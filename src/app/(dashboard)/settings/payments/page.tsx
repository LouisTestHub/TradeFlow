'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PaymentEntry {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  reference: string;
}

function generatePayments(): PaymentEntry[] {
  const customers = ['Sarah Johnson', 'Emma Williams', 'Thames Property', 'Claire Davis', 'Rachel Smith', 'Karen Anderson', 'ABC Facilities', 'Premier Property Services'];
  const methods = ['Card', 'Bank Transfer', 'Cash', 'Payment Link', 'Card', 'Bank Transfer'];
  const statuses: PaymentEntry['status'][] = ['completed', 'completed', 'completed', 'completed', 'pending', 'pending', 'failed', 'refunded'];

  return Array.from({ length: 40 }, (_, i) => ({
    id: String(i + 1),
    invoiceNumber: `INV${String(i + 1).padStart(6, '0')}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    amount: Math.round((Math.random() * 2500 + 80) * 100) / 100,
    method: methods[Math.floor(Math.random() * methods.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - i * 86400000 * (0.5 + Math.random())).toISOString(),
    reference: `PAY-${String(5000 + i).padStart(6, '0')}`,
  }));
}

export default function PaymentsPage() {
  const [payments] = useState(generatePayments);
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const periodPayments = payments.filter(p => {
    const d = new Date(p.date);
    if (period === 'today') return d >= todayStart;
    if (period === 'week') return d >= weekStart;
    return d >= monthStart;
  });

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  const completed = periodPayments.filter(p => p.status === 'completed');
  const pending = payments.filter(p => p.status === 'pending');
  const failed = payments.filter(p => p.status === 'failed');

  const collectedAmount = completed.reduce((s, p) => s + p.amount, 0);
  const pendingAmount = pending.reduce((s, p) => s + p.amount, 0);

  const methodBreakdown = completed.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  // Monthly chart data
  const monthlyData = [8450, 12300, 9800, 15200, 11600, 13400, 10900, 14700, 12800, 16500, 13200, collectedAmount || 11800];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Payments</h1>
          <p className="text-slate-500 mt-1">Track payments, generate payment links, manage billing</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {[
          { href: '/settings/payments/settings', label: 'Payment Settings', icon: '⚙️', desc: 'Stripe, methods, terms' },
          { href: '/settings/payments/links', label: 'Payment Links', icon: '🔗', desc: 'Generate & track links' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[48px] whitespace-nowrap flex-shrink-0"
          >
            <span className="text-lg">{link.icon}</span>
            <div>
              <span className="text-sm font-medium text-slate-700 block">{link.label}</span>
              <span className="text-[11px] text-slate-400">{link.desc}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Period Selector */}
      <div className="flex gap-1">
        {(['today', 'week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium min-h-[40px] ${
              period === p ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-green-600">Collected ({period})</p>
          <p className="text-2xl font-bold text-green-700 mt-1">£{collectedAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-green-600 mt-1">{completed.length} payments</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-600">Pending</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">£{pendingAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-amber-600 mt-1">{pending.length} invoices</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-xs text-red-600">Failed</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{failed.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Avg. Payment</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">£{completed.length > 0 ? (collectedAmount / completed.length).toFixed(0) : '0'}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Monthly Collections</h3>
        <div className="flex items-end gap-2 h-40">
          {monthlyData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-lg transition-colors ${i === 11 ? 'bg-primary/40' : 'bg-primary/20 hover:bg-primary/30'}`}
                style={{ height: `${(val / Math.max(...monthlyData)) * 120}px` }}
              />
              <span className="text-[10px] text-slate-400">
                {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Method Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Payment Method Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(methodBreakdown).sort((a, b) => b[1] - a[1]).map(([method, amount]) => {
            const pct = collectedAmount > 0 ? (amount / collectedAmount) * 100 : 0;
            return (
              <div key={method} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-32 shrink-0">{method}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-800 w-24 text-right">£{amount.toFixed(0)}</span>
                <span className="text-xs text-slate-400 w-12 text-right">{pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Table */}
      <div className="flex gap-1 overflow-x-auto">
        {['all', 'completed', 'pending', 'failed', 'refunded'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-xl text-sm font-medium min-h-[40px] whitespace-nowrap ${
              filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Reference</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Invoice</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Method</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-slate-700">{payment.reference}</td>
                  <td className="py-3 px-4 text-primary">{payment.invoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-600">{payment.customer}</td>
                  <td className="py-3 px-4 text-slate-600">{new Date(payment.date).toLocaleDateString('en-GB')}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{payment.method}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">£{payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {payment.status}
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
