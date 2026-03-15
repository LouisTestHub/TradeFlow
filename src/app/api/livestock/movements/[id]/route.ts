import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movement = await prisma.movement.findUnique({
      where: { id },
      include: {
        animals: { include: { animal: true } },
      },
    });

    if (!movement) return NextResponse.json({ error: 'Movement not found' }, { status: 404 });

    return NextResponse.json({ movement });
  } catch (error) {
    console.error('Movement detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.bcmsSubmitted !== undefined) updateData.bcmsSubmitted = body.bcmsSubmitted;
    if (body.bcmsRef !== undefined) updateData.bcmsRef = body.bcmsRef;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const movement = await prisma.movement.update({ where: { id }, data: updateData as any });
    return NextResponse.json({ movement });
  } catch (error) {
    console.error('Update movement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
