import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst({
      include: {
        memberships: {
          include: { user: { select: { id: true, name: true, email: true, phone: true, role: true } } },
        },
      },
    });

    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    return NextResponse.json({
      farm: {
        id: farm.id,
        name: farm.name,
        cphNumber: farm.cphNumber,
        sbiNumber: farm.sbiNumber,
        county: farm.county,
        postcode: farm.postcode,
        totalHectares: farm.totalHectares,
        farmType: farm.farmType,
      },
      team: farm.memberships.map((m) => ({
        id: m.id,
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        phone: m.user.phone,
        role: m.role,
        userRole: m.user.role,
      })),
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const { name, cphNumber, sbiNumber, county, postcode, totalHectares, farmType } = body;

    const updated = await prisma.farm.update({
      where: { id: farm.id },
      data: {
        ...(name !== undefined && { name }),
        ...(cphNumber !== undefined && { cphNumber }),
        ...(sbiNumber !== undefined && { sbiNumber }),
        ...(county !== undefined && { county }),
        ...(postcode !== undefined && { postcode }),
        ...(totalHectares !== undefined && { totalHectares: parseFloat(totalHectares) }),
        ...(farmType !== undefined && { farmType }),
      },
    });

    return NextResponse.json({ farm: updated });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
