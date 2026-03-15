'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface FertDetail {
  id: string;
  date: string;
  productType: string;
  productName: string | null;
  rateKgHa: number | null;
  rateUnit: string | null;
  nContent: number | null;
  pContent: number | null;
  kContent: number | null;
  nPercent: number | null;
  pPercent: number | null;
  kPercent: number | null;
  method: string | null;
  soilCondition: string | null;
  distanceFromWater: number | null;
  areaTreatedHa: number | null;
  notes: string | null;
  nvzCompliant: boolean;
  field: { id: string; name: string; hectares: number; nvzZone: boolean; cropType: string | null };
  operator: { id: string; name: string | null } | null;
}

export default function FertiliserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<FertDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/fertiliser/${id}`)
      .then((r) => r.json())
      .then(setRecord)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this fertiliser record?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/fertiliser/${id}`, { method: 'DELETE' });
      if (res.ok) router.push('/fertiliser');
    } catch { alert('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const typeLabel = (t: string) => {
    const map: Record<string, string> = {
      chemical: 'Chemical Fertiliser', fym: 'Farmyard Manure', slurry: 'Slurry',
      organic: 'Organic', sewage_sludge: 'Sewage Sludge', compost: 'Compost', manure: 'Manure',
    };
    return map[t] || t;
  };

  if (loading) return <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />;
  if (!record) return (
    <div className="text-center py-16">
      <p className="text-lg text-slate-600">Record not found</p>
      <Link href="/fertiliser" className="text-primary font-medium mt-4 inline-block">← Back</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/fertiliser" className="text-sm text-slate-500 hover:text-primary mb-2 inline-block">← Fertiliser Records</Link>
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          {record.productName || typeLabel(record.productType)}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{formatDate(record.date)} • {record.field.name}</p>
      </div>

      {/* NVZ Status */}
      {record.field.nvzZone && (
        <div className={`rounded-2xl p-4 border ${record.nvzCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`font-bold ${record.nvzCompliant ? 'text-green-800' : 'text-red-800'}`}>
            {record.nvzCompliant ? '🟢 NVZ Compliant' : '🔴 NVZ Non-Compliant'}
          </p>
        </div>
      )}

      {/* Details */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">Application Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt className="text-slate-500">Type</dt><dd className="font-medium">{typeLabel(record.productType)}</dd></div>
          <div><dt className="text-slate-500">Field</dt><dd className="font-medium">{record.field.name} ({record.field.hectares} ha)</dd></div>
          <div><dt className="text-slate-500">Rate</dt><dd className="font-medium">{record.rateKgHa} {record.rateUnit || 'kg/ha'}</dd></div>
          <div><dt className="text-slate-500">Area Treated</dt><dd className="font-medium">{record.areaTreatedHa ? `${record.areaTreatedHa} ha` : '—'}</dd></div>
          <div><dt className="text-slate-500">Method</dt><dd className="font-medium capitalize">{record.method || '—'}</dd></div>
          {record.operator && <div><dt className="text-slate-500">Operator</dt><dd className="font-medium">{record.operator.name}</dd></div>}
        </dl>
      </section>

      {/* Nutrients */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">Nutrient Content</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-green-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-700">{record.nContent ? Math.round(record.nContent) : 0}</p>
            <p className="text-xs text-green-600 mt-1">N kg/ha</p>
          </div>
          <div className="text-center bg-blue-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-700">{record.pContent ? Math.round(record.pContent) : 0}</p>
            <p className="text-xs text-blue-600 mt-1">P₂O₅ kg/ha</p>
          </div>
          <div className="text-center bg-amber-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-700">{record.kContent ? Math.round(record.kContent) : 0}</p>
            <p className="text-xs text-amber-600 mt-1">K₂O kg/ha</p>
          </div>
        </div>
      </section>

      {/* Conditions */}
      {(record.soilCondition || record.distanceFromWater !== null) && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Spreading Conditions</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {record.soilCondition && <div><dt className="text-slate-500">Soil Condition</dt><dd className="font-medium capitalize">{record.soilCondition.replace('_', ' ')}</dd></div>}
            {record.distanceFromWater !== null && <div><dt className="text-slate-500">Distance from Water</dt><dd className="font-medium">{record.distanceFromWater}m</dd></div>}
          </dl>
        </section>
      )}

      {/* Notes */}
      {record.notes && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-700 mb-2">Notes</h2>
          <p className="text-sm text-slate-600">{record.notes}</p>
        </section>
      )}

      <div className="flex gap-3">
        <button onClick={handleDelete} disabled={deleting}
          className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition min-h-[48px] disabled:opacity-50">
          {deleting ? 'Deleting...' : '🗑️ Delete Record'}
        </button>
      </div>
    </div>
  );
}
