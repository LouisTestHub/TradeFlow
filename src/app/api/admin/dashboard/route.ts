import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalFarms, totalUsers, recentFarms, recentActivity, contactSubmissions] = await Promise.all([
    prisma.farm.count(),
    prisma.user.count(),
    prisma.farm.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: true, farm: true } }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const [sprayCount, medicineCount, movementCount] = await Promise.all([
    prisma.sprayRecord.count({ where: { createdAt: { gte: today } } }),
    prisma.medicineRecord.count({ where: { createdAt: { gte: today } } }),
    prisma.movement.count({ where: { createdAt: { gte: today } } }),
  ]);

  return NextResponse.json({
    stats: {
      totalFarms,
      totalUsers,
      activeFarms: recentFarms,
      trialFarms: Math.round(totalFarms * 0.18), // placeholder
      recordsToday: sprayCount + medicineCount + movementCount,
      mrr: totalFarms * 30, // placeholder
      arr: totalFarms * 360,
    },
    recentActivity: recentActivity.map(a => ({
      id: a.id,
      action: a.action,
      entity: a.entity,
      user: a.user?.name || 'System',
      farm: a.farm?.name,
      createdAt: a.createdAt,
    })),
    recentSupport: contactSubmissions.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      message: c.message,
      createdAt: c.createdAt,
    })),
  });
}
