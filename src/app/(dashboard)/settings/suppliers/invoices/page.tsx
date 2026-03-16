'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SupplierInvoice {
  id: string;
  supplier: string;
  invoiceNumber: string;
  date: string;
  total: number;
  vat: number;
  netTotal: number;
  poRef: string | null;
  matchStatus: 'matched' | 'partial' | 'unmatched' | 'approved';
  matchConfidence: number;
  jobRef: string | null;
  items: number;
}

function generateInvoices(): SupplierInvoice[] {
  const suppliers = ['CEF', 'City Plumbing', 'Wolseley', 'Screwfix', 'Plumb Center'];
  const statuses: Array<'matched' | 'partial' | 'unmatched' | 'approved'> = ['matched', 'matched', 'approved', 'partial', 'unmatched'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const net = Math.random() * 600 + 30;
    const vat = net * 0.2;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: String(i + 1),
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      invoiceNumber: `SI-${String(9000 + i).padStart(6, '0')}`,
      date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
      total: net + vat,
      vat,
      netTotal: net,
      poRef: Math.random() > 0.3 ? `PO-${String(3000 + i).padStart(6, '0')}` : null,
      matchStatus: status,
      matchConfidence: status === 'matched' ? 100 : status === 'partial' ? 75 : status === 'approved' ? 100 : 0,
      jobRef: Math.random() > 0.3 ? `JOB${String(100 + Math.floor(Math.random() * 50)).padStart(6, '0')}` : null,
      items: Math.floor(Math.random() * 8) + 1,
    };
  });
}

export default function SupplierInvoicesPage() {
  const [invoices] = useState(generateInvoices);
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.matchStatus === filter);
  
  const stats = {
    total: invoices.length,
    matched: invoices.filter(i => i.matchStatus === 'matched').length,
    approved: invoices.filter(i => i.matchStatus === 'approved').length,
    unmatched: invoices.filter(i => i.matchStatus === 'unmatched').length,
    totalValue: invoices.reduce((sum, i) => sum + i.total, 0),
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(i => i.id)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/suppliers" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Supplier Invoices</h1>
          <p className="text-slate-500 mt-1">Import, match, and approve supplier invoices</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[44px]">
          📤 Import Invoices
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-green-600">Matched</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.matched}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-600">Approved</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-600">Unmatched</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{stats.unmatched}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Total Value</p>
          <p className="text-lg font-bold text-slate-800 mt-1">£{stats.totalValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Filter & Bulk Actions */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1">
          {['all', 'matched', 'approved', 'unmatched', 'partial'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium min-h-[40px] ${
                filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <div className="flex gap-2 ml-auto">
            <button className="px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium min-h-[40px]">
              ✓ Approve ({selected.size})
            </button>
            <button className="px-3 py-2 bg-white text-slate-600 border border-gray-200 rounded-xl text-sm min-h-[40px]">
              🔗 Match to PO
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-3 px-4 w-8">
                  <input type="checkbox" onChange={selectAll} checked={selected.size === filtered.length && filtered.length > 0} className="w-4 h-4 rounded border-gray-300" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Invoice</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Supplier</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">PO Ref</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Job</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Net</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">VAT</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Total</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <input type="checkbox" checked={selected.has(inv.id)} onChange={() => toggleSelect(inv.id)} className="w-4 h-4 rounded border-gray-300" />
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-600">{inv.supplier}</td>
                  <td className="py-3 px-4 text-slate-600">{new Date(inv.date).toLocaleDateString('en-GB')}</td>
                  <td className="py-3 px-4 text-slate-600">{inv.poRef || '—'}</td>
                  <td className="py-3 px-4 text-primary">{inv.jobRef || '—'}</td>
                  <td className="py-3 px-4 text-slate-600">£{inv.netTotal.toFixed(2)}</td>
                  <td className="py-3 px-4 text-slate-500">£{inv.vat.toFixed(2)}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">£{inv.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      inv.matchStatus === 'matched' ? 'bg-green-100 text-green-700' :
                      inv.matchStatus === 'approved' ? 'bg-blue-100 text-blue-700' :
                      inv.matchStatus === 'partial' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {inv.matchStatus === 'matched' ? '✓ Matched' : inv.matchStatus === 'approved' ? '✓ Approved' : inv.matchStatus === 'partial' ? '~ Partial' : '✗ Unmatched'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
