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
      { cphNumber: { contains: search } },
      { county: { contains: search } },
    ];
  }

  const [farms, total] = await Promise.all([
    prisma.farm.findMany({
      where,
      include: {
        memberships: { include: { user: true } },
        fields: true,
        animals: { where: { status: 'alive' } },
        _count: {
          select: {
            sprayRecords: true,
            medicineRecords: true,
            movements: true,
            fertRecords: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.farm.count({ where }),
  ]);

  return NextResponse.json({
    farms: farms.map(f => ({
      id: f.id,
      name: f.name,
      cphNumber: f.cphNumber,
      sbiNumber: f.sbiNumber,
      county: f.county,
      farmType: f.farmType,
      totalHectares: f.totalHectares,
      createdAt: f.createdAt,
      users: f.memberships.map(m => ({ id: m.user.id, name: m.user.name, role: m.role })),
      fieldCount: f.fields.length,
      animalCount: f.animals.length,
      records: f._count,
      dataHealth: {
        hasCph: !!f.cphNumber,
        hasSbi: !!f.sbiNumber,
        hasFields: f.fields.length > 0,
        hasAnimals: f.animals.length > 0,
        score: [f.cphNumber, f.sbiNumber, f.fields.length > 0, f.animals.length > 0].filter(Boolean).length * 25,
      },
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
