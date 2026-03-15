import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { year, crop, variety, plantingDate, harvestDate, yieldTonnes } = body;

    if (!year || !crop) {
      return NextResponse.json({ error: 'Year and crop are required' }, { status: 400 });
    }

    const season = await prisma.fieldSeason.create({
      data: {
        fieldId: id,
        year: parseInt(year),
        crop,
        variety: variety || null,
        plantingDate: plantingDate ? new Date(plantingDate) : null,
        harvestDate: harvestDate ? new Date(harvestDate) : null,
        yieldTonnes: yieldTonnes ? parseFloat(yieldTonnes) : null,
      },
    });

    return NextResponse.json({ season }, { status: 201 });
  } catch (error) {
    console.error('Create season error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await request.json();
    const { seasonId, year, crop, variety, plantingDate, harvestDate, yieldTonnes } = body;

    if (!seasonId) {
      return NextResponse.json({ error: 'seasonId is required' }, { status: 400 });
    }

    const season = await prisma.fieldSeason.update({
      where: { id: seasonId },
      data: {
        ...(year !== undefined && { year: parseInt(year) }),
        ...(crop !== undefined && { crop }),
        ...(variety !== undefined && { variety }),
        ...(plantingDate !== undefined && { plantingDate: plantingDate ? new Date(plantingDate) : null }),
        ...(harvestDate !== undefined && { harvestDate: harvestDate ? new Date(harvestDate) : null }),
        ...(yieldTonnes !== undefined && { yieldTonnes: yieldTonnes ? parseFloat(yieldTonnes) : null }),
      },
    });

    return NextResponse.json({ season });
  } catch (error) {
    console.error('Update season error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId');

    if (!seasonId) {
      return NextResponse.json({ error: 'seasonId is required' }, { status: 400 });
    }

    await prisma.fieldSeason.delete({ where: { id: seasonId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete season error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
