import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    // Red Tractor Score
    const rtChecklist = await prisma.auditChecklist.findFirst({
      where: { farmId: farm.id, scheme: 'red_tractor' },
      orderBy: { auditDate: 'desc' },
      include: { items: true },
    });

    let redTractorScore = 0;
    let redTractorIssues: string[] = [];
    if (rtChecklist) {
      const total = rtChecklist.items.length;
      const compliant = rtChecklist.items.filter(
        (i) => i.status === 'compliant' || i.status === 'na'
      ).length;
      redTractorScore = total > 0 ? Math.round((compliant / total) * 100) : 0;
      redTractorIssues = rtChecklist.items
        .filter((i) => i.status !== 'compliant' && i.status !== 'na')
        .map((i) => i.requirement);
    }

    // BCMS Score - based on submitted vs total movements
    const totalMovements = await prisma.movement.count({ where: { farmId: farm.id } });
    const submittedMovements = await prisma.movement.count({
      where: { farmId: farm.id, bcmsSubmitted: true },
    });
    const bcmsScore = totalMovements > 0
      ? Math.round((submittedMovements / totalMovements) * 100)
      : 100;
    const bcmsPending = totalMovements - submittedMovements;

    // SFI Score - based on actions with evidence
    const sfiAgreement = await prisma.sfiAgreement.findFirst({
      where: { farmId: farm.id, status: 'active' },
      include: { actions: { include: { evidence: true } } },
    });

    let sfiScore = 100;
    let sfiIssues: string[] = [];
    if (sfiAgreement) {
      const totalActions = sfiAgreement.actions.length;
      const actionsWithEvidence = sfiAgreement.actions.filter(
        (a) => a.evidence.length > 0
      ).length;
      sfiScore = totalActions > 0 ? Math.round((actionsWithEvidence / totalActions) * 100) : 100;
      sfiIssues = sfiAgreement.actions
        .filter((a) => a.evidence.length === 0)
        .map((a) => `${a.actionCode}: ${a.actionName} — no evidence`);
    }

    // NVZ Score - based on nutrient plan compliance
    const nvzFields = await prisma.field.count({ where: { farmId: farm.id, nvzZone: true } });
    const nutrientPlans = await prisma.nutrientPlan.findMany({
      where: { farmId: farm.id },
    });
    const nvzCompliant = nutrientPlans.filter((p) => p.nvzCompliant).length;
    const nvzScore = nvzFields === 0
      ? 100
      : nutrientPlans.length > 0
      ? Math.round((nvzCompliant / nutrientPlans.length) * 100)
      : 50;

    // Medicine Score - based on withdrawal tracking
    const activeMedicines = await prisma.medicineRecord.findMany({
      where: { farmId: farm.id },
    });
    const now = new Date();
    const expiredWithdrawals = activeMedicines.filter(
      (m) => m.withdrawalEndDate && new Date(m.withdrawalEndDate) > now
    ).length;
    const medicineScore = activeMedicines.length > 0
      ? Math.round(((activeMedicines.length - expiredWithdrawals) / activeMedicines.length) * 100)
      : 100;

    // Equipment Score - based on calibration currency
    const allEquipment = await prisma.equipment.count({ where: { farmId: farm.id } });
    const calibratedEquipment = await prisma.equipment.count({
      where: {
        farmId: farm.id,
        calibrationDate: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      },
    });
    const equipmentScore = allEquipment > 0
      ? Math.round((calibratedEquipment / allEquipment) * 100)
      : 100;

    // Overall score (weighted average)
    const weights = { redTractor: 25, bcms: 20, sfi: 15, nvz: 15, medicine: 15, equipment: 10 };
    const overall = Math.round(
      (redTractorScore * weights.redTractor +
        bcmsScore * weights.bcms +
        sfiScore * weights.sfi +
        nvzScore * weights.nvz +
        medicineScore * weights.medicine +
        equipmentScore * weights.equipment) / 100
    );

    // Items needing attention
    const attentionItems: string[] = [];
    if (bcmsPending > 0) attentionItems.push(`${bcmsPending} BCMS movement${bcmsPending > 1 ? 's' : ''} pending submission`);
    if (redTractorIssues.length > 0) attentionItems.push(`${redTractorIssues.length} Red Tractor items not evidenced`);
    if (sfiIssues.length > 0) attentionItems.push(`${sfiIssues.length} SFI actions need evidence`);
    if (allEquipment > calibratedEquipment) attentionItems.push(`${allEquipment - calibratedEquipment} equipment items need calibration`);

    return NextResponse.json({
      overall,
      schemes: {
        redTractor: { score: redTractorScore, issues: redTractorIssues.length },
        bcms: { score: bcmsScore, pending: bcmsPending },
        sfi: { score: sfiScore, issues: sfiIssues.length },
        nvz: { score: nvzScore },
        medicine: { score: medicineScore, activeWithdrawals: expiredWithdrawals },
        equipment: { score: equipmentScore, needsCalibration: allEquipment - calibratedEquipment },
      },
      attentionItems,
    });
  } catch (error) {
    console.error('Compliance score error:', error);
    return NextResponse.json({ error: 'Failed to calculate compliance scores' }, { status: 500 });
  }
}
