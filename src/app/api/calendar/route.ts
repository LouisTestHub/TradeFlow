import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  status: 'overdue' | 'due_soon' | 'upcoming' | 'completed';
  link?: string;
}

export async function GET(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month'); // YYYY-MM
    const now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth();
    if (monthParam) {
      const [y, m] = monthParam.split('-').map(Number);
      year = y;
      month = m - 1;
    }

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const events: CalendarEvent[] = [];

    // 1. BCMS Movement deadlines (3 days from movement date)
    const movements = await prisma.movement.findMany({
      where: { farmId: farm.id },
      include: { animals: { include: { animal: true } } },
    });

    for (const mov of movements) {
      const deadline = new Date(mov.date);
      deadline.setDate(deadline.getDate() + 3);
      if (deadline >= startDate && deadline <= endDate) {
        const animalCount = mov.animals?.length || 0;
        events.push({
          id: `bcms-${mov.id}`,
          date: deadline.toISOString(),
          title: `BCMS: ${animalCount} ${mov.movementType} movement submission`,
          category: 'BCMS',
          status: mov.bcmsSubmitted ? 'completed' : deadline < now ? 'overdue' : 'due_soon',
          link: '/livestock/movements',
        });
      }
    }

    // 2. Medicine withdrawal dates
    const medicines = await prisma.medicineRecord.findMany({
      where: { farmId: farm.id },
    });

    for (const med of medicines) {
      if (med.withdrawalEndDate) {
        const clearDate = new Date(med.withdrawalEndDate);
        if (clearDate >= startDate && clearDate <= endDate) {
          events.push({
            id: `med-${med.id}`,
            date: clearDate.toISOString(),
            title: `Medicine: ${med.productName} withdrawal clears`,
            category: 'Medicine',
            status: clearDate < now ? 'completed' : 'upcoming',
            link: `/medicine/${med.id}`,
          });
        }
      }
    }

    // 3. SFI evidence deadlines
    const sfiAgreements = await prisma.sfiAgreement.findMany({
      where: { farmId: farm.id, status: 'active' },
      include: { actions: { include: { evidence: true } } },
    });

    for (const agreement of sfiAgreements) {
      // End of agreement evidence deadline
      const endD = new Date(agreement.endDate);
      if (endD >= startDate && endD <= endDate) {
        for (const action of agreement.actions) {
          const hasEvidence = action.evidence.some((e) => e.status === 'submitted');
          events.push({
            id: `sfi-${action.id}`,
            date: endD.toISOString(),
            title: `SFI: ${action.actionCode} - ${action.actionName} evidence`,
            category: 'SFI',
            status: hasEvidence ? 'completed' : endD < now ? 'overdue' : 'upcoming',
            link: `/sfi/${action.id}`,
          });
        }
      }
    }

    // 4. Red Tractor audit date
    const rtChecklist = await prisma.auditChecklist.findFirst({
      where: { farmId: farm.id, scheme: 'red_tractor' },
      orderBy: { auditDate: 'desc' },
    });

    if (rtChecklist?.auditDate) {
      const auditD = new Date(rtChecklist.auditDate);
      if (auditD >= startDate && auditD <= endDate) {
        events.push({
          id: `rt-${rtChecklist.id}`,
          date: auditD.toISOString(),
          title: `Red Tractor: Annual audit${rtChecklist.auditor ? ` (${rtChecklist.auditor})` : ''}`,
          category: 'Red Tractor',
          status: rtChecklist.status === 'passed' ? 'completed' : auditD < now ? 'overdue' : 'upcoming',
          link: '/red-tractor',
        });
      }
    }

    // 5. Equipment calibration due dates
    const equipment = await prisma.equipment.findMany({
      where: { farmId: farm.id },
    });

    for (const eq of equipment) {
      if (eq.calibrationDate) {
        const nextCalDate = new Date(eq.calibrationDate);
        nextCalDate.setFullYear(nextCalDate.getFullYear() + 1);
        if (nextCalDate >= startDate && nextCalDate <= endDate) {
          events.push({
            id: `equip-${eq.id}`,
            date: nextCalDate.toISOString(),
            title: `Equipment: ${eq.name} calibration due`,
            category: 'Equipment',
            status: nextCalDate < now ? 'overdue' : 'upcoming',
            link: '/settings/equipment',
          });
        }
      }
    }

    // 6. Compliance alerts
    const alerts = await prisma.complianceAlert.findMany({
      where: {
        farmId: farm.id,
        dueDate: { gte: startDate, lte: endDate },
      },
    });

    for (const alert of alerts) {
      if (alert.dueDate) {
        events.push({
          id: `alert-${alert.id}`,
          date: alert.dueDate.toISOString(),
          title: alert.message,
          category: alert.type === 'expiry' ? 'Insurance' : alert.type === 'deadline' ? 'Deadline' : 'Alert',
          status: alert.resolved ? 'completed' : new Date(alert.dueDate) < now ? 'overdue' : 'upcoming',
        });
      }
    }

    // 7. NVZ closed periods (Oct 1 - Jan 31 for manufactured fertiliser on sandy/shallow soils)
    const nvzFields = await prisma.field.findMany({
      where: { farmId: farm.id, nvzZone: true },
    });

    if (nvzFields.length > 0) {
      // Closed period for manufactured fertiliser: 1 Sep to 15 Jan
      const closedPeriods = [
        { start: new Date(year, 8, 1), end: new Date(year + 1, 0, 15), label: 'NVZ: Manufactured fertiliser closed period' },
        { start: new Date(year, 9, 1), end: new Date(year + 1, 0, 31), label: 'NVZ: Organic manure closed period (grassland)' },
      ];

      for (const cp of closedPeriods) {
        if (cp.start >= startDate && cp.start <= endDate) {
          events.push({
            id: `nvz-start-${cp.label}-${year}`,
            date: cp.start.toISOString(),
            title: `${cp.label} starts`,
            category: 'NVZ',
            status: 'upcoming',
            link: '/fertiliser/nvz-plan',
          });
        }
        if (cp.end >= startDate && cp.end <= endDate) {
          events.push({
            id: `nvz-end-${cp.label}-${year}`,
            date: cp.end.toISOString(),
            title: `${cp.label} ends`,
            category: 'NVZ',
            status: 'upcoming',
            link: '/fertiliser/nvz-plan',
          });
        }
      }
    }

    // 8. Harvest interval clear dates from spray records
    const sprays = await prisma.sprayRecord.findMany({
      where: { farmId: farm.id },
      include: { products: true, field: true },
    });

    for (const spray of sprays) {
      // Estimate harvest interval based on field season
      const season = await prisma.fieldSeason.findFirst({
        where: { fieldId: spray.fieldId },
        orderBy: { year: 'desc' },
      });
      if (season?.harvestDate) {
        const harvestD = new Date(season.harvestDate);
        if (harvestD >= startDate && harvestD <= endDate) {
          events.push({
            id: `harvest-${spray.id}`,
            date: harvestD.toISOString(),
            title: `Harvest: ${spray.field.name} harvest interval clears`,
            category: 'Harvest',
            status: harvestD < now ? 'completed' : 'upcoming',
            link: `/sprays/${spray.id}`,
          });
        }
      }
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate upcoming deadlines (next 30 days from now)
    const upcoming = events
      .filter((e) => e.status !== 'completed' && new Date(e.date) >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
      .slice(0, 20);

    // Classify status based on time
    const classifiedEvents = events.map((e) => {
      const eventDate = new Date(e.date);
      const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (e.status === 'completed') return e;
      if (diffDays < 0) return { ...e, status: 'overdue' as const };
      if (diffDays <= 7) return { ...e, status: 'due_soon' as const };
      return { ...e, status: 'upcoming' as const };
    });

    return NextResponse.json({
      year,
      month: month + 1,
      events: classifiedEvents,
      upcoming,
    });
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}
