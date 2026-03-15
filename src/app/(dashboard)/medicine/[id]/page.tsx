'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface MedicineDetail {
  id: string;
  date: string;
  productName: string;
  batchNumber: string | null;
  dose: string | null;
  doseNumeric: number | null;
  doseUnit: string | null;
  route: string | null;
  withdrawalMeatDays: number | null;
  withdrawalMilkDays: number | null;
  withdrawalEndMeat: string | null;
  withdrawalEndMilk: string | null;
  meatActive: boolean;
  milkActive: boolean;
  meatDaysRemaining: number;
  milkDaysRemaining: number;
  vetName: string | null;
  reason: string | null;
  notes: string | null;
  animalWeight: number | null;
  expiryDate: string | null;
  isCourse: boolean;
  courseDoses: number | null;
  courseIntervalHours: number | null;
  courseCurrentDose: number | null;
  createdAt: string;
  animals: Array<{
    animal: { id: string; earTag: string; species: string; breed: string | null; sex: string | null; dob: string | null };
  }>;
  vet: { name: string; practice: string | null; phone: string | null; rcvsNumber: string | null } | null;
}

export default function MedicineDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<MedicineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/medicine/${id}`)
      .then((r) => r.json())
      .then(setRecord)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this medicine record? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/medicine/${id}`, { method: 'DELETE' });
      if (res.ok) router.push('/medicine');
    } catch {
      alert('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const routeLabel = (r: string | null) => {
    const map: Record<string, string> = {
      injection: 'Intramuscular (IM)', oral: 'Oral', 'pour-on': 'Pour-On', topical: 'Topical',
      intramammary: 'Intramammary', iv: 'Intravenous (IV)', intranasal: 'Intranasal', subcutaneous: 'Subcutaneous (SC)',
    };
    return r ? map[r] || r : '—';
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
      <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
    </div>
  );

  if (!record) return (
    <div className="text-center py-16">
      <p className="text-lg text-slate-600">Record not found</p>
      <Link href="/medicine" className="text-primary font-medium mt-4 inline-block">← Back to Medicine</Link>
    </div>
  );

  const isWithdrawalActive = record.meatActive || record.milkActive;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/medicine" className="text-sm text-slate-500 hover:text-primary mb-2 inline-block">← Medicine Records</Link>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">{record.productName}</h1>
          <p className="text-sm text-slate-500 mt-1">{formatDate(record.date)} • {record.reason}</p>
        </div>
        {isWithdrawalActive ? (
          <span className="text-sm font-bold text-red-700 bg-red-100 px-4 py-2 rounded-full">🔴 Under Withdrawal</span>
        ) : (
          <span className="text-sm font-bold text-green-700 bg-green-100 px-4 py-2 rounded-full">✅ Clear</span>
        )}
      </div>

      {/* Withdrawal Status */}
      {isWithdrawalActive && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
          <h2 className="font-bold text-red-800 flex items-center gap-2">🔴 WITHDRAWAL PERIOD ACTIVE</h2>
          {record.meatActive && (
            <div>
              <p className="text-sm text-red-700">🥩 Meat withdrawal: {record.withdrawalMeatDays} days</p>
              <p className="text-sm text-red-700 font-semibold">Clear date: {formatDate(record.withdrawalEndMeat)} ({record.meatDaysRemaining} days remaining)</p>
              <div className="mt-2 h-3 bg-red-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, record.withdrawalMeatDays ? ((record.withdrawalMeatDays - record.meatDaysRemaining) / record.withdrawalMeatDays) * 100 : 0)}%` }} />
              </div>
            </div>
          )}
          {record.milkActive && (
            <div>
              <p className="text-sm text-red-700">🥛 Milk withdrawal: {record.withdrawalMilkDays} days</p>
              <p className="text-sm text-red-700 font-semibold">Clear date: {formatDate(record.withdrawalEndMilk)} ({record.milkDaysRemaining} days remaining)</p>
              <div className="mt-2 h-3 bg-red-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, record.withdrawalMilkDays ? ((record.withdrawalMilkDays - record.milkDaysRemaining) / record.withdrawalMilkDays) * 100 : 0)}%` }} />
              </div>
            </div>
          )}
          <p className="text-xs text-red-600">⚠️ DO NOT send to slaughter or sell milk before these dates.</p>
        </div>
      )}

      {/* Animals */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">Animals Treated ({record.animals.length})</h2>
        <div className="space-y-2">
          {record.animals.map((a) => (
            <Link key={a.animal.id} href={`/livestock/${a.animal.id}`}
              className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 hover:bg-slate-100 transition min-h-[48px]">
              <span className="font-mono font-medium text-sm">{a.animal.earTag}</span>
              <span className="text-sm text-slate-500">{a.animal.breed} • {a.animal.sex}</span>
              <span className="text-xs text-slate-400 ml-auto">{a.animal.species}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Treatment Details */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">Treatment Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt className="text-slate-500">Dose</dt><dd className="font-medium">{record.dose || '—'}</dd></div>
          <div><dt className="text-slate-500">Route</dt><dd className="font-medium">{routeLabel(record.route)}</dd></div>
          <div><dt className="text-slate-500">Animal Weight</dt><dd className="font-medium">{record.animalWeight ? `${record.animalWeight} kg` : '—'}</dd></div>
          <div><dt className="text-slate-500">Batch Number</dt><dd className="font-medium">{record.batchNumber || '—'}</dd></div>
          <div><dt className="text-slate-500">Expiry</dt><dd className="font-medium">{record.expiryDate || '—'}</dd></div>
          <div><dt className="text-slate-500">Meat Withdrawal</dt><dd className="font-medium">{record.withdrawalMeatDays ? `${record.withdrawalMeatDays} days` : 'None'}</dd></div>
          <div><dt className="text-slate-500">Milk Withdrawal</dt><dd className="font-medium">{record.withdrawalMilkDays ? `${record.withdrawalMilkDays} days` : 'None'}</dd></div>
        </dl>
      </section>

      {/* Course */}
      {record.isCourse && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Course Treatment</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><dt className="text-slate-500">Total Doses</dt><dd className="font-medium">{record.courseDoses}</dd></div>
            <div><dt className="text-slate-500">Current Dose</dt><dd className="font-medium">{record.courseCurrentDose} of {record.courseDoses}</dd></div>
            <div><dt className="text-slate-500">Interval</dt><dd className="font-medium">{record.courseIntervalHours} hours</dd></div>
          </dl>
        </section>
      )}

      {/* Vet */}
      {record.vet && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Prescribing Vet</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><dt className="text-slate-500">Name</dt><dd className="font-medium">{record.vet.name}</dd></div>
            <div><dt className="text-slate-500">Practice</dt><dd className="font-medium">{record.vet.practice || '—'}</dd></div>
            {record.vet.phone && <div><dt className="text-slate-500">Phone</dt><dd className="font-medium">{record.vet.phone}</dd></div>}
            {record.vet.rcvsNumber && <div><dt className="text-slate-500">RCVS</dt><dd className="font-medium">{record.vet.rcvsNumber}</dd></div>}
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

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition min-h-[48px] disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : '🗑️ Delete Record'}
        </button>
      </div>
    </div>
  );
}
