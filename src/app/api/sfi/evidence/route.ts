import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const actionId = searchParams.get('actionId');

    const where = actionId ? { actionId } : {};

    const evidence = await prisma.sfiEvidence.findMany({
      where,
      include: {
        action: { select: { actionCode: true, actionName: true } },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(evidence);
  } catch (error) {
    console.error('SFI Evidence list error:', error);
    return NextResponse.json({ error: 'Failed to fetch evidence' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.actionId) {
      return NextResponse.json({ error: 'actionId is required' }, { status: 400 });
    }

    const evidence = await prisma.sfiEvidence.create({
      data: {
        actionId: body.actionId,
        date: body.date ? new Date(body.date) : new Date(),
        description: body.description || null,
        photoUrl: body.photoUrl || null,
        geoLat: body.geoLat ? parseFloat(body.geoLat) : null,
        geoLng: body.geoLng ? parseFloat(body.geoLng) : null,
        status: body.status || 'draft',
      },
    });

    return NextResponse.json(evidence, { status: 201 });
  } catch (error) {
    console.error('SFI Evidence create error:', error);
    return NextResponse.json({ error: 'Failed to create evidence' }, { status: 500 });
  }
}
