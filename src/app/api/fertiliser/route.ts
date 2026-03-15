import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// RB209 organic N availability rates (% of total N available in year of application)
const ORGANIC_N_AVAILABILITY: Record<string, { totalN: number; availableRate: number; totalP: number; totalK: number }> = {
  'Cattle FYM': { totalN: 6.0, availableRate: 0.25, totalP: 3.2, totalK: 8.0 },
  'Pig FYM': { totalN: 7.0, availableRate: 0.30, totalP: 6.0, totalK: 5.0 },
  'Poultry Manure': { totalN: 16.0, availableRate: 0.35, totalP: 13.0, totalK: 9.0 },
  'Cattle Slurry': { totalN: 2.6, availableRate: 0.45, totalP: 0.6, totalK: 2.5 },
  'Pig Slurry': { totalN: 4.0, availableRate: 0.50, totalP: 1.2, totalK: 2.0 },
  'Digestate (whole)': { totalN: 4.5, availableRate: 0.55, totalP: 0.5, totalK: 3.5 },
  'Sewage Sludge': { totalN: 10.0, availableRate: 0.30, totalP: 8.0, totalK: 1.0 },
  'Compost (green)': { totalN: 7.0, availableRate: 0.10, totalP: 3.0, totalK: 6.0 },
};

// NVZ closed periods (month indices, 0-based)
const NVZ_CLOSED_PERIODS = {
  organic_high_n_arable: { start: 7, end: 11 }, // 1 Aug - 31 Dec (sandy/shallow)
  organic_high_n_grass: { start: 8, end: 11 },  // 1 Sep - 31 Dec
  chemical_n_arable: { start: 8, end: 0 },      // 15 Sep - 15 Jan
  chemical_n_grass: { start: 8, end: 0 },        // 15 Sep - 15 Jan (sandy/shallow)
};

function isInClosedPeriod(date: Date, fieldType: string, productType: string): { blocked: boolean; reason: string } {
  const month = date.getMonth();
  const day = date.getDate();
  const isGrass = fieldType?.toLowerCase().includes('grass') || fieldType?.toLowerCase().includes('silage');
  const isOrganic = ['organic', 'fym', 'slurry', 'sewage_sludge', 'compost'].includes(productType);

  if (isOrganic) {
    const period = isGrass ? NVZ_CLOSED_PERIODS.organic_high_n_grass : NVZ_CLOSED_PERIODS.organic_high_n_arable;
    if (month >= period.start && month <= period.end) {
      return { blocked: true, reason: `NVZ closed period for organic manure on ${isGrass ? 'grassland' : 'arable'}: ${isGrass ? '1 Sep' : '1 Aug'} - 31 Dec` };
    }
  } else {
    // Chemical fertiliser
    if (month === 8 && day >= 15) return { blocked: true, reason: 'NVZ closed period for chemical N: 15 Sep - 15 Jan' };
    if (month >= 9 && month <= 11) return { blocked: true, reason: 'NVZ closed period for chemical N: 15 Sep - 15 Jan' };
    if (month === 0 && day <= 15) return { blocked: true, reason: 'NVZ closed period for chemical N: 15 Sep - 15 Jan' };
  }

  return { blocked: false, reason: '' };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');
    const productType = searchParams.get('type');
    const season = searchParams.get('season');

    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const where: Record<string, unknown> = { farmId: farm.id };
    if (fieldId) where.fieldId = fieldId;
    if (productType) where.productType = productType;

    // Season filter (e.g. "2025" means harvest year 2025, typically Aug-Jul)
    if (season) {
      const yr = parseInt(season);
      where.date = {
        gte: new Date(yr - 1, 7, 1), // Aug 1 previous year
        lte: new Date(yr, 6, 31),      // Jul 31 season year
      };
    }

    const records = await prisma.fertiliserRecord.findMany({
      where: where as any,
      include: {
        field: { select: { id: true, name: true, hectares: true, nvzZone: true, cropType: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Add NVZ status to each record
    const enriched = records.map((r) => {
      const field = r.field;
      if (!field.nvzZone) {
        return { ...r, nvzStatus: 'na' as const };
      }

      // Calculate N/ha for this field this season
      const isGrass = field.cropType?.toLowerCase().includes('grass') || field.cropType?.toLowerCase().includes('silage');
      const limit = isGrass ? 250 : 200;
      const nPerHa = r.nContent || 0;

      // Get all N applied to this field
      // (this is a simplified check — full calc is in nvz-plan)
      if (nPerHa > limit * 0.8 && nPerHa <= limit) {
        return { ...r, nvzStatus: 'warning' as const, nvzLimit: limit };
      } else if (nPerHa > limit) {
        return { ...r, nvzStatus: 'exceeded' as const, nvzLimit: limit };
      }
      return { ...r, nvzStatus: 'compliant' as const, nvzLimit: limit };
    });

    return NextResponse.json({
      records: enriched,
      organicNRates: ORGANIC_N_AVAILABILITY,
    });
  } catch (error) {
    console.error('Fertiliser GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch fertiliser records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    // Get field to check NVZ
    const field = await prisma.field.findUnique({ where: { id: body.fieldId } });
    if (!field) return NextResponse.json({ error: 'Field not found' }, { status: 404 });

    const appDate = new Date(body.date);
    const warnings: string[] = [];

    // NVZ closed period check
    if (field.nvzZone) {
      const closedCheck = isInClosedPeriod(appDate, field.cropType || '', body.productType);
      if (closedCheck.blocked) {
        warnings.push(closedCheck.reason);
      }
    }

    // Soil condition check
    const blockedConditions = ['waterlogged', 'frozen', 'snow_covered'];
    if (body.soilCondition && blockedConditions.includes(body.soilCondition)) {
      warnings.push(`Cannot spread on ${body.soilCondition.replace('_', ' ')} ground (NVZ regulation)`);
    }

    // Watercourse distance check
    if (body.distanceFromWater !== undefined && body.distanceFromWater !== null) {
      const isSlurry = body.productType === 'slurry';
      const minDistance = isSlurry ? 50 : 10;
      if (body.distanceFromWater < minDistance) {
        warnings.push(`Must be at least ${minDistance}m from watercourse (${isSlurry ? 'slurry' : 'fertiliser'})`);
      }
    }

    // Calculate N/P/K for organic manures
    let nContent = body.nContent;
    let pContent = body.pContent;
    let kContent = body.kContent;

    if (['organic', 'fym', 'slurry', 'sewage_sludge', 'compost'].includes(body.productType) && body.productName) {
      const orgData = ORGANIC_N_AVAILABILITY[body.productName];
      if (orgData && body.rateKgHa) {
        const rateT = body.rateKgHa / 1000; // convert kg/ha to t/ha if needed, or use direct
        const rate = body.rateUnit === 't/ha' ? body.rateKgHa : (body.rateUnit === 'm3/ha' ? body.rateKgHa : body.rateKgHa / 1000);
        nContent = nContent || rate * orgData.totalN * orgData.availableRate;
        pContent = pContent || rate * orgData.totalP;
        kContent = kContent || rate * orgData.totalK;
      }
    }

    // NVZ N limit check
    if (field.nvzZone && nContent) {
      const seasonStart = new Date(appDate.getFullYear() - (appDate.getMonth() < 7 ? 1 : 0), 7, 1);
      const seasonEnd = new Date(appDate.getFullYear() + (appDate.getMonth() >= 7 ? 1 : 0), 6, 31);

      const existingN = await prisma.fertiliserRecord.aggregate({
        where: {
          fieldId: body.fieldId,
          date: { gte: seasonStart, lte: seasonEnd },
        },
        _sum: { nContent: true },
      });

      const currentTotal = (existingN._sum.nContent || 0) + nContent;
      const isGrass = field.cropType?.toLowerCase().includes('grass') || field.cropType?.toLowerCase().includes('silage');
      const limit = isGrass ? 250 : 200;
      const hectares = body.areaTreatedHa || field.hectares;
      const nPerHa = hectares ? currentTotal / hectares : currentTotal;

      if (nPerHa > limit) {
        warnings.push(`NVZ N limit EXCEEDED: ${nPerHa.toFixed(1)} kg N/ha applied (limit: ${limit} kg N/ha)`);
      } else if (nPerHa > limit * 0.8) {
        warnings.push(`NVZ warning: ${nPerHa.toFixed(1)} kg N/ha applied (${Math.round((nPerHa / limit) * 100)}% of ${limit} kg/ha limit)`);
      }
    }

    const record = await prisma.fertiliserRecord.create({
      data: {
        farmId: farm.id,
        fieldId: body.fieldId,
        date: appDate,
        productType: body.productType,
        productName: body.productName || null,
        rateKgHa: body.rateKgHa ? parseFloat(body.rateKgHa) : null,
        rateUnit: body.rateUnit || null,
        nContent: nContent ? parseFloat(nContent) : null,
        pContent: pContent ? parseFloat(pContent) : null,
        kContent: kContent ? parseFloat(kContent) : null,
        nPercent: body.nPercent ? parseFloat(body.nPercent) : null,
        pPercent: body.pPercent ? parseFloat(body.pPercent) : null,
        kPercent: body.kPercent ? parseFloat(body.kPercent) : null,
        method: body.method || null,
        operatorId: body.operatorId || null,
        equipmentId: body.equipmentId || null,
        areaTreatedHa: body.areaTreatedHa ? parseFloat(body.areaTreatedHa) : null,
        soilCondition: body.soilCondition || null,
        distanceFromWater: body.distanceFromWater !== undefined ? parseFloat(body.distanceFromWater) : null,
        notes: body.notes || null,
        nvzCompliant: warnings.filter((w) => w.includes('EXCEEDED') || w.includes('Cannot') || w.includes('Must be')).length === 0,
      },
    });

    return NextResponse.json({ record, warnings }, { status: 201 });
  } catch (error) {
    console.error('Fertiliser POST error:', error);
    return NextResponse.json({ error: 'Failed to create fertiliser record' }, { status: 500 });
  }
}
