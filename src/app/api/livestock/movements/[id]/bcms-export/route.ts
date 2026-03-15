import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movement = await prisma.movement.findUnique({
      where: { id },
      include: {
        animals: { include: { animal: true } },
      },
    });

    if (!movement) return NextResponse.json({ error: 'Movement not found' }, { status: 404 });

    // Generate BCMS-compatible CSV
    const headers = ['Movement Date', 'Movement Type', 'Animal Ear Tag', 'From CPH', 'To CPH', 'Haulier', 'Vehicle Reg'];
    const rows = movement.animals.map((ma) => [
      new Date(movement.date).toLocaleDateString('en-GB'),
      movement.movementType.toUpperCase(),
      ma.animal.earTag,
      movement.fromCph,
      movement.toCph,
      movement.haulier || '',
      movement.vehicleReg || '',
    ]);

    // If no linked animals, create a single row
    if (rows.length === 0) {
      rows.push([
        new Date(movement.date).toLocaleDateString('en-GB'),
        movement.movementType.toUpperCase(),
        `(${movement.animalCount} animals)`,
        movement.fromCph,
        movement.toCph,
        movement.haulier || '',
        movement.vehicleReg || '',
      ]);
    }

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bcms-movement-${movement.id}.csv"`,
      },
    });
  } catch (error) {
    console.error('BCMS export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
