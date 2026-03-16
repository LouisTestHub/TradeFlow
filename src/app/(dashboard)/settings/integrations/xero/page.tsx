'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SyncLogEntry {
  id: string;
  timestamp: string;
  type: string;
  direction: string;
  records: number;
  status: 'success' | 'partial' | 'failed';
  message: string;
}

const mockSyncLog: SyncLogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'Invoices', direction: 'TradeFlow → Xero', records: 12, status: 'success', message: '12 invoices synced successfully' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), type: 'Contacts', direction: 'TradeFlow → Xero', records: 3, status: 'success', message: '3 new contacts created in Xero' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), type: 'Payments', direction: 'Xero → TradeFlow', records: 8, status: 'partial', message: '6 of 8 payments matched. 2 unmatched.' },
  { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'Invoices', direction: 'TradeFlow → Xero', records: 5, status: 'failed', message: 'API rate limit exceeded. Retry scheduled.' },
  { id: '5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), type: 'Contacts', direction: 'Both', records: 14, status: 'success', message: '14 contacts reconciled' },
];

const accountMappings = {
  invoiceTypes: [
    { tradeflow: 'Standard Invoice', xeroAccount: '200 - Sales', xeroCode: '200' },
    { tradeflow: 'Emergency Callout', xeroAccount: '201 - Emergency Revenue', xeroCode: '201' },
    { tradeflow: 'Service Contract', xeroAccount: '202 - Contract Revenue', xeroCode: '202' },
    { tradeflow: 'Materials Only', xeroAccount: '203 - Materials Revenue', xeroCode: '203' },
  ],
  paymentMethods: [
    { tradeflow: 'Bank Transfer', xeroBankAccount: 'Business Current Account', xeroCode: 'BANK-001' },
    { tradeflow: 'Card Payment', xeroBankAccount: 'Stripe Clearing', xeroCode: 'STRIPE-001' },
    { tradeflow: 'Cash', xeroBankAccount: 'Cash / Petty Cash', xeroCode: 'CASH-001' },
    { tradeflow: 'Cheque', xeroBankAccount: 'Business Current Account', xeroCode: 'BANK-001' },
  ],
  taxRates: [
    { tradeflow: 'Standard Rate (20%)', xeroRate: 'OUTPUT2 - 20%', xeroCode: 'OUTPUT2' },
    { tradeflow: 'Reduced Rate (5%)', xeroRate: 'RROUTPUT - 5%', xeroCode: 'RROUTPUT' },
    { tradeflow: 'Zero Rated (0%)', xeroRate: 'ZERORATEDOUTPUT', xeroCode: 'ZERORATEDOUTPUT' },
    { tradeflow: 'Exempt', xeroRate: 'EXEMPTOUTPUT', xeroCode: 'EXEMPTOUTPUT' },
  ],
  cisDeductions: [
    { tradeflow: 'CIS 20% Deduction', xeroAccount: '810 - CIS Deductions Suffered', xeroCode: '810' },
    { tradeflow: 'CIS 30% Deduction', xeroAccount: '810 - CIS Deductions Suffered', xeroCode: '810' },
    { tradeflow: 'CIS Gross Payment', xeroAccount: 'N/A', xeroCode: '-' },
  ],
};

export default function XeroIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sync' | 'mapping' | 'log'>('overview');
  const [syncSettings, setSyncSettings] = useState({
    invoices: true,
    contacts: true,
    payments: true,
    bills: false,
    frequency: 'hourly',
    autoSync: true,
    twoWay: false,
  });

  const handleConnect = () => {
    setConnecting(true);
    // Mock OAuth flow
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect Xero? Existing synced data will remain but new syncs will stop.')) {
      setConnected(false);
    }
  };

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 3000);
  };

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: '📊' },
    { key: 'sync' as const, label: 'Sync Settings', icon: '🔄' },
    { key: 'mapping' as const, label: 'Account Mapping', icon: '🗺️' },
    { key: 'log' as const, label: 'Sync Log', icon: '📋' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/settings/integrations" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#13B5EA]/10 rounded-xl flex items-center justify-center text-xl">💼</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Xero Integration</h1>
              <p className="text-sm text-slate-500">Sync your accounting data with Xero</p>
            </div>
          </div>
        </div>
        {connected && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-200">
            🟢 Connected
          </span>
        )}
      </div>

      {/* Connection Card */}
      {!connected ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-[#13B5EA]/10 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">💼</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Connect Your Xero Account</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Link TradeFlow to Xero to automatically sync invoices, contacts, and payments. 
            Keep your books up to date without double entry.
          </p>
          <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
            {['Invoices sync automatically to Xero', 'Customer contacts stay in sync', 'Payments reconcile both ways', 'CIS deductions mapped correctly', 'VAT rates matched to Xero tax codes'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-green-500">✓</span> {item}
              </div>
            ))}
          </div>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="bg-[#13B5EA] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#0FA0D1] transition-colors min-h-[48px] disabled:opacity-50"
          >
            {connecting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Connecting to Xero...
              </span>
            ) : (
              'Connect with Xero'
            )}
          </button>
          <p className="text-xs text-slate-400 mt-3">You&apos;ll be redirected to Xero to authorise access</p>
        </div>
      ) : (
        <>
          {/* Connected Info Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#13B5EA]/10 rounded-xl flex items-center justify-center text-xl">💼</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">TradeFlow Services Ltd</p>
                  <p className="text-xs text-slate-500">Organisation ID: xero-org-abc123 · Connected {new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncNow}
                  disabled={syncing}
                  className="text-sm text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/5 min-h-[44px] disabled:opacity-50"
                >
                  {syncing ? '⏳ Syncing...' : '🔄 Sync Now'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 min-h-[44px]"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">Invoices Synced</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">247</p>
                  <p className="text-xs text-green-600 mt-1">↑ 12 today</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">Contacts Synced</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">86</p>
                  <p className="text-xs text-green-600 mt-1">↑ 3 this week</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">Payments Matched</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">189</p>
                  <p className="text-xs text-amber-600 mt-1">2 unmatched</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">Last Sync</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">15 min ago</p>
                  <p className="text-xs text-green-600 mt-1">✓ All clear</p>
                </div>
              </div>

              {/* Recent Sync Activity */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Recent Sync Activity</h3>
                  <Link href="/settings/integrations/xero/history" className="text-sm text-primary hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  {mockSyncLog.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className={`w-2 h-2 rounded-full ${entry.status === 'success' ? 'bg-green-500' : entry.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700">{entry.message}</p>
                        <p className="text-xs text-slate-400">{entry.type} · {entry.direction}</p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sync Settings Tab */}
          {activeTab === 'sync' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">What to Sync</h3>
                <div className="space-y-3">
                  {[
                    { key: 'invoices', label: 'Invoices', desc: 'Sync invoices from TradeFlow to Xero as sales invoices' },
                    { key: 'contacts', label: 'Contacts', desc: 'Sync customer records as Xero contacts' },
                    { key: 'payments', label: 'Payments', desc: 'Match incoming payments with Xero bank transactions' },
                    { key: 'bills', label: 'Supplier Bills', desc: 'Import supplier invoices as Xero bills (coming soon)' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={syncSettings[item.key as keyof typeof syncSettings] as boolean}
                        onChange={(e) => setSyncSettings({ ...syncSettings, [item.key]: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-primary mt-0.5"
                        disabled={item.key === 'bills'}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Sync Frequency</h3>
                <select
                  value={syncSettings.frequency}
                  onChange={(e) => setSyncSettings({ ...syncSettings, frequency: e.target.value })}
                  className="w-full max-w-xs rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]"
                >
                  <option value="realtime">Real-time (instant)</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily (midnight)</option>
                  <option value="weekly">Weekly (Sunday midnight)</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncSettings.autoSync}
                    onChange={(e) => setSyncSettings({ ...syncSettings, autoSync: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Auto-sync new records</p>
                    <p className="text-xs text-slate-500">Automatically push new invoices and contacts to Xero</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncSettings.twoWay}
                    onChange={(e) => setSyncSettings({ ...syncSettings, twoWay: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Two-way sync</p>
                    <p className="text-xs text-slate-500">Pull changes from Xero back into TradeFlow</p>
                  </div>
                </label>
              </div>

              <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
                Save Sync Settings
              </button>
            </div>
          )}

          {/* Account Mapping Tab */}
          {activeTab === 'mapping' && (
            <div className="space-y-6">
              {/* Invoice Type Mapping */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Invoice Type → Xero Account</h3>
                <p className="text-sm text-slate-500 mb-4">Map TradeFlow invoice types to your Xero chart of accounts</p>
                <div className="space-y-3">
                  {accountMappings.invoiceTypes.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-slate-600 w-44 shrink-0">{m.tradeflow}</span>
                      <span className="text-slate-400">→</span>
                      <input
                        type="text"
                        defaultValue={m.xeroAccount}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[44px] flex-1 min-w-[200px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Mapping */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Payment Method → Xero Bank Account</h3>
                <div className="space-y-3">
                  {accountMappings.paymentMethods.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-slate-600 w-44 shrink-0">{m.tradeflow}</span>
                      <span className="text-slate-400">→</span>
                      <input
                        type="text"
                        defaultValue={m.xeroBankAccount}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[44px] flex-1 min-w-[200px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Rate Mapping */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Tax Rates → Xero Tax Codes</h3>
                <div className="space-y-3">
                  {accountMappings.taxRates.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-slate-600 w-44 shrink-0">{m.tradeflow}</span>
                      <span className="text-slate-400">→</span>
                      <input
                        type="text"
                        defaultValue={m.xeroRate}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[44px] flex-1 min-w-[200px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CIS Deduction Mapping */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">CIS Deductions → Xero Account</h3>
                <p className="text-sm text-slate-500 mb-4">Map CIS deduction types to the correct Xero nominal code</p>
                <div className="space-y-3">
                  {accountMappings.cisDeductions.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-slate-600 w-44 shrink-0">{m.tradeflow}</span>
                      <span className="text-slate-400">→</span>
                      <input
                        type="text"
                        defaultValue={m.xeroAccount}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[44px] flex-1 min-w-[200px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
                Save Mappings
              </button>
            </div>
          )}

          {/* Sync Log Tab */}
          {activeTab === 'log' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Recent Sync Activity</h3>
                <Link href="/settings/integrations/xero/history" className="text-sm text-primary hover:underline">
                  Full History →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-xs font-medium text-slate-500">Time</th>
                      <th className="text-left py-3 text-xs font-medium text-slate-500">Type</th>
                      <th className="text-left py-3 text-xs font-medium text-slate-500">Direction</th>
                      <th className="text-left py-3 text-xs font-medium text-slate-500">Records</th>
                      <th className="text-left py-3 text-xs font-medium text-slate-500">Status</th>
                      <th className="text-left py-3 text-xs font-medium text-slate-500">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSyncLog.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 text-slate-600 whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 text-slate-700 font-medium">{entry.type}</td>
                        <td className="py-3 text-slate-600">{entry.direction}</td>
                        <td className="py-3 text-slate-600">{entry.records}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            entry.status === 'success' ? 'bg-green-100 text-green-700' :
                            entry.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 max-w-[200px] truncate">{entry.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
