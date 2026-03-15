'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface SprayDetail {
  spray: {
    id: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
    field: { id: string; name: string; hectares: number; nvzZone: boolean; cropType: string | null };
    farm: { id: string; name: string };
    operator: { id: string; name: string | null; email: string };
    equipment: {
      id: string;
      name: string;
      type: string;
      tankCapacity: number | null;
      nozzleType: string | null;
      calibrationDate: string | null;
    } | null;
    areaTreatedHa: number | null;
    reason: string | null;
    notes: string | null;
    status: string;
    products: Array<{
      id: string;
      productName: string;
      activeIngredient: string | null;
      doseRate: number | null;
      doseUnit: string | null;
      areaTreated: number | null;
      batchNumber: string | null;
      mapp: string | null;
    }>;
    weather: {
      tempC: number | null;
      windSpeedKmh: number | null;
      windDirection: string | null;
      humidityPct: number | null;
      rainLast24hMm: number | null;
      source: string | null;
    } | null;
    createdAt: string;
  };
  compliance: {
    isCompliant: boolean;
    missingFields: string[];
  };
  harvestIntervals: Array<{
    productName: string;
    harvestInterval: number;
    earliestHarvest: string;
  }>;
  nvzData: {
    totalNApplied: number;
    nvzLimit: number;
    percentUsed: number;
  } | null;
}

export default function SprayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<SprayDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/sprays/${id}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this spray record? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sprays/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/sprays');
      }
    } catch {
      /* ignore */
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!data?.spray) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Spray record not found</p>
        <Link href="/sprays" className="text-primary font-medium">← Back to Spray Diary</Link>
      </div>
    );
  }

  const { spray, compliance, harvestIntervals, nvzData } = data;
  const sprayDate = new Date(spray.date);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/sprays" className="text-sm text-primary hover:underline mb-1 inline-block">← Spray Diary</Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            {spray.field.name}
          </h1>
          <p className="text-slate-500 mt-1">
            {sprayDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {spray.startTime && ` • ${spray.startTime}`}
            {spray.endTime && ` – ${spray.endTime}`}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/sprays/${id}/edit`}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 min-h-[44px] flex items-center"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 min-h-[44px] disabled:opacity-50"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Compliance Badge */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
        compliance.isCompliant
          ? 'bg-green-50 border border-green-200'
          : 'bg-amber-50 border border-amber-200'
      }`}>
        <span className="text-lg">{compliance.isCompliant ? '✅' : '⚠️'}</span>
        <div>
          <p className={`text-sm font-semibold ${compliance.isCompliant ? 'text-green-700' : 'text-amber-700'}`}>
            {compliance.isCompliant ? 'Red Tractor Compliant' : 'Missing Information'}
          </p>
          {!compliance.isCompliant && (
            <p className="text-xs text-amber-600 mt-0.5">
              Missing: {compliance.missingFields.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Field & Application Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Application Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Field</p>
            <p className="text-sm font-medium text-slate-800">{spray.field.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Area Treated</p>
            <p className="text-sm font-medium text-slate-800">
              {spray.areaTreatedHa || spray.field.hectares} ha
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Crop</p>
            <p className="text-sm font-medium text-slate-800">{spray.field.cropType || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Operator</p>
            <p className="text-sm font-medium text-slate-800">{spray.operator.name || spray.operator.email}</p>
          </div>
          {spray.equipment && (
            <>
              <div>
                <p className="text-xs text-slate-500">Equipment</p>
                <p className="text-sm font-medium text-slate-800">{spray.equipment.name}</p>
              </div>
              {spray.equipment.nozzleType && (
                <div>
                  <p className="text-xs text-slate-500">Nozzle</p>
                  <p className="text-sm font-medium text-slate-800">{spray.equipment.nozzleType}</p>
                </div>
              )}
            </>
          )}
          {spray.reason && (
            <div className="col-span-2">
              <p className="text-xs text-slate-500">Reason</p>
              <p className="text-sm font-medium text-slate-800">{spray.reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
          Products Applied ({spray.products.length})
        </h2>
        {spray.products.map((product) => (
          <div key={product.id} className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">{product.productName}</p>
              {product.mapp && (
                <span className="text-xs text-slate-400">MAPP: {product.mapp}</span>
              )}
            </div>
            {product.activeIngredient && (
              <p className="text-xs text-slate-500">Active: {product.activeIngredient}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              {product.doseRate && (
                <div>
                  <span className="text-xs text-slate-400">Rate: </span>
                  <span className="font-medium text-slate-700">
                    {product.doseRate} {product.doseUnit || 'l/ha'}
                  </span>
                </div>
              )}
              {product.areaTreated && (
                <div>
                  <span className="text-xs text-slate-400">Area: </span>
                  <span className="font-medium text-slate-700">{product.areaTreated} ha</span>
                </div>
              )}
              {product.batchNumber && (
                <div>
                  <span className="text-xs text-slate-400">Batch: </span>
                  <span className="font-medium text-slate-700">{product.batchNumber}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weather */}
      {spray.weather && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Weather Conditions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {spray.weather.tempC != null && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Temperature</p>
                <p className="text-xl font-bold text-slate-800">{Math.round(spray.weather.tempC * 10) / 10}°C</p>
              </div>
            )}
            {spray.weather.windSpeedKmh != null && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Wind</p>
                <p className="text-xl font-bold text-slate-800">
                  {Math.round(spray.weather.windSpeedKmh)} km/h
                </p>
                {spray.weather.windDirection && (
                  <p className="text-xs text-slate-400">{spray.weather.windDirection}</p>
                )}
              </div>
            )}
            {spray.weather.humidityPct != null && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Humidity</p>
                <p className="text-xl font-bold text-slate-800">{Math.round(spray.weather.humidityPct)}%</p>
              </div>
            )}
            {spray.weather.rainLast24hMm != null && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Rain (24h)</p>
                <p className="text-xl font-bold text-slate-800">
                  {Math.round(spray.weather.rainLast24hMm * 10) / 10} mm
                </p>
              </div>
            )}
          </div>
          {spray.weather.source && (
            <p className="text-xs text-slate-400">Source: {spray.weather.source}</p>
          )}

          {/* Spray window check inline */}
          {spray.weather.tempC != null && spray.weather.windSpeedKmh != null && (
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                {spray.weather.tempC > 5 ? '✅' : '⚠️'} Temperature {spray.weather.tempC > 5 ? 'OK' : 'below minimum'}
              </p>
              <p className="text-sm">
                {spray.weather.windSpeedKmh < 20 ? '✅' : '⚠️'} Wind {spray.weather.windSpeedKmh < 20 ? 'OK' : 'above maximum'}
              </p>
              <p className="text-sm">
                {(spray.weather.rainLast24hMm || 0) <= 2 ? '✅' : '⚠️'} Rainfall {(spray.weather.rainLast24hMm || 0) <= 2 ? 'OK' : 'recent rain detected'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Harvest Intervals */}
      {harvestIntervals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Harvest Intervals</h2>
          {harvestIntervals.map((hi, i) => {
            const earliest = new Date(hi.earliestHarvest);
            const isPast = earliest < new Date();
            return (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{hi.productName}</p>
                  <p className="text-xs text-slate-500">{hi.harvestInterval} day interval</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isPast ? 'text-green-600' : 'text-amber-600'}`}>
                    {isPast ? '✅ Cleared' : `⏳ ${earliest.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </p>
                  <p className="text-xs text-slate-400">Earliest harvest</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NVZ Data */}
      {nvzData && (
        <div className={`rounded-2xl border p-5 space-y-3 ${
          nvzData.percentUsed > 100 ? 'bg-red-50 border-red-200' :
          nvzData.percentUsed > 80 ? 'bg-amber-50 border-amber-200' :
          'bg-white border-gray-100 shadow-sm'
        }`}>
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">NVZ Nitrogen Tracking</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">N applied this season</span>
            <span className="text-sm font-bold text-slate-800">{nvzData.totalNApplied} kg N/ha</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                nvzData.percentUsed > 100 ? 'bg-red-500' :
                nvzData.percentUsed > 80 ? 'bg-amber-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(nvzData.percentUsed, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{nvzData.percentUsed}% of limit</span>
            <span>Limit: {nvzData.nvzLimit} kg N/ha</span>
          </div>
          {nvzData.percentUsed > 100 && (
            <p className="text-sm text-red-700 font-semibold">🔴 NVZ limit exceeded!</p>
          )}
          {nvzData.percentUsed > 80 && nvzData.percentUsed <= 100 && (
            <p className="text-sm text-amber-700 font-semibold">⚠️ Approaching NVZ limit</p>
          )}
        </div>
      )}

      {/* Notes */}
      {spray.notes && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-2">Notes</h2>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{spray.notes}</p>
        </div>
      )}

      {/* Record Info */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
        <h2 className="text-xs font-semibold text-slate-400 uppercase mb-3">Record Information</h2>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
          <div>Record ID: {spray.id.slice(0, 8)}...</div>
          <div>Created: {new Date(spray.createdAt).toLocaleDateString('en-GB')}</div>
          <div>Status: {spray.status}</div>
          <div>Farm: {spray.farm.name}</div>
        </div>
      </div>
    </div>
  );
}
