import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    // Get records that have withdrawal periods overlapping with the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Get all records that could have events in this month
    const records = await prisma.medicineRecord.findMany({
      where: {
        farmId: farm.id,
        OR: [
          // Treatment date in this month
          { date: { gte: startOfMonth, lte: endOfMonth } },
          // Meat withdrawal ends in this month
          { withdrawalEndMeat: { gte: startOfMonth, lte: endOfMonth } },
          // Milk withdrawal ends in this month
          { withdrawalEndMilk: { gte: startOfMonth, lte: endOfMonth } },
          // Withdrawal period spans this month (treatment before, end after)
          { AND: [{ date: { lte: endOfMonth } }, { withdrawalEndDate: { gte: startOfMonth } }] },
        ],
      },
      include: {
        animals: {
          include: {
            animal: { select: { id: true, earTag: true, species: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const now = new Date();

    // Build calendar events
    const events: Array<{
      date: string;
      type: 'treatment' | 'meat_clear' | 'milk_clear' | 'withdrawal_active';
      animalTag: string;
      animalId: string;
      productName: string;
      recordId: string;
    }> = [];

    const activeWithdrawals: Array<{
      animalTag: string;
      animalId: string;
      productName: string;
      treatmentDate: string;
      meatClearDate: string | null;
      milkClearDate: string | null;
      meatProgress: number;
      milkProgress: number;
      meatActive: boolean;
      milkActive: boolean;
      recordId: string;
    }> = [];

    for (const r of records) {
      const treatDate = new Date(r.date);
      const meatEnd = r.withdrawalEndMeat ? new Date(r.withdrawalEndMeat) : null;
      const milkEnd = r.withdrawalEndMilk ? new Date(r.withdrawalEndMilk) : null;

      for (const am of r.animals) {
        // Treatment date event
        if (treatDate >= startOfMonth && treatDate <= endOfMonth) {
          events.push({
            date: treatDate.toISOString().split('T')[0],
            type: 'treatment',
            animalTag: am.animal.earTag,
            animalId: am.animal.id,
            productName: r.productName,
            recordId: r.id,
          });
        }

        // Meat clear date
        if (meatEnd && meatEnd >= startOfMonth && meatEnd <= endOfMonth) {
          events.push({
            date: meatEnd.toISOString().split('T')[0],
            type: 'meat_clear',
            animalTag: am.animal.earTag,
            animalId: am.animal.id,
            productName: r.productName,
            recordId: r.id,
          });
        }

        // Milk clear date
        if (milkEnd && milkEnd >= startOfMonth && milkEnd <= endOfMonth) {
          events.push({
            date: milkEnd.toISOString().split('T')[0],
            type: 'milk_clear',
            animalTag: am.animal.earTag,
            animalId: am.animal.id,
            productName: r.productName,
            recordId: r.id,
          });
        }

        // Active withdrawal check
        const meatActive = meatEnd ? meatEnd > now : false;
        const milkActive = milkEnd ? milkEnd > now : false;

        if (meatActive || milkActive) {
          const meatTotal = r.withdrawalMeatDays || 0;
          const milkTotal = r.withdrawalMilkDays || 0;
          const elapsed = (now.getTime() - treatDate.getTime()) / 86400000;

          activeWithdrawals.push({
            animalTag: am.animal.earTag,
            animalId: am.animal.id,
            productName: r.productName,
            treatmentDate: treatDate.toISOString(),
            meatClearDate: meatEnd?.toISOString() || null,
            milkClearDate: milkEnd?.toISOString() || null,
            meatProgress: meatTotal > 0 ? Math.min(100, Math.round((elapsed / meatTotal) * 100)) : 100,
            milkProgress: milkTotal > 0 ? Math.min(100, Math.round((elapsed / milkTotal) * 100)) : 100,
            meatActive,
            milkActive,
            recordId: r.id,
          });
        }
      }
    }

    // Check for movement conflicts
    const activeAnimalIds = activeWithdrawals.map((a) => a.animalId);
    const pendingMovements = await prisma.movement.findMany({
      where: {
        farmId: farm.id,
        movementType: 'off',
        date: { gte: now },
        animals: { some: { animalId: { in: activeAnimalIds } } },
      },
      include: { animals: { include: { animal: { select: { earTag: true, id: true } } } } },
    });

    const movementWarnings = pendingMovements.flatMap((m) =>
      m.animals
        .filter((a) => activeAnimalIds.includes(a.animalId))
        .map((a) => {
          const withdrawal = activeWithdrawals.find((w) => w.animalId === a.animalId);
          return {
            animalTag: a.animal.earTag,
            movementDate: m.date.toISOString(),
            destination: m.toCph,
            withdrawalClearDate: withdrawal?.meatClearDate || withdrawal?.milkClearDate,
            productName: withdrawal?.productName,
          };
        })
    );

    return NextResponse.json({
      events,
      activeWithdrawals,
      movementWarnings,
      month,
      year,
    });
  } catch (error) {
    console.error('Medicine calendar error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}
