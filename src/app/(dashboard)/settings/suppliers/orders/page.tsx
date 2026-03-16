'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  jobRef: string;
  jobTitle: string;
  items: Array<{ description: string; qty: number; unitPrice: number }>;
  subtotal: number;
  vat: number;
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'partially_delivered' | 'delivered' | 'cancelled';
  deliveryDate: string | null;
  notes: string;
}

function generateOrders(): PurchaseOrder[] {
  const suppliers = ['CEF', 'City Plumbing', 'Wolseley', 'Screwfix', 'Plumb Center'];
  const statuses: PurchaseOrder['status'][] = ['draft', 'sent', 'confirmed', 'partially_delivered', 'delivered', 'delivered', 'delivered'];
  const itemDescriptions = [
    '22mm copper pipe (3m)', '15mm compression elbow', 'Worcester Greenstar 30i', 'Megaflo Eco 170L',
    '2.5mm T&E cable (100m)', 'Consumer unit 18-way', 'LED downlight pack (10)', 'Flue liner kit 9m',
    'Thermostatic radiator valve', 'Central heating inhibitor', 'Gas isolating valve 22mm', 'Soldering flux & solder kit',
  ];

  return Array.from({ length: 25 }, (_, i) => {
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = Array.from({ length: itemCount }, () => {
      const desc = itemDescriptions[Math.floor(Math.random() * itemDescriptions.length)];
      const qty = Math.floor(Math.random() * 10) + 1;
      const unit = Math.random() * 80 + 5;
      return { description: desc, qty, unitPrice: Math.round(unit * 100) / 100 };
    });
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const vat = subtotal * 0.2;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: String(i + 1),
      poNumber: `PO-${String(3000 + i).padStart(6, '0')}`,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      jobRef: `JOB${String(100 + i).padStart(6, '0')}`,
      jobTitle: ['Boiler Install', 'Bathroom Refit', 'Rewire', 'Gas Service', 'Emergency Repair', 'Radiator Install'][i % 6],
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total: Math.round((subtotal + vat) * 100) / 100,
      status,
      deliveryDate: status === 'delivered' ? new Date(Date.now() - i * 86400000 * 2).toISOString() : null,
      notes: '',
    };
  });
}

export default function PurchaseOrdersPage() {
  const [orders] = useState(generateOrders);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    sent: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-indigo-100 text-indigo-700',
    partially_delivered: 'bg-amber-100 text-amber-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/suppliers" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Purchase Orders</h1>
          <p className="text-slate-500 mt-1">Track material orders linked to jobs</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[44px]">
          + New PO
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Total POs</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{orders.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-600">Open</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{orders.filter(o => ['draft', 'sent', 'confirmed'].includes(o.status)).length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-600">Partially Delivered</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{orders.filter(o => o.status === 'partially_delivered').length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Total Value</p>
          <p className="text-lg font-bold text-slate-800 mt-1">£{orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 overflow-x-auto">
        {['all', 'draft', 'sent', 'confirmed', 'partially_delivered', 'delivered'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-xl text-sm font-medium min-h-[40px] whitespace-nowrap ${
              filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">{order.poNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[order.status]}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{order.supplier} · {order.items.length} items · Job: {order.jobRef}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">£{order.total.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{new Date(order.date).toLocaleDateString('en-GB')}</p>
              </div>
              <span className="text-slate-400">{expandedId === order.id ? '▼' : '▶'}</span>
            </div>
            
            {expandedId === order.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50/30">
                <table className="w-full text-sm mb-3">
                  <thead>
                    <tr className="text-xs text-slate-500">
                      <th className="text-left pb-2">Item</th>
                      <th className="text-right pb-2">Qty</th>
                      <th className="text-right pb-2">Unit Price</th>
                      <th className="text-right pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2 text-slate-700">{item.description}</td>
                        <td className="py-2 text-right text-slate-600">{item.qty}</td>
                        <td className="py-2 text-right text-slate-600">£{item.unitPrice.toFixed(2)}</td>
                        <td className="py-2 text-right font-medium text-slate-800">£{(item.qty * item.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-2 text-right text-slate-500">Subtotal</td>
                      <td className="py-2 text-right font-medium">£{order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-1 text-right text-slate-500">VAT (20%)</td>
                      <td className="py-1 text-right">£{order.vat.toFixed(2)}</td>
                    </tr>
                    <tr className="font-semibold">
                      <td colSpan={3} className="py-2 text-right text-slate-800">Total</td>
                      <td className="py-2 text-right text-slate-800">£{order.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
                <p className="text-xs text-slate-500">Job: {order.jobRef} — {order.jobTitle}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
