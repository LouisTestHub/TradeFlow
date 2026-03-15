import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const equipment = await prisma.equipment.findMany({
      where: { farmId: farm.id },
      orderBy: { name: 'asc' },
    });

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      equipment: equipment.map((e) => {
        let calibrationStatus: 'ok' | 'due_soon' | 'overdue' | 'unknown' = 'unknown';
        let calibrationDueDate: Date | null = null;

        if (e.calibrationDate) {
          // Annual calibration
          calibrationDueDate = new Date(e.calibrationDate);
          calibrationDueDate.setFullYear(calibrationDueDate.getFullYear() + 1);

          if (calibrationDueDate < now) {
            calibrationStatus = 'overdue';
          } else if (calibrationDueDate < thirtyDaysFromNow) {
            calibrationStatus = 'due_soon';
          } else {
            calibrationStatus = 'ok';
          }
        }

        return {
          id: e.id,
          name: e.name,
          type: e.type,
          nozzleType: e.nozzleType,
          tankCapacity: e.tankCapacity,
          calibrationDate: e.calibrationDate,
          calibrationDueDate,
          calibrationStatus,
          motExpiry: e.motExpiry,
          notes: e.notes,
          createdAt: e.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error('Equipment GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const { name, type, nozzleType, tankCapacity, calibrationDate, motExpiry, notes } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const equipment = await prisma.equipment.create({
      data: {
        farmId: farm.id,
        name,
        type,
        nozzleType: nozzleType || null,
        tankCapacity: tankCapacity ? parseFloat(tankCapacity) : null,
        calibrationDate: calibrationDate ? new Date(calibrationDate) : null,
        motExpiry: motExpiry ? new Date(motExpiry) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ equipment }, { status: 201 });
  } catch (error) {
    console.error('Equipment POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
