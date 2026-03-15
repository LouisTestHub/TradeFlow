'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BreedingStats {
  breedingCows: number;
  inCalf: number;
  dueThisMonth: number;
  calvesBornSeason: number;
  calvingPct: number;
}

interface BreedingRecord {
  id: string;
  damId: string;
  sireId: string | null;
  sireName: string | null;
  serviceDate: string | null;
  method: string | null;
  expectedCalving: string | null;
  calvingDate: string | null;
  calfSex: string | null;
  calfBreed: string | null;
  calfWeight: number | null;
  assisted: boolean;
  dam: { id: string; earTag: string; breed: string | null };
  sire: { id: string; earTag: string; breed: string | null } | null;
  calf: { id: string; earTag: string } | null;
  daysUntilDue?: number;
}

interface AnimalOption {
  id: string;
  earTag: string;
  breed: string | null;
  sex: string | null;
}

export default function BreedingPage() {
  const [stats, setStats] = useState<BreedingStats | null>(null);
  const [dueToCalve, setDueToCalve] = useState<BreedingRecord[]>([]);
  const [records, setRecords] = useState<BreedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCalvingForm, setShowCalvingForm] = useState(false);
  const [females, setFemales] = useState<AnimalOption[]>([]);
  const [males, setMales] = useState<AnimalOption[]>([]);
  const [saving, setSaving] = useState(false);

  const [serviceForm, setServiceForm] = useState({ damId: '', sireId: '', sireName: '', serviceDate: new Date().toISOString().split('T')[0], method: 'natural', notes: '' });
  const [calvingForm, setCalvingForm] = useState({ damId: '', calvingDate: new Date().toISOString().split('T')[0], calfSex: '', calfBreed: '', calfWeight: '', assisted: false, presentation: '', calfEarTag: '', calfEidNumber: '', notes: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/livestock/breeding').then((r) => r.json()),
      fetch('/api/livestock?species=cattle&status=alive').then((r) => r.json()),
    ]).then(([breedingData, animalData]) => {
      setStats(breedingData.stats);
      setDueToCalve(breedingData.dueToCalve || []);
      setRecords(breedingData.records || []);
      const animals = animalData.animals || [];
      setFemales(animals.filter((a: AnimalOption) => a.sex === 'female'));
      setMales(animals.filter((a: AnimalOption) => a.sex === 'male'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleLogService(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/livestock/breeding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      });
      if (res.ok) {
        setShowServiceForm(false);
        window.location.reload();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLogCalving(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/livestock/breeding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...calvingForm, type: 'calving' }),
      });
      if (res.ok) {
        setShowCalvingForm(false);
        window.location.reload();
      }
    } finally {
      setSaving(false);
    }
  }

  // Compute expected calving for service form
  const expectedCalving = serviceForm.serviceDate
    ? new Date(new Date(serviceForm.serviceDate).getTime() + 283 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Breeding</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowServiceForm(true)} className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium text-sm min-h-[48px]">+ Log Service/AI</button>
          <button onClick={() => setShowCalvingForm(true)} className="px-4 py-2.5 bg-amber-500 text-white rounded-xl font-medium text-sm min-h-[48px]">🐣 Log Calving</button>
        </div>
      </div>

      {/* Quick stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Breeding Cows', value: stats.breedingCows },
            { label: 'In-Calf', value: stats.inCalf },
            { label: 'Due This Month', value: stats.dueThisMonth },
            { label: 'Calves Born', value: stats.calvesBornSeason },
            { label: 'Calving %', value: `${stats.calvingPct}%` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Due to calve */}
      {dueToCalve.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">📅 Due to Calve</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {dueToCalve.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-3.5 min-h-[48px]">
                <div>
                  <Link href={`/livestock/${r.dam.id}`} className="text-sm font-medium text-primary">{r.dam.earTag}</Link>
                  <span className="text-sm text-slate-500 ml-2">
                    — Sire: {r.sire ? r.sire.earTag : r.sireName || 'Unknown'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    Due: {r.expectedCalving ? new Date(r.expectedCalving).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                  </p>
                  {r.daysUntilDue !== undefined && (
                    <p className={`text-xs font-medium ${r.daysUntilDue <= 7 ? 'text-red-600' : r.daysUntilDue <= 14 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {r.daysUntilDue <= 0 ? 'Overdue!' : `${r.daysUntilDue} days`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent breeding records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Recent Records</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {records.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-400 text-center">No breeding records yet</p>
          ) : (
            records.slice(0, 20).map((r) => (
              <div key={r.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href={`/livestock/${r.dam.id}`} className="text-sm font-medium text-primary">{r.dam.earTag}</Link>
                    {r.serviceDate && (
                      <span className="text-sm text-slate-500 ml-2">
                        Served {new Date(r.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — {r.method === 'ai' ? 'AI' : 'Natural'}
                      </span>
                    )}
                  </div>
                  {r.calvingDate ? (
                    <span className="text-xs font-medium text-green-600">🐣 Calved {new Date(r.calvingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  ) : r.expectedCalving ? (
                    <span className="text-xs text-amber-600">Due {new Date(r.expectedCalving).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  ) : null}
                </div>
                {r.calvingDate && r.calfWeight && (
                  <p className="text-xs text-slate-400 mt-1">
                    {r.calfSex} {r.calfBreed} calf — {r.calfWeight}kg {r.assisted ? '(assisted)' : ''}
                    {r.calf && <Link href={`/livestock/${r.calf.id}`} className="text-primary ml-2">{r.calf.earTag}</Link>}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleLogService} className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800">Log Service / AI</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dam *</label>
              <select required value={serviceForm.damId} onChange={(e) => setServiceForm({ ...serviceForm, damId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]">
                <option value="">Select cow...</option>
                {females.map((f) => <option key={f.id} value={f.id}>{f.earTag} — {f.breed}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service Date *</label>
              <input type="date" required value={serviceForm.serviceDate} onChange={(e) => setServiceForm({ ...serviceForm, serviceDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              {expectedCalving && <p className="text-xs text-slate-500 mt-1">Expected calving: {expectedCalving} (+283 days)</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
              <div className="flex gap-3">
                {['natural', 'ai'].map((m) => (
                  <button key={m} type="button" onClick={() => setServiceForm({ ...serviceForm, method: m })} className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[48px] ${serviceForm.method === m ? 'bg-primary text-white' : 'bg-gray-100 text-slate-600'}`}>
                    {m === 'natural' ? 'Natural' : 'AI'}
                  </button>
                ))}
              </div>
            </div>

            {serviceForm.method === 'natural' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sire (stock bull)</label>
                <select value={serviceForm.sireId} onChange={(e) => setServiceForm({ ...serviceForm, sireId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]">
                  <option value="">Select bull...</option>
                  {males.map((m) => <option key={m.id} value={m.id}>{m.earTag} — {m.breed}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">AI Bull Name / Code</label>
                <input type="text" value={serviceForm.sireName} onChange={(e) => setServiceForm({ ...serviceForm, sireName: e.target.value })} placeholder="e.g. AI Hereford (NM2280)" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea value={serviceForm.notes} onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[80px]" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm min-h-[48px] disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setShowServiceForm(false)} className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-sm min-h-[48px]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Calving Form Modal */}
      {showCalvingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleLogCalving} className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800">🐣 Log Calving</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dam *</label>
              <select required value={calvingForm.damId} onChange={(e) => setCalvingForm({ ...calvingForm, damId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]">
                <option value="">Select cow...</option>
                {females.map((f) => <option key={f.id} value={f.id}>{f.earTag} — {f.breed}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Calving Date</label>
              <input type="date" value={calvingForm.calvingDate} onChange={(e) => setCalvingForm({ ...calvingForm, calvingDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Calf Sex</label>
                <select value={calvingForm.calfSex} onChange={(e) => setCalvingForm({ ...calvingForm, calfSex: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]">
                  <option value="">—</option>
                  <option value="male">Bull calf</option>
                  <option value="female">Heifer calf</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Calf Weight (kg)</label>
                <input type="number" value={calvingForm.calfWeight} onChange={(e) => setCalvingForm({ ...calvingForm, calfWeight: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Calf Breed</label>
              <input type="text" value={calvingForm.calfBreed} onChange={(e) => setCalvingForm({ ...calvingForm, calfBreed: e.target.value })} placeholder="e.g. Hereford x" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm min-h-[48px]">
                <input type="checkbox" checked={calvingForm.assisted} onChange={(e) => setCalvingForm({ ...calvingForm, assisted: e.target.checked })} className="w-5 h-5 rounded" />
                Assisted calving
              </label>
              <div className="flex-1">
                <input type="text" value={calvingForm.presentation} onChange={(e) => setCalvingForm({ ...calvingForm, presentation: e.target.value })} placeholder="Presentation (e.g. normal, breech)" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Create Calf Record</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Calf Ear Tag</label>
                  <input type="text" value={calvingForm.calfEarTag} onChange={(e) => setCalvingForm({ ...calvingForm, calfEarTag: e.target.value })} placeholder="UK 12 345 100099" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Calf EID</label>
                  <input type="text" value={calvingForm.calfEidNumber} onChange={(e) => setCalvingForm({ ...calvingForm, calfEidNumber: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">If ear tag is provided, a new animal record will be auto-created</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea value={calvingForm.notes} onChange={(e) => setCalvingForm({ ...calvingForm, notes: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[80px]" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium text-sm min-h-[48px] disabled:opacity-50">{saving ? 'Saving...' : '🐣 Log Calving'}</button>
              <button type="button" onClick={() => setShowCalvingForm(false)} className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-sm min-h-[48px]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <Link href="/livestock" className="text-sm text-slate-400 hover:text-slate-600 min-h-[44px] flex items-center">← Back to Livestock</Link>
    </div>
  );
}
