'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FieldPlan {
  fieldId: string;
  fieldName: string;
  hectares: number;
  nvzZone: boolean;
  cropType: string;
  isGrass: boolean;
  nLimit: number;
  nApplied: number;
  nPerHa: number;
  pApplied: number;
  kApplied: number;
  organicN: number;
  remaining: number;
  percentUsed: number;
  nvzStatus: 'compliant' | 'warning' | 'exceeded' | 'na';
  recordCount: number;
}

interface WholeFarmSummary {
  totalAreaNVZ: number;
  totalOrganicN: number;
  avgOrganicNPerHa: number;
  organicNLimit: number;
  organicNStatus: string;
  organicNPercent: number;
}

interface ClosedPeriod {
  type: string;
  start: string;
  end: string;
  months: number[];
}

const STATUS_COLORS = {
  compliant: { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500', border: 'border-green-200' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500', border: 'border-amber-200' },
  exceeded: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500', border: 'border-red-200' },
  na: { bg: 'bg-gray-50', text: 'text-gray-500', bar: 'bg-gray-300', border: 'border-gray-200' },
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function NvzPlanPage() {
  const [fieldPlans, setFieldPlans] = useState<FieldPlan[]>([]);
  const [wholeFarm, setWholeFarm] = useState<WholeFarmSummary | null>(null);
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriod[]>([]);
  const [season, setSeason] = useState('');
  const [isAnyClosed, setIsAnyClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fertiliser/nvz-plan')
      .then((r) => r.json())
      .then((data) => {
        setFieldPlans(data.fieldPlans || []);
        setWholeFarm(data.wholeFarmSummary || null);
        setClosedPeriods(data.closedPeriods || []);
        setSeason(data.season || '');
        setIsAnyClosed(data.isAnyClosed || false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const nvzFields = fieldPlans.filter((f) => f.nvzZone);
  const currentMonth = new Date().getMonth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/fertiliser" className="text-sm text-slate-500 hover:text-primary mb-1 inline-block">← Fertiliser Records</Link>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">NVZ Nutrient Plan</h1>
          <p className="text-sm text-slate-500 mt-1">Season {season}</p>
        </div>
        <button className="border border-primary text-primary px-4 py-3 rounded-xl font-medium hover:bg-primary/5 transition min-h-[48px] flex items-center gap-2">
          📄 Export PDF
        </button>
      </div>

      {/* Per-field N tracking */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="hidden sm:grid grid-cols-7 gap-2 px-5 py-3 bg-gray-50 text-xs font-semibold text-slate-400 uppercase">
          <span>Field</span>
          <span>Crop</span>
          <span>N Applied</span>
          <span>N Limit</span>
          <span className="col-span-2">Progress</span>
          <span className="text-center">Status</span>
        </div>
        <div className="divide-y divide-gray-50">
          {fieldPlans.map((f) => {
            const colors = STATUS_COLORS[f.nvzStatus];
            return (
              <div key={f.fieldId} className="sm:grid sm:grid-cols-7 sm:gap-2 px-5 py-4 items-center">
                <div>
                  <span className="font-medium text-sm text-slate-800">{f.fieldName}</span>
                  <span className="block text-xs text-slate-400">{f.hectares} ha</span>
                </div>
                <span className="text-sm text-slate-600">{f.cropType}</span>
                <span className="text-sm font-medium text-slate-700">{f.nPerHa} kg/ha</span>
                <span className="text-sm text-slate-500">{f.nvzZone ? f.nLimit : '—'}</span>
                <div className="col-span-2">
                  {f.nvzZone ? (
                    <div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${colors.bar}`}
                          style={{ width: `${Math.min(100, f.percentUsed)}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">{f.remaining} kg/ha remaining</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Not in NVZ</span>
                  )}
                </div>
                <div className="text-center">
                  {f.nvzZone ? (
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                      {f.nvzStatus === 'compliant' ? '🟢' : f.nvzStatus === 'warning' ? '🟡' : '🔴'} {f.percentUsed}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-2 bg-gray-50 text-xs text-slate-500">
          * Grassland NVZ limit: 250 kg N/ha • Arable NVZ limit: 200 kg N/ha
        </div>
      </div>

      {/* Whole Farm Summary */}
      {wholeFarm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Whole Farm Organic N Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{wholeFarm.totalAreaNVZ}</p>
              <p className="text-xs text-slate-500 mt-1">ha in NVZ</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{wholeFarm.totalOrganicN}</p>
              <p className="text-xs text-slate-500 mt-1">kg organic N total</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${wholeFarm.organicNStatus === 'compliant' ? 'bg-green-50' : wholeFarm.organicNStatus === 'warning' ? 'bg-amber-50' : 'bg-red-50'}`}>
              <p className={`text-2xl font-bold ${wholeFarm.organicNStatus === 'compliant' ? 'text-green-700' : wholeFarm.organicNStatus === 'warning' ? 'text-amber-700' : 'text-red-700'}`}>
                {wholeFarm.avgOrganicNPerHa}
              </p>
              <p className="text-xs text-slate-500 mt-1">kg/ha average</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{wholeFarm.organicNLimit}</p>
              <p className="text-xs text-slate-500 mt-1">kg/ha limit</p>
            </div>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${
              wholeFarm.organicNStatus === 'compliant' ? 'bg-green-500' : wholeFarm.organicNStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'
            }`} style={{ width: `${Math.min(100, wholeFarm.organicNPercent)}%` }} />
          </div>
          <p className="text-sm text-slate-600 mt-2 text-center">
            {wholeFarm.organicNPercent}% of 170 kg/ha whole farm organic N limit
            {wholeFarm.organicNStatus === 'compliant' ? ' ✅' : wholeFarm.organicNStatus === 'warning' ? ' ⚠️' : ' ❌'}
          </p>
        </div>
      )}

      {/* Closed Period Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Closed Period Calendar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs text-slate-400 font-medium pb-2 pr-4 min-w-[200px]">Type</th>
                {MONTH_NAMES.map((m, i) => (
                  <th key={m} className={`text-center text-xs font-medium pb-2 px-1 min-w-[36px] ${i === currentMonth ? 'text-primary font-bold' : 'text-slate-400'}`}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {closedPeriods.map((p, pi) => (
                <tr key={pi}>
                  <td className="text-xs text-slate-600 py-1.5 pr-4">{p.type}</td>
                  {MONTH_NAMES.map((_, mi) => {
                    const isClosed = p.months.includes(mi);
                    const isCurrentMonth = mi === currentMonth;
                    return (
                      <td key={mi} className="text-center py-1.5 px-0.5">
                        <div className={`w-7 h-5 rounded ${
                          isClosed ? (isCurrentMonth ? 'bg-red-500' : 'bg-red-200') : (isCurrentMonth ? 'bg-green-300' : 'bg-green-100')
                        }`} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-200 rounded" /> Closed period</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded" /> Open</span>
        </div>
        <p className="text-sm mt-3 font-medium text-slate-600">
          {isAnyClosed ? '🔴 Currently in a closed period for some applications' : '✅ Currently all fields clear of closed periods'}
        </p>
      </div>
    </div>
  );
}
