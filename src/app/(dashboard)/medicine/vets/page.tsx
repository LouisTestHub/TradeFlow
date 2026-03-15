'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Vet {
  id: string;
  name: string;
  practice: string | null;
  phone: string | null;
  email: string | null;
  rcvsNumber: string | null;
  notes: string | null;
  medicineRecords: Array<{
    id: string;
    date: string;
    productName: string;
    reason: string | null;
  }>;
}

export default function VetsPage() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [practice, setPractice] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [rcvsNumber, setRcvsNumber] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fetchVets = async () => {
    try {
      const res = await fetch('/api/medicine/vets');
      const data = await res.json();
      setVets(data);
    } catch {
      console.error('Failed to fetch vets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/medicine/vets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, practice, phone, email, rcvsNumber, notes: formNotes }),
      });
      if (res.ok) {
        setName(''); setPractice(''); setPhone(''); setEmail(''); setRcvsNumber(''); setFormNotes('');
        setShowForm(false);
        fetchVets();
      }
    } catch {
      alert('Failed to save vet');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/medicine" className="text-sm text-slate-500 hover:text-primary mb-1 inline-block">← Medicine Records</Link>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Vet Contacts</h1>
          <p className="text-sm text-slate-500 mt-1">{vets.length} saved vets</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-primary/90 transition min-h-[48px]">
          {showForm ? 'Cancel' : '+ Add Vet'}
        </button>
      </div>

      {/* New Vet Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">New Vet Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="e.g. Sarah Williams"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Practice</label>
              <input type="text" value={practice} onChange={(e) => setPractice(e.target.value)}
                placeholder="e.g. Oakfield Veterinary Practice"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="01234 567890"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="vet@practice.co.uk"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">RCVS Number</label>
              <input type="text" value={rcvsNumber} onChange={(e) => setRcvsNumber(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm min-h-[48px]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2}
              placeholder="Any notes..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none" />
          </div>
          <button type="submit" disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 min-h-[48px] disabled:opacity-50">
            {saving ? 'Saving...' : '💾 Save Vet'}
          </button>
        </form>
      )}

      {/* Vet Cards */}
      <div className="space-y-4">
        {vets.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{v.name}</h3>
                {v.practice && <p className="text-sm text-slate-500">{v.practice}</p>}
              </div>
              <span className="text-2xl">🏥</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-4">
              {v.phone && (
                <a href={`tel:${v.phone}`} className="flex items-center gap-2 text-primary hover:underline min-h-[44px]">
                  📞 {v.phone}
                </a>
              )}
              {v.email && (
                <a href={`mailto:${v.email}`} className="flex items-center gap-2 text-primary hover:underline min-h-[44px]">
                  ✉️ {v.email}
                </a>
              )}
              {v.rcvsNumber && (
                <span className="flex items-center gap-2 text-slate-500 min-h-[44px]">
                  🏷️ RCVS: {v.rcvsNumber}
                </span>
              )}
            </div>

            {/* Recent treatments by this vet */}
            {v.medicineRecords.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Recent Treatments</h4>
                <div className="space-y-1">
                  {v.medicineRecords.map((r) => (
                    <Link key={r.id} href={`/medicine/${r.id}`}
                      className="flex items-center justify-between text-sm hover:bg-slate-50 rounded-lg px-2 py-1.5 min-h-[36px]">
                      <span className="text-slate-600">{r.productName}</span>
                      <span className="text-xs text-slate-400">{formatDate(r.date)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {vets.length === 0 && !showForm && (
        <div className="text-center py-16">
          <span className="text-5xl">🏥</span>
          <h3 className="mt-4 text-lg font-semibold text-slate-700">No vet contacts saved</h3>
          <p className="text-sm text-slate-500 mt-1">Add your vet contacts to link with treatments</p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 bg-primary text-white px-6 py-3 rounded-xl font-medium min-h-[48px]">
            Add First Vet
          </button>
        </div>
      )}
    </div>
  );
}
