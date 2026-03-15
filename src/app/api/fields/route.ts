import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const fields = await prisma.field.findMany({
      where: { farmId: farm.id },
      include: {
        seasons: { orderBy: { year: 'desc' } },
        sprayRecords: { orderBy: { date: 'desc' }, take: 1, include: { products: true } },
        soilTests: { orderBy: { date: 'desc' }, take: 1 },
        fertRecords: { orderBy: { date: 'desc' }, take: 1 },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      fields: fields.map((f) => ({
        id: f.id,
        name: f.name,
        fieldNumber: f.fieldNumber,
        hectares: f.hectares,
        cropType: f.cropType,
        soilType: f.soilType,
        nvzZone: f.nvzZone,
        geometry: f.geometry,
        currentSeason: f.seasons[0] || null,
        lastSpray: f.sprayRecords[0]
          ? {
              date: f.sprayRecords[0].date,
              products: f.sprayRecords[0].products.map((p) => p.productName),
            }
          : null,
        lastSoilTest: f.soilTests[0] || null,
      })),
      summary: {
        totalFields: fields.length,
        totalHectares: Math.round(fields.reduce((sum, f) => sum + f.hectares, 0) * 10) / 10,
      },
    });
  } catch (error) {
    console.error('Fields API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const { name, fieldNumber, hectares, cropType, soilType, nvzZone, geometry } = body;

    if (!name || !hectares) {
      return NextResponse.json({ error: 'Name and hectares are required' }, { status: 400 });
    }

    const field = await prisma.field.create({
      data: {
        farmId: farm.id,
        name,
        fieldNumber: fieldNumber || null,
        hectares: parseFloat(hectares),
        cropType: cropType || null,
        soilType: soilType || null,
        nvzZone: nvzZone || false,
        geometry: geometry ? JSON.stringify(geometry) : null,
      },
    });

    return NextResponse.json({ field }, { status: 201 });
  } catch (error) {
    console.error('Create field error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
