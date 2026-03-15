import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email and role are required' }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const passwordHash = await bcrypt.hash('changeme123', 12);
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: role === 'agronomist' ? 'AGRONOMIST' : 'FARMER',
        },
      });
    }

    // Check if membership already exists
    const existing = await prisma.farmMembership.findUnique({
      where: { userId_farmId: { userId: user.id, farmId: farm.id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 });
    }

    const membership = await prisma.farmMembership.create({
      data: {
        userId: user.id,
        farmId: farm.id,
        role,
      },
    });

    return NextResponse.json({
      member: {
        id: membership.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        role: membership.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Add team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get('id');

    if (!membershipId) {
      return NextResponse.json({ error: 'Membership ID is required' }, { status: 400 });
    }

    await prisma.farmMembership.delete({ where: { id: membershipId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
