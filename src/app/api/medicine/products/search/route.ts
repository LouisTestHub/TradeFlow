import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const species = searchParams.get('species');

    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { activeIngredient: { contains: q } },
      ];
    }

    if (species) {
      where.species = { contains: species };
    }

    const products = await prisma.vetMedicine.findMany({
      where: where as any,
      orderBy: { name: 'asc' },
      take: 20,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Medicine product search error:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
