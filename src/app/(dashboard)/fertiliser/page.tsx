'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FertiliserRecord {
  id: string;
  date: string;
  productType: string;
  productName: string | null;
  rateKgHa: number | null;
  rateUnit: string | null;
  nContent: number | null;
  pContent: number | null;
  kContent: number | null;
  method: string | null;
  soilCondition: string | null;
  nvzCompliant: boolean;
  nvzStatus: 'compliant' | 'warning' | 'exceeded' | 'na';
  field: { id: string; name: string; hectares: number; nvzZone: boolean };
}

const NVZ_ICONS: Record<string, string> = {
  compliant: '🟢',
  warning: '🟡',
  exceeded: '🔴',
  na: '⚪',
};

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  chemical: 'Chemical',
  organic: 'Organic',
  fym: 'FYM',
  slurry: 'Slurry',
  sewage_sludge: 'Sewage Sludge',
  compost: 'Compost',
  manure: 'Manure',
};

export default function FertiliserPage() {
  const [records, setRecords] = useState<FertiliserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fieldFilter, setFieldFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (fieldFilter) params.set('fieldId', fieldFilter);
    if (typeFilter) params.set('type', typeFilter);

    fetch(`/api/fertiliser?${params}`)
      .then((r) => r.json())
      .then((data) => setRecords(data.records || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fieldFilter, typeFilter]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const uniqueFields = Array.from(new Map(records.map((r) => [r.field.id, r.field])).values());

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Fertiliser & Nutrients</h1>
          <p className="text-sm text-slate-500 mt-1">{records.length} applications recorded</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/fertiliser/nvz-plan"
            className="border border-primary text-primary px-4 py-3 rounded-xl font-medium hover:bg-primary/5 transition min-h-[48px] flex items-center gap-2">
            📊 NVZ Plan
          </Link>
          <Link href="/fertiliser/new"
            className="bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-primary/90 transition min-h-[48px] flex items-center gap-2">
            <span className="text-lg">+</span> Log Application
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white min-h-[44px]">
          <option value="">All Fields</option>
          {uniqueFields.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white min-h-[44px]">
          <option value="">All Types</option>
          <option value="chemical">Chemical</option>
          <option value="organic">Organic</option>
          <option value="fym">FYM</option>
          <option value="slurry">Slurry</option>
        </select>
      </div>

      {/* NVZ Status Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-600 bg-white rounded-xl border border-gray-100 px-4 py-3">
        <span>NVZ: 🟢 Compliant</span>
        <span>🟡 &gt;80% of limit</span>
        <span>🔴 Exceeds limit</span>
        <span className="text-xs text-slate-400">* Available N (accounting for organic mineralisation rates)</span>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-7 gap-2 px-5 py-3 bg-gray-50 text-xs font-semibold text-slate-400 uppercase">
          <span>Date</span>
          <span>Field</span>
          <span>Product</span>
          <span>Rate</span>
          <span>N kg/ha</span>
          <span>P/K</span>
          <span className="text-center">NVZ</span>
        </div>
        <div className="divide-y divide-gray-50">
          {records.map((r) => (
            <Link key={r.id} href={`/fertiliser/${r.id}`}
              className="block sm:grid sm:grid-cols-7 sm:gap-2 px-5 py-4 hover:bg-gray-50 transition min-h-[64px] items-center">
              <span className="text-sm font-medium text-slate-700">{formatDate(r.date)}</span>
              <span className="text-sm text-slate-600">{r.field.name}</span>
              <div>
                <span className="text-sm font-medium text-slate-700">{r.productName || r.productType}</span>
                <span className="block sm:hidden text-xs text-slate-400">
                  {PRODUCT_TYPE_LABELS[r.productType] || r.productType}
                </span>
              </div>
              <span className="text-sm text-slate-600">
                {r.rateKgHa ? `${r.rateKgHa} ${r.rateUnit || 'kg/ha'}` : '—'}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {r.nContent ? `${Math.round(r.nContent)}` : '0'}
              </span>
              <span className="text-xs text-slate-500">
                P: {r.pContent ? Math.round(r.pContent) : 0} / K: {r.kContent ? Math.round(r.kContent) : 0}
              </span>
              <span className="text-center text-lg">{NVZ_ICONS[r.nvzStatus]}</span>
            </Link>
          ))}
        </div>
      </div>

      {records.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl">🌱</span>
          <h3 className="mt-4 text-lg font-semibold text-slate-700">No fertiliser records</h3>
          <p className="text-sm text-slate-500 mt-1">Start logging applications to track nutrient usage</p>
          <Link href="/fertiliser/new" className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium min-h-[48px]">
            Log First Application
          </Link>
        </div>
      )}
    </div>
  );
}
