'use client';

import Link from 'next/link';

const reportTypes = [
  { id: 'revenue', name: 'Revenue Report', icon: '💰', description: 'Monthly and annual revenue breakdown' },
  { id: 'jobs', name: 'Jobs Report', icon: '📋', description: 'Job completion rates and statistics' },
  { id: 'engineers', name: 'Engineer Performance', icon: '👷', description: 'Engineer productivity and utilization' },
  { id: 'certificates', name: 'Certificates Report', icon: '📜', description: 'Certificate issuance and expiry tracking' },
  { id: 'cis', name: 'CIS Tax Report', icon: '💷', description: 'CIS deductions and submissions' },
  { id: 'invoices', name: 'Invoice Aging', icon: '📊', description: 'Outstanding invoices and payment status' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Reports</h1>
        <p className="text-slate-500 mt-1">Business intelligence and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-4xl w-16 h-16 flex items-center justify-center bg-gray-50 rounded-xl flex-shrink-0">
              {report.icon}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-slate-800">{report.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{report.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
