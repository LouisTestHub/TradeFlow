import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.fertiliserRecord.findUnique({
      where: { id },
      include: {
        field: { select: { id: true, name: true, hectares: true, nvzZone: true, cropType: true } },
        operator: { select: { id: true, name: true } },
      },
    });

    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(record);
  } catch (error) {
    console.error('Fertiliser GET [id] error:', error);
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

    const record = await prisma.fertiliserRecord.update({
      where: { id },
      data: {
        date: body.date ? new Date(body.date) : undefined,
        productType: body.productType,
        productName: body.productName || null,
        rateKgHa: body.rateKgHa ? parseFloat(body.rateKgHa) : null,
        rateUnit: body.rateUnit || null,
        nContent: body.nContent ? parseFloat(body.nContent) : null,
        pContent: body.pContent ? parseFloat(body.pContent) : null,
        kContent: body.kContent ? parseFloat(body.kContent) : null,
        nPercent: body.nPercent ? parseFloat(body.nPercent) : null,
        pPercent: body.pPercent ? parseFloat(body.pPercent) : null,
        kPercent: body.kPercent ? parseFloat(body.kPercent) : null,
        method: body.method || null,
        soilCondition: body.soilCondition || null,
        distanceFromWater: body.distanceFromWater !== undefined ? parseFloat(body.distanceFromWater) : null,
        areaTreatedHa: body.areaTreatedHa ? parseFloat(body.areaTreatedHa) : null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Fertiliser PUT error:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.fertiliserRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fertiliser DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
