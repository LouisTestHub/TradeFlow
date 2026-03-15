import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');

    const where: Record<string, unknown> = { farmId: farm.id };
    if (type) where.movementType = type;
    if (status === 'pending') where.bcmsSubmitted = false;
    if (status === 'submitted') where.bcmsSubmitted = true;

    const movements = await prisma.movement.findMany({
      where: where as any,
      include: {
        animals: { include: { animal: { select: { id: true, earTag: true, species: true, breed: true, sex: true } } } },
      },
      orderBy: { date: 'desc' },
    });

    const now = new Date();
    const enriched = movements.map((m) => {
      const movDate = new Date(m.date);
      const deadlineDate = new Date(movDate.getTime() + 3 * 86400000);
      const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / 86400000);

      let bcmsAlert = 'ok';
      if (!m.bcmsSubmitted) {
        if (daysRemaining <= 0) bcmsAlert = 'overdue';
        else if (daysRemaining <= 1) bcmsAlert = 'due_today';
        else if (daysRemaining <= 2) bcmsAlert = 'warning';
        else bcmsAlert = 'ok';
      }

      return {
        ...m,
        animals: m.animals.map((a) => a.animal),
        bcmsAlert,
        daysRemaining: m.bcmsSubmitted ? null : Math.max(0, daysRemaining),
        deadlineDate: deadlineDate.toISOString(),
      };
    });

    return NextResponse.json({ movements: enriched, farmCph: farm.cphNumber });
  } catch (error) {
    console.error('Movements API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const { movementType, date, fromCph, toCph, animalIds, haulier, vehicleReg, departureTime, journeyDuration, notes } = body;

    if (!movementType || !date || !fromCph || !toCph) {
      return NextResponse.json({ error: 'Movement type, date, from CPH and to CPH are required' }, { status: 400 });
    }

    // Calculate standstill for ON movements (cattle)
    let standstillEnd = null;
    if (movementType === 'on') {
      standstillEnd = new Date(new Date(date).getTime() + 6 * 86400000);
    }

    const movement = await prisma.movement.create({
      data: {
        farmId: farm.id,
        movementType,
        date: new Date(date),
        fromCph,
        toCph,
        haulier: haulier || null,
        vehicleReg: vehicleReg || null,
        departureTime: departureTime || null,
        journeyDuration: journeyDuration ? parseFloat(journeyDuration) : null,
        standstillEnd,
        animalCount: animalIds?.length || 1,
        species: 'cattle',
        notes: notes || null,
      },
    });

    // Link animals
    if (animalIds?.length) {
      for (const animalId of animalIds) {
        await prisma.movementAnimal.create({ data: { animalId, movementId: movement.id } });
      }
    }

    return NextResponse.json({ movement }, { status: 201 });
  } catch (error) {
    console.error('Create movement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
