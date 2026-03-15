import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const { animals } = body;

    if (!animals || !Array.isArray(animals) || animals.length === 0) {
      return NextResponse.json({ error: 'No animals provided' }, { status: 400 });
    }

    const created = [];
    const errors = [];

    for (let i = 0; i < animals.length; i++) {
      const row = animals[i];
      try {
        if (!row.earTag || !row.species) {
          errors.push({ row: i + 1, error: 'Missing ear tag or species' });
          continue;
        }
        const animal = await prisma.animal.create({
          data: {
            farmId: farm.id,
            earTag: row.earTag,
            eidNumber: row.eidNumber || null,
            species: row.species,
            breed: row.breed || null,
            sex: row.sex || null,
            dob: row.dob ? new Date(row.dob) : null,
          },
        });
        created.push(animal);
      } catch (err) {
        errors.push({ row: i + 1, error: String(err) });
      }
    }

    return NextResponse.json({ created: created.length, errors, total: animals.length }, { status: 201 });
  } catch (error) {
    console.error('Import animals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
