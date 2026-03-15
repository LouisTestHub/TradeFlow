import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, nozzleType, tankCapacity, calibrationDate, motExpiry, notes } = body;

    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        name: name || undefined,
        type: type || undefined,
        nozzleType: nozzleType !== undefined ? nozzleType : undefined,
        tankCapacity: tankCapacity !== undefined ? (tankCapacity ? parseFloat(tankCapacity) : null) : undefined,
        calibrationDate: calibrationDate !== undefined ? (calibrationDate ? new Date(calibrationDate) : null) : undefined,
        motExpiry: motExpiry !== undefined ? (motExpiry ? new Date(motExpiry) : null) : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('Equipment PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    await prisma.equipment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Equipment DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
