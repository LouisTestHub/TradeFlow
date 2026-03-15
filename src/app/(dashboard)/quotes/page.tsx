'use client';

import { useEffect, useState } from 'react';

interface Quote {
  id: string;
  quoteNumber: string;
  customer: string;
  title: string;
  validUntil: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockQuotes: Quote[] = Array.from({ length: 30 }, (_, i) => {
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 60));
        const validUntil = new Date(createdAt);
        validUntil.setDate(validUntil.getDate() + 30);
        const statuses = ['pending', 'sent', 'accepted', 'rejected', 'expired'];
        
        return {
          id: String(i + 1),
          quoteNumber: `QT${String(1000 + i).padStart(6, '0')}`,
          customer: ['Sarah Johnson', 'Thames Property', 'Emma Williams', 'ABC Ltd', 'Claire Davis', 'London Lettings'][i % 6],
          title: ['Boiler installation', 'Full rewire', 'Bathroom suite replacement', 'Kitchen plumbing', 'HVAC system'][i % 5],
          validUntil: validUntil.toISOString(),
          total: 500 + Math.random() * 5000,
          status: statuses[i % statuses.length],
          createdAt: createdAt.toISOString()
        };
      });
      setQuotes(mockQuotes);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Quotes</h1>
          <p className="text-slate-500 mt-1">{quotes.length} total quotes</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          + New Quote
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Quote #</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Title</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Created</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Valid Until</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Total</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {quotes.map(quote => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-mono text-blue-600">{quote.quoteNumber}</td>
                <td className="px-5 py-3 text-sm text-slate-700">{quote.customer}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{quote.title}</td>
                <td className="px-5 py-3 text-sm text-slate-600">
                  {new Date(quote.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </td>
                <td className="px-5 py-3 text-sm text-slate-600">
                  {new Date(quote.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3 text-right text-sm font-medium text-slate-700">£{quote.total.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    quote.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    quote.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    quote.status === 'expired' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {quote.status}
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
