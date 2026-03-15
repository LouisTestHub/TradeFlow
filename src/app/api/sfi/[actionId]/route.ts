import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ actionId: string }> }
) {
  try {
    const { actionId } = await params;

    const action = await prisma.sfiAction.findUnique({
      where: { id: actionId },
      include: {
        agreement: true,
        field: { select: { name: true, hectares: true } },
        evidence: { orderBy: { date: 'desc' } },
      },
    });

    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    return NextResponse.json(action);
  } catch (error) {
    console.error('SFI Action API error:', error);
    return NextResponse.json({ error: 'Failed to fetch action' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ actionId: string }> }
) {
  try {
    const { actionId } = await params;
    const body = await request.json();

    const updated = await prisma.sfiAction.update({
      where: { id: actionId },
      data: {
        actionCode: body.actionCode,
        actionName: body.actionName,
        hectares: body.hectares ? parseFloat(body.hectares) : null,
        paymentPerHa: body.paymentPerHa ? parseFloat(body.paymentPerHa) : null,
        evidenceRequired: body.evidenceRequired,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('SFI Action update error:', error);
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }
}
