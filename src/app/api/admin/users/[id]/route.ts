import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      farmMemberships: { include: { farm: true } },
    },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const farm = user.farmMemberships[0]?.farm;
  let stats = null;
  if (farm) {
    const [sprays, medicines, movements] = await Promise.all([
      prisma.sprayRecord.count({ where: { farmId: farm.id } }),
      prisma.medicineRecord.count({ where: { farmId: farm.id } }),
      prisma.movement.count({ where: { farmId: farm.id } }),
    ]);
    stats = { sprays, medicines, movements };
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      farm: farm ? { id: farm.id, name: farm.name, cphNumber: farm.cphNumber } : null,
    },
    stats,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const body = await request.json();
  const { role, disabled } = body;

  const updateData: Record<string, unknown> = {};
  if (role) updateData.role = role;
  if (disabled !== undefined) {
    updateData.role = disabled ? 'DISABLED' : 'FARMER';
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ user });
}
