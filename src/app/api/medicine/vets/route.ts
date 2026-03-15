import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const vets = await prisma.vetContact.findMany({
      where: { farmId: farm.id },
      include: {
        medicineRecords: {
          orderBy: { date: 'desc' },
          take: 5,
          select: { id: true, date: true, productName: true, reason: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(vets);
  } catch (error) {
    console.error('Vets GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch vets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const vet = await prisma.vetContact.create({
      data: {
        farmId: farm.id,
        name: body.name,
        practice: body.practice || null,
        phone: body.phone || null,
        email: body.email || null,
        rcvsNumber: body.rcvsNumber || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(vet, { status: 201 });
  } catch (error) {
    console.error('Vets POST error:', error);
    return NextResponse.json({ error: 'Failed to create vet' }, { status: 500 });
  }
}
