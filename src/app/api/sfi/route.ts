import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const agreements = await prisma.sfiAgreement.findMany({
      where: { farmId: farm.id },
      include: {
        actions: {
          include: {
            evidence: { orderBy: { date: 'desc' } },
            field: { select: { name: true } },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    // Calculate stats per agreement
    const result = agreements.map((agreement) => {
      const totalActions = agreement.actions.length;
      const actionsWithEvidence = agreement.actions.filter(
        (a) => a.evidence.length > 0
      ).length;
      const completedActions = agreement.actions.filter(
        (a) => a.evidence.some((e) => e.status === 'submitted')
      ).length;
      const progressPercent = totalActions > 0 ? Math.round((actionsWithEvidence / totalActions) * 100) : 0;

      // Calculate total expected payment
      const actionPayments = agreement.actions.reduce((sum, a) => {
        return sum + (a.paymentPerHa || 0) * (a.hectares || 1);
      }, 0);

      return {
        id: agreement.id,
        sfiRef: agreement.sfiRef,
        startDate: agreement.startDate,
        endDate: agreement.endDate,
        totalAnnualPayment: agreement.totalAnnualPayment,
        status: agreement.status,
        actions: agreement.actions.map((a) => ({
          id: a.id,
          actionCode: a.actionCode,
          actionName: a.actionName,
          fieldName: a.field?.name || null,
          hectares: a.hectares,
          paymentPerHa: a.paymentPerHa,
          evidenceRequired: a.evidenceRequired,
          evidenceCount: a.evidence.length,
          submittedCount: a.evidence.filter((e) => e.status === 'submitted').length,
          status: a.evidence.some((e) => e.status === 'submitted')
            ? 'completed'
            : a.evidence.length > 0
            ? 'in_progress'
            : 'not_started',
        })),
        totalActions,
        actionsWithEvidence,
        completedActions,
        progressPercent,
        actionPayments,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('SFI API error:', error);
    return NextResponse.json({ error: 'Failed to fetch SFI data' }, { status: 500 });
  }
}
