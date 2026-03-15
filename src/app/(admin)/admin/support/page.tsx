'use client';

import { useState, useEffect, useCallback } from 'react';

interface Ticket {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  message: string;
  source: string | null;
  createdAt: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ticket | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/support?page=${page}`);
      const data = await res.json();
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { /* empty */ }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
        <p className="text-sm text-slate-500">{total} total submissions</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ))
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-slate-400">No support tickets yet</div>
        ) : tickets.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(selected?.id === t.id ? null : t)}
            className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-primary/30 transition-all min-h-[48px]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-slate-800">{t.name}</p>
                  {t.companyName && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t.companyName}</span>}
                </div>
                <p className="text-sm text-slate-600 truncate">{t.message}</p>
              </div>
              <span className="text-xs text-slate-400 ml-3 whitespace-nowrap">{new Date(t.createdAt).toLocaleDateString('en-GB')}</span>
            </div>

            {selected?.id === t.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <p><span className="text-slate-500">Email:</span> <span className="font-medium">{t.email}</span></p>
                {t.phone && <p><span className="text-slate-500">Phone:</span> <span className="font-medium">{t.phone}</span></p>}
                <p className="text-slate-700 whitespace-pre-wrap">{t.message}</p>
                {t.source && <p className="text-xs text-slate-400">Source: {t.source}</p>}
              </div>
            )}
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-slate-500 disabled:opacity-30 min-h-[48px] px-4">← Previous</button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-slate-500 disabled:opacity-30 min-h-[48px] px-4">Next →</button>
        </div>
      )}
    </div>
  );
}
