import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get('species');
    const product = searchParams.get('product');
    const withdrawalStatus = searchParams.get('withdrawalStatus');

    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const records = await prisma.medicineRecord.findMany({
      where: { farmId: farm.id },
      include: {
        animals: {
          include: {
            animal: { select: { id: true, earTag: true, species: true, breed: true, sex: true, status: true } },
          },
        },
        vet: true,
      },
      orderBy: { date: 'desc' },
    });

    const now = new Date();
    let filtered = records.map((r) => {
      const meatEnd = r.withdrawalEndMeat ? new Date(r.withdrawalEndMeat) : null;
      const milkEnd = r.withdrawalEndMilk ? new Date(r.withdrawalEndMilk) : null;
      const latestEnd = r.withdrawalEndDate ? new Date(r.withdrawalEndDate) : null;

      const meatActive = meatEnd ? meatEnd > now : false;
      const milkActive = milkEnd ? milkEnd > now : false;
      const isActive = meatActive || milkActive;

      const meatDaysRemaining = meatEnd ? Math.max(0, Math.ceil((meatEnd.getTime() - now.getTime()) / 86400000)) : 0;
      const milkDaysRemaining = milkEnd ? Math.max(0, Math.ceil((milkEnd.getTime() - now.getTime()) / 86400000)) : 0;

      return {
        ...r,
        withdrawalActive: isActive,
        meatActive,
        milkActive,
        meatDaysRemaining,
        milkDaysRemaining,
        meatClearDate: meatEnd?.toISOString() || null,
        milkClearDate: milkEnd?.toISOString() || null,
      };
    });

    if (species) {
      filtered = filtered.filter((r) =>
        r.animals.some((a) => a.animal.species === species)
      );
    }
    if (product) {
      filtered = filtered.filter((r) =>
        r.productName.toLowerCase().includes(product.toLowerCase())
      );
    }
    if (withdrawalStatus === 'active') {
      filtered = filtered.filter((r) => r.withdrawalActive);
    } else if (withdrawalStatus === 'clear') {
      filtered = filtered.filter((r) => !r.withdrawalActive);
    }

    // Active withdrawals summary
    const activeWithdrawals = filtered
      .filter((r) => r.withdrawalActive)
      .flatMap((r) =>
        r.animals.map((a) => ({
          animalTag: a.animal.earTag,
          animalId: a.animal.id,
          productName: r.productName,
          treatmentDate: r.date,
          meatClearDate: r.meatClearDate,
          milkClearDate: r.milkClearDate,
          meatDaysRemaining: r.meatDaysRemaining,
          milkDaysRemaining: r.milkDaysRemaining,
          meatActive: r.meatActive,
          milkActive: r.milkActive,
        }))
      );

    return NextResponse.json({
      records: filtered,
      activeWithdrawals,
      totalActiveAnimals: new Set(activeWithdrawals.map((a) => a.animalId)).size,
    });
  } catch (error) {
    console.error('Medicine GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch medicine records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const treatmentDate = new Date(body.date);
    const meatDays = body.withdrawalMeatDays || 0;
    const milkDays = body.withdrawalMilkDays || 0;
    const withdrawalEndMeat = meatDays > 0 ? new Date(treatmentDate.getTime() + meatDays * 86400000) : null;
    const withdrawalEndMilk = milkDays > 0 ? new Date(treatmentDate.getTime() + milkDays * 86400000) : null;
    const withdrawalEndDate = withdrawalEndMeat && withdrawalEndMilk
      ? (withdrawalEndMeat > withdrawalEndMilk ? withdrawalEndMeat : withdrawalEndMilk)
      : withdrawalEndMeat || withdrawalEndMilk;

    const record = await prisma.medicineRecord.create({
      data: {
        farmId: farm.id,
        date: treatmentDate,
        productName: body.productName,
        batchNumber: body.batchNumber || null,
        dose: body.dose || null,
        doseNumeric: body.doseNumeric ? parseFloat(body.doseNumeric) : null,
        doseUnit: body.doseUnit || null,
        route: body.route || null,
        withdrawalMeatDays: meatDays,
        withdrawalMilkDays: milkDays,
        withdrawalEndMeat,
        withdrawalEndMilk,
        withdrawalEndDate,
        vetId: body.vetId || null,
        vetName: body.vetName || null,
        reason: body.reason || null,
        notes: body.notes || null,
        animalWeight: body.animalWeight ? parseFloat(body.animalWeight) : null,
        expiryDate: body.expiryDate || null,
        isCourse: body.isCourse || false,
        courseDoses: body.courseDoses ? parseInt(body.courseDoses) : null,
        courseIntervalHours: body.courseIntervalHours ? parseInt(body.courseIntervalHours) : null,
        courseCurrentDose: body.courseCurrentDose ? parseInt(body.courseCurrentDose) : 1,
        productId: body.productId || null,
      },
    });

    // Link animals
    if (body.animalIds && Array.isArray(body.animalIds)) {
      for (const animalId of body.animalIds) {
        await prisma.animalMedicine.create({
          data: { animalId, medicineRecordId: record.id },
        });
      }
    }

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Medicine POST error:', error);
    return NextResponse.json({ error: 'Failed to create medicine record' }, { status: 500 });
  }
}
