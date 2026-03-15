'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FieldOption {
  id: string;
  name: string;
  hectares: number;
  cropType: string | null;
  nvzZone: boolean;
  currentSeason: { crop: string; variety: string | null } | null;
}

interface PppProduct {
  id: string;
  name: string;
  mapp: string | null;
  activeIngredient: string | null;
  maxDoseRate: number | null;
  doseUnit: string | null;
  harvestInterval: number | null;
  bufferZone: number | null;
  manufacturer: string | null;
}

interface TeamMember {
  userId: string;
  name: string | null;
  email: string;
  role: string;
}

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  tankCapacity: number | null;
  nozzleType: string | null;
  calibrationStatus: string;
}

interface SprayProductEntry {
  productName: string;
  activeIngredient: string;
  mapp: string;
  doseRate: string;
  doseUnit: string;
  maxDoseRate: number | null;
  harvestInterval: number | null;
  bufferZone: number | null;
  batchNumber: string;
  areaTreated: string;
}

interface WeatherEntry {
  tempC: string;
  windSpeedKmh: string;
  windDirection: string;
  humidityPct: string;
  rainLast24hMm: string;
  source: string;
}

const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function SprayWindowAssessment({ weather, products }: { weather: WeatherEntry; products: SprayProductEntry[] }) {
  const temp = parseFloat(weather.tempC);
  const wind = parseFloat(weather.windSpeedKmh);
  const rain = parseFloat(weather.rainLast24hMm);

  const checks = [
    {
      label: `Temperature: ${weather.tempC || '—'}°C`,
      ok: !isNaN(temp) && temp > 5,
      detail: !isNaN(temp) ? (temp > 5 ? 'OK — above 5°C minimum' : 'Below 5°C minimum') : 'Not recorded',
    },
    {
      label: `Wind: ${weather.windSpeedKmh || '—'} km/h`,
      ok: !isNaN(wind) && wind < 20,
      detail: !isNaN(wind) ? (wind < 20 ? 'OK — below 20 km/h max' : 'Above 20 km/h maximum') : 'Not recorded',
    },
    {
      label: `Rain last 24h: ${weather.rainLast24hMm || '0'} mm`,
      ok: isNaN(rain) || rain <= 2,
      detail: !isNaN(rain) ? (rain <= 2 ? 'OK — minimal rainfall' : 'Recent rain may affect application') : 'Not recorded',
    },
  ];

  const allOk = checks.every((c) => c.ok);
  const anyMissing = !weather.tempC && !weather.windSpeedKmh;

  const bufferWarnings = products
    .filter((p) => p.bufferZone && p.bufferZone > 0)
    .map((p) => `${p.bufferZone}m buffer from watercourse required for ${p.productName}`);

  return (
    <div className={`rounded-xl border p-4 ${allOk ? 'bg-green-50 border-green-200' : anyMissing ? 'bg-gray-50 border-gray-200' : 'bg-amber-50 border-amber-200'}`}>
      <h4 className="text-sm font-semibold text-slate-800 mb-3">Spray Window Assessment</h4>
      <div className="space-y-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-sm flex-shrink-0">{check.ok ? '✅' : '⚠️'}</span>
            <div>
              <span className="text-sm text-slate-700">{check.label}</span>
              <span className="text-xs text-slate-500 ml-1">({check.detail})</span>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-2 pt-1 border-t border-current/10 mt-2">
          <span className="text-sm flex-shrink-0">{allOk ? '✅' : anyMissing ? '❓' : '⚠️'}</span>
          <span className={`text-sm font-semibold ${allOk ? 'text-green-700' : anyMissing ? 'text-slate-500' : 'text-amber-700'}`}>
            Overall: {allOk ? 'GOOD spray conditions' : anyMissing ? 'Weather not recorded' : 'MARGINAL conditions — review before spraying'}
          </span>
        </div>
      </div>
      {bufferWarnings.length > 0 && (
        <div className="mt-3 space-y-1">
          {bufferWarnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-700 flex items-start gap-1">
              <span>⚠️</span> {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductSearch({
  onSelect,
}: {
  onSelect: (product: PppProduct) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PppProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=10`);
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        /* ignore */
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
        onFocus={() => setShowResults(true)}
        placeholder="Search PPP database... (name, active ingredient, MAPP)"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      {showResults && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelect(p);
                setQuery('');
                setShowResults(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 min-h-[48px]"
            >
              <p className="text-sm font-medium text-slate-800">{p.name}</p>
              <p className="text-xs text-slate-500">
                {p.activeIngredient}
                {p.mapp && <span className="ml-2">MAPP: {p.mapp}</span>}
                {p.manufacturer && <span className="ml-2">• {p.manufacturer}</span>}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyProduct: SprayProductEntry = {
  productName: '',
  activeIngredient: '',
  mapp: '',
  doseRate: '',
  doseUnit: 'l/ha',
  maxDoseRate: null,
  harvestInterval: null,
  bufferZone: null,
  batchNumber: '',
  areaTreated: '',
};

const emptyWeather: WeatherEntry = {
  tempC: '',
  windSpeedKmh: '',
  windDirection: '',
  humidityPct: '',
  rainLast24hMm: '0',
  source: 'manual',
};

export default function NewSprayPage() {
  const router = useRouter();
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [fieldId, setFieldId] = useState('');
  const [areaTreatedHa, setAreaTreatedHa] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<SprayProductEntry[]>([{ ...emptyProduct }]);
  const [weather, setWeather] = useState<WeatherEntry>({ ...emptyWeather });

  const selectedField = fields.find((f) => f.id === fieldId);
  const selectedEquipment = equipment.find((e) => e.id === equipmentId);

  useEffect(() => {
    Promise.all([
      fetch('/api/fields').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
      fetch('/api/equipment').then((r) => r.json()),
    ]).then(([fieldsData, settingsData, equipData]) => {
      setFields(
        (fieldsData.fields || []).map((f: FieldOption & { currentSeason?: { crop: string; variety: string | null } | null }) => ({
          id: f.id,
          name: f.name,
          hectares: f.hectares,
          cropType: f.cropType,
          nvzZone: f.nvzZone,
          currentSeason: f.currentSeason || null,
        }))
      );
      setTeam(settingsData.team || []);
      if (settingsData.team?.length > 0) {
        setOperatorId(settingsData.team[0].userId);
      }
      setEquipment(equipData.equipment || []);
    });
  }, []);

  useEffect(() => {
    if (selectedField && !areaTreatedHa) {
      setAreaTreatedHa(String(selectedField.hectares));
    }
  }, [fieldId, selectedField, areaTreatedHa]);

  function handleProductSelect(index: number, ppp: PppProduct) {
    const updated = [...products];
    updated[index] = {
      ...updated[index],
      productName: ppp.name,
      activeIngredient: ppp.activeIngredient || '',
      mapp: ppp.mapp || '',
      doseUnit: ppp.doseUnit || 'l/ha',
      maxDoseRate: ppp.maxDoseRate,
      harvestInterval: ppp.harvestInterval,
      bufferZone: ppp.bufferZone,
      areaTreated: areaTreatedHa,
    };
    setProducts(updated);
  }

  function updateProduct(index: number, field: keyof SprayProductEntry, value: string) {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  }

  function addProduct() {
    setProducts([...products, { ...emptyProduct, areaTreated: areaTreatedHa }]);
  }

  function removeProduct(index: number) {
    if (products.length <= 1) return;
    setProducts(products.filter((_, i) => i !== index));
  }

  async function handleSubmit(action: 'return' | 'another') {
    setError('');
    if (!fieldId || !date || !operatorId || products.every((p) => !p.productName)) {
      setError('Please fill in field, date, operator, and at least one product.');
      return;
    }

    setSaving(true);
    try {
      const body = {
        fieldId,
        date,
        startTime: startTime || null,
        endTime: endTime || null,
        areaTreatedHa: areaTreatedHa || null,
        reason: reason || null,
        notes: notes || null,
        operatorId,
        equipmentId: equipmentId || null,
        products: products
          .filter((p) => p.productName)
          .map((p) => ({
            productName: p.productName,
            activeIngredient: p.activeIngredient || null,
            mapp: p.mapp || null,
            doseRate: p.doseRate || null,
            doseUnit: p.doseUnit || null,
            areaTreated: p.areaTreated || areaTreatedHa || null,
            batchNumber: p.batchNumber || null,
          })),
        weather: weather.tempC || weather.windSpeedKmh
          ? {
              tempC: weather.tempC || null,
              windSpeedKmh: weather.windSpeedKmh || null,
              windDirection: weather.windDirection || null,
              humidityPct: weather.humidityPct || null,
              rainLast24hMm: weather.rainLast24hMm || null,
              source: weather.source || 'manual',
            }
          : null,
      };

      const res = await fetch('/api/sprays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      if (action === 'another') {
        // Reset form for another entry
        setProducts([{ ...emptyProduct }]);
        setWeather({ ...emptyWeather });
        setReason('');
        setNotes('');
        setStartTime('');
        setEndTime('');
        window.scrollTo(0, 0);
      } else {
        router.push('/sprays');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save spray record');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Log Spray Application
          </h1>
          <p className="text-sm text-slate-500 mt-1">Record a spray application for compliance</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 min-h-[44px]"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm">{error}</div>
      )}

      {/* When & Where */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">When &amp; Where</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Field *</label>
          <select
            value={fieldId}
            onChange={(e) => { setFieldId(e.target.value); setAreaTreatedHa(''); }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
          >
            <option value="">Select field...</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.hectares} ha)
              </option>
            ))}
          </select>
        </div>

        {selectedField && (
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
            <div>
              <p className="text-xs text-slate-500">Crop</p>
              <p className="text-sm font-medium text-slate-700">
                {selectedField.currentSeason
                  ? `${selectedField.currentSeason.crop}${selectedField.currentSeason.variety ? ` — ${selectedField.currentSeason.variety}` : ''}`
                  : selectedField.cropType || 'Not set'}
              </p>
            </div>
            {selectedField.nvzZone && (
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">NVZ Zone</span>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Area Treated (ha)</label>
          <input
            type="number"
            step="0.1"
            value={areaTreatedHa}
            onChange={(e) => setAreaTreatedHa(e.target.value)}
            placeholder={selectedField ? String(selectedField.hectares) : ''}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
          />
        </div>
      </div>

      {/* Products Applied */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Products Applied</h2>

        {products.map((product, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Product {index + 1}</h3>
              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="text-xs text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  Remove
                </button>
              )}
            </div>

            {!product.productName ? (
              <ProductSearch onSelect={(p) => handleProductSelect(index, p)} />
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{product.productName}</p>
                    <button
                      type="button"
                      onClick={() => updateProduct(index, 'productName', '')}
                      className="text-xs text-slate-400 hover:text-slate-600 min-h-[44px] flex items-center"
                    >
                      Change
                    </button>
                  </div>
                  {product.activeIngredient && (
                    <p className="text-xs text-slate-500">Active: {product.activeIngredient}</p>
                  )}
                  {product.mapp && <p className="text-xs text-slate-500">MAPP: {product.mapp}</p>}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.harvestInterval != null && product.harvestInterval > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                        Harvest interval: {product.harvestInterval}d
                      </span>
                    )}
                    {product.bufferZone != null && product.bufferZone > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                        Buffer: {product.bufferZone}m
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Dose Rate *
                      {product.maxDoseRate && (
                        <span className="text-slate-400 ml-1">(max {product.maxDoseRate})</span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={product.doseRate}
                      onChange={(e) => updateProduct(index, 'doseRate', e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px] ${
                        product.maxDoseRate && parseFloat(product.doseRate) > product.maxDoseRate
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 focus:border-primary'
                      }`}
                    />
                    {product.maxDoseRate && parseFloat(product.doseRate) > product.maxDoseRate && (
                      <p className="text-xs text-red-600 mt-1">⚠️ Exceeds max dose ({product.maxDoseRate} {product.doseUnit})</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Unit</label>
                    <select
                      value={product.doseUnit}
                      onChange={(e) => updateProduct(index, 'doseUnit', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
                    >
                      <option value="l/ha">L/ha</option>
                      <option value="kg/ha">kg/ha</option>
                      <option value="ml/ha">ml/ha</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={product.batchNumber}
                    onChange={(e) => updateProduct(index, 'batchNumber', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
                    placeholder="e.g. ABC123"
                  />
                </div>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addProduct}
          className="w-full py-3 text-sm font-medium text-primary border border-dashed border-primary/30 rounded-xl hover:bg-primary/5 min-h-[48px]"
        >
          + Add Another Product (tank mix)
        </button>
      </div>

      {/* Application Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Application Details</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Operator *</label>
          <select
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
          >
            <option value="">Select operator...</option>
            {team.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.name || m.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Equipment</label>
          <select
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
          >
            <option value="">Select equipment...</option>
            {equipment.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.type})
                {e.calibrationStatus === 'overdue' ? ' 🔴 Overdue cal.' : ''}
                {e.calibrationStatus === 'due_soon' ? ' ⚠️ Cal. due soon' : ''}
              </option>
            ))}
          </select>
          {selectedEquipment?.calibrationStatus === 'overdue' && (
            <p className="text-xs text-red-600 mt-1">🔴 Calibration overdue — NSTS test required for Red Tractor compliance</p>
          )}
        </div>

        {selectedEquipment?.tankCapacity && (
          <div className="text-xs text-slate-500 bg-gray-50 rounded-xl p-3">
            Tank capacity: {selectedEquipment.tankCapacity}L
            {selectedEquipment.nozzleType && ` • Nozzle: ${selectedEquipment.nozzleType}`}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for Application</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
          >
            <option value="">Select reason...</option>
            <option value="Pre-emergence herbicide">Pre-emergence herbicide</option>
            <option value="Post-emergence herbicide">Post-emergence herbicide</option>
            <option value="T0 fungicide">T0 fungicide</option>
            <option value="T1 fungicide">T1 fungicide</option>
            <option value="T2 fungicide">T2 fungicide</option>
            <option value="T3 fungicide (ear wash)">T3 fungicide (ear wash)</option>
            <option value="Insecticide">Insecticide</option>
            <option value="Growth regulator">Growth regulator</option>
            <option value="Desiccation">Desiccation</option>
            <option value="Slug pellets">Slug pellets</option>
            <option value="Grassland weed control">Grassland weed control</option>
            <option value="Stubble treatment">Stubble treatment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Weather */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Weather at Application</h2>
          <button
            type="button"
            className="px-3 py-2 text-xs font-medium text-slate-500 bg-gray-50 rounded-xl border border-gray-100 min-h-[36px]"
            title="Met Office integration coming soon"
          >
            🌡️ Auto-Capture (coming soon)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              value={weather.tempC}
              onChange={(e) => setWeather({ ...weather, tempC: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Wind Speed (km/h)</label>
            <input
              type="number"
              step="0.1"
              value={weather.windSpeedKmh}
              onChange={(e) => setWeather({ ...weather, windSpeedKmh: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Wind Direction</label>
            <select
              value={weather.windDirection}
              onChange={(e) => setWeather({ ...weather, windDirection: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
            >
              <option value="">—</option>
              {WIND_DIRECTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Humidity (%)</label>
            <input
              type="number"
              step="1"
              value={weather.humidityPct}
              onChange={(e) => setWeather({ ...weather, humidityPct: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Rain Last 24h (mm)</label>
            <input
              type="number"
              step="0.1"
              value={weather.rainLast24hMm}
              onChange={(e) => setWeather({ ...weather, rainLast24hMm: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Source</label>
            <select
              value={weather.source}
              onChange={(e) => setWeather({ ...weather, source: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[44px]"
            >
              <option value="manual">Manual</option>
              <option value="metoffice">Met Office</option>
              <option value="sencrop">Sencrop</option>
            </select>
          </div>
        </div>

        {/* Spray Window Assessment */}
        {(weather.tempC || weather.windSpeedKmh) && (
          <SprayWindowAssessment weather={weather} products={products} />
        )}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Reason for application, observations, field conditions..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base resize-none"
        />
      </div>

      {/* What This Record Generates */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-3">
          What This Record Generates
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <span>✅</span> Red Tractor spray record
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <span>✅</span> Pesticide application record (legal requirement)
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <span>✅</span> Field activity log
          </p>
          {selectedField?.nvzZone && (
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <span>✅</span> NVZ nutrient tracking (if fertiliser component)
            </p>
          )}
          {products.some((p) => p.harvestInterval && p.harvestInterval > 0) && (
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <span>✅</span> Harvest interval countdown
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleSubmit('return')}
          disabled={saving}
          className="flex-1 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors min-h-[48px] disabled:opacity-50"
        >
          {saving ? 'Saving...' : '💾 Save & Return to Diary'}
        </button>
        <button
          onClick={() => handleSubmit('another')}
          disabled={saving}
          className="flex-1 px-6 py-3.5 bg-white text-primary font-semibold rounded-xl border-2 border-primary hover:bg-primary/5 transition-colors min-h-[48px] disabled:opacity-50"
        >
          Save & Log Another
        </button>
      </div>
    </div>
  );
}
