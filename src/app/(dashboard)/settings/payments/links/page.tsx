'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PaymentLink {
  id: string;
  token: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  expiresAt: string;
  views: number;
  sharedVia: string[];
  paidAt: string | null;
}

function generateLinks(): PaymentLink[] {
  const customers = ['Sarah Johnson', 'Emma Williams', 'Thames Property', 'Claire Davis', 'Rachel Smith', 'Karen Anderson'];
  const statuses: PaymentLink['status'][] = ['active', 'active', 'completed', 'completed', 'completed', 'expired'];
  const channels = [['sms'], ['email'], ['sms', 'email'], ['whatsapp'], ['sms', 'whatsapp'], ['email']];

  return Array.from({ length: 20 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const created = new Date(Date.now() - i * 86400000 * 2);
    const expires = new Date(created.getTime() + 86400000 * 14);

    return {
      id: String(i + 1),
      token: `pay_${Math.random().toString(36).substr(2, 12)}`,
      invoiceNumber: `INV${String(i + 100).padStart(6, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      amount: Math.round((Math.random() * 2000 + 80) * 100) / 100,
      status,
      createdAt: created.toISOString(),
      expiresAt: expires.toISOString(),
      views: Math.floor(Math.random() * 5) + (status === 'completed' ? 1 : 0),
      sharedVia: channels[Math.floor(Math.random() * channels.length)],
      paidAt: status === 'completed' ? new Date(created.getTime() + 86400000 * (1 + Math.floor(Math.random() * 5))).toISOString() : null,
    };
  });
}

export default function PaymentLinksPage() {
  const [links] = useState(generateLinks);
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? links : links.filter(l => l.status === filter);

  const stats = {
    active: links.filter(l => l.status === 'active').length,
    completed: links.filter(l => l.status === 'completed').length,
    collected: links.filter(l => l.status === 'completed').reduce((s, l) => s + l.amount, 0),
    conversionRate: Math.round((links.filter(l => l.status === 'completed').length / Math.max(links.length, 1)) * 100),
  };

  const copyLink = (token: string, id: string) => {
    navigator.clipboard?.writeText(`https://tradeflow.app/pay/${token}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/payments" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Payment Links</h1>
          <p className="text-slate-500 mt-1">Generate shareable payment links for invoices</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[44px]"
        >
          + Generate Link
        </button>
      </div>

      {/* Create Link Form */}
      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Generate New Payment Link</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Invoice Number</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]">
                <option>Select invoice...</option>
                <option>INV000035 - Sarah Johnson - £450.00</option>
                <option>INV000036 - Thames Property - £1,250.00</option>
                <option>INV000037 - Claire Davis - £180.00</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Expiry</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]">
                <option>7 days</option>
                <option selected>14 days</option>
                <option>30 days</option>
                <option>Never</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Share Via</label>
            <div className="flex gap-3">
              {['📱 SMS', '📧 Email', '💬 WhatsApp'].map((ch) => (
                <label key={ch} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={ch.includes('SMS')} className="w-4 h-4 rounded border-gray-300 text-primary" />
                  <span className="text-sm text-slate-600">{ch}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 min-h-[48px]">Generate & Send</button>
            <button onClick={() => setShowCreate(false)} className="px-6 py-3 border border-gray-200 rounded-xl text-slate-600 min-h-[48px]">Cancel</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-600">Active Links</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.active}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs text-emerald-600">Collected</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">£{stats.collected.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.conversionRate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1">
        {['all', 'active', 'completed', 'expired'].map((f) => (
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

      {/* Links List */}
      <div className="space-y-3">
        {filtered.map((link) => (
          <div key={link.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                link.status === 'completed' ? 'bg-green-100' : link.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {link.status === 'completed' ? '✅' : link.status === 'active' ? '🔗' : '⏰'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-800">{link.invoiceNumber}</span>
                  <span className="text-sm text-slate-600">— {link.customer}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    link.status === 'completed' ? 'bg-green-100 text-green-700' :
                    link.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {link.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>£{link.amount.toFixed(2)}</span>
                  <span>Created: {new Date(link.createdAt).toLocaleDateString('en-GB')}</span>
                  <span>{link.views} views</span>
                  <span>Via: {link.sharedVia.join(', ')}</span>
                  {link.paidAt && <span className="text-green-600">Paid: {new Date(link.paidAt).toLocaleDateString('en-GB')}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <p className="text-lg font-bold text-slate-800">£{link.amount.toFixed(2)}</p>
                {link.status === 'active' && (
                  <button
                    onClick={() => copyLink(link.token, link.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 min-h-[36px]"
                  >
                    {copiedId === link.id ? '✓ Copied' : '📋 Copy Link'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
