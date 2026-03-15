import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the first farm (demo)
    const farm = await prisma.farm.findFirst({
      include: {
        fields: {
          include: {
            seasons: { orderBy: { year: 'desc' }, take: 1 },
            sprayRecords: { orderBy: { date: 'desc' }, take: 1 },
          },
        },
        complianceAlerts: {
          where: { resolved: false },
          orderBy: { dueDate: 'asc' },
        },
        animals: true,
        movements: { orderBy: { date: 'desc' }, take: 5 },
        sprayRecords: {
          orderBy: { date: 'desc' },
          take: 5,
          include: { field: true, products: true },
        },
        medicineRecords: {
          orderBy: { date: 'desc' },
          take: 5,
          include: { animals: { include: { animal: true } } },
        },
        fertRecords: {
          orderBy: { date: 'desc' },
          take: 5,
          include: { field: true },
        },
        sfiAgreements: {
          where: { status: 'active' },
          include: { actions: { include: { evidence: true } } },
        },
        auditChecklists: {
          orderBy: { auditDate: 'desc' },
          take: 1,
          include: { items: true },
        },
      },
    });

    if (!farm) {
      return NextResponse.json({ error: 'No farm found' }, { status: 404 });
    }

    // Calculate stats
    const totalFields = farm.fields.length;
    const totalHectares = farm.fields.reduce((sum, f) => sum + f.hectares, 0);
    const arableHa = farm.fields
      .filter((f) => !['Permanent Pasture', 'Silage', 'Woodland / SFI'].includes(f.cropType || ''))
      .reduce((sum, f) => sum + f.hectares, 0);
    const grasslandHa = totalHectares - arableHa;

    const cattle = farm.animals.filter((a) => a.species === 'cattle' && a.status === 'alive');
    const sheep = farm.animals.filter((a) => a.species === 'sheep' && a.status === 'alive');

    const pendingMovements = farm.movements.filter((m) => !m.bcmsSubmitted);
    const sprayCount = farm.sprayRecords.length;

    // Recent activity
    type Activity = { type: string; description: string; date: Date; icon: string };
    const recentActivity: Activity[] = [];

    for (const spray of farm.sprayRecords.slice(0, 3)) {
      const productNames = spray.products.map((p) => p.productName).join(', ');
      recentActivity.push({
        type: 'spray',
        description: `${productNames || 'Spray'} on ${spray.field.name}`,
        date: spray.date,
        icon: '🌿',
      });
    }
    for (const med of farm.medicineRecords.slice(0, 2)) {
      const animalCount = med.animals.length;
      recentActivity.push({
        type: 'medicine',
        description: `${med.productName} on ${animalCount} animal${animalCount !== 1 ? 's' : ''}`,
        date: med.date,
        icon: '💊',
      });
    }
    for (const mov of farm.movements.slice(0, 2)) {
      recentActivity.push({
        type: 'movement',
        description: `${mov.animalCount} ${mov.species || 'animals'} ${mov.movementType === 'on' ? 'received' : 'moved'}`,
        date: mov.date,
        icon: '🚛',
      });
    }
    for (const fert of farm.fertRecords.slice(0, 2)) {
      recentActivity.push({
        type: 'fertiliser',
        description: `${fert.productName || fert.productType} on ${fert.field.name}`,
        date: fert.date,
        icon: '🌱',
      });
    }

    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Compliance health
    const auditChecklist = farm.auditChecklists[0];
    let redTractorScore = 100;
    if (auditChecklist) {
      const total = auditChecklist.items.length;
      const compliant = auditChecklist.items.filter((i) => i.status === 'compliant').length;
      redTractorScore = total > 0 ? Math.round((compliant / total) * 100) : 100;
    }

    const sfiAgreement = farm.sfiAgreements[0];
    let sfiStatus = 'No agreement';
    if (sfiAgreement) {
      const totalActions = sfiAgreement.actions.length;
      const actionsWithEvidence = sfiAgreement.actions.filter((a) => a.evidence.length > 0).length;
      sfiStatus = totalActions > 0 ? `${actionsWithEvidence}/${totalActions} actions evidenced` : 'On track';
    }

    // Get latest weather reading
    const latestWeather = await prisma.weatherReading.findFirst({
      orderBy: { timestamp: 'desc' },
      include: { station: true },
    });

    return NextResponse.json({
      weather: latestWeather
        ? {
            tempC: latestWeather.tempC,
            windSpeed: latestWeather.windSpeed,
            windDirection: latestWeather.windDirection,
            rainfallMm: latestWeather.rainfallMm,
            humidity: latestWeather.humidity,
            timestamp: latestWeather.timestamp,
          }
        : null,
      farm: {
        id: farm.id,
        name: farm.name,
        totalHectares: farm.totalHectares,
        farmType: farm.farmType,
        cphNumber: farm.cphNumber,
        sbiNumber: farm.sbiNumber,
        county: farm.county,
        postcode: farm.postcode,
      },
      stats: {
        totalFields,
        totalHectares: Math.round(totalHectares * 10) / 10,
        arableHa: Math.round(arableHa * 10) / 10,
        grasslandHa: Math.round(grasslandHa * 10) / 10,
        cattleCount: cattle.length,
        sheepCount: sheep.length,
        pendingMovements: pendingMovements.length,
        sprayRecordsThisSeason: sprayCount,
      },
      alerts: farm.complianceAlerts.map((a) => ({
        id: a.id,
        type: a.type,
        message: a.message,
        dueDate: a.dueDate,
        severity: a.type === 'deadline' ? 'high' : a.type === 'expiry' ? 'medium' : 'low',
      })),
      recentActivity: recentActivity.slice(0, 8),
      compliance: {
        redTractorScore,
        bcmsPending: pendingMovements.length,
        sfiStatus,
        nvzCompliant: true,
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
