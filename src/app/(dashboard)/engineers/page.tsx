'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Engineer {
  id: string;
  name: string;
  employeeNumber: string;
  mobile: string;
  status: string;
  gasSafe: string | null;
  niceic: string | null;
  cisTaxStatus: string;
  vehicle: string | null;
}

export default function EngineersPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const names = ['James Mitchell', 'Tom Harrison', 'Michael Davies', 'Chris Thompson', 'David Wilson', 
                    'Robert Brown', 'Paul Anderson', 'Mark Taylor', 'Steven Smith', 'Andrew Jones',
                    'Peter Williams', 'John Roberts', 'Simon Clarke', 'Matthew Evans', 'Daniel Martin',
                    'Gary White', 'Kevin Wright', 'Ryan Scott', 'Luke Green', 'Adam Baker'];
      const mockEngineers = names.map((name, i) => ({
        id: String(i + 1),
        name,
        employeeNumber: `ENG${String(i + 1).padStart(4, '0')}`,
        mobile: `07700 90${String(1000 + i).padStart(4, '0')}`,
        status: i < 18 ? 'active' : (i === 18 ? 'holiday' : 'sick'),
        gasSafe: i % 3 === 0 ? `GS${100000 + i}` : null,
        niceic: i % 2 === 0 ? `NIC${200000 + i}` : null,
        cisTaxStatus: ['gross', '20', '30'][i % 3],
        vehicle: i < 10 ? `VX${15 + i} ABC` : null
      }));
      setEngineers(mockEngineers);
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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Engineers</h1>
          <p className="text-slate-500 mt-1">{engineers.length} total engineers</p>
        </div>
        <Link href="/engineers/new" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          + Add Engineer
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Employee #</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Mobile</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Gas Safe</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">NICEIC</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">CIS</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Vehicle</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {engineers.map(eng => (
              <tr key={eng.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-mono text-blue-600">{eng.employeeNumber}</td>
                <td className="px-5 py-3 text-sm font-medium text-slate-700">{eng.name}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{eng.mobile}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{eng.gasSafe || '-'}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{eng.niceic || '-'}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{eng.cisTaxStatus === 'gross' ? 'Gross' : `${eng.cisTaxStatus}%`}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{eng.vehicle || '-'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    eng.status === 'active' ? 'bg-green-100 text-green-700' : 
                    eng.status === 'holiday' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {eng.status}
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
