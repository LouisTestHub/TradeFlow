import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const spray = await prisma.sprayRecord.findUnique({
      where: { id },
      include: {
        field: {
          select: { id: true, name: true, hectares: true, nvzZone: true, cropType: true },
          
        },
        operator: { select: { id: true, name: true, email: true } },
        equipment: { select: { id: true, name: true, type: true, tankCapacity: true, nozzleType: true, calibrationDate: true } },
        products: true,
        weatherSnapshot: true,
        farm: { select: { id: true, name: true } },
      },
    });

    if (!spray) {
      return NextResponse.json({ error: 'Spray record not found' }, { status: 404 });
    }

    // Calculate compliance status
    const missingFields: string[] = [];
    if (!spray.weatherSnapshot) missingFields.push('weather conditions');
    if (spray.products.some((p) => !p.batchNumber)) missingFields.push('batch number');
    if (!spray.equipment) missingFields.push('equipment');
    if (!spray.startTime) missingFields.push('application time');

    // Check harvest intervals
    const harvestIntervals: Array<{
      productName: string;
      harvestInterval: number;
      earliestHarvest: string;
    }> = [];

    for (const product of spray.products) {
      if (product.mapp) {
        const pppProduct = await prisma.pppProduct.findFirst({
          where: { mapp: product.mapp },
        });
        if (pppProduct?.harvestInterval && pppProduct.harvestInterval > 0) {
          const earliest = new Date(spray.date);
          earliest.setDate(earliest.getDate() + pppProduct.harvestInterval);
          harvestIntervals.push({
            productName: product.productName,
            harvestInterval: pppProduct.harvestInterval,
            earliestHarvest: earliest.toISOString(),
          });
        }
      }
    }

    // Get field N total for NVZ
    let nvzData = null;
    if (spray.field.nvzZone) {
      const fieldFertRecords = await prisma.fertiliserRecord.findMany({
        where: {
          fieldId: spray.fieldId,
          date: { gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      });
      const totalN = fieldFertRecords.reduce((sum, r) => sum + (r.nContent || 0), 0);
      nvzData = {
        totalNApplied: Math.round(totalN * 10) / 10,
        nvzLimit: 250,
        percentUsed: Math.round((totalN / 250) * 100),
      };
    }

    return NextResponse.json({
      spray: {
        id: spray.id,
        date: spray.date,
        startTime: spray.startTime,
        endTime: spray.endTime,
        field: spray.field,
        farm: spray.farm,
        operator: spray.operator,
        equipment: spray.equipment,
        areaTreatedHa: spray.areaTreatedHa,
        reason: spray.reason,
        notes: spray.notes,
        status: spray.status,
        products: spray.products.map((p) => ({
          id: p.id,
          productName: p.productName,
          activeIngredient: p.activeIngredient,
          doseRate: p.doseRate,
          doseUnit: p.doseUnit,
          areaTreated: p.areaTreated,
          batchNumber: p.batchNumber,
          mapp: p.mapp,
        })),
        weather: spray.weatherSnapshot
          ? {
              tempC: spray.weatherSnapshot.tempC,
              windSpeedKmh: spray.weatherSnapshot.windSpeedKmh,
              windDirection: spray.weatherSnapshot.windDirection,
              humidityPct: spray.weatherSnapshot.humidityPct,
              rainLast24hMm: spray.weatherSnapshot.rainLast24hMm,
              source: spray.weatherSnapshot.source,
            }
          : null,
        createdAt: spray.createdAt,
        updatedAt: spray.updatedAt,
      },
      compliance: {
        isCompliant: missingFields.length === 0,
        missingFields,
      },
      harvestIntervals,
      nvzData,
    });
  } catch (error) {
    console.error('Spray GET error:', error);
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

    const existing = await prisma.sprayRecord.findUnique({
      where: { id },
      include: { weatherSnapshot: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Spray record not found' }, { status: 404 });
    }

    // Update or create weather
    let weatherSnapshotId = existing.weatherSnapshotId;
    if (weather) {
      if (existing.weatherSnapshotId) {
        await prisma.sprayWeather.update({
          where: { id: existing.weatherSnapshotId },
          data: {
            tempC: weather.tempC != null ? parseFloat(weather.tempC) : null,
            windSpeedKmh: weather.windSpeedKmh != null ? parseFloat(weather.windSpeedKmh) : null,
            windDirection: weather.windDirection || null,
            humidityPct: weather.humidityPct != null ? parseFloat(weather.humidityPct) : null,
            rainLast24hMm: weather.rainLast24hMm != null ? parseFloat(weather.rainLast24hMm) : null,
            source: weather.source || 'manual',
          },
        });
      } else {
        const newWeather = await prisma.sprayWeather.create({
          data: {
            tempC: weather.tempC != null ? parseFloat(weather.tempC) : null,
            windSpeedKmh: weather.windSpeedKmh != null ? parseFloat(weather.windSpeedKmh) : null,
            windDirection: weather.windDirection || null,
            humidityPct: weather.humidityPct != null ? parseFloat(weather.humidityPct) : null,
            rainLast24hMm: weather.rainLast24hMm != null ? parseFloat(weather.rainLast24hMm) : null,
            source: weather.source || 'manual',
          },
        });
        weatherSnapshotId = newWeather.id;
      }
    }

    // Update products - delete old, create new
    if (products && Array.isArray(products)) {
      await prisma.sprayProduct.deleteMany({ where: { sprayRecordId: id } });
      for (const p of products) {
        await prisma.sprayProduct.create({
          data: {
            sprayRecordId: id,
            productName: p.productName,
            activeIngredient: p.activeIngredient || null,
            doseRate: p.doseRate ? parseFloat(p.doseRate) : null,
            doseUnit: p.doseUnit || null,
            areaTreated: p.areaTreated ? parseFloat(p.areaTreated) : null,
            batchNumber: p.batchNumber || null,
            mapp: p.mapp || null,
          },
        });
      }
    }

    const spray = await prisma.sprayRecord.update({
      where: { id },
      data: {
        fieldId: fieldId || undefined,
        date: date ? new Date(date) : undefined,
        startTime: startTime !== undefined ? startTime : undefined,
        endTime: endTime !== undefined ? endTime : undefined,
        operatorId: operatorId || undefined,
        equipmentId: equipmentId !== undefined ? equipmentId : undefined,
        weatherSnapshotId,
        areaTreatedHa: areaTreatedHa !== undefined ? parseFloat(areaTreatedHa) : undefined,
        reason: reason !== undefined ? reason : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        products: true,
        weatherSnapshot: true,
        field: { select: { id: true, name: true, hectares: true } },
      },
    });

    return NextResponse.json({ spray });
  } catch (error) {
    console.error('Spray PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.sprayRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Spray record not found' }, { status: 404 });
    }

    // Delete products first
    await prisma.sprayProduct.deleteMany({ where: { sprayRecordId: id } });

    // Delete weather if exists
    if (existing.weatherSnapshotId) {
      // Need to disconnect first since it's a 1:1
      await prisma.sprayRecord.update({
        where: { id },
        data: { weatherSnapshotId: null },
      });
      await prisma.sprayWeather.delete({ where: { id: existing.weatherSnapshotId } });
    }

    await prisma.sprayRecord.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Spray DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
