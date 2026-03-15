import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const records = await prisma.breedingRecord.findMany({
      where: { farmId: farm.id },
      include: {
        dam: { select: { id: true, earTag: true, breed: true } },
        sire: { select: { id: true, earTag: true, breed: true } },
        calf: { select: { id: true, earTag: true, sex: true, breed: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Stats
    const now = new Date();
    const breedingCows = await prisma.animal.count({
      where: { farmId: farm.id, species: 'cattle', sex: 'female', status: 'alive' },
    });

    const inCalf = records.filter((r) => r.expectedCalving && !r.calvingDate && new Date(r.expectedCalving) > now).length;

    const thisMonth = records.filter((r) => {
      if (!r.expectedCalving || r.calvingDate) return false;
      const exp = new Date(r.expectedCalving);
      return exp.getMonth() === now.getMonth() && exp.getFullYear() === now.getFullYear();
    }).length;

    const calvesBornSeason = records.filter((r) => r.calvingDate).length;
    const totalServiced = records.filter((r) => r.serviceDate).length;
    const calvingPct = totalServiced > 0 ? Math.round((calvesBornSeason / totalServiced) * 100) : 0;

    // Due to calve list (sorted by expected date)
    const dueToCalve = records
      .filter((r) => r.expectedCalving && !r.calvingDate)
      .sort((a, b) => new Date(a.expectedCalving!).getTime() - new Date(b.expectedCalving!).getTime())
      .map((r) => ({
        ...r,
        daysUntilDue: Math.ceil((new Date(r.expectedCalving!).getTime() - now.getTime()) / 86400000),
      }));

    return NextResponse.json({
      records,
      dueToCalve,
      stats: { breedingCows, inCalf, dueThisMonth: thisMonth, calvesBornSeason, calvingPct },
    });
  } catch (error) {
    console.error('Breeding API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();

    if (body.type === 'calving') {
      // Log calving — optionally create calf record
      const { damId, calvingDate, calfSex, calfBreed, calfWeight, assisted, presentation, calfEarTag, calfEidNumber, notes } = body;

      let calfId = null;
      if (calfEarTag) {
        const calf = await prisma.animal.create({
          data: {
            farmId: farm.id,
            earTag: calfEarTag,
            eidNumber: calfEidNumber || null,
            species: 'cattle',
            breed: calfBreed || null,
            sex: calfSex || null,
            dob: calvingDate ? new Date(calvingDate) : new Date(),
            damId,
            status: 'alive',
          },
        });
        calfId = calf.id;
      }

      // Find existing breeding record for this dam or create new one
      const existingRecord = await prisma.breedingRecord.findFirst({
        where: { damId, calvingDate: null },
        orderBy: { expectedCalving: 'asc' },
      });

      if (existingRecord) {
        const record = await prisma.breedingRecord.update({
          where: { id: existingRecord.id },
          data: {
            calvingDate: calvingDate ? new Date(calvingDate) : new Date(),
            calfId,
            calfSex: calfSex || null,
            calfBreed: calfBreed || null,
            calfWeight: calfWeight ? parseFloat(calfWeight) : null,
            assisted: assisted || false,
            presentation: presentation || null,
            notes: notes || null,
          },
        });
        return NextResponse.json({ record }, { status: 201 });
      }

      const record = await prisma.breedingRecord.create({
        data: {
          farmId: farm.id,
          damId,
          calvingDate: calvingDate ? new Date(calvingDate) : new Date(),
          calfId,
          calfSex: calfSex || null,
          calfBreed: calfBreed || null,
          calfWeight: calfWeight ? parseFloat(calfWeight) : null,
          assisted: assisted || false,
          presentation: presentation || null,
          notes: notes || null,
        },
      });
      return NextResponse.json({ record }, { status: 201 });
    }

    // Log service/AI
    const { damId, sireId, sireName, serviceDate, method, notes } = body;
    if (!damId || !serviceDate) {
      return NextResponse.json({ error: 'Dam and service date are required' }, { status: 400 });
    }

    const sDate = new Date(serviceDate);
    const expectedCalving = new Date(sDate.getTime() + 283 * 86400000);

    const record = await prisma.breedingRecord.create({
      data: {
        farmId: farm.id,
        damId,
        sireId: sireId || null,
        sireName: sireName || null,
        serviceDate: sDate,
        method: method || 'natural',
        expectedCalving,
        notes: notes || null,
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error('Create breeding record error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
