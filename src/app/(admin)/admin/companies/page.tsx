'use client';

import { useState, useEffect, useCallback } from 'react';

interface CompanyRow {
  id: string;
  name: string;
  companyNumber: string | null;
  vatNumber: string | null;
  tradingName: string | null;
  gasSafeNumber: string | null;
  niceicNumber: string | null;
  createdAt: string;
  users: { id: string; name: string | null; role: string }[];
  engineerCount: number;
  customerCount: number;
  records: { jobs: number; invoices: number; certificates: number; cisRecords: number };
  dataHealth: { hasGasSafe: boolean; hasVat: boolean; hasEngineers: boolean; hasCustomers: boolean; score: number };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    try {
      const res = await fetch(`/api/admin/companies?${params}`);
      const data = await res.json();
      setCompanies(data.companies || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { /* empty */ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Management</h1>
          <p className="text-sm text-slate-500">{total} total companies</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, company number, or trading name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm min-h-[48px]"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-32" />
            </div>
          ))
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-slate-400">No companies found</div>
        ) : companies.map(company => (
          <div key={company.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{company.name}</h3>
                <p className="text-sm text-slate-500">
                  {company.tradingName && company.tradingName !== company.name ? `Trading as: ${company.tradingName} • ` : ''}
                  Co. No: {company.companyNumber || 'N/A'} • VAT: {company.vatNumber || 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-full ${company.dataHealth.score >= 75 ? 'bg-green-500' : company.dataHealth.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-xs text-slate-500">{company.dataHealth.score}% complete</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{company.engineerCount}</p>
                <p className="text-xs text-slate-500">Engineers</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{company.customerCount}</p>
                <p className="text-xs text-slate-500">Customers</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{company.records.jobs + company.records.invoices + company.records.certificates + company.records.cisRecords}</p>
                <p className="text-xs text-slate-500">Total Records</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-2">
                <p className="font-bold text-slate-800">{company.users.length}</p>
                <p className="text-xs text-slate-500">Users</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!company.dataHealth.hasGasSafe && <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">No Gas Safe</span>}
              {!company.dataHealth.hasVat && <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">No VAT Number</span>}
              {!company.dataHealth.hasEngineers && <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">No Engineers</span>}
              {!company.dataHealth.hasCustomers && <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">No Customers</span>}
              {company.dataHealth.score === 100 && <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">✅ Complete</span>}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 min-h-[48px] px-4">← Previous</button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 min-h-[48px] px-4">Next →</button>
        </div>
      )}
    </div>
  );
}
