import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    }

    // Update the audit item with the evidence URL and mark as compliant
    const updated = await prisma.auditItem.update({
      where: { id: body.itemId },
      data: {
        status: 'compliant',
        evidenceUrl: body.evidenceUrl || body.fileName || 'uploaded',
        notes: body.notes || `Document uploaded: ${body.fileName || 'evidence'}`,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('RT upload error:', error);
    return NextResponse.json({ error: 'Failed to upload evidence' }, { status: 500 });
  }
}
