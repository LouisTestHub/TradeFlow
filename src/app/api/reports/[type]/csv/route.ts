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

  try {
    let csv = '';
    let filename = '';

    switch (type) {
      case 'bcms': {
        const movements = await prisma.movement.findMany({
          where: { farmId: farm.id, date: { gte: from, lte: to } },
          include: { animals: { include: { animal: true } } },
          orderBy: { date: 'asc' },
        });
        csv = 'Movement Date,Movement Type,From CPH,To CPH,Species,Animal Count,Ear Tags,Haulier,Vehicle Reg,BCMS Submitted,BCMS Ref\n';
        movements.forEach(m => {
          const tags = m.animals.map(a => a.animal.earTag).join('; ');
          csv += `${fmtDate(m.date)},${m.movementType},${m.fromCph},${m.toCph},${m.species || ''},${m.animalCount},"${tags}",${m.haulier || ''},${m.vehicleReg || ''},${m.bcmsSubmitted ? 'Yes' : 'No'},${m.bcmsRef || ''}\n`;
        });
        filename = `bcms-movements-${fmtDate(from)}-to-${fmtDate(to)}.csv`;
        break;
      }
      case 'spray': {
        const sprays = await prisma.sprayRecord.findMany({
          where: { farmId: farm.id, date: { gte: from, lte: to } },
          include: { products: true, field: true, operator: true, equipment: true, weatherSnapshot: true },
          orderBy: { date: 'asc' },
        });
        csv = 'Date,Field,Product,Active Ingredient,Dose Rate,Unit,Batch No,Area (ha),Operator,Equipment,Temp (°C),Wind (km/h),Wind Dir,Humidity (%),Reason\n';
        sprays.forEach(s => {
          s.products.forEach(p => {
            const w = s.weatherSnapshot;
            csv += `${fmtDate(s.date)},${s.field.name},"${p.productName}",${p.activeIngredient || ''},${p.doseRate || ''},${p.doseUnit || ''},${p.batchNumber || ''},${s.areaTreatedHa || ''},${s.operator?.name || ''},${s.equipment?.name || ''},${w?.tempC ?? ''},${w?.windSpeedKmh ?? ''},${w?.windDirection || ''},${w?.humidityPct ?? ''},${s.reason || ''}\n`;
          });
        });
        filename = `spray-report-${fmtDate(from)}-to-${fmtDate(to)}.csv`;
        break;
      }
      case 'medicine': {
        const medicines = await prisma.medicineRecord.findMany({
          where: { farmId: farm.id, date: { gte: from, lte: to } },
          include: { animals: { include: { animal: true } }, vet: true },
          orderBy: { date: 'asc' },
        });
        csv = 'Date,Product,Batch No,Dose,Route,Animals,Withdrawal Meat (days),Withdrawal Milk (days),Withdrawal End,Vet,Reason\n';
        medicines.forEach(m => {
          const tags = m.animals.map(a => a.animal.earTag).join('; ');
          csv += `${fmtDate(m.date)},"${m.productName}",${m.batchNumber || ''},${m.dose || ''},${m.route || ''},"${tags}",${m.withdrawalMeatDays ?? ''},${m.withdrawalMilkDays ?? ''},${m.withdrawalEndDate ? fmtDate(m.withdrawalEndDate) : ''},${m.vet?.name || ''},${m.reason || ''}\n`;
        });
        filename = `medicine-report-${fmtDate(from)}-to-${fmtDate(to)}.csv`;
        break;
      }
      case 'nvz': {
        const fertilisers = await prisma.fertiliserRecord.findMany({
          where: { farmId: farm.id, date: { gte: from, lte: to } },
          include: { field: true },
          orderBy: { date: 'asc' },
        });
        csv = 'Date,Field,Product Type,Product Name,Rate (kg/ha),N (kg/ha),P2O5 (kg/ha),K2O (kg/ha),Method,NVZ Compliant\n';
        fertilisers.forEach(f => {
          csv += `${fmtDate(f.date)},${f.field.name},${f.productType},${f.productName || ''},${f.rateKgHa ?? ''},${f.nContent ?? ''},${f.pContent ?? ''},${f.kContent ?? ''},${f.method || ''},${f.nvzCompliant ? 'Yes' : 'No'}\n`;
        });
        filename = `nvz-nutrient-${fmtDate(from)}-to-${fmtDate(to)}.csv`;
        break;
      }
      case 'expense': {
        const [sprays, meds, ferts] = await Promise.all([
          prisma.sprayRecord.findMany({ where: { farmId: farm.id, date: { gte: from, lte: to } }, include: { products: true, field: true } }),
          prisma.medicineRecord.findMany({ where: { farmId: farm.id, date: { gte: from, lte: to } } }),
          prisma.fertiliserRecord.findMany({ where: { farmId: farm.id, date: { gte: from, lte: to } }, include: { field: true } }),
        ]);
        csv = 'Date,Category,Description,Field/Animal,Estimated Cost (£)\n';
        sprays.forEach(s => {
          csv += `${fmtDate(s.date)},Crop Protection,"${s.products.map(p => p.productName).join(', ')}",${s.field.name},25\n`;
        });
        meds.forEach(m => {
          csv += `${fmtDate(m.date)},Veterinary & Medicine,"${m.productName}",,15\n`;
        });
        ferts.forEach(f => {
          csv += `${fmtDate(f.date)},Fertiliser & Nutrients,"${f.productName || f.productType}",${f.field.name},40\n`;
        });
        filename = `expense-report-${fmtDate(from)}-to-${fmtDate(to)}.csv`;
        break;
      }
      case 'season': {
        const [fields, sprays, ferts, seasons] = await Promise.all([
          prisma.field.findMany({ where: { farmId: farm.id } }),
          prisma.sprayRecord.findMany({ where: { farmId: farm.id, date: { gte: from, lte: to } } }),
          prisma.fertiliserRecord.findMany({ where: { farmId: farm.id, date: { gte: from, lte: to } } }),
          prisma.fieldSeason.findMany({ where: { field: { farmId: farm.id } }, include: { field: true } }),
        ]);
        csv = 'Field,Hectares,Crop,Variety,Yield (t),Spray Apps,Spray Cost (£),Fert Apps,Fert Cost (£),Seed Cost (£),Total Input (£),Gross Margin (£)\n';
        fields.forEach(f => {
          const fs = sprays.filter(s => s.fieldId === f.id);
          const ff = ferts.filter(fe => fe.fieldId === f.id);
          const season = seasons.find(s => s.fieldId === f.id);
          const sc = fs.length * 25; const fc = ff.length * 40; const seedC = f.hectares * 80;
          const total = sc + fc + seedC;
          const gm = season?.yieldTonnes ? Math.round((season.yieldTonnes * 180) - total) : '';
          csv += `${f.name},${f.hectares},${season?.crop || f.cropType || ''},${season?.variety || ''},${season?.yieldTonnes ?? ''},${fs.length},${sc},${ff.length},${fc},${Math.round(seedC)},${Math.round(total)},${gm}\n`;
        });
        filename = `season-summary-${fmtDate(from)}-to-${fmtDate(to)}.csv`;
        break;
      }
      default:
        return NextResponse.json({ error: 'CSV not available for this report type' }, { status: 400 });
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}

function fmtDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().split('T')[0];
}
