import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.medicineRecord.findUnique({
      where: { id },
      include: {
        animals: {
          include: {
            animal: { select: { id: true, earTag: true, species: true, breed: true, sex: true, dob: true, status: true } },
          },
        },
        vet: true,
      },
    });

    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const now = new Date();
    const meatEnd = record.withdrawalEndMeat ? new Date(record.withdrawalEndMeat) : null;
    const milkEnd = record.withdrawalEndMilk ? new Date(record.withdrawalEndMilk) : null;

    return NextResponse.json({
      ...record,
      meatActive: meatEnd ? meatEnd > now : false,
      milkActive: milkEnd ? milkEnd > now : false,
      meatDaysRemaining: meatEnd ? Math.max(0, Math.ceil((meatEnd.getTime() - now.getTime()) / 86400000)) : 0,
      milkDaysRemaining: milkEnd ? Math.max(0, Math.ceil((milkEnd.getTime() - now.getTime()) / 86400000)) : 0,
    });
  } catch (error) {
    console.error('Medicine GET [id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const treatmentDate = new Date(body.date);
    const meatDays = body.withdrawalMeatDays || 0;
    const milkDays = body.withdrawalMilkDays || 0;
    const withdrawalEndMeat = meatDays > 0 ? new Date(treatmentDate.getTime() + meatDays * 86400000) : null;
    const withdrawalEndMilk = milkDays > 0 ? new Date(treatmentDate.getTime() + milkDays * 86400000) : null;
    const withdrawalEndDate = withdrawalEndMeat && withdrawalEndMilk
      ? (withdrawalEndMeat > withdrawalEndMilk ? withdrawalEndMeat : withdrawalEndMilk)
      : withdrawalEndMeat || withdrawalEndMilk;

    const record = await prisma.medicineRecord.update({
      where: { id },
      data: {
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
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Medicine PUT error:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.animalMedicine.deleteMany({ where: { medicineRecordId: id } });
    await prisma.medicineRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Medicine DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
