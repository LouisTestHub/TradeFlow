'use client';

import { useEffect, useState } from 'react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  total: number;
  status: string;
  cisDeduction: number | null;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockInvoices: Invoice[] = Array.from({ length: 35 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 30);
        const total = 200 + Math.random() * 3000;
        const hasCis = i % 4 === 0;
        const isPaid = i > 10;
        
        return {
          id: String(i + 1),
          invoiceNumber: `INV${String(i + 1).padStart(6, '0')}`,
          customer: ['Sarah Johnson', 'Thames Property', 'Emma Williams', 'ABC Ltd', 'Claire Davis'][i % 5],
          date: date.toISOString(),
          dueDate: dueDate.toISOString(),
          total,
          status: isPaid ? 'paid' : (new Date() > dueDate ? 'overdue' : 'unpaid'),
          cisDeduction: hasCis ? (total * 0.8 * 0.2) : null
        };
      });
      setInvoices(mockInvoices);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    unpaid: invoices.filter(i => i.status === 'unpaid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Invoices</h1>
          <p className="text-slate-500 mt-1">{invoices.length} total invoices</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          + New Invoice
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-green-600">Paid</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.paid}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <p className="text-xs text-yellow-600">Unpaid</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.unpaid}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-xs text-red-600">Overdue</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{stats.overdue}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Invoice #</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Due Date</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Total</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">CIS Deduction</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-mono text-blue-600">{invoice.invoiceNumber}</td>
                <td className="px-5 py-3 text-sm text-slate-700">{invoice.customer}</td>
                <td className="px-5 py-3 text-sm text-slate-600">
                  {new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3 text-sm text-slate-600">
                  {new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3 text-right text-sm font-medium text-slate-700">£{invoice.total.toFixed(2)}</td>
                <td className="px-5 py-3 text-right text-sm text-slate-600">
                  {invoice.cisDeduction ? `£${invoice.cisDeduction.toFixed(2)}` : '-'}
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
