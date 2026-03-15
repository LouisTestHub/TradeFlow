import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season') || new Date().getFullYear().toString();
    const yr = parseInt(season);

    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const seasonStart = new Date(yr - 1, 7, 1); // Aug 1
    const seasonEnd = new Date(yr, 6, 31);       // Jul 31

    // Get all NVZ fields
    const fields = await prisma.field.findMany({
      where: { farmId: farm.id },
      include: {
        fertRecords: {
          where: { date: { gte: seasonStart, lte: seasonEnd } },
        },
        seasons: {
          where: { year: yr },
          take: 1,
        },
      },
    });

    const fieldPlans = fields.map((f) => {
      const isGrass = f.cropType?.toLowerCase().includes('grass') || f.cropType?.toLowerCase().includes('silage');
      const nLimit = isGrass ? 250 : 200;

      const totalN = f.fertRecords.reduce((sum, r) => sum + (r.nContent || 0), 0);
      const totalP = f.fertRecords.reduce((sum, r) => sum + (r.pContent || 0), 0);
      const totalK = f.fertRecords.reduce((sum, r) => sum + (r.kContent || 0), 0);
      const nPerHa = f.hectares > 0 ? totalN / f.hectares : 0;

      const organicN = f.fertRecords
        .filter((r) => ['organic', 'fym', 'slurry', 'sewage_sludge', 'compost'].includes(r.productType))
        .reduce((sum, r) => sum + (r.nContent || 0), 0);

      let nvzStatus: 'compliant' | 'warning' | 'exceeded' | 'na' = 'na';
      let percentUsed = 0;
      if (f.nvzZone) {
        percentUsed = nLimit > 0 ? Math.round((nPerHa / nLimit) * 100) : 0;
        if (nPerHa > nLimit) nvzStatus = 'exceeded';
        else if (nPerHa > nLimit * 0.8) nvzStatus = 'warning';
        else nvzStatus = 'compliant';
      }

      return {
        fieldId: f.id,
        fieldName: f.name,
        hectares: f.hectares,
        nvzZone: f.nvzZone,
        cropType: f.cropType || (f.seasons[0]?.crop) || 'Unknown',
        isGrass,
        nLimit,
        nApplied: Math.round(totalN * 10) / 10,
        nPerHa: Math.round(nPerHa * 10) / 10,
        pApplied: Math.round(totalP * 10) / 10,
        kApplied: Math.round(totalK * 10) / 10,
        organicN: Math.round(organicN * 10) / 10,
        remaining: Math.round((nLimit - nPerHa) * 10) / 10,
        percentUsed,
        nvzStatus,
        recordCount: f.fertRecords.length,
      };
    });

    // Whole farm organic N summary
    const totalFarmArea = fields.filter((f) => f.nvzZone).reduce((sum, f) => sum + f.hectares, 0);
    const totalOrganicN = fieldPlans.reduce((sum, f) => sum + f.organicN, 0);
    const avgOrganicNPerHa = totalFarmArea > 0 ? totalOrganicN / totalFarmArea : 0;
    const organicNLimit = 170; // kg/ha whole farm average

    // NVZ closed period calendar
    const closedPeriods = [
      { type: 'Organic manure (high N) — Arable (sandy/shallow)', start: '1 Aug', end: '31 Dec', months: [7, 8, 9, 10, 11] },
      { type: 'Organic manure (high N) — Grassland', start: '1 Sep', end: '31 Dec', months: [8, 9, 10, 11] },
      { type: 'Organic manure (low N, FYM) — Arable (sandy/shallow)', start: '1 Oct', end: '31 Dec', months: [9, 10, 11] },
      { type: 'Manufactured fertiliser N — All', start: '15 Sep', end: '15 Jan', months: [9, 10, 11, 0] },
    ];

    const currentMonth = new Date().getMonth();
    const isAnyClosed = closedPeriods.some((p) => p.months.includes(currentMonth));

    return NextResponse.json({
      season: `${yr - 1}/${yr.toString().slice(2)}`,
      fieldPlans,
      wholeFarmSummary: {
        totalAreaNVZ: Math.round(totalFarmArea * 10) / 10,
        totalOrganicN: Math.round(totalOrganicN * 10) / 10,
        avgOrganicNPerHa: Math.round(avgOrganicNPerHa * 10) / 10,
        organicNLimit,
        organicNStatus: avgOrganicNPerHa > organicNLimit ? 'exceeded' : avgOrganicNPerHa > organicNLimit * 0.8 ? 'warning' : 'compliant',
        organicNPercent: Math.round((avgOrganicNPerHa / organicNLimit) * 100),
      },
      closedPeriods,
      isAnyClosed,
    });
  } catch (error) {
    console.error('NVZ plan error:', error);
    return NextResponse.json({ error: 'Failed to fetch NVZ plan' }, { status: 500 });
  }
}
