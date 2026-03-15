'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  nozzleType: string | null;
  tankCapacity: number | null;
  calibrationDate: string | null;
  calibrationDueDate: string | null;
  calibrationStatus: 'ok' | 'due_soon' | 'overdue' | 'unknown';
  motExpiry: string | null;
  notes: string | null;
}

const EQUIPMENT_TYPES = ['sprayer', 'spreader', 'drill', 'knapsack', 'other'];

function CalibrationBadge({ status }: { status: string }) {
  switch (status) {
    case 'ok':
      return <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">🟢 OK</span>;
    case 'due_soon':
      return <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full">⚠️ Due soon</span>;
    case 'overdue':
      return <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-700 rounded-full">🔴 Overdue</span>;
    default:
      return <span className="text-xs font-medium px-2 py-1 bg-gray-50 text-gray-500 rounded-full">— N/A</span>;
  }
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('sprayer');
  const [formNozzle, setFormNozzle] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formCalDate, setFormCalDate] = useState('');
  const [formMotExpiry, setFormMotExpiry] = useState('');
  const [formNotes, setFormNotes] = useState('');

  async function loadEquipment() {
    try {
      const res = await fetch('/api/equipment');
      const data = await res.json();
      setEquipment(data.equipment || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEquipment();
  }, []);

  function resetForm() {
    setFormName('');
    setFormType('sprayer');
    setFormNozzle('');
    setFormCapacity('');
    setFormCalDate('');
    setFormMotExpiry('');
    setFormNotes('');
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(item: EquipmentItem) {
    setFormName(item.name);
    setFormType(item.type);
    setFormNozzle(item.nozzleType || '');
    setFormCapacity(item.tankCapacity ? String(item.tankCapacity) : '');
    setFormCalDate(item.calibrationDate ? new Date(item.calibrationDate).toISOString().split('T')[0] : '');
    setFormMotExpiry(item.motExpiry ? new Date(item.motExpiry).toISOString().split('T')[0] : '');
    setFormNotes(item.notes || '');
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!formName || !formType) return;
    setSaving(true);

    const body = {
      name: formName,
      type: formType,
      nozzleType: formNozzle || null,
      tankCapacity: formCapacity || null,
      calibrationDate: formCalDate || null,
      motExpiry: formMotExpiry || null,
      notes: formNotes || null,
    };

    try {
      const url = editingId ? `/api/equipment/${editingId}` : '/api/equipment';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        resetForm();
        await loadEquipment();
      }
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this equipment? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/equipment/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadEquipment();
      }
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/settings" className="text-sm text-primary hover:underline mb-1 inline-block">← Settings</Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Equipment Register
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track tools, testing equipment, and calibration dates for certification compliance
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors min-h-[48px]"
        >
          + Add Equipment
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 font-[var(--font-dm-sans)]">
            {editingId ? 'Edit Equipment' : 'Add Equipment'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Hardi Commander 4400"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Type *</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              >
                {EQUIPMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nozzle Type</label>
              <input
                type="text"
                value={formNozzle}
                onChange={(e) => setFormNozzle(e.target.value)}
                placeholder="e.g. 03-F110 Flat Fan"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {formType === 'spreader' ? 'Hopper Capacity (kg)' : 'Tank Capacity (L)'}
              </label>
              <input
                type="number"
                step="1"
                value={formCapacity}
                onChange={(e) => setFormCapacity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Last Calibration Date (NSTS)
              </label>
              <input
                type="date"
                value={formCalDate}
                onChange={(e) => setFormCalDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">MOT / Insurance Expiry</label>
              <input
                type="date"
                value={formMotExpiry}
                onChange={(e) => setFormMotExpiry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !formName}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors min-h-[48px] disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Equipment'}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 min-h-[48px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Equipment List */}
      <div className="space-y-3">
        {equipment.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-lg text-slate-400">No equipment registered yet</p>
          </div>
        ) : (
          equipment.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-slate-600 rounded-full capitalize">
                      {item.type}
                    </span>
                    <CalibrationBadge status={item.calibrationStatus} />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                    {item.tankCapacity && (
                      <span>{item.type === 'spreader' ? `${item.tankCapacity} kg` : `${item.tankCapacity} L`}</span>
                    )}
                    {item.nozzleType && <span>Nozzle: {item.nozzleType}</span>}
                    {item.calibrationDate && (
                      <span>
                        Calibrated: {new Date(item.calibrationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {item.calibrationDueDate && (
                      <span>
                        Due: {new Date(item.calibrationDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {item.notes && <p className="text-xs text-slate-400 mt-1">{item.notes}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl hover:bg-gray-50"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-red-300 hover:text-red-600 rounded-xl hover:bg-red-50"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-2">📋 Certification Requirement</h3>
        <p className="text-sm text-slate-600">
          All sprayers must have a valid NSTS (National Sprayer Testing Scheme) certificate.
          Calibration is required annually. Equipment with overdue calibration will be flagged on spray records.
        </p>
      </div>
    </div>
  );
}
