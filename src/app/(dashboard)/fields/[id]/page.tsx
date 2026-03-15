'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';

interface FieldDetail {
  field: {
    id: string;
    name: string;
    fieldNumber: string | null;
    hectares: number;
    cropType: string | null;
    soilType: string | null;
    nvzZone: boolean;
    geometry: string | null;
    farmName: string;
  };
  seasons: Array<{
    id: string;
    year: number;
    crop: string;
    variety: string | null;
    plantingDate: string | null;
    harvestDate: string | null;
    yieldTonnes: number | null;
  }>;
  sprays: Array<{
    id: string;
    date: string;
    products: Array<{ name: string; activeIngredient: string | null; doseRate: number | null; doseUnit: string | null }>;
    operator: string;
    areaTreated: number | null;
  }>;
  soilTests: Array<{
    id: string;
    date: string;
    ph: number | null;
    pIndex: number | null;
    kIndex: number | null;
    mgIndex: number | null;
    organicMatter: number | null;
  }>;
  fertiliser: {
    records: Array<{
      id: string;
      date: string;
      productType: string;
      productName: string | null;
      rateKgHa: number | null;
      nContent: number | null;
      pContent: number | null;
      kContent: number | null;
      method: string | null;
      operator: string | null;
    }>;
    seasonTotals: { n: number; p: number; k: number };
    nvzLimit: number | null;
  };
}

type Tab = 'overview' | 'crops' | 'sprays' | 'fertiliser' | 'soil';

const tabs: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'crops', label: 'Crop History' },
  { key: 'sprays', label: 'Sprays' },
  { key: 'fertiliser', label: 'Fertiliser' },
  { key: 'soil', label: 'Soil Tests' },
];

export default function FieldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<FieldDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showSeasonForm, setShowSeasonForm] = useState(false);
  const [showSoilForm, setShowSoilForm] = useState(false);

  useEffect(() => {
    fetch(`/api/fields/${id}`)
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!data || !data.field) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Field not found</p>
        <Link href="/fields" className="text-primary font-medium mt-2 inline-block">← Back to Fields</Link>
      </div>
    );
  }

  const { field, seasons, sprays, soilTests, fertiliser } = data;
  const currentSeason = seasons[0];

  async function handleAddSeason(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      year: form.get('year'),
      crop: form.get('crop'),
      variety: form.get('variety') || null,
      plantingDate: form.get('plantingDate') || null,
      harvestDate: form.get('harvestDate') || null,
      yieldTonnes: form.get('yieldTonnes') || null,
    };
    const res = await fetch(`/api/fields/${id}/seasons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setShowSeasonForm(false);
      const updated = await fetch(`/api/fields/${id}`).then(r => r.json());
      setData(updated);
    }
  }

  async function handleDeleteSeason(seasonId: string) {
    if (!confirm('Delete this season?')) return;
    const res = await fetch(`/api/fields/${id}/seasons?seasonId=${seasonId}`, { method: 'DELETE' });
    if (res.ok) {
      const updated = await fetch(`/api/fields/${id}`).then(r => r.json());
      setData(updated);
    }
  }

  async function handleAddSoilTest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      date: form.get('date'),
      ph: form.get('ph') || null,
      pIndex: form.get('pIndex') || null,
      kIndex: form.get('kIndex') || null,
      mgIndex: form.get('mgIndex') || null,
      organicMatter: form.get('organicMatter') || null,
    };
    const res = await fetch(`/api/fields/${id}/soil-tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setShowSoilForm(false);
      const updated = await fetch(`/api/fields/${id}`).then(r => r.json());
      setData(updated);
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/fields" className="text-primary hover:underline">← Fields</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600">{field.name}</span>
      </div>

      {/* Field Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            {field.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
            <span>{field.hectares} ha</span>
            {field.soilType && <><span>•</span><span>Soil: {field.soilType}</span></>}
            {field.nvzZone && <><span>•</span><span className="text-amber-600 font-medium">NVZ: Yes</span></>}
            {field.fieldNumber && <><span>•</span><span>Field No: {field.fieldNumber}</span></>}
          </div>
        </div>
        <Link
          href={`/fields/${id}/edit`}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors min-h-[44px] flex items-center"
        >
          ✏️ Edit Field
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {activeTab === 'overview' && (
          <div className="p-5 space-y-5">
            {/* Mini map placeholder */}
            <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-4xl">🗺️</span>
            </div>
            {currentSeason && (
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">Current Crop</h3>
                <p className="text-sm text-slate-600">
                  {currentSeason.crop}{currentSeason.variety ? ` (${currentSeason.variety})` : ''}
                  {currentSeason.plantingDate && ` — Planted: ${new Date(currentSeason.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </p>
              </div>
            )}
            {sprays.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800">Last Spray</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {sprays[0].products.map(p => p.name).join(', ')} — {new Date(sprays[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
            {fertiliser.records.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800">Last Fertiliser</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {fertiliser.records[0].productName || fertiliser.records[0].productType}
                  {fertiliser.records[0].rateKgHa ? ` @ ${fertiliser.records[0].rateKgHa} kg/ha` : ''}
                  {' — '}{new Date(fertiliser.records[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
            {field.nvzZone && (
              <div>
                <h3 className="font-semibold text-slate-800">NVZ Status</h3>
                <p className="text-sm text-slate-600 mt-1">
                  N applied: {fertiliser.seasonTotals.n} / {fertiliser.nvzLimit} kg N/ha max
                  {fertiliser.seasonTotals.n <= (fertiliser.nvzLimit || 200) ? ' ✅ Compliant' : ' ⚠️ Over limit'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Crop History</h3>
              <button
                onClick={() => setShowSeasonForm(!showSeasonForm)}
                className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors min-h-[44px]"
              >
                + Add Season
              </button>
            </div>

            {showSeasonForm && (
              <form onSubmit={handleAddSeason} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Year</label>
                    <input name="year" type="number" defaultValue={2025} required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Crop</label>
                    <select name="crop" required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]">
                      <option value="">Select...</option>
                      {['Winter Wheat','Spring Barley','Winter Barley','Oilseed Rape','Oats','Beans','Peas','Maize','Potatoes','Sugar Beet','Permanent Grass','Temporary Grass','Silage','Hay','Fallow','Woodland','Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Variety</label>
                  <input name="variety" type="text" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" placeholder="e.g. Skyfall" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Planting Date</label>
                    <input name="plantingDate" type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Harvest Date</label>
                    <input name="harvestDate" type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Yield (t/ha)</label>
                  <input name="yieldTonnes" type="number" step="0.1" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium min-h-[44px]">Save</button>
                  <button type="button" onClick={() => setShowSeasonForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]">Cancel</button>
                </div>
              </form>
            )}

            {seasons.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No crop history recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Year</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Crop</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Variety</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Planted</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Harvested</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Yield</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {seasons.map((s) => (
                      <tr key={s.id}>
                        <td className="px-3 py-2.5 text-sm text-slate-700">{s.year}/{(s.year + 1).toString().slice(-2)}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-700">{s.crop}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-500">{s.variety || '—'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-500">
                          {s.plantingDate ? new Date(s.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-slate-500">
                          {s.harvestDate ? new Date(s.harvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-slate-500">
                          {s.yieldTonnes ? `${s.yieldTonnes} t/ha` : '—'}
                        </td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => handleDeleteSeason(s.id)}
                            className="text-xs text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sprays' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Spray Records</h3>
              <Link
                href={`/sprays/new?fieldId=${id}`}
                className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors min-h-[44px] flex items-center"
              >
                + Log Spray
              </Link>
            </div>
            {sprays.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No spray records for this field</p>
            ) : (
              <div className="space-y-3">
                {sprays.map((s) => (
                  <div key={s.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {s.products.map(p => p.name).join(', ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-slate-500">
                      <span>Operator: {s.operator}</span>
                      {s.areaTreated && <span>Area: {s.areaTreated} ha</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'fertiliser' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Fertiliser Applications</h3>
              <Link
                href={`/fertiliser/new?fieldId=${id}`}
                className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors min-h-[44px] flex items-center"
              >
                + Log Fertiliser
              </Link>
            </div>

            {/* Season NPK Totals */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Season Totals (kg/ha)</h4>
              <div className="flex gap-6">
                <div>
                  <span className="text-xs text-slate-400">N</span>
                  <p className="text-lg font-bold text-slate-800">{fertiliser.seasonTotals.n}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">P</span>
                  <p className="text-lg font-bold text-slate-800">{fertiliser.seasonTotals.p}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">K</span>
                  <p className="text-lg font-bold text-slate-800">{fertiliser.seasonTotals.k}</p>
                </div>
                {fertiliser.nvzLimit && (
                  <div className="ml-auto">
                    <span className="text-xs text-slate-400">NVZ N Limit</span>
                    <p className="text-lg font-bold text-amber-600">{fertiliser.nvzLimit}</p>
                  </div>
                )}
              </div>
            </div>

            {fertiliser.records.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No fertiliser records for this field</p>
            ) : (
              <div className="space-y-3">
                {fertiliser.records.map((r) => (
                  <div key={r.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {r.productName || r.productType}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-slate-500">
                      {r.rateKgHa && <span>{r.rateKgHa} kg/ha</span>}
                      {r.method && <span>Method: {r.method}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'soil' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Soil Tests</h3>
              <button
                onClick={() => setShowSoilForm(!showSoilForm)}
                className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors min-h-[44px]"
              >
                + Add Soil Test
              </button>
            </div>

            {showSoilForm && (
              <form onSubmit={handleAddSoilTest} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                  <input name="date" type="date" required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">pH</label>
                    <input name="ph" type="number" step="0.1" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">P Index</label>
                    <input name="pIndex" type="number" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">K Index</label>
                    <input name="kIndex" type="number" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Mg Index</label>
                    <input name="mgIndex" type="number" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Organic Matter (%)</label>
                  <input name="organicMatter" type="number" step="0.1" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium min-h-[44px]">Save</button>
                  <button type="button" onClick={() => setShowSoilForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]">Cancel</button>
                </div>
              </form>
            )}

            {soilTests.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No soil tests recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Date</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">pH</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">P</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">K</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">Mg</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500">OM%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {soilTests.map((t) => (
                      <tr key={t.id}>
                        <td className="px-3 py-2.5 text-sm text-slate-700">
                          {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{t.ph ?? '—'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{t.pIndex ?? '—'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{t.kIndex ?? '—'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{t.mgIndex ?? '—'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{t.organicMatter ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
