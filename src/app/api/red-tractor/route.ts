import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    // Get the latest Red Tractor checklist
    const checklist = await prisma.auditChecklist.findFirst({
      where: { farmId: farm.id, scheme: 'red_tractor' },
      orderBy: { auditDate: 'desc' },
      include: { items: true },
    });

    if (!checklist) {
      return NextResponse.json({ error: 'No Red Tractor checklist found' }, { status: 404 });
    }

    // Auto-linking: check existing records to auto-mark items
    const [sprayCount, medicineCount, movementCount, equipmentCount, nutrientPlanCount] = await Promise.all([
      prisma.sprayRecord.count({ where: { farmId: farm.id } }),
      prisma.medicineRecord.count({ where: { farmId: farm.id } }),
      prisma.movement.count({ where: { farmId: farm.id, bcmsSubmitted: true } }),
      prisma.equipment.count({
        where: {
          farmId: farm.id,
          calibrationDate: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.nutrientPlan.count({ where: { farmId: farm.id } }),
    ]);

    // Auto-link rules mapping requirement keywords to record counts
    const autoLinkRules: Record<string, boolean> = {
      'spray records': sprayCount > 0,
      'sprayer tested': equipmentCount > 0,
      'medicine records': medicineCount > 0,
      'movement records': movementCount > 0,
      'nutrient management': nutrientPlanCount > 0,
      'soil management': nutrientPlanCount > 0,
    };

    // Enhance items with auto-link status
    const items = checklist.items.map((item) => {
      let autoLinked = false;
      let autoLinkSource = '';

      for (const [keyword, hasRecords] of Object.entries(autoLinkRules)) {
        if (item.requirement.toLowerCase().includes(keyword) && hasRecords) {
          autoLinked = true;
          autoLinkSource = keyword.includes('spray')
            ? 'Spray Records'
            : keyword.includes('medicine')
            ? 'Medicine Records'
            : keyword.includes('movement')
            ? 'BCMS Movements'
            : keyword.includes('nutrient') || keyword.includes('soil')
            ? 'Nutrient Plans'
            : 'Equipment';
          break;
        }
      }

      return {
        ...item,
        autoLinked,
        autoLinkSource,
        effectiveStatus: autoLinked && item.status === 'pending' ? 'compliant' : item.status,
      };
    });

    // Group by category
    const categories: Record<string, typeof items> = {};
    for (const item of items) {
      const cat = item.category || 'Other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    }

    // Calculate scores
    const totalItems = items.length;
    const compliantItems = items.filter(
      (i) => i.effectiveStatus === 'compliant' || i.effectiveStatus === 'na'
    ).length;
    const complianceScore = totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 0;

    // Days until audit
    const auditDate = checklist.auditDate ? new Date(checklist.auditDate) : null;
    const daysUntilAudit = auditDate
      ? Math.ceil((auditDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return NextResponse.json({
      id: checklist.id,
      scheme: checklist.scheme,
      auditDate: checklist.auditDate,
      auditor: checklist.auditor,
      status: checklist.status,
      daysUntilAudit,
      complianceScore,
      totalItems,
      compliantItems,
      categories,
    });
  } catch (error) {
    console.error('Red Tractor API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Red Tractor data' }, { status: 500 });
  }
}
