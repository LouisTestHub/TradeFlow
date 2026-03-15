import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const url = new URL(request.url);
    const species = url.searchParams.get('species');
    const status = url.searchParams.get('status');
    const breed = url.searchParams.get('breed');
    const sex = url.searchParams.get('sex');
    const groupId = url.searchParams.get('groupId');
    const search = url.searchParams.get('search');

    const where: Record<string, unknown> = { farmId: farm.id };
    if (species) where.species = species;
    if (status) where.status = status;
    if (breed) where.breed = breed;
    if (sex) where.sex = sex;
    if (groupId) where.groupId = groupId;
    if (search) {
      where.OR = [
        { earTag: { contains: search } },
        { eidNumber: { contains: search } },
      ];
    }

    const animals = await prisma.animal.findMany({
      where: where as any,
      include: {
        group: true,
        medicineRecords: {
          include: { medicineRecord: true },
          orderBy: { medicineRecord: { date: 'desc' } },
          take: 1,
        },
        movementAnimals: {
          include: { movement: true },
          orderBy: { movement: { date: 'desc' } },
          take: 1,
        },
      },
      orderBy: { earTag: 'asc' },
    });

    // Compute status indicators
    const now = new Date();
    const enriched = animals.map((a) => {
      let statusIndicator = 'active';
      if (a.status === 'sold') statusIndicator = 'sold';
      else if (a.status === 'dead') statusIndicator = 'dead';
      else {
        const lastMed = a.medicineRecords[0]?.medicineRecord;
        if (lastMed?.withdrawalEndDate && new Date(lastMed.withdrawalEndDate) > now) {
          statusIndicator = 'withdrawal';
        } else if (lastMed?.withdrawalEndDate && new Date(lastMed.date) > new Date(now.getTime() - 14 * 86400000)) {
          statusIndicator = 'on_medicine';
        }
        const lastMov = a.movementAnimals[0]?.movement;
        if (lastMov && !lastMov.bcmsSubmitted && lastMov.movementType === 'on') {
          statusIndicator = 'pending_movement';
        }
      }
      return {
        id: a.id,
        earTag: a.earTag,
        eidNumber: a.eidNumber,
        species: a.species,
        breed: a.breed,
        sex: a.sex,
        dob: a.dob,
        status: a.status,
        statusIndicator,
        groupId: a.groupId,
        groupName: a.group?.name || null,
        notes: a.notes,
      };
    });

    // Summary counts
    const allAnimals = await prisma.animal.findMany({ where: { farmId: farm.id }, select: { species: true, status: true } });
    const cattle = allAnimals.filter((a) => a.species === 'cattle');
    const sheep = allAnimals.filter((a) => a.species === 'sheep');
    const pendingMovements = await prisma.movement.count({
      where: { farmId: farm.id, bcmsSubmitted: false },
    });
    const dueToday = await prisma.movement.count({
      where: {
        farmId: farm.id,
        bcmsSubmitted: false,
        date: { lte: new Date(now.getTime() - 2 * 86400000) },
      },
    });

    // Get available breeds and groups for filters
    const breeds = await prisma.animal.findMany({
      where: { farmId: farm.id },
      select: { breed: true },
      distinct: ['breed'],
    });
    const groups = await prisma.animalGroup.findMany({
      where: { farmId: farm.id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      animals: enriched,
      summary: {
        cattle: { total: cattle.length, alive: cattle.filter((c) => c.status === 'alive').length, sold: cattle.filter((c) => c.status === 'sold').length, dead: cattle.filter((c) => c.status === 'dead').length },
        sheep: { total: sheep.length, alive: sheep.filter((s) => s.status === 'alive').length, sold: sheep.filter((s) => s.status === 'sold').length, dead: sheep.filter((s) => s.status === 'dead').length },
        pendingMovements,
        dueToday,
      },
      filters: {
        breeds: breeds.map((b) => b.breed).filter(Boolean),
        groups,
      },
    });
  } catch (error) {
    console.error('Livestock API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const { earTag, eidNumber, species, breed, sex, dob, damId, sireId, groupId, purchaseDate, purchaseFrom, purchasePrice, passportNumber, notes } = body;

    if (!earTag || !species) {
      return NextResponse.json({ error: 'Ear tag and species are required' }, { status: 400 });
    }

    const animal = await prisma.animal.create({
      data: {
        farmId: farm.id,
        earTag,
        eidNumber: eidNumber || null,
        species,
        breed: breed || null,
        sex: sex || null,
        dob: dob ? new Date(dob) : null,
        damId: damId || null,
        sireId: sireId || null,
        groupId: groupId || null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchaseFrom: purchaseFrom || null,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        passportNumber: passportNumber || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ animal }, { status: 201 });
  } catch (error) {
    console.error('Create animal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
