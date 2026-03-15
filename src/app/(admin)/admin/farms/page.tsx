'use client';

import { useState, useEffect, useCallback } from 'react';

interface FarmRow {
  id: string;
  name: string;
  cphNumber: string | null;
  sbiNumber: string | null;
  county: string | null;
  farmType: string | null;
  totalHectares: number | null;
  createdAt: string;
  users: { id: string; name: string | null; role: string }[];
  fieldCount: number;
  animalCount: number;
  records: { sprayRecords: number; medicineRecords: number; movements: number; fertRecords: number };
  dataHealth: { hasCph: boolean; hasSbi: boolean; hasFields: boolean; hasAnimals: boolean; score: number };
}

export default function AdminFarmsPage() {
  const [farms, setFarms] = useState<FarmRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFarms = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    try {
      const res = await fetch(`/api/admin/farms?${params}`);
      const data = await res.json();
      setFarms(data.farms || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { /* empty */ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchFarms(); }, [fetchFarms]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Farm Management</h1>
          <p className="text-sm text-slate-500">{total} total farms</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, CPH, or county..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm min-h-[48px]"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-32" />
            </div>
          ))
        ) : farms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-slate-400">No farms found</div>
        ) : farms.map(farm => (
          <div key={farm.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{farm.name}</h3>
                <p className="text-sm text-slate-500">
                  {farm.county || 'Unknown county'} • {farm.farmType || 'Unknown type'} • CPH: {farm.cphNumber || 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-full ${farm.dataHealth.score >= 75 ? 'bg-green-500' : farm.dataHealth.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-xs text-slate-500">{farm.dataHealth.score}% complete</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{farm.fieldCount}</p>
                <p className="text-xs text-slate-500">Fields</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{farm.animalCount}</p>
                <p className="text-xs text-slate-500">Animals</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{farm.records.sprayRecords + farm.records.medicineRecords + farm.records.movements + farm.records.fertRecords}</p>
                <p className="text-xs text-slate-500">Total Records</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{farm.users.length}</p>
                <p className="text-xs text-slate-500">Users</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!farm.dataHealth.hasCph && <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">Missing CPH</span>}
              {!farm.dataHealth.hasSbi && <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">Missing SBI</span>}
              {!farm.dataHealth.hasFields && <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">No Fields</span>}
              {!farm.dataHealth.hasAnimals && <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">No Animals</span>}
              {farm.dataHealth.score === 100 && <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">✅ Complete</span>}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 min-h-[48px] px-4">← Previous</button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 min-h-[48px] px-4">Next →</button>
        </div>
      )}
    </div>
  );
}
