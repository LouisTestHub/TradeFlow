import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');
    const product = searchParams.get('product');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { farmId: farm.id };
    if (fieldId) where.fieldId = fieldId;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
    }
    if (product) {
      where.products = { some: { productName: { contains: product } } };
    }

    const [sprays, total] = await Promise.all([
      prisma.sprayRecord.findMany({
        where,
        include: {
          field: { select: { id: true, name: true, hectares: true } },
          operator: { select: { id: true, name: true } },
          equipment: { select: { id: true, name: true, type: true } },
          products: true,
          weatherSnapshot: true,
        },
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.sprayRecord.count({ where }),
    ]);

    return NextResponse.json({
      sprays: sprays.map((s) => ({
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        field: s.field,
        operator: s.operator,
        equipment: s.equipment,
        areaTreatedHa: s.areaTreatedHa,
        reason: s.reason,
        notes: s.notes,
        status: s.status,
        products: s.products.map((p) => ({
          id: p.id,
          productName: p.productName,
          activeIngredient: p.activeIngredient,
          doseRate: p.doseRate,
          doseUnit: p.doseUnit,
          areaTreated: p.areaTreated,
          batchNumber: p.batchNumber,
          mapp: p.mapp,
        })),
        weather: s.weatherSnapshot
          ? {
              tempC: s.weatherSnapshot.tempC,
              windSpeedKmh: s.weatherSnapshot.windSpeedKmh,
              windDirection: s.weatherSnapshot.windDirection,
              humidityPct: s.weatherSnapshot.humidityPct,
              rainLast24hMm: s.weatherSnapshot.rainLast24hMm,
              source: s.weatherSnapshot.source,
            }
          : null,
        createdAt: s.createdAt,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Sprays GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const farm = await prisma.farm.findFirst();
    if (!farm) return NextResponse.json({ error: 'No farm found' }, { status: 404 });

    const body = await request.json();
    const {
      fieldId,
      date,
      startTime,
      endTime,
      areaTreatedHa,
      reason,
      notes,
      operatorId,
      equipmentId,
      products,
      weather,
    } = body;

    if (!fieldId || !date || !operatorId) {
      return NextResponse.json(
        { error: 'fieldId, date, and operatorId are required' },
        { status: 400 }
      );
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'At least one product is required' },
        { status: 400 }
      );
    }

    // Create weather snapshot if provided
    let weatherSnapshotId: string | null = null;
    if (weather) {
      const weatherRecord = await prisma.sprayWeather.create({
        data: {
          tempC: weather.tempC != null ? parseFloat(weather.tempC) : null,
          windSpeedKmh: weather.windSpeedKmh != null ? parseFloat(weather.windSpeedKmh) : null,
          windDirection: weather.windDirection || null,
          humidityPct: weather.humidityPct != null ? parseFloat(weather.humidityPct) : null,
          rainLast24hMm: weather.rainLast24hMm != null ? parseFloat(weather.rainLast24hMm) : null,
          source: weather.source || 'manual',
        },
      });
      weatherSnapshotId = weatherRecord.id;
    }

    const spray = await prisma.sprayRecord.create({
      data: {
        farmId: farm.id,
        fieldId,
        date: new Date(date),
        startTime: startTime || null,
        endTime: endTime || null,
        operatorId,
        equipmentId: equipmentId || null,
        weatherSnapshotId,
        areaTreatedHa: areaTreatedHa ? parseFloat(areaTreatedHa) : null,
        reason: reason || null,
        notes: notes || null,
        status: 'complete',
        products: {
          create: products.map((p: Record<string, unknown>) => ({
            productName: p.productName as string,
            activeIngredient: (p.activeIngredient as string) || null,
            doseRate: p.doseRate ? parseFloat(p.doseRate as string) : null,
            doseUnit: (p.doseUnit as string) || null,
            areaTreated: p.areaTreated ? parseFloat(p.areaTreated as string) : null,
            batchNumber: (p.batchNumber as string) || null,
            mapp: (p.mapp as string) || null,
          })),
        },
      },
      include: {
        products: true,
        weatherSnapshot: true,
        field: { select: { id: true, name: true, hectares: true } },
      },
    });

    return NextResponse.json({ spray }, { status: 201 });
  } catch (error) {
    console.error('Sprays POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
