'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const soilTypes = ['Clay', 'Clay Loam', 'Sandy Loam', 'Sand', 'Peat', 'Chalk', 'Silt', 'Silt Loam', 'Loam', 'Sandy Clay', 'Alluvial'];
const cropTypes = ['Winter Wheat', 'Spring Barley', 'Winter Barley', 'Oilseed Rape', 'Oats', 'Beans', 'Peas', 'Maize', 'Potatoes', 'Sugar Beet', 'Permanent Grass', 'Temporary Grass', 'Silage', 'Hay', 'Fallow', 'Woodland', 'Other'];

export default function NewFieldPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name'),
      fieldNumber: form.get('fieldNumber') || null,
      hectares: form.get('hectares'),
      cropType: form.get('cropType') || null,
      soilType: form.get('soilType') || null,
      nvzZone: form.get('nvzZone') === 'on',
    };

    try {
      const res = await fetch('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/fields/${data.field.id}`);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to create field');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/fields" className="text-primary hover:underline">← Fields</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600">Add Field</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Add New Field</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-100">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Field Name *</label>
          <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" placeholder="e.g. Top Meadow" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Size (hectares) *</label>
            <input name="hectares" type="number" step="0.1" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" placeholder="e.g. 25.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Field Number</label>
            <input name="fieldNumber" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" placeholder="e.g. TM01" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Soil Type</label>
          <select name="soilType" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]">
            <option value="">Select soil type...</option>
            {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Crop</label>
          <select name="cropType" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]">
            <option value="">Select crop...</option>
            {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input name="nvzZone" type="checkbox" id="nvzZone" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
          <label htmlFor="nvzZone" className="text-sm font-medium text-slate-700">NVZ Zone (Nitrate Vulnerable Zone)</label>
        </div>

        {/* Map boundary placeholder */}
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <span className="text-3xl block mb-2">🗺️</span>
          <p className="text-sm text-slate-500">Field boundary drawing available when mapping is configured.</p>
          <p className="text-xs text-slate-400 mt-1">You can also import boundaries from a GeoJSON file later.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors min-h-[48px] disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Field'}
          </button>
          <Link href="/fields" className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 min-h-[48px] flex items-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
