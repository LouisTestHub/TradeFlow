'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface AnimalDetail {
  id: string;
  earTag: string;
  eidNumber: string | null;
  species: string;
  breed: string | null;
  sex: string | null;
  dob: string | null;
  status: string;
  groupId: string | null;
  groupName: string | null;
  passportNumber: string | null;
  purchaseDate: string | null;
  purchaseFrom: string | null;
  purchasePrice: number | null;
  notes: string | null;
  damId: string | null;
  sireId: string | null;
  deathDate: string | null;
  soldDate: string | null;
}

interface TimelineItem {
  date: string;
  type: string;
  icon: string;
  description: string;
}

const statusIcons: Record<string, string> = {
  alive: '🟢 Active',
  sold: '📤 Sold',
  dead: '☠️ Dead',
  moved: '🟡 Moved',
};

export default function AnimalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<{
    animal: AnimalDetail;
    dam: { id: string; earTag: string; breed: string | null } | null;
    sire: { id: string; earTag: string; breed: string | null } | null;
    offspring: Array<{ id: string; earTag: string; sex: string | null; dob: string | null; breed: string | null }>;
    timeline: TimelineItem[];
    movements: Array<Record<string, unknown>>;
    medicineRecords: Array<Record<string, unknown>>;
    breedingRecords: Array<Record<string, unknown>>;
    groups: Array<{ id: string; name: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/livestock/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  async function handleStatusChange(status: string) {
    if (!confirm(`Mark this animal as ${status}?`)) return;
    await fetch(`/api/livestock/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    window.location.reload();
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this animal record? This cannot be undone.')) return;
    await fetch(`/api/livestock/${params.id}`, { method: 'DELETE' });
    router.push('/livestock');
  }

  async function handleSaveDetails() {
    await fetch(`/api/livestock/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditing(false);
    window.location.reload();
  }

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>;
  }

  if (!data?.animal) {
    return <div className="text-center py-12 text-slate-500">Animal not found</div>;
  }

  const { animal, dam, sire, offspring, timeline, movements, medicineRecords, breedingRecords, groups } = data;
  const age = animal.dob ? `${Math.floor((Date.now() - new Date(animal.dob).getTime()) / (365.25 * 86400000))} years` : null;

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link href="/livestock" className="text-slate-400 hover:text-slate-600 text-sm min-h-[44px] flex items-center">← Livestock</Link>
      </div>

      {/* Animal summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">{animal.earTag}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
          {animal.eidNumber && <span>EID: <span className="font-mono">{animal.eidNumber}</span></span>}
          {animal.breed && <span>Breed: {animal.breed}</span>}
          <span>Sex: {animal.sex === 'male' ? 'Male' : animal.sex === 'female' ? 'Female' : '—'}</span>
          {animal.dob && <span>DOB: {new Date(animal.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
          {age && <span>Age: {age}</span>}
          <span>Status: {statusIcons[animal.status] || animal.status}</span>
          {animal.groupName && <span>Group: <span className="text-primary font-medium">{animal.groupName}</span></span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto bg-gray-100 rounded-xl p-1 -mx-1 px-1">
        {['timeline', 'movements', 'medicine', 'breeding', 'details'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-h-[40px] ${activeTab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {timeline.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-400 text-center">No timeline events</p>
          ) : (
            timeline.map((event, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <span className="text-lg flex-shrink-0 mt-0.5">{event.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{event.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="space-y-3">
          <Link href={`/livestock/movements/new?animals=${animal.id}`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium min-h-[44px]">
            + Log Movement
          </Link>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {movements.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No movements recorded</p>
            ) : (
              movements.map((m: any, i: number) => (
                <div key={i} className="px-5 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">
                      {m.movementType === 'on' ? '📍 ON' : m.movementType === 'off' ? '📍 OFF' : '📍 BETWEEN'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {m.fromCph} → {m.toCph}
                  </p>
                  <span className={`text-xs font-medium ${m.bcmsSubmitted ? 'text-green-600' : 'text-amber-600'}`}>
                    {m.bcmsSubmitted ? '✅ BCMS Submitted' : '⚠️ BCMS Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'medicine' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {medicineRecords.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No medicine records</p>
            ) : (
              medicineRecords.map((mr: any, i: number) => {
                const isWithdrawal = mr.withdrawalEndDate && new Date(mr.withdrawalEndDate) > new Date();
                return (
                  <div key={i} className="px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">💊 {mr.productName}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(mr.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {mr.dose && <p className="text-sm text-slate-600 mt-1">Dose: {mr.dose} ({mr.route})</p>}
                    {mr.reason && <p className="text-sm text-slate-500">{mr.reason}</p>}
                    {isWithdrawal && (
                      <p className="text-xs font-medium text-red-600 mt-1">
                        🔴 Withdrawal until {new Date(mr.withdrawalEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    {mr.withdrawalEndDate && !isWithdrawal && (
                      <p className="text-xs text-green-600 mt-1">✅ Withdrawal cleared</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'breeding' && (
        <div className="space-y-4">
          {/* Parentage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Parentage</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Dam:</span>{' '}
                {dam ? <Link href={`/livestock/${dam.id}`} className="text-primary font-medium">{dam.earTag}</Link> : 'Unknown'}
                {dam?.breed && <span className="text-slate-400 ml-1">({dam.breed})</span>}
              </div>
              <div>
                <span className="text-slate-500">Sire:</span>{' '}
                {sire ? <Link href={`/livestock/${sire.id}`} className="text-primary font-medium">{sire.earTag}</Link> : 'Unknown'}
                {sire?.breed && <span className="text-slate-400 ml-1">({sire.breed})</span>}
              </div>
            </div>
          </div>

          {/* Offspring */}
          {offspring.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Offspring ({offspring.length})</h3>
              <div className="space-y-2">
                {offspring.map((o) => (
                  <Link key={o.id} href={`/livestock/${o.id}`} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 min-h-[44px]">
                    <span className="text-sm font-medium text-primary">{o.earTag}</span>
                    <span className="text-xs text-slate-500">
                      {o.sex === 'male' ? 'M' : 'F'} • {o.breed} • {o.dob ? new Date(o.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Breeding records */}
          {breedingRecords.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              <div className="px-5 py-3">
                <h3 className="text-sm font-bold text-slate-700">Breeding History</h3>
              </div>
              {breedingRecords.map((br: any, i: number) => (
                <div key={i} className="px-5 py-3.5">
                  {br.serviceDate && (
                    <p className="text-sm text-slate-700">
                      🔗 Served {new Date(br.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' — '}{br.method === 'ai' ? 'AI' : 'Natural'}
                      {br.sireName && ` (${br.sireName})`}
                    </p>
                  )}
                  {br.expectedCalving && !br.calvingDate && (
                    <p className="text-sm text-amber-600 mt-1">📅 Due: {new Date(br.expectedCalving).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  )}
                  {br.calvingDate && (
                    <p className="text-sm text-green-700 mt-1">
                      🐣 Calved {new Date(br.calvingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {br.calfSex && ` — ${br.calfSex}`}
                      {br.calfWeight && ` (${br.calfWeight}kg)`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <Link href="/livestock/breeding" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium min-h-[44px]">
            + Log Service/Calving
          </Link>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            {!editing ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700">Details</h3>
                  <button onClick={() => { setEditing(true); setEditForm({ earTag: animal.earTag, eidNumber: animal.eidNumber || '', breed: animal.breed || '', sex: animal.sex || '', dob: animal.dob ? new Date(animal.dob).toISOString().split('T')[0] : '', notes: animal.notes || '', groupId: animal.groupId || '', passportNumber: animal.passportNumber || '', purchaseFrom: animal.purchaseFrom || '', purchasePrice: animal.purchasePrice?.toString() || '' }); }} className="text-sm text-primary font-medium min-h-[44px]">
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div><span className="text-slate-500">Ear Tag:</span> <span className="text-slate-800 font-medium">{animal.earTag}</span></div>
                  <div><span className="text-slate-500">EID:</span> <span className="text-slate-800 font-mono">{animal.eidNumber || '—'}</span></div>
                  <div><span className="text-slate-500">Breed:</span> <span className="text-slate-800">{animal.breed || '—'}</span></div>
                  <div><span className="text-slate-500">Sex:</span> <span className="text-slate-800">{animal.sex || '—'}</span></div>
                  <div><span className="text-slate-500">DOB:</span> <span className="text-slate-800">{animal.dob ? new Date(animal.dob).toLocaleDateString('en-GB') : '—'}</span></div>
                  <div><span className="text-slate-500">Group:</span> <span className="text-slate-800">{animal.groupName || '—'}</span></div>
                  {animal.species === 'cattle' && <div><span className="text-slate-500">Passport:</span> <span className="text-slate-800">{animal.passportNumber || '—'}</span></div>}
                  <div><span className="text-slate-500">Purchase from:</span> <span className="text-slate-800">{animal.purchaseFrom || '—'}</span></div>
                  <div><span className="text-slate-500">Purchase price:</span> <span className="text-slate-800">{animal.purchasePrice ? `£${animal.purchasePrice}` : '—'}</span></div>
                  {animal.notes && <div className="sm:col-span-2"><span className="text-slate-500">Notes:</span> <span className="text-slate-800">{animal.notes}</span></div>}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700">Edit Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'earTag', label: 'Ear Tag', type: 'text' },
                    { key: 'eidNumber', label: 'EID Number', type: 'text' },
                    { key: 'breed', label: 'Breed', type: 'text' },
                    { key: 'sex', label: 'Sex', type: 'select', options: ['male', 'female'] },
                    { key: 'dob', label: 'Date of Birth', type: 'date' },
                    { key: 'passportNumber', label: 'Passport Number', type: 'text' },
                    { key: 'purchaseFrom', label: 'Purchase From', type: 'text' },
                    { key: 'purchasePrice', label: 'Purchase Price (£)', type: 'number' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-slate-500 mb-1">{field.label}</label>
                      {field.type === 'select' ? (
                        <select value={editForm[field.key] || ''} onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]">
                          <option value="">—</option>
                          {field.options?.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} value={editForm[field.key] || ''} onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]" />
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Group</label>
                    <select value={editForm.groupId || ''} onChange={(e) => setEditForm({ ...editForm, groupId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]">
                      <option value="">No group</option>
                      {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Notes</label>
                    <textarea value={editForm.notes || ''} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[80px]" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveDetails} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium min-h-[44px]">Save Changes</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium min-h-[44px]">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {animal.status === 'alive' && (
              <>
                <button onClick={() => handleStatusChange('sold')} className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium min-h-[48px]">📤 Mark as Sold</button>
                <button onClick={() => handleStatusChange('dead')} className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium min-h-[48px]">☠️ Mark as Dead</button>
              </>
            )}
            <button onClick={handleDelete} className="px-4 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 min-h-[48px]">🗑️ Delete Record</button>
          </div>
        </div>
      )}
    </div>
  );
}
