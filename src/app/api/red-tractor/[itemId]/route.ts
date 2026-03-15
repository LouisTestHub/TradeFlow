import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();

    const updated = await prisma.auditItem.update({
      where: { id: itemId },
      data: {
        status: body.status,
        evidenceUrl: body.evidenceUrl,
        notes: body.notes,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('RT item update error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
