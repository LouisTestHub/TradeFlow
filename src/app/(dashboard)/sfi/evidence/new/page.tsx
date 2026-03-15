'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SfiActionOption {
  id: string;
  actionCode: string;
  actionName: string;
}

const HEDGEROW_SPECIES = [
  'Hawthorn', 'Blackthorn', 'Elder', 'Hazel', 'Field Maple',
  'Dog Rose', 'Holly', 'Oak', 'Ash', 'Beech', 'Crab Apple', 'Spindle',
];

export default function SfiEvidenceNewPage() {
  const router = useRouter();
  const [actions, setActions] = useState<SfiActionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState({
    actionId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    geoLat: '',
    geoLng: '',
    species: [] as string[],
    height: '',
    width: '',
    gaps: '',
    gapDescription: '',
    condition: 'Good',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/sfi')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const allActions = data[0].actions.map((a: SfiActionOption) => ({
            id: a.id,
            actionCode: a.actionCode,
            actionName: a.actionName,
          }));
          setActions(allActions);
          if (allActions.length > 0) {
            setFormData((p) => ({ ...p, actionId: allActions[0].id }));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Auto-get GPS
    getGPS();
  }, []);

  function getGPS() {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((p) => ({
          ...p,
          geoLat: pos.coords.latitude.toFixed(6),
          geoLng: pos.coords.longitude.toFixed(6),
        }));
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true }
    );
  }

  function toggleSpecies(species: string) {
    setFormData((p) => ({
      ...p,
      species: p.species.includes(species)
        ? p.species.filter((s) => s !== species)
        : [...p.species, species],
    }));
  }

  const selectedAction = actions.find((a) => a.id === formData.actionId);
  const isHedgerow = selectedAction?.actionCode?.startsWith('HRW');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.actionId) return;
    setSaving(true);

    let description = formData.description;
    if (isHedgerow) {
      const parts = [];
      if (formData.species.length > 0) parts.push(`Species: ${formData.species.join(', ')} (${formData.species.length} total)`);
      if (formData.height) parts.push(`Height: ${formData.height}m`);
      if (formData.width) parts.push(`Width: ${formData.width}m`);
      if (formData.gaps) parts.push(`Gaps: ${formData.gaps}${formData.gapDescription ? ` — ${formData.gapDescription}` : ''}`);
      parts.push(`Condition: ${formData.condition}`);
      if (formData.notes) parts.push(`Notes: ${formData.notes}`);
      description = parts.join('\n');
    }

    const res = await fetch('/api/sfi/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionId: formData.actionId,
        date: formData.date,
        description,
        geoLat: formData.geoLat || null,
        geoLng: formData.geoLng || null,
        status: 'draft',
      }),
    });

    if (res.ok) {
      router.push(`/sfi/${formData.actionId}`);
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="space-y-6">{[1, 2].map((i) => <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/sfi" className="text-sm text-primary hover:underline mb-2 inline-block">
          ← SFI Actions
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          📸 Capture SFI Evidence
        </h1>
        <p className="text-slate-500 mt-1">Record evidence for your SFI actions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Action Selection */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
            Action & Date
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SFI Action</label>
              <select
                value={formData.actionId}
                onChange={(e) => setFormData((p) => ({ ...p, actionId: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]"
              >
                {actions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.actionCode} — {a.actionName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]"
              />
            </div>
          </div>
        </div>

        {/* GPS Location */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
              📍 Location
            </h2>
            <button
              type="button"
              onClick={getGPS}
              className="text-sm text-primary hover:underline min-h-[44px] px-2"
              disabled={gpsLoading}
            >
              {gpsLoading ? 'Getting...' : '🔄 Refresh GPS'}
            </button>
          </div>

          {formData.geoLat && formData.geoLng ? (
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-sm text-green-700 font-medium">✅ GPS Captured</p>
              <p className="text-sm text-green-600">
                {formData.geoLat}, {formData.geoLng}
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-sm text-blue-700">
                {gpsLoading ? '📡 Acquiring GPS signal...' : 'Tap Refresh GPS to capture coordinates'}
              </p>
            </div>
          )}

          <div className="mt-3 text-xs text-slate-400 space-y-0.5">
            <p>✅ Geo-tagged (GPS coordinates embedded)</p>
            <p>✅ Date/time stamped</p>
            <p>✅ Stored with audit trail (immutable)</p>
          </div>
        </div>

        {/* Hedgerow-specific observations */}
        {isHedgerow && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
              🌿 Hedgerow Observations
            </h2>

            {/* Species Checklist */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Species Found ({formData.species.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {HEDGEROW_SPECIES.map((species) => (
                  <button
                    key={species}
                    type="button"
                    onClick={() => toggleSpecies(species)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      formData.species.includes(species)
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {formData.species.includes(species) ? '✓' : '○'} {species}
                  </button>
                ))}
              </div>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData((p) => ({ ...p, height: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]"
                  placeholder="3.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Width (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => setFormData((p) => ({ ...p, width: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]"
                  placeholder="2.0"
                />
              </div>
            </div>

            {/* Gaps */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gaps</label>
                <input
                  type="number"
                  value={formData.gaps}
                  onChange={(e) => setFormData((p) => ({ ...p, gaps: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]"
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Gap Description</label>
                <input
                  type="text"
                  value={formData.gapDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, gapDescription: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]"
                  placeholder="e.g. 3m gap near gate — rabbit damage"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData((p) => ({ ...p, condition: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[48px]"
              >
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Requires Action">Requires Action</option>
              </select>
            </div>
          </div>
        )}

        {/* Observations / Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
            📝 {isHedgerow ? 'Additional Notes' : 'Observations'}
          </h2>
          <textarea
            value={isHedgerow ? formData.notes : formData.description}
            onChange={(e) =>
              setFormData((p) =>
                isHedgerow
                  ? { ...p, notes: e.target.value }
                  : { ...p, description: e.target.value }
              )
            }
            rows={4}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
            placeholder={isHedgerow ? 'Any additional observations about this hedgerow...' : 'Describe what was observed, measurements taken, species found...'}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !formData.actionId}
            className="flex-1 px-4 py-3.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 min-h-[48px] disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save Evidence'}
          </button>
          <Link
            href="/sfi"
            className="px-6 py-3.5 border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 min-h-[48px] flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
