'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface MovementData {
  id: string;
  date: string;
  movementType: string;
  fromCph: string;
  toCph: string;
  animalCount: number;
  species: string | null;
  haulier: string | null;
  vehicleReg: string | null;
  bcmsSubmitted: boolean;
  bcmsRef: string | null;
  standstillEnd: string | null;
  notes: string | null;
  animals: Array<{ id: string; earTag: string; species: string; breed: string | null; sex: string | null }>;
  bcmsAlert: string;
  daysRemaining: number | null;
  deadlineDate: string;
}

const alertIcons: Record<string, string> = {
  ok: '🟢',
  warning: '🟡',
  due_today: '🔴',
  overdue: '🔴',
};

const alertLabels: Record<string, string> = {
  ok: '',
  warning: '2 days left',
  due_today: 'Due TODAY!',
  overdue: 'OVERDUE',
};

function MovementsContent() {
  const searchParams = useSearchParams();
  const [movements, setMovements] = useState<MovementData[]>([]);
  const [farmCph, setFarmCph] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const typeFilter = searchParams.get('type') || '';
  const statusFilter = searchParams.get('status') || '';

  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/livestock/movements?${params}`)
      .then((r) => r.json())
      .then((json) => {
        setMovements(json.movements || []);
        setFarmCph(json.farmCph || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [typeFilter, statusFilter]);

  async function markSubmitted(id: string) {
    await fetch(`/api/livestock/movements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bcmsSubmitted: true }),
    });
    window.location.reload();
  }

  async function downloadBcmsCsv(id: string) {
    const res = await fetch(`/api/livestock/movements/${id}/bcms-export`, { method: 'POST' });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bcms-movement-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Active standstill
  const activeStandstills = movements.filter((m) => m.standstillEnd && new Date(m.standstillEnd) > new Date());

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Movements</h1>
          <p className="text-sm text-slate-500 mt-1">Farm CPH: {farmCph || '—'}</p>
        </div>
        <Link href="/livestock/movements/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-light transition-colors min-h-[48px]">
          + Log Movement
        </Link>
      </div>

      {/* Standstill warnings */}
      {activeStandstills.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-amber-800 mb-2">⚠️ Active Standstill</h3>
          {activeStandstills.map((m) => {
            const endDate = new Date(m.standstillEnd!);
            const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / 86400000);
            return (
              <p key={m.id} className="text-sm text-amber-700">
                6-day standstill active until {endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — {daysLeft} day(s) remaining.
                No cattle may be moved OFF this holding.
              </p>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <select value={typeFilter} onChange={(e) => { const params = new URLSearchParams(searchParams.toString()); if (e.target.value) params.set('type', e.target.value); else params.delete('type'); window.location.href = `/livestock/movements?${params}`; }} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-h-[44px]">
          <option value="">All Types</option>
          <option value="on">ON</option>
          <option value="off">OFF</option>
          <option value="between">BETWEEN</option>
        </select>
        <select value={statusFilter} onChange={(e) => { const params = new URLSearchParams(searchParams.toString()); if (e.target.value) params.set('status', e.target.value); else params.delete('status'); window.location.href = `/livestock/movements?${params}`; }} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white min-h-[44px]">
          <option value="">All Status</option>
          <option value="pending">⚠️ BCMS Pending</option>
          <option value="submitted">✅ Submitted</option>
        </select>
      </div>

      {/* Movement list */}
      <div className="space-y-3">
        {movements.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No movements found</div>
        )}
        {movements.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === m.id ? null : m.id)} className="w-full px-5 py-4 text-left min-h-[48px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${m.movementType === 'on' ? 'bg-green-100 text-green-700' : m.movementType === 'off' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {m.movementType.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {m.animalCount} {m.species || 'animal'}(s) — {new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500">
                      {m.movementType === 'on' ? `From: ${m.fromCph}` : m.movementType === 'off' ? `To: ${m.toCph}` : `${m.fromCph} → ${m.toCph}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.bcmsSubmitted ? (
                    <span className="text-xs font-medium text-green-600">✅ Sent</span>
                  ) : (
                    <span className="text-xs font-medium text-amber-600">
                      {alertIcons[m.bcmsAlert]} {alertLabels[m.bcmsAlert] || `${m.daysRemaining}d`}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {expandedId === m.id && (
              <div className="px-5 pb-4 pt-0 border-t border-gray-50 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500">From CPH:</span> <span className="font-medium">{m.fromCph}</span></div>
                  <div><span className="text-slate-500">To CPH:</span> <span className="font-medium">{m.toCph}</span></div>
                  {m.haulier && <div><span className="text-slate-500">Haulier:</span> {m.haulier}</div>}
                  {m.vehicleReg && <div><span className="text-slate-500">Vehicle:</span> {m.vehicleReg}</div>}
                  {m.notes && <div className="col-span-2"><span className="text-slate-500">Notes:</span> {m.notes}</div>}
                </div>

                {m.animals.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Animals ({m.animals.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {m.animals.map((a) => (
                        <Link key={a.id} href={`/livestock/${a.id}`} className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-primary hover:bg-gray-200">{a.earTag}</Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* BCMS deadline */}
                {!m.bcmsSubmitted && (
                  <div className={`rounded-xl p-3 text-sm ${m.bcmsAlert === 'overdue' || m.bcmsAlert === 'due_today' ? 'bg-red-50 border border-red-200' : m.bcmsAlert === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                    <p className="font-medium">
                      {m.bcmsAlert === 'overdue' ? '🔴 OVERDUE — submit immediately to avoid fine' :
                        m.bcmsAlert === 'due_today' ? '🔴 BCMS submission due TODAY' :
                          m.bcmsAlert === 'warning' ? '🟡 2 days to submit to BCMS' :
                            `🟢 ${m.daysRemaining} days to submit to BCMS`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Deadline: {new Date(m.deadlineDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  {!m.bcmsSubmitted && (
                    <button onClick={() => markSubmitted(m.id)} className="px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium min-h-[44px]">
                      ✅ Mark as Submitted
                    </button>
                  )}
                  <button onClick={() => downloadBcmsCsv(m.id)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium min-h-[44px]">
                    📥 BCMS CSV Export
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Link href="/livestock" className="text-sm text-slate-400 hover:text-slate-600 min-h-[44px] flex items-center">← Back to Livestock</Link>
    </div>
  );
}

export default function MovementsPage() {
  return (
    <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse"/>)}</div>}>
      <MovementsContent />
    </Suspense>
  );
}
