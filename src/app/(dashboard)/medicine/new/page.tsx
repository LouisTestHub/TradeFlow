'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Animal {
  id: string;
  earTag: string;
  species: string;
  breed: string | null;
  sex: string | null;
}

interface VetProduct {
  id: string;
  name: string;
  activeIngredient: string | null;
  species: string | null;
  defaultDose: string | null;
  route: string | null;
  withdrawalMeatDays: number | null;
  withdrawalMilkDays: number | null;
  pomStatus: string | null;
  manufacturer: string | null;
}

interface Vet {
  id: string;
  name: string;
  practice: string | null;
  rcvsNumber: string | null;
}

const REASONS = [
  'Lameness', 'Mastitis', 'Pneumonia', 'Scour', 'Flystrike', 'Worms',
  'Preventative', 'Vaccination', 'Eye infection', 'Foot rot', 'Other',
];

const ROUTES = [
  { value: 'injection', label: 'IM (Intramuscular)' },
  { value: 'subcutaneous', label: 'SC (Subcutaneous)' },
  { value: 'oral', label: 'Oral' },
  { value: 'pour-on', label: 'Pour-On' },
  { value: 'topical', label: 'Topical' },
  { value: 'intramammary', label: 'Intramammary' },
  { value: 'iv', label: 'IV (Intravenous)' },
  { value: 'intranasal', label: 'Intranasal' },
];

export default function NewMedicinePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Animals
  const [animalSearch, setAnimalSearch] = useState('');
  const [animalResults, setAnimalResults] = useState<Animal[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);
  const [showAnimalSearch, setShowAnimalSearch] = useState(false);

  // Product
  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState<VetProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<VetProduct | null>(null);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [customProduct, setCustomProduct] = useState('');

  // Dosage
  const [doseNumeric, setDoseNumeric] = useState('');
  const [doseUnit, setDoseUnit] = useState('ml');
  const [route, setRoute] = useState('');
  const [animalWeight, setAnimalWeight] = useState('');

  // Withdrawal
  const [withdrawalMeatDays, setWithdrawalMeatDays] = useState('');
  const [withdrawalMilkDays, setWithdrawalMilkDays] = useState('');

  // Batch & vet
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [vets, setVets] = useState<Vet[]>([]);
  const [selectedVetId, setSelectedVetId] = useState('');

  // Course
  const [isCourse, setIsCourse] = useState(false);
  const [courseDoses, setCourseDoses] = useState('');
  const [courseInterval, setCourseInterval] = useState('');

  // Notes
  const [notes, setNotes] = useState('');

  // Fetch animals
  const searchAnimals = useCallback(async (q: string) => {
    if (q.length < 2) { setAnimalResults([]); return; }
    try {
      const res = await fetch(`/api/livestock?search=${encodeURIComponent(q)}&limit=10`);
      const data = await res.json();
      setAnimalResults(data.animals || []);
    } catch { setAnimalResults([]); }
  }, []);

  // Fetch products
  const searchProducts = useCallback(async (q: string) => {
    if (q.length < 2) { setProductResults([]); return; }
    try {
      const res = await fetch(`/api/medicine/products/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setProductResults(data);
    } catch { setProductResults([]); }
  }, []);

  // Fetch vets
  useEffect(() => {
    fetch('/api/medicine/vets').then((r) => r.json()).then(setVets).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchAnimals(animalSearch), 300);
    return () => clearTimeout(t);
  }, [animalSearch, searchAnimals]);

  useEffect(() => {
    const t = setTimeout(() => searchProducts(productSearch), 300);
    return () => clearTimeout(t);
  }, [productSearch, searchProducts]);

  // Auto-fill from selected product
  useEffect(() => {
    if (selectedProduct) {
      setWithdrawalMeatDays(String(selectedProduct.withdrawalMeatDays || 0));
      setWithdrawalMilkDays(String(selectedProduct.withdrawalMilkDays || 0));
      if (selectedProduct.route) setRoute(selectedProduct.route);
    }
  }, [selectedProduct]);

  const addAnimal = (animal: Animal) => {
    if (!selectedAnimals.find((a) => a.id === animal.id)) {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
    setAnimalSearch('');
    setShowAnimalSearch(false);
  };

  const removeAnimal = (id: string) => {
    setSelectedAnimals(selectedAnimals.filter((a) => a.id !== id));
  };

  const selectProduct = (product: VetProduct) => {
    setSelectedProduct(product);
    setProductSearch(product.name);
    setShowProductSearch(false);
  };

  // Calculate dose
  const calculatedDose = (() => {
    if (!selectedProduct?.defaultDose || !animalWeight) return null;
    const w = parseFloat(animalWeight);
    if (!w) return null;
    // Parse dose like "1ml/10kg" or "2.5ml/100kg"
    const match = selectedProduct.defaultDose.match(/([\d.]+)\s*ml?\s*\/\s*([\d.]+)\s*kg/i);
    if (!match) return null;
    const dosePerWeight = parseFloat(match[1]) / parseFloat(match[2]);
    return Math.round(dosePerWeight * w * 10) / 10;
  })();

  const doseWarning = (() => {
    if (!calculatedDose || !doseNumeric) return null;
    const given = parseFloat(doseNumeric);
    if (!given) return null;
    if (given > calculatedDose * 1.2) {
      return `⚠️ Dose given (${given}ml) exceeds calculated dose (${calculatedDose}ml) — please confirm`;
    }
    return null;
  })();

  // Withdrawal dates
  const withdrawalCalc = (() => {
    if (!date) return null;
    const treatDate = new Date(date);
    const meatDays = parseInt(withdrawalMeatDays) || 0;
    const milkDays = parseInt(withdrawalMilkDays) || 0;
    if (meatDays === 0 && milkDays === 0) return null;

    const meatEnd = meatDays > 0 ? new Date(treatDate.getTime() + meatDays * 86400000) : null;
    const milkEnd = milkDays > 0 ? new Date(treatDate.getTime() + milkDays * 86400000) : null;

    return { meatEnd, milkEnd, meatDays, milkDays };
  })();

  // Next dose date
  const nextDoseDate = (() => {
    if (!isCourse || !date || !courseInterval) return null;
    const interval = parseInt(courseInterval);
    if (!interval) return null;
    const next = new Date(new Date(date).getTime() + interval * 3600000);
    return next;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimals.length === 0) return alert('Please select at least one animal');
    if (!selectedProduct && !customProduct) return alert('Please select or enter a medicine product');

    setSaving(true);
    try {
      const res = await fetch('/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          reason: reason === 'Other' ? customReason : reason,
          animalIds: selectedAnimals.map((a) => a.id),
          productName: selectedProduct?.name || customProduct,
          productId: selectedProduct?.id || null,
          doseNumeric: doseNumeric || null,
          doseUnit,
          dose: doseNumeric ? `${doseNumeric}${doseUnit}` : null,
          route,
          animalWeight: animalWeight || null,
          withdrawalMeatDays: parseInt(withdrawalMeatDays) || 0,
          withdrawalMilkDays: parseInt(withdrawalMilkDays) || 0,
          batchNumber: batchNumber || null,
          expiryDate: expiryDate || null,
          vetId: selectedVetId || null,
          vetName: vets.find((v) => v.id === selectedVetId)?.name || null,
          isCourse,
          courseDoses: courseDoses ? parseInt(courseDoses) : null,
          courseIntervalHours: courseInterval ? parseInt(courseInterval) : null,
          notes: notes || null,
        }),
      });

      if (res.ok) {
        router.push('/medicine');
      } else {
        alert('Failed to save treatment');
      }
    } catch {
      alert('Failed to save treatment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Log Medicine Treatment</h1>
        <Link href="/medicine" className="text-sm text-slate-500 hover:text-slate-700 min-h-[44px] flex items-center">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Reason */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Date & Reason</h2>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Treatment Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
              <option value="">Select reason...</option>
              {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {reason === 'Other' && (
              <input type="text" placeholder="Describe reason..." value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px] mt-2" />
            )}
          </div>
        </section>

        {/* Animals */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Animals Treated</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search by tag or EID..."
              value={animalSearch}
              onChange={(e) => { setAnimalSearch(e.target.value); setShowAnimalSearch(true); }}
              onFocus={() => setShowAnimalSearch(true)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]"
            />
            {showAnimalSearch && animalResults.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {animalResults.map((a) => (
                  <button key={a.id} type="button" onClick={() => addAnimal(a)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm flex items-center justify-between min-h-[48px]">
                    <span className="font-mono font-medium">{a.earTag}</span>
                    <span className="text-slate-400">{a.breed} • {a.sex}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedAnimals.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Selected ({selectedAnimals.length}):</p>
              {selectedAnimals.map((a) => (
                <div key={a.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600">✅</span>
                    <span className="font-mono font-medium text-sm">{a.earTag}</span>
                    <span className="text-xs text-slate-500">{a.breed} • {a.sex}</span>
                  </div>
                  <button type="button" onClick={() => removeAnimal(a.id)}
                    className="text-red-400 hover:text-red-600 min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Medicine Product */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Medicine Product</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search medicine database..."
              value={productSearch}
              onChange={(e) => { setProductSearch(e.target.value); setShowProductSearch(true); setSelectedProduct(null); }}
              onFocus={() => setShowProductSearch(true)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]"
            />
            {showProductSearch && productResults.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {productResults.map((p) => (
                  <button key={p.id} type="button" onClick={() => selectProduct(p)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm border-b border-gray-50 min-h-[48px]">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.activeIngredient} • {p.pomStatus}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm space-y-1">
              <p className="font-semibold text-blue-800">{selectedProduct.name}</p>
              <p className="text-blue-600">Active: {selectedProduct.activeIngredient}</p>
              <p className="text-blue-600">POM Status: {selectedProduct.pomStatus}</p>
              <p className="text-blue-600">Default Dose: {selectedProduct.defaultDose}</p>
              <p className="text-blue-600">Route: {selectedProduct.route}</p>
              <p className="text-blue-600">Withdrawal — Meat: {selectedProduct.withdrawalMeatDays} days • Milk: {selectedProduct.withdrawalMilkDays} days</p>
            </div>
          )}

          {!selectedProduct && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">Or enter custom product name</label>
              <input type="text" placeholder="Product name" value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
          )}
        </section>

        {/* Dosage */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Dosage</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Dose Given</label>
              <div className="flex">
                <input type="number" step="0.1" placeholder="0" value={doseNumeric}
                  onChange={(e) => setDoseNumeric(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-l-xl border border-gray-200 text-sm min-h-[48px]" />
                <select value={doseUnit} onChange={(e) => setDoseUnit(e.target.value)}
                  className="px-3 py-3 rounded-r-xl border border-l-0 border-gray-200 text-sm bg-gray-50 min-h-[48px]">
                  <option value="ml">ml</option>
                  <option value="mg">mg</option>
                  <option value="tablets">tablets</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Animal Weight (est)</label>
              <div className="flex">
                <input type="number" step="1" placeholder="kg" value={animalWeight}
                  onChange={(e) => setAnimalWeight(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Route</label>
            <select value={route} onChange={(e) => setRoute(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
              <option value="">Select route...</option>
              {ROUTES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {calculatedDose && (
            <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              ℹ️ Calculated dose: {calculatedDose}ml ({selectedProduct?.defaultDose} × {animalWeight}kg)
            </p>
          )}
          {doseWarning && (
            <p className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">{doseWarning}</p>
          )}
        </section>

        {/* Batch & Vet */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Batch & Vet</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Batch Number</label>
              <input type="text" placeholder="e.g. B2026-0384" value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Expiry Date</label>
              <input type="text" placeholder="e.g. Dec 2027" value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Prescribing Vet</label>
            <select value={selectedVetId} onChange={(e) => setSelectedVetId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]">
              <option value="">Select vet...</option>
              {vets.map((v) => <option key={v.id} value={v.id}>{v.name} — {v.practice}</option>)}
            </select>
          </div>
        </section>

        {/* Withdrawal */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Withdrawal Period</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Meat (days)</label>
              <input type="number" min="0" value={withdrawalMeatDays}
                onChange={(e) => setWithdrawalMeatDays(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Milk (days)</label>
              <input type="number" min="0" value={withdrawalMilkDays}
                onChange={(e) => setWithdrawalMilkDays(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
          </div>
          {withdrawalCalc && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-red-800 flex items-center gap-2">🔴 WITHDRAWAL PERIOD ACTIVE</p>
              <p className="text-sm text-red-700">Treatment Date: {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              {withdrawalCalc.meatEnd && (
                <p className="text-sm text-red-700">🥩 Meat Withdrawal: {withdrawalCalc.meatDays} days → Clear: {withdrawalCalc.meatEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              )}
              {withdrawalCalc.milkEnd && (
                <p className="text-sm text-red-700">🥛 Milk Withdrawal: {withdrawalCalc.milkDays} days → Clear: {withdrawalCalc.milkEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              )}
              <p className="text-xs text-red-600 mt-2">⚠️ DO NOT send to slaughter or sell milk before these dates. Illegal meat/milk = prosecution.</p>
            </div>
          )}
        </section>

        {/* Course Treatment */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Course Treatment</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-600">Is this a course?</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsCourse(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] ${isCourse ? 'bg-primary text-white' : 'bg-gray-100 text-slate-600'}`}>Yes</button>
              <button type="button" onClick={() => setIsCourse(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] ${!isCourse ? 'bg-primary text-white' : 'bg-gray-100 text-slate-600'}`}>No</button>
            </div>
          </div>
          {isCourse && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Number of doses</label>
                <input type="number" min="2" value={courseDoses}
                  onChange={(e) => setCourseDoses(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Interval (hours)</label>
                <input type="number" min="1" value={courseInterval}
                  onChange={(e) => setCourseInterval(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
              </div>
            </div>
          )}
          {nextDoseDate && (
            <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              ⏰ Next dose due: {nextDoseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {nextDoseDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </section>

        {/* Notes */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Notes</h2>
          <textarea
            placeholder="Observations, severity, response to treatment..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none"
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition min-h-[56px] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? 'Saving...' : '💾 Save Treatment'}
        </button>
      </form>
    </div>
  );
}
