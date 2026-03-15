'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface AnimalOption {
  id: string;
  earTag: string;
  species: string;
  breed: string | null;
  sex: string | null;
}

function NewMovementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [farmCph, setFarmCph] = useState('');
  const [animals, setAnimals] = useState<AnimalOption[]>([]);
  const [search, setSearch] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState<AnimalOption[]>([]);
  const [form, setForm] = useState({
    movementType: 'on',
    date: new Date().toISOString().split('T')[0],
    fromCph: '',
    toCph: '',
    haulier: '',
    vehicleReg: '',
    departureTime: '',
    journeyDuration: '',
    notes: '',
  });

  useEffect(() => {
    // Load farm CPH and animals
    fetch('/api/livestock?status=alive')
      .then((r) => r.json())
      .then((json) => {
        setAnimals(json.animals || []);
        // Try get farm CPH from summary or first movement
        fetch('/api/livestock/movements')
          .then((r) => r.json())
          .then((mJson) => {
            setFarmCph(mJson.farmCph || '12/345/6789');
            // Set default CPH based on type
            if (form.movementType === 'on') {
              setForm((f) => ({ ...f, toCph: mJson.farmCph || '' }));
            } else if (form.movementType === 'off') {
              setForm((f) => ({ ...f, fromCph: mJson.farmCph || '' }));
            }
          });

        // Pre-select animals from query params
        const preSelected = searchParams.get('animals');
        if (preSelected) {
          const ids = preSelected.split(',');
          const matched = (json.animals || []).filter((a: AnimalOption) => ids.includes(a.id));
          setSelectedAnimals(matched);
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTypeChange(type: string) {
    const newForm = { ...form, movementType: type };
    if (type === 'on') { newForm.toCph = farmCph; newForm.fromCph = ''; }
    else if (type === 'off') { newForm.fromCph = farmCph; newForm.toCph = ''; }
    else { newForm.fromCph = farmCph; newForm.toCph = ''; }
    setForm(newForm);
  }

  function addAnimal(animal: AnimalOption) {
    if (!selectedAnimals.find((a) => a.id === animal.id)) {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
    setSearch('');
  }

  function removeAnimal(id: string) {
    setSelectedAnimals(selectedAnimals.filter((a) => a.id !== id));
  }

  const filteredAnimals = search.length > 0
    ? animals.filter((a) => (a.earTag.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search)) && !selectedAnimals.find((s) => s.id === a.id))
    : [];

  const movementDate = new Date(form.date);
  const deadlineDate = new Date(movementDate.getTime() + 3 * 86400000);
  const isStandstillTrigger = form.movementType === 'on';
  const standstillEnd = isStandstillTrigger ? new Date(movementDate.getTime() + 6 * 86400000) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/livestock/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          animalIds: selectedAnimals.map((a) => a.id),
        }),
      });
      if (res.ok) router.push('/livestock/movements');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/livestock/movements" className="text-slate-400 hover:text-slate-600 text-sm min-h-[44px] flex items-center">← Movements</Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Log Livestock Movement</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
        {/* Movement Type */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Movement Type</label>
          <div className="flex gap-2">
            {[{ value: 'on', label: 'ON to Farm' }, { value: 'off', label: 'OFF from Farm' }, { value: 'between', label: 'Between Holdings' }].map((t) => (
              <button key={t.value} type="button" onClick={() => handleTypeChange(t.value)} className={`flex-1 px-3 py-3 rounded-xl text-sm font-medium min-h-[48px] ${form.movementType === t.value ? 'bg-primary text-white' : 'bg-gray-100 text-slate-600'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Date & Details</label>
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
          <p className="text-xs text-amber-600 mt-2 font-medium">
            ⚠️ BCMS submission deadline: {deadlineDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} (3 days from movement)
          </p>
        </div>

        {/* From/To CPH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">From CPH</label>
            <input type="text" required value={form.fromCph} onChange={(e) => setForm({ ...form, fromCph: e.target.value })} placeholder="12/345/6789" className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px] ${form.movementType === 'off' || form.movementType === 'between' ? 'bg-gray-50' : ''}`} />
            {(form.movementType === 'off' || form.movementType === 'between') && form.fromCph === farmCph && (
              <p className="text-xs text-slate-400 mt-1">Your farm CPH</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">To CPH</label>
            <input type="text" required value={form.toCph} onChange={(e) => setForm({ ...form, toCph: e.target.value })} placeholder="12/345/6789" className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px] ${form.movementType === 'on' ? 'bg-gray-50' : ''}`} />
            {form.movementType === 'on' && form.toCph === farmCph && (
              <p className="text-xs text-slate-400 mt-1">Your farm CPH</p>
            )}
          </div>
        </div>

        {/* Animals */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Animals</label>
          <div className="relative">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search by tag or EID..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            {filteredAnimals.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredAnimals.slice(0, 10).map((a) => (
                  <button key={a.id} type="button" onClick={() => addAnimal(a)} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm min-h-[44px] border-b border-gray-50 last:border-0">
                    <span className="font-medium">{a.earTag}</span>
                    <span className="text-slate-400 ml-2">{a.breed} • {a.sex === 'male' ? 'M' : 'F'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedAnimals.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-xs text-slate-500 font-medium">Selected ({selectedAnimals.length}):</p>
              {selectedAnimals.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-sm min-h-[44px]">
                  <span>✅ {a.earTag} <span className="text-slate-400">• {a.breed} • {a.sex === 'male' ? 'M' : 'F'}</span></span>
                  <button type="button" onClick={() => removeAnimal(a.id)} className="text-red-500 hover:text-red-700 min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transport */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Transport</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Haulier Name</label>
              <input type="text" value={form.haulier} onChange={(e) => setForm({ ...form, haulier: e.target.value })} placeholder="Self / Company name" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Vehicle Registration</label>
              <input type="text" value={form.vehicleReg} onChange={(e) => setForm({ ...form, vehicleReg: e.target.value })} placeholder="AB12 CDE" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Departure Time</label>
              <input type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Journey Duration (hours)</label>
              <input type="number" step="0.5" value={form.journeyDuration} onChange={(e) => setForm({ ...form, journeyDuration: e.target.value })} placeholder="2" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>
          </div>
        </div>

        {/* Standstill Info */}
        {isStandstillTrigger && standstillEnd && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <p className="font-medium text-blue-800">ℹ️ Movement ON triggers:</p>
            <ul className="mt-1 space-y-1 text-blue-700">
              <li>• 6-day standstill on cattle movements OFF this holding</li>
              <li>• Standstill ends: {standstillEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</li>
              <li>• Existing animals NOT affected — only new arrivals</li>
            </ul>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Purchase price, condition, etc." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[80px]" />
        </div>

        {/* BCMS Status */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-slate-600">
          <p>⬜ Not yet submitted to BCMS</p>
          <p className="text-xs text-slate-400 mt-1">You can mark as submitted after saving this movement</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm min-h-[48px] disabled:opacity-50">
            {saving ? 'Saving...' : '💾 Save Movement'}
          </button>
          <Link href="/livestock/movements" className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-sm min-h-[48px] flex items-center">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default function NewMovementPage() {
  return (
    <Suspense fallback={<div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />}>
      <NewMovementContent />
    </Suspense>
  );
}
