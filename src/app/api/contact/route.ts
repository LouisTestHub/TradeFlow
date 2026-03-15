import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, farmName, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        farmName: farmName || null,
        message,
        source: req.nextUrl.searchParams.get('utm_source') || null,
        medium: req.nextUrl.searchParams.get('utm_medium') || null,
        campaign: req.nextUrl.searchParams.get('utm_campaign') || null,
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
