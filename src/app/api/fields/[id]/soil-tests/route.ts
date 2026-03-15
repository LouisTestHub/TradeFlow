import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, ph, pIndex, kIndex, mgIndex, organicMatter } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const soilTest = await prisma.soilTest.create({
      data: {
        fieldId: id,
        date: new Date(date),
        ph: ph ? parseFloat(ph) : null,
        pIndex: pIndex ? parseInt(pIndex) : null,
        kIndex: kIndex ? parseInt(kIndex) : null,
        mgIndex: mgIndex ? parseInt(mgIndex) : null,
        organicMatter: organicMatter ? parseFloat(organicMatter) : null,
      },
    });

    return NextResponse.json({ soilTest }, { status: 201 });
  } catch (error) {
    console.error('Create soil test error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
