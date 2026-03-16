'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  type: string;
  direction: string;
  records: number;
  status: 'success' | 'partial' | 'failed';
  message: string;
  duration: string;
  triggeredBy: string;
}

function generateHistory(): SyncHistoryEntry[] {
  const types = ['Invoices', 'Contacts', 'Payments', 'Tax Rates', 'Chart of Accounts'];
  const directions = ['TradeFlow → Xero', 'Xero → TradeFlow', 'Both'];
  const statuses: Array<'success' | 'partial' | 'failed'> = ['success', 'success', 'success', 'success', 'partial', 'failed'];
  const triggers = ['Auto-sync', 'Manual', 'Scheduled', 'Webhook'];
  const messages: Record<string, string[]> = {
    success: ['All records synced successfully', 'Sync completed without errors', 'Records reconciled'],
    partial: ['Some records require attention', 'Duplicate contacts skipped', 'Unmatched payments found'],
    failed: ['API rate limit exceeded', 'Authentication expired', 'Network timeout'],
  };

  return Array.from({ length: 50 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: String(i + 1),
      timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * (2 + Math.random() * 4)).toISOString(),
      type,
      direction: directions[Math.floor(Math.random() * directions.length)],
      records: Math.floor(Math.random() * 50) + 1,
      status,
      message: messages[status][Math.floor(Math.random() * messages[status].length)],
      duration: `${(Math.random() * 5 + 0.5).toFixed(1)}s`,
      triggeredBy: triggers[Math.floor(Math.random() * triggers.length)],
    };
  });
}

export default function XeroHistoryPage() {
  const [history] = useState(generateHistory);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [retrying, setRetrying] = useState<string | null>(null);

  const filtered = history.filter((h) => {
    if (statusFilter !== 'all' && h.status !== statusFilter) return false;
    if (typeFilter !== 'all' && h.type !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: history.length,
    success: history.filter(h => h.status === 'success').length,
    partial: history.filter(h => h.status === 'partial').length,
    failed: history.filter(h => h.status === 'failed').length,
  };

  const handleRetry = (id: string) => {
    setRetrying(id);
    setTimeout(() => setRetrying(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/integrations/xero" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Sync History</h1>
          <p className="text-slate-500 mt-1">Full audit trail of all Xero sync operations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Total Syncs</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-green-600">Successful</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.success}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-600">Partial</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{stats.partial}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-xs text-red-600">Failed</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{stats.failed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm min-h-[44px]"
        >
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="partial">Partial</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm min-h-[44px]"
        >
          <option value="all">All Types</option>
          <option value="Invoices">Invoices</option>
          <option value="Contacts">Contacts</option>
          <option value="Payments">Payments</option>
          <option value="Tax Rates">Tax Rates</option>
          <option value="Chart of Accounts">Chart of Accounts</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Time</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Direction</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Records</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Duration</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Trigger</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Message</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{entry.type}</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{entry.direction}</td>
                  <td className="py-3 px-4 text-slate-600">{entry.records}</td>
                  <td className="py-3 px-4 text-slate-500">{entry.duration}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{entry.triggeredBy}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      entry.status === 'success' ? 'bg-green-100 text-green-700' :
                      entry.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-[180px] truncate">{entry.message}</td>
                  <td className="py-3 px-4">
                    {(entry.status === 'failed' || entry.status === 'partial') && (
                      <button
                        onClick={() => handleRetry(entry.id)}
                        disabled={retrying === entry.id}
                        className="text-xs text-primary hover:underline disabled:opacity-50"
                      >
                        {retrying === entry.id ? '⏳' : '🔄 Retry'}
                      </button>
                    )}
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
