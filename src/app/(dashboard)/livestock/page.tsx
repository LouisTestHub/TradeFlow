'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface AnimalData {
  id: string;
  earTag: string;
  eidNumber: string | null;
  species: string;
  breed: string | null;
  sex: string | null;
  dob: string | null;
  status: string;
  statusIndicator: string;
  groupId: string | null;
  groupName: string | null;
}

interface Summary {
  cattle: { total: number; alive: number; sold: number; dead: number };
  sheep: { total: number; alive: number; sold: number; dead: number };
  pendingMovements: number;
  dueToday: number;
}

const statusIcons: Record<string, string> = {
  active: '🟢',
  pending_movement: '🟡',
  on_medicine: '💊',
  withdrawal: '🔴',
  sold: '📤',
  dead: '☠️',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  pending_movement: 'Pending movement',
  on_medicine: 'On medicine',
  withdrawal: 'Withdrawal period',
  sold: 'Sold',
  dead: 'Dead',
};

function LivestockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filters, setFilters] = useState<{ breeds: string[]; groups: Array<{ id: string; name: string; species: string | null }> }>({ breeds: [], groups: [] });
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const tab = searchParams.get('tab') || 'cattle';
  const statusFilter = searchParams.get('status') || '';
  const breedFilter = searchParams.get('breed') || '';
  const sexFilter = searchParams.get('sex') || '';
  const groupFilter = searchParams.get('groupId') || '';

  const fetchAnimals = useCallback(() => {
    const params = new URLSearchParams();
    if (tab !== 'all') params.set('species', tab);
    if (statusFilter) params.set('status', statusFilter);
    if (breedFilter) params.set('breed', breedFilter);
    if (sexFilter) params.set('sex', sexFilter);
    if (groupFilter) params.set('groupId', groupFilter);
    if (search) params.set('search', search);

    fetch(`/api/livestock?${params}`)
      .then((res) => res.json())
      .then((json) => {
        setAnimals(json.animals || []);
        setSummary(json.summary || null);
        setFilters(json.filters || { breeds: [], groups: [] });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab, statusFilter, breedFilter, sexFilter, groupFilter, search]);

  useEffect(() => { fetchAnimals(); }, [fetchAnimals]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/livestock?${params}`);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === animals.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(animals.map((a) => a.id)));
  }

  async function batchAction(action: string) {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    if (action === 'sold' || action === 'dead') {
      if (!confirm(`Mark ${ids.length} animal(s) as ${action}?`)) return;
      for (const id of ids) {
        await fetch(`/api/livestock/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: action }) });
      }
      setSelectedIds(new Set());
      fetchAnimals();
    }
  }

  const filteredBreeds = filters.breeds.filter((b) => {
    if (tab === 'all') return true;
    // We just show all breeds since we can't filter by species here
    return true;
  });

  const filteredGroups = filters.groups.filter((g) => {
    if (tab === 'all') return true;
    return !g.species || g.species === tab;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Livestock</h1>
        <Link href="/livestock/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-light transition-colors min-h-[48px]">
          + Add Animal
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
        {['cattle', 'sheep', 'all'].map((t) => (
          <button key={t} onClick={() => setParam('tab', t === 'cattle' ? '' : t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px] ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {t === 'cattle' ? '🐄 Cattle' : t === 'sheep' ? '🐑 Sheep' : '📋 All'}
          </button>
        ))}
      </div>

      {/* Summary Bar */}
      {summary && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-slate-600">
              <strong>Cattle:</strong> {summary.cattle.total} ({summary.cattle.alive} alive, {summary.cattle.sold} sold, {summary.cattle.dead} dead)
            </span>
            <span className="text-slate-600">
              <strong>Sheep:</strong> {summary.sheep.total} ({summary.sheep.alive} alive, {summary.sheep.sold} sold, {summary.sheep.dead} dead)
            </span>
            <span className={`font-medium ${summary.pendingMovements > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              Pending Movements: {summary.pendingMovements}
              {summary.dueToday > 0 && <span className="text-red-600 ml-1">(⚠️ {summary.dueToday} due today)</span>}
            </span>
          </div>
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={statusFilter} onChange={(e) => setParam('status', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-h-[44px]">
          <option value="">All Statuses</option>
          <option value="alive">Alive</option>
          <option value="sold">Sold</option>
          <option value="dead">Dead</option>
        </select>
        <select value={breedFilter} onChange={(e) => setParam('breed', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-h-[44px]">
          <option value="">All Breeds</option>
          {filteredBreeds.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={sexFilter} onChange={(e) => setParam('sex', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-h-[44px]">
          <option value="">Any Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select value={groupFilter} onChange={(e) => setParam('groupId', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-h-[44px]">
          <option value="">All Groups</option>
          {filteredGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAnimals()}
            placeholder="🔍 Search tag or EID..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-h-[44px]"
          />
        </div>
      </div>

      {/* Batch actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-primary">{selectedIds.size} selected</span>
          <Link href={`/livestock/movements/new?animals=${Array.from(selectedIds).join(',')}`} className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium min-h-[36px] flex items-center">
            Move
          </Link>
          <button onClick={() => batchAction('sold')} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium min-h-[36px]">Mark Sold</button>
          <button onClick={() => batchAction('dead')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium min-h-[36px]">Mark Dead</button>
        </div>
      )}

      {/* Status key */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {Object.entries(statusIcons).map(([key, icon]) => (
          <span key={key}>{icon} {statusLabels[key]}</span>
        ))}
      </div>

      {/* Mobile card view */}
      <div className="space-y-2 lg:hidden">
        {animals.map((a) => (
          <div key={a.id} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 min-h-[48px]">
            <input type="checkbox" checked={selectedIds.has(a.id)} onChange={() => toggleSelect(a.id)} className="w-5 h-5 rounded flex-shrink-0" />
            <Link href={`/livestock/${a.id}`} className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-sm">{a.earTag}</span>
                <span>{statusIcons[a.statusIndicator] || '🟢'}</span>
              </div>
              <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                <span>{a.breed || '—'}</span>
                <span>•</span>
                <span>{a.sex === 'male' ? 'M' : a.sex === 'female' ? 'F' : '—'}</span>
                {a.dob && <>
                  <span>•</span>
                  <span>{new Date(a.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                </>}
                {a.groupName && <>
                  <span>•</span>
                  <span className="text-primary">{a.groupName}</span>
                </>}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={selectedIds.size === animals.length && animals.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded" />
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Ear Tag</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">EID</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Breed</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Sex</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">DOB</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Group</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-10">St</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {animals.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selectedIds.has(a.id)} onChange={() => toggleSelect(a.id)} className="w-4 h-4 rounded" />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/livestock/${a.id}`} className="text-sm font-medium text-slate-800 hover:text-primary">{a.earTag}</Link>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 font-mono">{a.eidNumber || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{a.breed || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{a.sex === 'male' ? 'M' : a.sex === 'female' ? 'F' : '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{a.dob ? new Date(a.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{a.groupName || '—'}</td>
                <td className="px-4 py-3">{statusIcons[a.statusIndicator] || '🟢'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {animals.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No animals found matching your filters</div>
        )}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/livestock/movements" className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 hover:shadow-sm min-h-[44px] flex items-center gap-2">
          🚛 Movements
        </Link>
        <Link href="/livestock/breeding" className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 hover:shadow-sm min-h-[44px] flex items-center gap-2">
          🔗 Breeding
        </Link>
      </div>
    </div>
  );
}

export default function LivestockPage() {
  return (
    <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse"/>)}</div>}>
      <LivestockContent />
    </Suspense>
  );
}
