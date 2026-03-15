import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { activeIngredient: { contains: search } },
      { mapp: { contains: search } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.pppProduct.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { name: 'asc' } }),
    prisma.pppProduct.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const product = await prisma.pppProduct.create({ data: body });
  return NextResponse.json({ product }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const product = await prisma.pppProduct.update({ where: { id }, data });
  return NextResponse.json({ product });
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.pppProduct.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
