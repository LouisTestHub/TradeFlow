import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const groups = await prisma.animalGroup.findMany({
      where: { farmId: farm.id },
      include: {
        _count: { select: { animals: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ groups: groups.map((g) => ({ ...g, animalCount: g._count.animals })) });
  } catch (error) {
    console.error('Groups API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const { name, species } = body;

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const group = await prisma.animalGroup.create({
      data: { farmId: farm.id, name, species: species || null },
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error('Create group error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
