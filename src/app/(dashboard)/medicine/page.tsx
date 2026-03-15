'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ActiveWithdrawal {
  animalTag: string;
  animalId: string;
  productName: string;
  treatmentDate: string;
  meatClearDate: string | null;
  milkClearDate: string | null;
  meatDaysRemaining: number;
  milkDaysRemaining: number;
  meatActive: boolean;
  milkActive: boolean;
}

interface MedicineRecord {
  id: string;
  date: string;
  productName: string;
  dose: string | null;
  route: string | null;
  reason: string | null;
  batchNumber: string | null;
  withdrawalMeatDays: number | null;
  withdrawalMilkDays: number | null;
  withdrawalActive: boolean;
  meatActive: boolean;
  milkActive: boolean;
  meatDaysRemaining: number;
  milkDaysRemaining: number;
  meatClearDate: string | null;
  milkClearDate: string | null;
  isCourse: boolean;
  courseDoses: number | null;
  courseCurrentDose: number | null;
  animals: Array<{
    animal: { id: string; earTag: string; species: string; breed: string | null };
  }>;
  vet: { name: string; practice: string | null } | null;
}

type ViewMode = 'list' | 'calendar';

export default function MedicinePage() {
  const [records, setRecords] = useState<MedicineRecord[]>([]);
  const [activeWithdrawals, setActiveWithdrawals] = useState<ActiveWithdrawal[]>([]);
  const [totalActive, setTotalActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('list');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchRecords = async () => {
    try {
      const params = new URLSearchParams();
      if (speciesFilter) params.set('species', speciesFilter);
      if (productFilter) params.set('product', productFilter);
      if (statusFilter) params.set('withdrawalStatus', statusFilter);

      const res = await fetch(`/api/medicine?${params}`);
      const data = await res.json();
      setRecords(data.records || []);
      setActiveWithdrawals(data.activeWithdrawals || []);
      setTotalActive(data.totalActiveAnimals || 0);
    } catch {
      console.error('Failed to fetch medicine records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [speciesFilter, productFilter, statusFilter]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const shortDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const routeLabel = (r: string | null) => {
    const map: Record<string, string> = {
      injection: 'IM', oral: 'Oral', 'pour-on': 'Pour-On', topical: 'Topical',
      intramammary: 'IMM', iv: 'IV', intranasal: 'IN', subcutaneous: 'SC',
    };
    return r ? map[r] || r : '';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Medicine & Vet Records
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {records.length} records • {totalActive} animals under withdrawal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition min-h-[44px] ${view === 'list' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              List
            </button>
            <Link
              href="/medicine/calendar"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition min-h-[44px] flex items-center ${view === 'calendar' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Calendar
            </Link>
          </div>
          <Link
            href="/medicine/new"
            className="bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-primary/90 transition min-h-[48px] flex items-center gap-2"
          >
            <span className="text-lg">+</span> Log Treatment
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white min-h-[44px]"
        >
          <option value="">All Species</option>
          <option value="cattle">Cattle</option>
          <option value="sheep">Sheep</option>
        </select>
        <input
          type="text"
          placeholder="Search product..."
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white min-h-[44px] w-48"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white min-h-[44px]"
        >
          <option value="">All Status</option>
          <option value="active">🔴 Under Withdrawal</option>
          <option value="clear">✅ Clear</option>
        </select>
      </div>

      {/* Active Withdrawals Panel */}
      {activeWithdrawals.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔴</span>
            <h2 className="font-bold text-red-800">
              {totalActive} animal{totalActive !== 1 ? 's' : ''} currently under withdrawal
            </h2>
          </div>
          <div className="space-y-2">
            {activeWithdrawals.map((w, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-red-700 bg-red-100/50 rounded-xl px-4 py-3">
                <span className="font-mono font-medium">{w.animalTag}</span>
                <span className="text-red-600">— {w.productName}</span>
                <div className="flex gap-3 text-xs">
                  {w.meatActive && (
                    <span>🥩 Meat: clear {shortDate(w.meatClearDate)} ({w.meatDaysRemaining}d)</span>
                  )}
                  {w.milkActive && (
                    <span>🥛 Milk: clear {shortDate(w.milkClearDate)} ({w.milkDaysRemaining}d)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-3">
        {records.map((r) => (
          <Link
            key={r.id}
            href={`/medicine/${r.id}`}
            className="block bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:border-primary/30 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-500">{formatDate(r.date)}</span>
                  {r.isCourse && r.courseDoses && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Dose {r.courseCurrentDose}/{r.courseDoses}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 mt-1">{r.productName}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500">
                  {r.dose && <span>{r.dose}</span>}
                  {r.route && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{routeLabel(r.route)}</span>}
                  {r.reason && <span>• {r.reason}</span>}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.animals.map((a) => (
                    <span key={a.animal.id} className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                      {a.animal.earTag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                {r.withdrawalActive ? (
                  <div className="space-y-1">
                    <span className="inline-block text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                      🔴 Active
                    </span>
                    {r.meatActive && (
                      <p className="text-xs text-red-600">🥩 {shortDate(r.meatClearDate)}</p>
                    )}
                    {r.milkActive && (
                      <p className="text-xs text-red-600">🥛 {shortDate(r.milkClearDate)}</p>
                    )}
                  </div>
                ) : (
                  <span className="inline-block text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    ✅ Clear
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {records.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl">💊</span>
          <h3 className="mt-4 text-lg font-semibold text-slate-700">No medicine records</h3>
          <p className="text-sm text-slate-500 mt-1">Start logging treatments to track withdrawal periods</p>
          <Link href="/medicine/new" className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium min-h-[48px]">
            Log First Treatment
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/medicine/vets" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
          🏥 Manage Vets
        </Link>
        <Link href="/medicine/calendar" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
          📅 Withdrawal Calendar
        </Link>
      </div>
    </div>
  );
}
