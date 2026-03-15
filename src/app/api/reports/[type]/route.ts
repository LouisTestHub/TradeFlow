import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFarm } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getSessionFarm();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { farm } = session;
  const { type } = await params;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date(new Date().getFullYear(), 0, 1);
  const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : new Date();
  const fieldId = searchParams.get('fieldId') || undefined;

  try {
    switch (type) {
      case 'red-tractor':
        return NextResponse.json(await generateRedTractorPack(farm.id, from, to));
      case 'bcms':
        return NextResponse.json(await generateBcmsReport(farm.id, from, to));
      case 'spray':
        return NextResponse.json(await generateSprayReport(farm.id, from, to, fieldId));
      case 'medicine':
        return NextResponse.json(await generateMedicineReport(farm.id, from, to));
      case 'sfi':
        return NextResponse.json(await generateSfiReport(farm.id));
      case 'nvz':
        return NextResponse.json(await generateNvzReport(farm.id, from, to, fieldId));
      case 'farm-summary':
        return NextResponse.json(await generateFarmSummary(farm.id));
      case 'season':
        return NextResponse.json(await generateSeasonSummary(farm.id, from, to, fieldId));
      case 'expense':
        return NextResponse.json(await generateExpenseReport(farm.id, from, to));
      default:
        return NextResponse.json({ error: 'Unknown report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

async function generateRedTractorPack(farmId: string, from: Date, to: Date) {
  const [farm, fields, sprays, medicines, movements, fertilisers, nutrientPlans, equipment, sfiAgreements, audits, alerts] = await Promise.all([
    prisma.farm.findUnique({ where: { id: farmId } }),
    prisma.field.findMany({ where: { farmId }, include: { seasons: true, soilTests: true } }),
    prisma.sprayRecord.findMany({
      where: { farmId, date: { gte: from, lte: to } },
      include: { products: true, field: true, operator: true, equipment: true, weatherSnapshot: true },
      orderBy: { date: 'asc' },
    }),
    prisma.medicineRecord.findMany({
      where: { farmId, date: { gte: from, lte: to } },
      include: { animals: { include: { animal: true } }, vet: true },
      orderBy: { date: 'asc' },
    }),
    prisma.movement.findMany({
      where: { farmId, date: { gte: from, lte: to } },
      include: { animals: { include: { animal: true } } },
      orderBy: { date: 'asc' },
    }),
    prisma.fertiliserRecord.findMany({
      where: { farmId, date: { gte: from, lte: to } },
      include: { field: true },
      orderBy: { date: 'asc' },
    }),
    prisma.nutrientPlan.findMany({ where: { farmId }, include: { field: true } }),
    prisma.equipment.findMany({ where: { farmId } }),
    prisma.sfiAgreement.findMany({ where: { farmId }, include: { actions: { include: { evidence: true } } } }),
    prisma.auditChecklist.findMany({ where: { farmId }, include: { items: true }, orderBy: { auditDate: 'desc' } }),
    prisma.complianceAlert.findMany({ where: { farmId } }),
  ]);

  const totalItems = audits[0]?.items?.length || 0;
  const compliantItems = audits[0]?.items?.filter(i => i.status === 'compliant').length || 0;
  const complianceScore = totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 0;

  return {
    type: 'red-tractor',
    generatedAt: new Date().toISOString(),
    dateRange: { from: from.toISOString(), to: to.toISOString() },
    farm,
    sections: {
      fieldRegister: fields.map(f => ({
        name: f.name,
        fieldNumber: f.fieldNumber,
        hectares: f.hectares,
        cropType: f.cropType,
        soilType: f.soilType,
        nvzZone: f.nvzZone,
        currentSeason: f.seasons.find(s => s.year === new Date().getFullYear()),
        latestSoilTest: f.soilTests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0],
      })),
      sprayRecords: sprays.map(s => ({
        date: s.date,
        field: s.field.name,
        products: s.products.map(p => ({
          name: p.productName,
          activeIngredient: p.activeIngredient,
          doseRate: p.doseRate,
          doseUnit: p.doseUnit,
          batchNumber: p.batchNumber,
        })),
        operator: s.operator?.name,
        equipment: s.equipment?.name,
        areaTreated: s.areaTreatedHa,
        weather: s.weatherSnapshot ? {
          temp: s.weatherSnapshot.tempC,
          wind: s.weatherSnapshot.windSpeedKmh,
          windDir: s.weatherSnapshot.windDirection,
          humidity: s.weatherSnapshot.humidityPct,
        } : null,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      medicineRecords: medicines.map(m => ({
        date: m.date,
        product: m.productName,
        batchNumber: m.batchNumber,
        dose: m.dose,
        route: m.route,
        animals: m.animals.map(a => a.animal.earTag),
        withdrawalMeat: m.withdrawalMeatDays,
        withdrawalMilk: m.withdrawalMilkDays,
        withdrawalEnd: m.withdrawalEndDate,
        vet: m.vet ? { name: m.vet.name, practice: m.vet.practice, rcvs: m.vet.rcvsNumber } : null,
        reason: m.reason,
      })),
      movementRecords: movements.map(m => ({
        date: m.date,
        type: m.movementType,
        fromCph: m.fromCph,
        toCph: m.toCph,
        animalCount: m.animalCount,
        species: m.species,
        animals: m.animals.map(a => a.animal.earTag),
        haulier: m.haulier,
        vehicleReg: m.vehicleReg,
        bcmsSubmitted: m.bcmsSubmitted,
        bcmsRef: m.bcmsRef,
      })),
      fertiliserRecords: fertilisers.map(f => ({
        date: f.date,
        field: f.field.name,
        productType: f.productType,
        productName: f.productName,
        rateKgHa: f.rateKgHa,
        nContent: f.nContent,
        pContent: f.pContent,
        kContent: f.kContent,
        method: f.method,
        nvzCompliant: f.nvzCompliant,
      })),
      nvzPlan: nutrientPlans.map(np => ({
        field: np.field.name,
        year: np.year,
        plannedN: np.plannedN,
        plannedP: np.plannedP,
        plannedK: np.plannedK,
        actualN: np.actualN,
        actualP: np.actualP,
        actualK: np.actualK,
        compliant: np.nvzCompliant,
      })),
      equipmentRegister: equipment.map(e => ({
        name: e.name,
        type: e.type,
        nozzleType: e.nozzleType,
        tankCapacity: e.tankCapacity,
        calibrationDate: e.calibrationDate,
        motExpiry: e.motExpiry,
      })),
      sfiActions: sfiAgreements.flatMap(a => a.actions.map(act => ({
        code: act.actionCode,
        name: act.actionName,
        hectares: act.hectares,
        evidenceCount: act.evidence.length,
        submittedCount: act.evidence.filter(e => e.status === 'submitted').length,
      }))),
      complianceScore: {
        overall: complianceScore,
        totalItems,
        compliantItems,
        auditStatus: audits[0]?.status || 'none',
      },
    },
  };
}

async function generateBcmsReport(farmId: string, from: Date, to: Date) {
  const movements = await prisma.movement.findMany({
    where: { farmId, date: { gte: from, lte: to } },
    include: { animals: { include: { animal: true } } },
    orderBy: { date: 'asc' },
  });

  return {
    type: 'bcms',
    generatedAt: new Date().toISOString(),
    dateRange: { from: from.toISOString(), to: to.toISOString() },
    movements: movements.map(m => ({
      date: m.date,
      movementType: m.movementType,
      fromCph: m.fromCph,
      toCph: m.toCph,
      species: m.species,
      animalCount: m.animalCount,
      animals: m.animals.map(a => ({
        earTag: a.animal.earTag,
        eidNumber: a.animal.eidNumber,
        breed: a.animal.breed,
        sex: a.animal.sex,
        dob: a.animal.dob,
      })),
      haulier: m.haulier,
      vehicleReg: m.vehicleReg,
      departureTime: m.departureTime,
      journeyDuration: m.journeyDuration,
      bcmsSubmitted: m.bcmsSubmitted,
      bcmsRef: m.bcmsRef,
    })),
    totalMovements: movements.length,
    submitted: movements.filter(m => m.bcmsSubmitted).length,
    pending: movements.filter(m => !m.bcmsSubmitted).length,
  };
}

async function generateSprayReport(farmId: string, from: Date, to: Date, fieldId?: string) {
  const where: Record<string, unknown> = { farmId, date: { gte: from, lte: to } };
  if (fieldId) where.fieldId = fieldId;

  const sprays = await prisma.sprayRecord.findMany({
    where,
    include: { products: true, field: true, operator: true, equipment: true, weatherSnapshot: true },
    orderBy: { date: 'asc' },
  });

  const fields = await prisma.field.findMany({ where: { farmId } });
  const byField: Record<string, typeof sprays> = {};
  sprays.forEach(s => {
    if (!byField[s.field.name]) byField[s.field.name] = [];
    byField[s.field.name].push(s);
  });

  return {
    type: 'spray',
    generatedAt: new Date().toISOString(),
    dateRange: { from: from.toISOString(), to: to.toISOString() },
    totalApplications: sprays.length,
    totalFields: Object.keys(byField).length,
    byField: Object.entries(byField).map(([fieldName, records]) => ({
      fieldName,
      hectares: fields.find(f => f.name === fieldName)?.hectares,
      applications: records.length,
      records: records.map(s => ({
        date: s.date,
        products: s.products.map(p => ({
          name: p.productName,
          activeIngredient: p.activeIngredient,
          doseRate: p.doseRate,
          doseUnit: p.doseUnit,
          batchNumber: p.batchNumber,
        })),
        operator: s.operator?.name,
        equipment: s.equipment?.name,
        areaTreated: s.areaTreatedHa,
        weather: s.weatherSnapshot,
        startTime: s.startTime,
        endTime: s.endTime,
        reason: s.reason,
      })),
    })),
  };
}

async function generateMedicineReport(farmId: string, from: Date, to: Date) {
  const medicines = await prisma.medicineRecord.findMany({
    where: { farmId, date: { gte: from, lte: to } },
    include: { animals: { include: { animal: true } }, vet: true },
    orderBy: { date: 'asc' },
  });

  const now = new Date();
  return {
    type: 'medicine',
    generatedAt: new Date().toISOString(),
    dateRange: { from: from.toISOString(), to: to.toISOString() },
    totalTreatments: medicines.length,
    records: medicines.map(m => ({
      date: m.date,
      product: m.productName,
      batchNumber: m.batchNumber,
      dose: m.dose,
      route: m.route,
      reason: m.reason,
      animals: m.animals.map(a => ({
        earTag: a.animal.earTag,
        species: a.animal.species,
      })),
      withdrawal: {
        meatDays: m.withdrawalMeatDays,
        milkDays: m.withdrawalMilkDays,
        endMeat: m.withdrawalEndMeat,
        endMilk: m.withdrawalEndMilk,
        endDate: m.withdrawalEndDate,
        active: m.withdrawalEndDate ? new Date(m.withdrawalEndDate) > now : false,
      },
      vet: m.vet ? { name: m.vet.name, practice: m.vet.practice, rcvs: m.vet.rcvsNumber } : null,
    })),
    activeWithdrawals: medicines.filter(m => m.withdrawalEndDate && new Date(m.withdrawalEndDate) > now).length,
  };
}

async function generateSfiReport(farmId: string) {
  const agreements = await prisma.sfiAgreement.findMany({
    where: { farmId },
    include: {
      actions: {
        include: {
          evidence: true,
          field: true,
        },
      },
    },
  });

  return {
    type: 'sfi',
    generatedAt: new Date().toISOString(),
    agreements: agreements.map(a => ({
      ref: a.sfiRef,
      status: a.status,
      startDate: a.startDate,
      endDate: a.endDate,
      totalPayment: a.totalAnnualPayment,
      actions: a.actions.map(act => ({
        code: act.actionCode,
        name: act.actionName,
        field: act.field?.name,
        hectares: act.hectares,
        paymentPerHa: act.paymentPerHa,
        evidenceRequired: act.evidenceRequired,
        evidence: act.evidence.map(e => ({
          date: e.date,
          description: e.description,
          photoUrl: e.photoUrl,
          lat: e.geoLat,
          lng: e.geoLng,
          status: e.status,
        })),
        totalEvidence: act.evidence.length,
        submittedEvidence: act.evidence.filter(e => e.status === 'submitted').length,
      })),
    })),
    totalActions: agreements.reduce((sum, a) => sum + a.actions.length, 0),
    totalEvidence: agreements.reduce((sum, a) => sum + a.actions.reduce((s, act) => s + act.evidence.length, 0), 0),
  };
}

async function generateNvzReport(farmId: string, from: Date, to: Date, fieldId?: string) {
  const fertWhere: Record<string, unknown> = { farmId, date: { gte: from, lte: to } };
  if (fieldId) fertWhere.fieldId = fieldId;

  const [nutrientPlans, fertilisers, fields] = await Promise.all([
    prisma.nutrientPlan.findMany({
      where: fieldId ? { farmId, fieldId } : { farmId },
      include: { field: true },
    }),
    prisma.fertiliserRecord.findMany({
      where: fertWhere,
      include: { field: true },
    }),
    prisma.field.findMany({ where: { farmId } }),
  ]);

  const totalHectares = fields.reduce((sum, f) => sum + f.hectares, 0);
  const byField: Record<string, { n: number; p: number; k: number; organicN: number; hectares: number }> = {};

  fertilisers.forEach(f => {
    const key = f.field.name;
    if (!byField[key]) byField[key] = { n: 0, p: 0, k: 0, organicN: 0, hectares: f.field.hectares };
    byField[key].n += f.nContent || 0;
    byField[key].p += f.pContent || 0;
    byField[key].k += f.kContent || 0;
    if (['organic', 'fym', 'slurry'].includes(f.productType)) {
      byField[key].organicN += f.nContent || 0;
    }
  });

  const totalOrganicN = Object.values(byField).reduce((sum, f) => sum + f.organicN, 0);
  const wholeFarmOrganicNAvg = totalHectares > 0 ? totalOrganicN / totalHectares : 0;

  return {
    type: 'nvz',
    generatedAt: new Date().toISOString(),
    dateRange: { from: from.toISOString(), to: to.toISOString() },
    wholeFarmOrganicNPerHa: Math.round(wholeFarmOrganicNAvg * 10) / 10,
    nvzLimit: 170,
    compliant: wholeFarmOrganicNAvg <= 170,
    perField: Object.entries(byField).map(([name, data]) => {
      const plan = nutrientPlans.find(np => np.field.name === name);
      return {
        fieldName: name,
        hectares: data.hectares,
        appliedN: Math.round(data.n * 10) / 10,
        appliedP: Math.round(data.p * 10) / 10,
        appliedK: Math.round(data.k * 10) / 10,
        organicN: Math.round(data.organicN * 10) / 10,
        plannedN: plan?.plannedN,
        plannedP: plan?.plannedP,
        plannedK: plan?.plannedK,
        nvzCompliant: plan?.nvzCompliant ?? true,
      };
    }),
    nutrientPlans: nutrientPlans.map(np => ({
      field: np.field.name,
      year: np.year,
      plannedN: np.plannedN,
      plannedP: np.plannedP,
      plannedK: np.plannedK,
      actualN: np.actualN,
      actualP: np.actualP,
      actualK: np.actualK,
      compliant: np.nvzCompliant,
    })),
  };
}

async function generateFarmSummary(farmId: string) {
  const [farm, fields, animals, sprays, medicines, movements, agreements, audits, alerts] = await Promise.all([
    prisma.farm.findUnique({ where: { id: farmId } }),
    prisma.field.findMany({ where: { farmId } }),
    prisma.animal.findMany({ where: { farmId, status: 'alive' } }),
    prisma.sprayRecord.findMany({ where: { farmId } }),
    prisma.medicineRecord.findMany({ where: { farmId } }),
    prisma.movement.findMany({ where: { farmId } }),
    prisma.sfiAgreement.findMany({ where: { farmId, status: 'active' } }),
    prisma.auditChecklist.findMany({ where: { farmId }, include: { items: true } }),
    prisma.complianceAlert.findMany({ where: { farmId, resolved: false } }),
  ]);

  const totalHectares = fields.reduce((sum, f) => sum + f.hectares, 0);
  const cattleCount = animals.filter(a => a.species === 'cattle').length;
  const sheepCount = animals.filter(a => a.species === 'sheep').length;

  const latestAudit = audits[0];
  const rtItems = latestAudit?.items?.length || 0;
  const rtCompliant = latestAudit?.items?.filter(i => i.status === 'compliant').length || 0;

  return {
    type: 'farm-summary',
    generatedAt: new Date().toISOString(),
    farm,
    overview: {
      totalFields: fields.length,
      totalHectares: Math.round(totalHectares * 10) / 10,
      totalAnimals: animals.length,
      cattleCount,
      sheepCount,
      otherAnimals: animals.length - cattleCount - sheepCount,
    },
    compliance: {
      redTractorScore: rtItems > 0 ? Math.round((rtCompliant / rtItems) * 100) : null,
      sfiAgreements: agreements.length,
      outstandingAlerts: alerts.length,
    },
    seasonHighlights: {
      totalSprays: sprays.length,
      totalTreatments: medicines.length,
      totalMovements: movements.length,
    },
    upcomingDeadlines: alerts.slice(0, 5).map(a => ({
      type: a.type,
      message: a.message,
      dueDate: a.dueDate,
    })),
  };
}

async function generateSeasonSummary(farmId: string, from: Date, to: Date, fieldId?: string) {
  const fertWhere: Record<string, unknown> = { farmId, date: { gte: from, lte: to } };
  const sprayWhere: Record<string, unknown> = { farmId, date: { gte: from, lte: to } };
  if (fieldId) { fertWhere.fieldId = fieldId; sprayWhere.fieldId = fieldId; }

  const [fields, sprays, fertilisers, seasons] = await Promise.all([
    prisma.field.findMany({ where: fieldId ? { id: fieldId, farmId } : { farmId } }),
    prisma.sprayRecord.findMany({ where: sprayWhere, include: { products: true, field: true } }),
    prisma.fertiliserRecord.findMany({ where: fertWhere, include: { field: true } }),
    prisma.fieldSeason.findMany({
      where: fieldId ? { fieldId, year: { gte: from.getFullYear(), lte: to.getFullYear() } } : { field: { farmId }, year: { gte: from.getFullYear(), lte: to.getFullYear() } },
      include: { field: true },
    }),
  ]);

  const perField = fields.map(f => {
    const fieldSprays = sprays.filter(s => s.fieldId === f.id);
    const fieldFerts = fertilisers.filter(fe => fe.fieldId === f.id);
    const fieldSeason = seasons.find(s => s.fieldId === f.id);

    const sprayCost = fieldSprays.length * 25; // placeholder £25/application
    const fertCost = fieldFerts.length * 40; // placeholder £40/application
    const seedCost = f.hectares * 80; // placeholder £80/ha

    return {
      fieldName: f.name,
      hectares: f.hectares,
      crop: fieldSeason?.crop || f.cropType,
      variety: fieldSeason?.variety,
      yieldTonnes: fieldSeason?.yieldTonnes,
      inputs: {
        sprayApplications: fieldSprays.length,
        sprayCost: Math.round(sprayCost),
        fertApplications: fieldFerts.length,
        fertCost: Math.round(fertCost),
        seedCost: Math.round(seedCost),
        totalInputCost: Math.round(sprayCost + fertCost + seedCost),
      },
      grossMargin: fieldSeason?.yieldTonnes
        ? Math.round((fieldSeason.yieldTonnes * 180) - (sprayCost + fertCost + seedCost)) // placeholder £180/t
        : null,
    };
  });

  return {
    type: 'season',
    generatedAt: new Date().toISOString(),
    dateRange: { from: from.toISOString(), to: to.toISOString() },
    perField,
    totals: {
      totalInputCost: perField.reduce((sum, f) => sum + f.inputs.totalInputCost, 0),
      totalSprayCost: perField.reduce((sum, f) => sum + f.inputs.sprayCost, 0),
      totalFertCost: perField.reduce((sum, f) => sum + f.inputs.fertCost, 0),
      totalSeedCost: perField.reduce((sum, f) => sum + f.inputs.seedCost, 0),
    },
  };
}

async function generateExpenseReport(farmId: string, from: Date, to: Date) {
  const [sprays, medicines, fertilisers] = await Promise.all([
    prisma.sprayRecord.findMany({
      where: { farmId, date: { gte: from, lte: to } },
      include: { products: true, field: true },
    }),
    prisma.medicineRecord.findMany({
      where: { farmId, date: { gte: from, lte: to } },
      include: { animals: true },
    }),
    prisma.fertiliserRecord.findMany({
      where: { farmId, date: { gte: from, lte: to } },
      include: { field: true },
    }),
  ]);

  const categories = {
    cropProtection: {
      label: 'Crop Protection',
      count: sprays.length,
      estimatedCost: sprays.length * 25, // placeholder
      items: sprays.map(s => ({
        date: s.date,
        description: s.products.map(p => p.productName).join(', '),
        field: s.field.name,
        estimatedCost: 25,
      })),
    },
    medicine: {
      label: 'Veterinary & Medicine',
      count: medicines.length,
      estimatedCost: medicines.length * 15, // placeholder
      items: medicines.map(m => ({
        date: m.date,
        description: m.productName,
        animalCount: m.animals.length,
        estimatedCost: 15,
      })),
    },
    fertiliser: {
      label: 'Fertiliser & Nutrients',
      count: fertilisers.length,
      estimatedCost: fertilisers.length * 40, // placeholder
      items: fertilisers.map(f => ({
        date: f.date,
        description: f.productName || f.productType,
        field: f.field.name,
        estimatedCost: 40,
      })),
    },
  };

  const totalEstimatedCost = Object.values(categories).reduce((sum, c) => sum + c.estimatedCost, 0);

  return {
    type: 'expense',
    generatedAt: new Date().toISOString(),
    dateRange: { from: from.toISOString(), to: to.toISOString() },
    categories,
    totalEstimatedCost,
    note: 'Costs are estimates based on placeholder values. Enter actual costs per product for accurate figures.',
  };
}
