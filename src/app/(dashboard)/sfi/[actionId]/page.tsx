'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Evidence {
  id: string;
  date: string;
  description: string | null;
  photoUrl: string | null;
  geoLat: number | null;
  geoLng: number | null;
  status: string;
}

interface ActionDetail {
  id: string;
  actionCode: string;
  actionName: string;
  hectares: number | null;
  paymentPerHa: number | null;
  evidenceRequired: string | null;
  agreement: { sfiRef: string; startDate: string; endDate: string };
  field: { name: string; hectares: number } | null;
  evidence: Evidence[];
}

const HEDGEROW_SPECIES = [
  'Hawthorn', 'Blackthorn', 'Elder', 'Hazel', 'Field Maple',
  'Dog Rose', 'Holly', 'Oak', 'Ash', 'Beech', 'Crab Apple', 'Spindle',
];

export default function SfiActionDetailPage() {
  const params = useParams();
  const actionId = params.actionId as string;
  const [action, setAction] = useState<ActionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Inline evidence form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/sfi/${actionId}`)
      .then((r) => r.json())
      .then((data) => { setAction(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [actionId]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const isHedgerow = action?.actionCode?.startsWith('HRW');
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
        actionId,
        description,
        geoLat: formData.geoLat || null,
        geoLng: formData.geoLng || null,
        status: 'draft',
      }),
    });

    if (res.ok) {
      // Refresh
      const refreshed = await fetch(`/api/sfi/${actionId}`);
      const data = await refreshed.json();
      setAction(data);
      setShowForm(false);
      setFormData({ description: '', geoLat: '', geoLng: '', species: [], height: '', width: '', gaps: '', gapDescription: '', condition: 'Good', notes: '' });
    }
    setSaving(false);
  }

  function toggleSpecies(species: string) {
    setFormData((p) => ({
      ...p,
      species: p.species.includes(species)
        ? p.species.filter((s) => s !== species)
        : [...p.species, species],
    }));
  }

  if (loading) {
    return <div className="space-y-6">{[1, 2, 3].map((i) => <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />)}</div>;
  }

  if (!action) {
    return <div className="text-center py-16 text-slate-500">Action not found</div>;
  }

  const isHedgerow = action.actionCode.startsWith('HRW');
  const evidenceStatus = action.evidence.some((e) => e.status === 'submitted')
    ? 'completed'
    : action.evidence.length > 0
    ? 'in_progress'
    : 'not_started';

  const statusConfig = {
    completed: { icon: '✅', label: 'Completed', color: 'text-green-700 bg-green-100' },
    in_progress: { icon: '🔵', label: 'In Progress', color: 'text-blue-700 bg-blue-100' },
    not_started: { icon: '⬜', label: 'Not Started', color: 'text-gray-600 bg-gray-100' },
  };
  const sc = statusConfig[evidenceStatus];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link href="/sfi" className="text-sm text-primary hover:underline mb-2 inline-block">
          ← SFI Actions
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          {action.actionCode}: {action.actionName}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {action.paymentPerHa && (
            <span className="text-sm text-slate-600">💰 £{action.paymentPerHa}/ha</span>
          )}
          {action.hectares && (
            <span className="text-sm text-slate-600">📐 {action.hectares} ha</span>
          )}
          {action.field && (
            <span className="text-sm text-slate-600">🌾 {action.field.name}</span>
          )}
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${sc.color}`}>
            {sc.icon} {sc.label}
          </span>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-3">
          📋 What&apos;s Required
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {action.evidenceRequired || 'Complete the required activities and submit evidence.'}
        </p>
        {isHedgerow && (
          <div className="mt-3 bg-amber-50 rounded-xl p-3">
            <p className="text-sm text-amber-800 font-medium">Hedgerow Assessment Requirements:</p>
            <ul className="text-sm text-amber-700 mt-1 space-y-1 list-disc list-inside">
              <li>Walk and assess every hedgerow on your land</li>
              <li>Record hedgerow species (min 2 woody species for good condition)</li>
              <li>Measure height and width</li>
              <li>Note gaps and condition assessment</li>
              <li>Photo evidence with GPS location</li>
            </ul>
          </div>
        )}
      </div>

      {/* Evidence Log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
            📸 Evidence Log ({action.evidence.length})
          </h2>
          <button
            onClick={() => { setShowForm(!showForm); if (!showForm) getGPS(); }}
            className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[44px]"
          >
            + Add Evidence
          </button>
        </div>

        {action.evidence.length === 0 && !showForm ? (
          <div className="px-5 py-8 text-center">
            <span className="text-4xl block mb-3">📷</span>
            <p className="text-sm text-slate-500">No evidence recorded yet</p>
            <button
              onClick={() => { setShowForm(true); getGPS(); }}
              className="mt-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 min-h-[44px]"
            >
              Add First Evidence
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {action.evidence.map((ev) => (
              <div key={ev.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">
                        {new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        ev.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ev.status === 'submitted' ? '✅ Submitted' : '📝 Draft'}
                      </span>
                    </div>
                    {ev.description && (
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{ev.description}</p>
                    )}
                    {(ev.geoLat && ev.geoLng) && (
                      <p className="text-xs text-slate-400 mt-1">
                        📍 {ev.geoLat.toFixed(4)}, {ev.geoLng.toFixed(4)}
                      </p>
                    )}
                  </div>
                  {ev.photoUrl && (
                    <span className="text-2xl ml-3">📷</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline Evidence Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-primary/20 shadow-sm p-5">
          <h3 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
            Add Evidence
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* GPS */}
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">📍 GPS Location</span>
                <button
                  type="button"
                  onClick={getGPS}
                  className="text-xs text-blue-600 hover:underline min-h-[44px] px-2"
                  disabled={gpsLoading}
                >
                  {gpsLoading ? 'Getting location...' : 'Refresh GPS'}
                </button>
              </div>
              {formData.geoLat && formData.geoLng ? (
                <p className="text-sm text-blue-700 mt-1">
                  ✅ {formData.geoLat}, {formData.geoLng}
                </p>
              ) : (
                <p className="text-sm text-blue-600 mt-1">
                  {gpsLoading ? 'Acquiring GPS...' : 'Tap to capture GPS coordinates'}
                </p>
              )}
            </div>

            {/* Hedgerow-specific fields */}
            {isHedgerow && (
              <>
                {/* Species Checklist */}
                <div>
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
                <div className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-3 gap-3">
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
                      placeholder="e.g. 3m gap near gate"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData((p) => ({ ...p, condition: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]"
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Requires Action">Requires Action</option>
                  </select>
                </div>
              </>
            )}

            {/* General description / notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isHedgerow ? 'Additional Notes' : 'Observations'}
              </label>
              <textarea
                value={isHedgerow ? formData.notes : formData.description}
                onChange={(e) =>
                  setFormData((p) =>
                    isHedgerow
                      ? { ...p, notes: e.target.value }
                      : { ...p, description: e.target.value }
                  )
                }
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                placeholder={isHedgerow ? 'Any additional observations...' : 'Describe what was observed...'}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[48px] disabled:opacity-50"
              >
                {saving ? 'Saving...' : '💾 Save Evidence'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 min-h-[48px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
