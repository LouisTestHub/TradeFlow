import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const [tickets, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactSubmission.count(),
  ]);

  return NextResponse.json({
    tickets: tickets.map(t => ({
      id: t.id,
      name: t.name,
      email: t.email,
      phone: t.phone,
      farmName: t.farmName,
      message: t.message,
      source: t.source,
      createdAt: t.createdAt,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
