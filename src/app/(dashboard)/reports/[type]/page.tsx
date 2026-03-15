'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';

const reportMeta: Record<string, { title: string; icon: string; csvAvailable: boolean }> = {
  'compliance-pack': { title: 'Compliance Audit Pack', icon: '📋', csvAvailable: false },
  'engineer-certs': { title: 'Engineer Certifications', icon: '👷', csvAvailable: true },
  'job-summary': { title: 'Job Summary Report', icon: '📊', csvAvailable: true },
  'financial': { title: 'Financial Report', icon: '💰', csvAvailable: true },
  'cis-summary': { title: 'CIS Tax Summary', icon: '💷', csvAvailable: true },
  'customer-activity': { title: 'Customer Activity', icon: '👥', csvAvailable: true },
  'fleet-maintenance': { title: 'Fleet Maintenance Report', icon: '🚐', csvAvailable: true },
  'certificates-expiry': { title: 'Certificate Expiry Report', icon: '📜', csvAvailable: true },
};

export default function ReportViewPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const meta = reportMeta[type] || { title: 'Report', icon: '📄', csvAvailable: false };
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const getDateParams = useCallback(() => {
    const now = new Date();
    let from: string, to: string;
    switch (dateRange) {
      case 'week':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
        break;
      case 'month':
        from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        from = new Date(now.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
        break;
      case 'year':
        from = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
        break;
      case 'custom':
        from = customFrom || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        to = customTo || now.toISOString().split('T')[0];
        break;
      default:
        from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
    }
    return `from=${from}&to=${to}`;
  }, [dateRange, customFrom, customTo]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${type}?${getDateParams()}`);
      const json = await res.json();
      setData(json);
    } catch { setData(null); }
    setLoading(false);
  }, [type, getDateParams]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const downloadCsv = () => {
    window.open(`/api/reports/${type}/csv?${getDateParams()}`, '_blank');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/reports" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <span className="text-3xl">{meta.icon}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{meta.title}</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]"
                />
              </div>
            </>
          )}

          <button
            onClick={fetchReport}
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium min-h-[48px]"
          >
            Generate
          </button>

          {meta.csvAvailable && (
            <button
              onClick={downloadCsv}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium min-h-[48px]"
            >
              📥 CSV
            </button>
          )}

          <button
            onClick={printReport}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium min-h-[48px]"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <div className="prose max-w-none">
            {type === 'compliance-pack' && <CompliancePackReport data={data} />}
            {type === 'engineer-certs' && <EngineerCertsReport data={data} />}
            {type === 'job-summary' && <JobSummaryReport data={data} />}
            {type === 'financial' && <FinancialReport data={data} />}
            {type === 'cis-summary' && <CisSummaryReport data={data} />}
            {type === 'customer-activity' && <CustomerActivityReport data={data} />}
            {type === 'fleet-maintenance' && <FleetMaintenanceReport data={data} />}
            {type === 'certificates-expiry' && <CertificatesExpiryReport data={data} />}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No data available for this report
          </div>
        )}
      </div>
    </div>
  );
}

function CompliancePackReport({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Compliance Audit Pack</h2>
      <p className="text-sm text-slate-500">Comprehensive compliance documentation for regulatory audits.</p>
      
      <div className="space-y-4">
        <Section title="Gas Safe Certificates">
          <p className="text-sm text-slate-600">CP12 certificates issued: {(data.gasSafeCerts as number) || 0}</p>
        </Section>
        
        <Section title="Electrical Certificates">
          <p className="text-sm text-slate-600">EICR certificates issued: {(data.electricalCerts as number) || 0}</p>
        </Section>
        
        <Section title="CIS Tax Records">
          <p className="text-sm text-slate-600">Tax submissions: {(data.cisRecords as number) || 0}</p>
        </Section>
      </div>
    </div>
  );
}

function EngineerCertsReport({ data }: { data: Record<string, unknown> }) {
  const engineers = (data.engineers as any[]) || [];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Engineer Certifications</h2>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-2">Engineer</th>
            <th className="pb-2">Gas Safe</th>
            <th className="pb-2">NICEIC</th>
            <th className="pb-2">F-Gas</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {engineers.map((e, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{e.name}</td>
              <td>{e.gasSafe || '—'}</td>
              <td>{e.niceic || '—'}</td>
              <td>{e.fgas || '—'}</td>
              <td><span className={`px-2 py-0.5 rounded text-xs ${e.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JobSummaryReport({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Job Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Jobs" value={(data.totalJobs as number) || 0} />
        <Stat label="Completed" value={(data.completed as number) || 0} />
        <Stat label="In Progress" value={(data.inProgress as number) || 0} />
        <Stat label="Scheduled" value={(data.scheduled as number) || 0} />
      </div>
    </div>
  );
}

function FinancialReport({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Financial Report</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Revenue" value={`£${((data.revenue as number) || 0).toLocaleString()}`} />
        <Stat label="Invoiced" value={`£${((data.invoiced as number) || 0).toLocaleString()}`} />
        <Stat label="Paid" value={`£${((data.paid as number) || 0).toLocaleString()}`} />
        <Stat label="Outstanding" value={`£${((data.outstanding as number) || 0).toLocaleString()}`} />
      </div>
    </div>
  );
}

function CisSummaryReport({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">CIS Tax Summary</h2>
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Gross Payment" value={`£${((data.gross as number) || 0).toLocaleString()}`} />
        <Stat label="CIS Deduction" value={`£${((data.deduction as number) || 0).toLocaleString()}`} />
        <Stat label="Net Payment" value={`£${((data.net as number) || 0).toLocaleString()}`} />
      </div>
    </div>
  );
}

function CustomerActivityReport({ data }: { data: Record<string, unknown> }) {
  const customers = (data.customers as any[]) || [];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Customer Activity</h2>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-2">Customer</th>
            <th className="pb-2 text-right">Jobs</th>
            <th className="pb-2 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{c.name}</td>
              <td className="text-right">{c.jobCount}</td>
              <td className="text-right">£{c.revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FleetMaintenanceReport({ data }: { data: Record<string, unknown> }) {
  const vehicles = (data.vehicles as any[]) || [];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Fleet Maintenance</h2>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-2">Vehicle</th>
            <th className="pb-2">MOT Expiry</th>
            <th className="pb-2">Service Due</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{v.registration}</td>
              <td>{v.motExpiry}</td>
              <td>{v.serviceDue}</td>
              <td><span className={`px-2 py-0.5 rounded text-xs ${v.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{v.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CertificatesExpiryReport({ data }: { data: Record<string, unknown> }) {
  const certs = (data.certificates as any[]) || [];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Certificate Expiry Report</h2>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-2">Certificate</th>
            <th className="pb-2">Customer</th>
            <th className="pb-2">Expiry Date</th>
            <th className="pb-2">Days Until Expiry</th>
          </tr>
        </thead>
        <tbody>
          {certs.map((c, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{c.type}</td>
              <td>{c.customer}</td>
              <td>{c.expiryDate}</td>
              <td>{c.daysUntilExpiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-primary pl-4">
      <h3 className="font-semibold text-slate-700 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
