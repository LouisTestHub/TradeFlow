'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

interface FieldOption {
  id: string;
  name: string;
  hectares: number;
  cropType: string | null;
  nvzZone: boolean;
}

interface TeamMember {
  userId: string;
  name: string | null;
  email: string;
}

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
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

function ProductSearch({ onSelect }: { onSelect: (product: PppProduct) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PppProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 1) { setResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=10`);
        const data = await res.json();
        setResults(data.products || []);
      } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowResults(false);
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
        placeholder="Search PPP database..."
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
      />
      {showResults && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {results.map((p) => (
            <button key={p.id} type="button" onClick={() => { onSelect(p); setQuery(''); setShowResults(false); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 min-h-[48px]"
            >
              <p className="text-sm font-medium text-slate-800">{p.name}</p>
              <p className="text-xs text-slate-500">{p.activeIngredient} {p.mapp && `• MAPP: ${p.mapp}`}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditSprayPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [fields, setFields] = useState<FieldOption[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [fieldId, setFieldId] = useState('');
  const [areaTreatedHa, setAreaTreatedHa] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<SprayProductEntry[]>([]);
  const [weather, setWeather] = useState<WeatherEntry>({
    tempC: '', windSpeedKmh: '', windDirection: '', humidityPct: '', rainLast24hMm: '0', source: 'manual',
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/sprays/${id}`).then(r => r.json()),
      fetch('/api/fields').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/equipment').then(r => r.json()),
    ]).then(([sprayData, fieldsData, settingsData, equipData]) => {
      const s = sprayData.spray;
      if (s) {
        setDate(new Date(s.date).toISOString().split('T')[0]);
        setStartTime(s.startTime || '');
        setEndTime(s.endTime || '');
        setFieldId(s.field.id);
        setAreaTreatedHa(s.areaTreatedHa ? String(s.areaTreatedHa) : '');
        setOperatorId(s.operator.id);
        setEquipmentId(s.equipment?.id || '');
        setReason(s.reason || '');
        setNotes(s.notes || '');
        setProducts(s.products.map((p: Record<string, unknown>) => ({
          productName: p.productName || '',
          activeIngredient: p.activeIngredient || '',
          mapp: p.mapp || '',
          doseRate: p.doseRate ? String(p.doseRate) : '',
          doseUnit: (p.doseUnit as string) || 'l/ha',
          maxDoseRate: null,
          harvestInterval: null,
          bufferZone: null,
          batchNumber: p.batchNumber || '',
          areaTreated: p.areaTreated ? String(p.areaTreated) : '',
        })));
        if (s.weather) {
          setWeather({
            tempC: s.weather.tempC != null ? String(s.weather.tempC) : '',
            windSpeedKmh: s.weather.windSpeedKmh != null ? String(s.weather.windSpeedKmh) : '',
            windDirection: s.weather.windDirection || '',
            humidityPct: s.weather.humidityPct != null ? String(s.weather.humidityPct) : '',
            rainLast24hMm: s.weather.rainLast24hMm != null ? String(s.weather.rainLast24hMm) : '0',
            source: s.weather.source || 'manual',
          });
        }
      }
      setFields((fieldsData.fields || []).map((f: FieldOption) => ({ id: f.id, name: f.name, hectares: f.hectares, cropType: f.cropType, nvzZone: f.nvzZone })));
      setTeam((settingsData.team || []).map((m: TeamMember) => ({ userId: m.userId, name: m.name, email: m.email })));
      setEquipmentList(equipData.equipment || []);
      setLoading(false);
    });
  }, [id]);

  function handleProductSelect(index: number, ppp: PppProduct) {
    const updated = [...products];
    updated[index] = { ...updated[index], productName: ppp.name, activeIngredient: ppp.activeIngredient || '', mapp: ppp.mapp || '', doseUnit: ppp.doseUnit || 'l/ha', maxDoseRate: ppp.maxDoseRate, harvestInterval: ppp.harvestInterval, bufferZone: ppp.bufferZone };
    setProducts(updated);
  }

  function updateProduct(index: number, field: keyof SprayProductEntry, value: string) {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  }

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const body = {
        fieldId, date, startTime, endTime, areaTreatedHa, reason, notes, operatorId, equipmentId: equipmentId || null,
        products: products.filter(p => p.productName).map(p => ({
          productName: p.productName, activeIngredient: p.activeIngredient || null, mapp: p.mapp || null,
          doseRate: p.doseRate || null, doseUnit: p.doseUnit || null, areaTreated: p.areaTreated || null, batchNumber: p.batchNumber || null,
        })),
        weather: weather.tempC || weather.windSpeedKmh ? {
          tempC: weather.tempC || null, windSpeedKmh: weather.windSpeedKmh || null, windDirection: weather.windDirection || null,
          humidityPct: weather.humidityPct || null, rainLast24hMm: weather.rainLast24hMm || null, source: weather.source || 'manual',
        } : null,
      };

      const res = await fetch(`/api/sprays/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Failed to save');
      router.push(`/sprays/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Edit Spray Record</h1>
        </div>
        <button onClick={() => router.back()} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 min-h-[44px]">Cancel</button>
      </div>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm">{error}</div>}

      {/* When & Where */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800">When &amp; Where</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Field *</label>
          <select value={fieldId} onChange={e => setFieldId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]">
            <option value="">Select field...</option>
            {fields.map(f => <option key={f.id} value={f.id}>{f.name} ({f.hectares} ha)</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Area Treated (ha)</label>
          <input type="number" step="0.1" value={areaTreatedHa} onChange={e => setAreaTreatedHa(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800">Products Applied</h2>
        {products.map((product, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Product {index + 1}</h3>
              {products.length > 1 && <button type="button" onClick={() => setProducts(products.filter((_, i) => i !== index))} className="text-xs text-red-400 hover:text-red-600 min-h-[44px]">Remove</button>}
            </div>
            {!product.productName ? (
              <ProductSearch onSelect={(p) => handleProductSelect(index, p)} />
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{product.productName}</p>
                    <button type="button" onClick={() => updateProduct(index, 'productName', '')} className="text-xs text-slate-400 hover:text-slate-600 min-h-[44px] flex items-center">Change</button>
                  </div>
                  {product.activeIngredient && <p className="text-xs text-slate-500">Active: {product.activeIngredient}</p>}
                  {product.mapp && <p className="text-xs text-slate-500">MAPP: {product.mapp}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Dose Rate</label>
                    <input type="number" step="0.01" value={product.doseRate} onChange={e => updateProduct(index, 'doseRate', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Unit</label>
                    <select value={product.doseUnit} onChange={e => updateProduct(index, 'doseUnit', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm min-h-[44px]">
                      <option value="l/ha">L/ha</option><option value="kg/ha">kg/ha</option><option value="ml/ha">ml/ha</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Batch Number</label>
                  <input type="text" value={product.batchNumber} onChange={e => updateProduct(index, 'batchNumber', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm min-h-[44px]" />
                </div>
              </>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setProducts([...products, { productName: '', activeIngredient: '', mapp: '', doseRate: '', doseUnit: 'l/ha', maxDoseRate: null, harvestInterval: null, bufferZone: null, batchNumber: '', areaTreated: '' }])}
          className="w-full py-3 text-sm font-medium text-primary border border-dashed border-primary/30 rounded-xl hover:bg-primary/5 min-h-[48px]">
          + Add Another Product
        </button>
      </div>

      {/* Application Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800">Application Details</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Operator *</label>
          <select value={operatorId} onChange={e => setOperatorId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]">
            <option value="">Select...</option>
            {team.map(m => <option key={m.userId} value={m.userId}>{m.name || m.email}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Equipment</label>
          <select value={equipmentId} onChange={e => setEquipmentId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]">
            <option value="">Select...</option>
            {equipmentList.map(e => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
        </div>
      </div>

      {/* Weather */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800">Weather</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Temp (°C)</label>
            <input type="number" step="0.1" value={weather.tempC} onChange={e => setWeather({...weather, tempC: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm min-h-[44px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Wind (km/h)</label>
            <input type="number" step="0.1" value={weather.windSpeedKmh} onChange={e => setWeather({...weather, windSpeedKmh: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm min-h-[44px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Direction</label>
            <select value={weather.windDirection} onChange={e => setWeather({...weather, windDirection: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm min-h-[44px]">
              <option value="">—</option>
              {WIND_DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Humidity (%)</label>
            <input type="number" value={weather.humidityPct} onChange={e => setWeather({...weather, humidityPct: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm min-h-[44px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Rain 24h (mm)</label>
            <input type="number" step="0.1" value={weather.rainLast24hMm} onChange={e => setWeather({...weather, rainLast24hMm: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm min-h-[44px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Source</label>
            <select value={weather.source} onChange={e => setWeather({...weather, source: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm min-h-[44px]">
              <option value="manual">Manual</option><option value="metoffice">Met Office</option><option value="sencrop">Sencrop</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-800">Notes</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-base resize-none" />
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="flex-1 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light min-h-[48px] disabled:opacity-50">
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
        <button onClick={() => router.back()} className="px-6 py-3.5 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 min-h-[48px]">Cancel</button>
      </div>
    </div>
  );
}
