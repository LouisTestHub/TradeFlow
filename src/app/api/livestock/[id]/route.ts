import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        group: true,
        medicineRecords: {
          include: { medicineRecord: true },
          orderBy: { medicineRecord: { date: 'desc' } },
        },
        movementAnimals: {
          include: { movement: true },
          orderBy: { movement: { date: 'desc' } },
        },
        breedingAsDam: {
          include: { sire: true, calf: true },
          orderBy: { serviceDate: 'desc' },
        },
        breedingAsSire: {
          include: { dam: true, calf: true },
          orderBy: { serviceDate: 'desc' },
        },
        breedingAsCalf: {
          include: { dam: true, sire: true },
          take: 1,
        },
      },
    });

    if (!animal) return NextResponse.json({ error: 'Animal not found' }, { status: 404 });

    // Build timeline
    const timeline: Array<{ date: string; type: string; icon: string; description: string }> = [];

    // Birth
    if (animal.dob) {
      timeline.push({ date: animal.dob.toISOString(), type: 'birth', icon: '🐄', description: `Born${animal.breedingAsCalf[0]?.dam ? ` — Dam: ${animal.breedingAsCalf[0].dam.earTag}` : ''}` });
    }

    // Movements
    for (const ma of animal.movementAnimals) {
      const m = ma.movement;
      const typeLabel = m.movementType === 'on' ? 'ON' : m.movementType === 'off' ? 'OFF' : 'BETWEEN';
      timeline.push({ date: m.date.toISOString(), type: 'movement', icon: '📍', description: `Movement ${typeLabel} — ${m.movementType === 'on' ? `from ${m.fromCph}` : m.movementType === 'off' ? `to ${m.toCph}` : `${m.fromCph} → ${m.toCph}`}` });
    }

    // Medicine
    for (const am of animal.medicineRecords) {
      const mr = am.medicineRecord;
      const wdEnd = mr.withdrawalEndDate ? ` (withdrawal: ${new Date(mr.withdrawalEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})` : '';
      timeline.push({ date: mr.date.toISOString(), type: 'medicine', icon: '💊', description: `${mr.productName} treatment${wdEnd}` });
    }

    // Breeding events
    for (const br of animal.breedingAsDam) {
      if (br.serviceDate) {
        timeline.push({ date: br.serviceDate.toISOString(), type: 'breeding', icon: '🔗', description: `Served — ${br.method === 'ai' ? 'AI' : 'Natural'}${br.sire ? ` by ${br.sire.earTag}` : br.sireName ? ` by ${br.sireName}` : ''}` });
      }
      if (br.calvingDate) {
        timeline.push({ date: br.calvingDate.toISOString(), type: 'calving', icon: '🐣', description: `Calved — ${br.calfSex || ''} ${br.calfBreed || ''} calf${br.calfWeight ? ` (${br.calfWeight}kg)` : ''}` });
      }
    }

    // Sort newest first
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Get dam/sire details
    let dam = null;
    let sire = null;
    if (animal.damId) {
      dam = await prisma.animal.findUnique({ where: { id: animal.damId }, select: { id: true, earTag: true, breed: true } });
    }
    if (animal.sireId) {
      sire = await prisma.animal.findUnique({ where: { id: animal.sireId }, select: { id: true, earTag: true, breed: true } });
    }

    // Get offspring
    const offspring = await prisma.animal.findMany({
      where: { OR: [{ damId: animal.id }, { sireId: animal.id }] },
      select: { id: true, earTag: true, sex: true, dob: true, breed: true },
      orderBy: { dob: 'desc' },
    });

    // Get groups for editing
    const groups = await prisma.animalGroup.findMany({
      where: { farmId: animal.farmId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      animal: {
        id: animal.id,
        earTag: animal.earTag,
        eidNumber: animal.eidNumber,
        species: animal.species,
        breed: animal.breed,
        sex: animal.sex,
        dob: animal.dob,
        status: animal.status,
        groupId: animal.groupId,
        groupName: animal.group?.name || null,
        passportNumber: animal.passportNumber,
        purchaseDate: animal.purchaseDate,
        purchaseFrom: animal.purchaseFrom,
        purchasePrice: animal.purchasePrice,
        notes: animal.notes,
        damId: animal.damId,
        sireId: animal.sireId,
        deathDate: animal.deathDate,
        soldDate: animal.soldDate,
      },
      dam,
      sire,
      offspring,
      timeline,
      movements: animal.movementAnimals.map((ma) => ma.movement),
      medicineRecords: animal.medicineRecords.map((am) => am.medicineRecord),
      breedingRecords: [...animal.breedingAsDam, ...animal.breedingAsSire],
      groups,
    });
  } catch (error) {
    console.error('Animal detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    const fields = ['earTag', 'eidNumber', 'breed', 'sex', 'notes', 'groupId', 'passportNumber', 'purchaseFrom'];
    for (const f of fields) {
      if (body[f] !== undefined) updateData[f] = body[f] || null;
    }
    if (body.dob !== undefined) updateData.dob = body.dob ? new Date(body.dob) : null;
    if (body.purchaseDate !== undefined) updateData.purchaseDate = body.purchaseDate ? new Date(body.purchaseDate) : null;
    if (body.purchasePrice !== undefined) updateData.purchasePrice = body.purchasePrice ? parseFloat(body.purchasePrice) : null;
    if (body.damId !== undefined) updateData.damId = body.damId || null;
    if (body.sireId !== undefined) updateData.sireId = body.sireId || null;

    // Status changes
    if (body.status === 'sold') {
      updateData.status = 'sold';
      updateData.soldDate = body.soldDate ? new Date(body.soldDate) : new Date();
    } else if (body.status === 'dead') {
      updateData.status = 'dead';
      updateData.deathDate = body.deathDate ? new Date(body.deathDate) : new Date();
    } else if (body.status) {
      updateData.status = body.status;
    }

    const animal = await prisma.animal.update({ where: { id }, data: updateData as any });
    return NextResponse.json({ animal });
  } catch (error) {
    console.error('Update animal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.animal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete animal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
