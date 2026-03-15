import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const field = await prisma.field.findUnique({
      where: { id },
      include: {
        seasons: { orderBy: { year: 'desc' } },
        sprayRecords: {
          orderBy: { date: 'desc' },
          include: { products: true, operator: true, weatherSnapshot: true },
        },
        soilTests: { orderBy: { date: 'desc' } },
        fertRecords: {
          orderBy: { date: 'desc' },
          include: { operator: true },
        },
        nutrientPlans: { orderBy: { year: 'desc' } },
        sfiActions: {
          include: { evidence: true, agreement: true },
        },
        farm: true,
      },
    });

    if (!field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 404 });
    }

    // Calculate nutrient totals for current season
    const currentYear = new Date().getFullYear();
    const seasonFerts = field.fertRecords.filter(
      (f) => new Date(f.date).getFullYear() >= currentYear - 1
    );
    const totalN = seasonFerts.reduce((sum, f) => sum + (f.nContent || 0) * (f.rateKgHa || 0) / 100, 0);
    const totalP = seasonFerts.reduce((sum, f) => sum + (f.pContent || 0) * (f.rateKgHa || 0) / 100, 0);
    const totalK = seasonFerts.reduce((sum, f) => sum + (f.kContent || 0) * (f.rateKgHa || 0) / 100, 0);

    return NextResponse.json({
      field: {
        id: field.id,
        name: field.name,
        fieldNumber: field.fieldNumber,
        hectares: field.hectares,
        cropType: field.cropType,
        soilType: field.soilType,
        nvzZone: field.nvzZone,
        geometry: field.geometry,
        farmName: field.farm.name,
      },
      seasons: field.seasons,
      sprays: field.sprayRecords.map((s) => ({
        id: s.id,
        date: s.date,
        products: s.products.map((p) => ({
          name: p.productName,
          activeIngredient: p.activeIngredient,
          doseRate: p.doseRate,
          doseUnit: p.doseUnit,
        })),
        operator: s.operator.name,
        areaTreated: s.areaTreatedHa,
        weather: s.weatherSnapshot,
      })),
      soilTests: field.soilTests,
      fertiliser: {
        records: field.fertRecords.map((f) => ({
          id: f.id,
          date: f.date,
          productType: f.productType,
          productName: f.productName,
          rateKgHa: f.rateKgHa,
          nContent: f.nContent,
          pContent: f.pContent,
          kContent: f.kContent,
          method: f.method,
          operator: f.operator?.name,
        })),
        seasonTotals: {
          n: Math.round(totalN * 10) / 10,
          p: Math.round(totalP * 10) / 10,
          k: Math.round(totalK * 10) / 10,
        },
        nvzLimit: field.nvzZone ? 200 : null,
      },
      sfiActions: field.sfiActions,
    });
  } catch (error) {
    console.error('Field detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, fieldNumber, hectares, cropType, soilType, nvzZone, geometry } = body;

    const field = await prisma.field.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(fieldNumber !== undefined && { fieldNumber }),
        ...(hectares !== undefined && { hectares: parseFloat(hectares) }),
        ...(cropType !== undefined && { cropType }),
        ...(soilType !== undefined && { soilType }),
        ...(nvzZone !== undefined && { nvzZone }),
        ...(geometry !== undefined && { geometry: geometry ? JSON.stringify(geometry) : null }),
      },
    });

    return NextResponse.json({ field });
  } catch (error) {
    console.error('Update field error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
