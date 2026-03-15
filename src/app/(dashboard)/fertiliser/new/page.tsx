'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FieldOption {
  id: string;
  name: string;
  hectares: number;
  nvzZone: boolean;
  cropType: string | null;
}

const PRODUCT_TYPES = [
  { value: 'chemical', label: 'Chemical Fertiliser', icon: '⚗️' },
  { value: 'fym', label: 'FYM', icon: '🐄' },
  { value: 'slurry', label: 'Slurry', icon: '💧' },
  { value: 'sewage_sludge', label: 'Sewage Sludge', icon: '🏭' },
  { value: 'compost', label: 'Compost', icon: '🍂' },
  { value: 'organic', label: 'Other Organic', icon: '🌿' },
];

const CHEMICAL_PRODUCTS = [
  { name: 'Ammonium Nitrate 34.5%', n: 34.5, p: 0, k: 0 },
  { name: 'Urea 46%N', n: 46, p: 0, k: 0 },
  { name: 'DAP 18-46-0', n: 18, p: 46, k: 0 },
  { name: 'Triple Super Phosphate 0-46-0', n: 0, p: 46, k: 0 },
  { name: 'MOP 0-0-60', n: 0, p: 0, k: 60 },
  { name: '20-10-10', n: 20, p: 10, k: 10 },
  { name: '0-20-30', n: 0, p: 20, k: 30 },
  { name: 'Double Top 27%N 12%SO3', n: 27, p: 0, k: 0 },
  { name: 'Sulphate of Ammonia 21%N', n: 21, p: 0, k: 0 },
  { name: 'CAN 27%N', n: 27, p: 0, k: 0 },
];

const ORGANIC_PRODUCTS: Record<string, { name: string; totalN: number; availRate: number; totalP: number; totalK: number }[]> = {
  fym: [
    { name: 'Cattle FYM', totalN: 6.0, availRate: 0.25, totalP: 3.2, totalK: 8.0 },
    { name: 'Pig FYM', totalN: 7.0, availRate: 0.30, totalP: 6.0, totalK: 5.0 },
    { name: 'Poultry Manure', totalN: 16.0, availRate: 0.35, totalP: 13.0, totalK: 9.0 },
  ],
  slurry: [
    { name: 'Cattle Slurry', totalN: 2.6, availRate: 0.45, totalP: 0.6, totalK: 2.5 },
    { name: 'Pig Slurry', totalN: 4.0, availRate: 0.50, totalP: 1.2, totalK: 2.0 },
    { name: 'Digestate (whole)', totalN: 4.5, availRate: 0.55, totalP: 0.5, totalK: 3.5 },
  ],
  sewage_sludge: [
    { name: 'Sewage Sludge', totalN: 10.0, availRate: 0.30, totalP: 8.0, totalK: 1.0 },
  ],
  compost: [
    { name: 'Compost (green)', totalN: 7.0, availRate: 0.10, totalP: 3.0, totalK: 6.0 },
  ],
};

const METHODS = [
  { value: 'broadcast', label: 'Broadcast' },
  { value: 'band', label: 'Band' },
  { value: 'foliar', label: 'Foliar' },
  { value: 'injected', label: 'Injected' },
  { value: 'surface', label: 'Surface Spread' },
  { value: 'trailing_shoe', label: 'Trailing Shoe' },
];

const SOIL_CONDITIONS = [
  { value: 'dry', label: 'Dry', ok: true },
  { value: 'moist', label: 'Moist', ok: true },
  { value: 'wet', label: 'Wet', ok: true },
  { value: 'waterlogged', label: 'Waterlogged ⛔', ok: false },
  { value: 'frozen', label: 'Frozen ⛔', ok: false },
  { value: 'snow_covered', label: 'Snow-covered ⛔', ok: false },
];

export default function NewFertiliserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fieldId, setFieldId] = useState('');
  const [areaTreated, setAreaTreated] = useState('');
  const [productType, setProductType] = useState('chemical');
  const [productName, setProductName] = useState('');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState('kg/ha');
  const [nPercent, setNPercent] = useState('');
  const [pPercent, setPPercent] = useState('');
  const [kPercent, setKPercent] = useState('');
  const [nContent, setNContent] = useState('');
  const [pContent, setPContent] = useState('');
  const [kContent, setKContent] = useState('');
  const [method, setMethod] = useState('broadcast');
  const [soilCondition, setSoilCondition] = useState('');
  const [distFromWater, setDistFromWater] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('/api/fields')
      .then((r) => r.json())
      .then((data) => {
        const f = (data.fields || data || []).map((f: any) => ({
          id: f.id, name: f.name, hectares: f.hectares, nvzZone: f.nvzZone, cropType: f.cropType,
        }));
        setFields(f);
      })
      .catch(console.error);
  }, []);

  const selectedField = fields.find((f) => f.id === fieldId);

  // Auto-calc N/P/K for chemical
  useEffect(() => {
    if (productType === 'chemical' && rate) {
      const r = parseFloat(rate);
      const n = parseFloat(nPercent) || 0;
      const p = parseFloat(pPercent) || 0;
      const k = parseFloat(kPercent) || 0;
      setNContent(String(Math.round(r * n / 100 * 10) / 10));
      setPContent(String(Math.round(r * p / 100 * 10) / 10));
      setKContent(String(Math.round(r * k / 100 * 10) / 10));
    }
  }, [rate, nPercent, pPercent, kPercent, productType]);

  // Auto-fill chemical product analysis
  const selectChemicalProduct = (name: string) => {
    setProductName(name);
    const prod = CHEMICAL_PRODUCTS.find((p) => p.name === name);
    if (prod) {
      setNPercent(String(prod.n));
      setPPercent(String(prod.p));
      setKPercent(String(prod.k));
    }
  };

  // Auto-calc N/P/K for organic
  const organicProducts = ORGANIC_PRODUCTS[productType] || [];
  const selectedOrganic = organicProducts.find((p) => p.name === productName);

  useEffect(() => {
    if (selectedOrganic && rate) {
      const r = parseFloat(rate);
      if (r) {
        setNContent(String(Math.round(r * selectedOrganic.totalN * selectedOrganic.availRate * 10) / 10));
        setPContent(String(Math.round(r * selectedOrganic.totalP * 10) / 10));
        setKContent(String(Math.round(r * selectedOrganic.totalK * 10) / 10));
      }
    }
  }, [rate, selectedOrganic]);

  // Set default rate unit based on product type
  useEffect(() => {
    if (productType === 'slurry') setRateUnit('m³/ha');
    else if (['fym', 'sewage_sludge', 'compost', 'organic'].includes(productType)) setRateUnit('t/ha');
    else setRateUnit('kg/ha');
  }, [productType]);

  // NVZ warnings
  useEffect(() => {
    const w: string[] = [];
    if (selectedField?.nvzZone) {
      // Soil condition
      if (['waterlogged', 'frozen', 'snow_covered'].includes(soilCondition)) {
        w.push(`⛔ Cannot spread on ${soilCondition.replace('_', ' ')} ground (NVZ regulation)`);
      }
      // Water distance
      if (distFromWater) {
        const dist = parseFloat(distFromWater);
        const min = productType === 'slurry' ? 50 : 10;
        if (dist < min) w.push(`⛔ Must be at least ${min}m from watercourse (${productType === 'slurry' ? 'slurry: 50m' : '10m'})`);
      }
      // Closed period check (simplified)
      const appMonth = new Date(date).getMonth();
      const isOrganic = ['organic', 'fym', 'slurry', 'sewage_sludge', 'compost'].includes(productType);
      if (isOrganic && appMonth >= 7 && appMonth <= 11) {
        w.push('⚠️ Check NVZ closed period for organic manure on this field type');
      }
      if (!isOrganic && ((appMonth === 8 && new Date(date).getDate() >= 15) || (appMonth >= 9 && appMonth <= 11) || (appMonth === 0 && new Date(date).getDate() <= 15))) {
        w.push('⛔ NVZ closed period for chemical N: 15 Sep - 15 Jan');
      }
    }
    setWarnings(w);
  }, [soilCondition, distFromWater, date, productType, selectedField]);

  const isOrganic = ['organic', 'fym', 'slurry', 'sewage_sludge', 'compost'].includes(productType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId) return alert('Please select a field');
    setSaving(true);
    try {
      const res = await fetch('/api/fertiliser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date, fieldId, areaTreatedHa: areaTreated || null, productType, productName,
          rateKgHa: rate || null, rateUnit,
          nContent: nContent || null, pContent: pContent || null, kContent: kContent || null,
          nPercent: nPercent || null, pPercent: pPercent || null, kPercent: kPercent || null,
          method, soilCondition: soilCondition || null,
          distanceFromWater: distFromWater || null,
          notes: notes || null,
        }),
      });
      const data = await res.json();
      if (data.warnings?.length > 0) {
        const proceed = confirm(`Warnings:\n${data.warnings.join('\n')}\n\nRecord saved with warnings.`);
      }
      if (res.ok) router.push('/fertiliser');
      else alert('Failed to save');
    } catch {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Log Fertiliser Application</h1>
        <Link href="/fertiliser" className="text-sm text-slate-500 hover:text-slate-700 min-h-[44px] flex items-center">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* When & Where */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">When & Where</h2>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Field</label>
            <select value={fieldId} onChange={(e) => { setFieldId(e.target.value); const f = fields.find((f) => f.id === e.target.value); if (f) setAreaTreated(String(f.hectares)); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" required>
              <option value="">Select field...</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.hectares} ha) {f.nvzZone ? '🟢 NVZ' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Area Treated (ha)</label>
            <input type="number" step="0.1" value={areaTreated} onChange={(e) => setAreaTreated(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
          </div>
        </section>

        {/* Product Type */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Product Type</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRODUCT_TYPES.map((t) => (
              <button key={t.value} type="button" onClick={() => { setProductType(t.value); setProductName(''); }}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition min-h-[64px] ${
                  productType === t.value ? 'bg-primary/10 border-2 border-primary text-primary' : 'bg-gray-50 border-2 border-transparent text-slate-600'
                }`}>
                <span className="text-xl">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Product Details */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
            {isOrganic ? 'Organic Manure Details' : 'Chemical Fertiliser Details'}
          </h2>

          {productType === 'chemical' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Product</label>
                <select value={productName} onChange={(e) => selectChemicalProduct(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
                  <option value="">Select product...</option>
                  {CHEMICAL_PRODUCTS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                  <option value="custom">Custom product...</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">N %</label>
                  <input type="number" step="0.1" value={nPercent} onChange={(e) => setNPercent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">P₂O₅ %</label>
                  <input type="number" step="0.1" value={pPercent} onChange={(e) => setPPercent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">K₂O %</label>
                  <input type="number" step="0.1" value={kPercent} onChange={(e) => setKPercent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
                <select value={productName} onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
                  <option value="">Select type...</option>
                  {organicProducts.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              {selectedOrganic && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                  <p>ℹ️ RB209 N availability: {Math.round(selectedOrganic.availRate * 100)}% of total N available in year of application</p>
                  <p className="text-xs mt-1">Total N: {selectedOrganic.totalN} kg/t • P₂O₅: {selectedOrganic.totalP} kg/t • K₂O: {selectedOrganic.totalK} kg/t</p>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Application Rate</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Unit</label>
              <select value={rateUnit} onChange={(e) => setRateUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
                <option value="kg/ha">kg/ha</option>
                <option value="t/ha">t/ha</option>
                <option value="m³/ha">m³/ha</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
              {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {/* Calculated N/P/K */}
          {(nContent || pContent || kContent) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
              <p className="font-medium text-green-800">Estimated Available Nutrients:</p>
              <div className="grid grid-cols-3 gap-2 mt-1 text-green-700">
                <span>N: {nContent} kg/ha</span>
                <span>P₂O₅: {pContent} kg/ha</span>
                <span>K₂O: {kContent} kg/ha</span>
              </div>
            </div>
          )}
        </section>

        {/* Spreading Conditions (NVZ) */}
        {selectedField?.nvzZone && (
          <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Spreading Conditions (NVZ)</h2>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Soil Condition</label>
              <select value={soilCondition} onChange={(e) => setSoilCondition(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
                <option value="">Select condition...</option>
                {SOIL_CONDITIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Distance from Watercourse (m)</label>
              <input type="number" step="1" value={distFromWater} onChange={(e) => setDistFromWater(e.target.value)}
                placeholder={productType === 'slurry' ? 'Min 50m for slurry' : 'Min 10m'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <p className="text-xs text-slate-500">
              ⚠️ NVZ: Cannot spread on waterlogged, frozen, or snow-covered ground.
              Cannot spread within {productType === 'slurry' ? '50m' : '10m'} of watercourse.
            </p>
          </section>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-2">
            <h3 className="font-bold text-red-800">⚠️ NVZ Warnings</h3>
            {warnings.map((w, i) => (
              <p key={i} className="text-sm text-red-700">{w}</p>
            ))}
          </div>
        )}

        {/* Notes */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Notes</h2>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="Any additional notes..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none" />
        </section>

        {/* Submit */}
        <button type="submit" disabled={saving || warnings.some((w) => w.startsWith('⛔'))}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition min-h-[56px] flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? 'Saving...' : '💾 Save Application'}
        </button>
      </form>
    </div>
  );
}
