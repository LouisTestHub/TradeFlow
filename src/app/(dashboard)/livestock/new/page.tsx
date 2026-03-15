'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const cattleBreeds = ['Hereford', 'Angus', 'Aberdeen Angus', 'Limousin', 'Charolais', 'Simmental', 'British Blue', 'Highland', 'Holstein-Friesian', 'Jersey', 'Shorthorn', 'Dexter', 'Welsh Black', 'South Devon', 'Galloway'];
const sheepBreeds = ['Suffolk', 'Texel', 'Mule', 'Cheviot', 'Welsh Mountain', 'Lleyn', 'Hampshire Down', 'Romney', 'Dorset', 'Jacob', 'Shropshire', 'Ryeland', 'Blue Faced Leicester', 'Swaledale', 'Blackface'];

export default function AddAnimalPage() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'single' | 'csv'>('single');
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState<Array<{ id: string; name: string; species: string | null }>>([]);
  const [csvResult, setCsvResult] = useState<{ created: number; errors: Array<{ row: number; error: string }>; total: number } | null>(null);
  const [form, setForm] = useState({
    species: 'cattle',
    earTag: '',
    eidNumber: '',
    breed: '',
    sex: '',
    dob: '',
    damId: '',
    sireId: '',
    groupId: '',
    purchaseDate: '',
    purchaseFrom: '',
    purchasePrice: '',
    passportNumber: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/livestock/groups').then((r) => r.json()).then((json) => setGroups(json.groups || []));
  }, []);

  const breeds = form.species === 'cattle' ? cattleBreeds : sheepBreeds;
  const filteredGroups = groups.filter((g) => !g.species || g.species === form.species);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/livestock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const json = await res.json();
        router.push(`/livestock/${json.animal.id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleCsvImport() {
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      const animals = lines.slice(1).map((line) => {
        const vals = line.split(',').map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          const key = h === 'ear_tag' || h === 'eartag' ? 'earTag'
            : h === 'eid' || h === 'eid_number' ? 'eidNumber'
            : h;
          row[key] = vals[i] || '';
        });
        if (!row.species) row.species = form.species;
        return row;
      }).filter((r) => r.earTag);

      const res = await fetch('/api/livestock/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animals }),
      });
      const json = await res.json();
      setCsvResult(json);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/livestock" className="text-slate-400 hover:text-slate-600 text-sm min-h-[44px] flex items-center">← Livestock</Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Add Animal</h1>

      {/* Mode toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => setMode('single')} className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[40px] ${mode === 'single' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Single Animal</button>
        <button onClick={() => setMode('csv')} className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[40px] ${mode === 'csv' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>CSV Import</button>
      </div>

      {mode === 'single' ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          {/* Species */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Species *</label>
            <div className="flex gap-3">
              {['cattle', 'sheep'].map((s) => (
                <button key={s} type="button" onClick={() => setForm({ ...form, species: s, breed: '' })} className={`px-4 py-2.5 rounded-xl text-sm font-medium min-h-[48px] flex-1 ${form.species === s ? 'bg-primary text-white' : 'bg-gray-100 text-slate-600'}`}>
                  {s === 'cattle' ? '🐄 Cattle' : '🐑 Sheep'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ear Tag */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ear Tag *</label>
              <input type="text" required value={form.earTag} onChange={(e) => setForm({ ...form, earTag: e.target.value })} placeholder="UK 12 345 100001" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>

            {/* EID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">EID Number</label>
              <input type="text" value={form.eidNumber} onChange={(e) => setForm({ ...form, eidNumber: e.target.value })} placeholder="826 000012345678" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
              <select value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]">
                <option value="">Select breed</option>
                {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                <option value="other">Other / Cross</option>
              </select>
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
              <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
            </div>

            {/* Group */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Group</label>
              <select value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]">
                <option value="">No group</option>
                {filteredGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            {form.species === 'cattle' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Passport Number</label>
                <input type="text" value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              </div>
            )}
          </div>

          {/* Purchase details */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3">Purchase Details (if bought in)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Date</label>
                <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">From (farm/market)</label>
                <input type="text" value={form.purchaseFrom} onChange={(e) => setForm({ ...form, purchaseFrom: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Price (£)</label>
                <input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[80px]" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm min-h-[48px] disabled:opacity-50">
              {saving ? 'Saving...' : '💾 Save Animal'}
            </button>
            <Link href="/livestock" className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-sm min-h-[48px] flex items-center">Cancel</Link>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Default Species</label>
            <div className="flex gap-3">
              {['cattle', 'sheep'].map((s) => (
                <button key={s} type="button" onClick={() => setForm({ ...form, species: s })} className={`px-4 py-2.5 rounded-xl text-sm font-medium min-h-[48px] ${form.species === s ? 'bg-primary text-white' : 'bg-gray-100 text-slate-600'}`}>
                  {s === 'cattle' ? '🐄 Cattle' : '🐑 Sheep'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-slate-600">
            <p className="font-medium mb-2">CSV Format</p>
            <code className="text-xs text-slate-500 block">earTag,eidNumber,species,breed,sex,dob</code>
            <code className="text-xs text-slate-500 block mt-1">UK 12 345 100001,826 000012345678,cattle,Hereford,female,2023-03-12</code>
          </div>

          <div>
            <input ref={fileInput} type="file" accept=".csv" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]" />
          </div>

          <button onClick={handleCsvImport} disabled={saving} className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm min-h-[48px] disabled:opacity-50">
            {saving ? 'Importing...' : '📥 Import CSV'}
          </button>

          {csvResult && (
            <div className={`rounded-xl p-4 text-sm ${csvResult.errors.length > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="font-medium">Imported {csvResult.created} of {csvResult.total} animals</p>
              {csvResult.errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {csvResult.errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600">Row {err.row}: {err.error}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
