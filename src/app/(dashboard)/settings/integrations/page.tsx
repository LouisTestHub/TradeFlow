'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const [xeroConnected, setXeroConnected] = useState(false);
  const [xeroOrg, setXeroOrg] = useState('');
  const [syncFrequency, setSyncFrequency] = useState('weekly');
  const [autoSync, setAutoSync] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Category mapping state
  const [categories, setCategories] = useState({
    cropProtection: 'Crop Protection',
    medicine: 'Veterinary & Medicine',
    fertiliser: 'Fertiliser & Nutrients',
    vetFees: 'Veterinary & Medicine',
  });

  const handleConnect = () => {
    // Placeholder: would redirect to Xero OAuth2
    setXeroConnected(true);
    setXeroOrg('Oakfield Farm Ltd');
  };

  const handleDisconnect = () => {
    setXeroConnected(false);
    setXeroOrg('');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
          <p className="text-slate-500 mt-1">Connect external services to TradeFlow</p>
        </div>
      </div>

      {/* Xero Integration */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#13B5EA]/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
            💼
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-slate-800">Xero Accounting</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                xeroConnected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {xeroConnected ? '🟢 Connected' : '⬜ Not connected'}
              </span>
            </div>

            {xeroConnected ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Organisation: <span className="font-medium">{xeroOrg}</span></p>
                <p className="text-sm text-slate-500">Last Sync: {new Date().toLocaleDateString('en-GB')} — {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button onClick={handleDisconnect} className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 min-h-[48px]">
                    Disconnect
                  </button>
                  <button className="text-sm text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/5 min-h-[48px]">
                    Sync Now
                  </button>
                  <button onClick={() => setShowConfig(!showConfig)} className="text-sm text-slate-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 min-h-[48px]">
                    Configure
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-500 mb-3">
                  Connect your Xero account to automatically sync spray, medicine, and fertiliser costs as expenses.
                </p>
                <button onClick={handleConnect} className="bg-[#13B5EA] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0FA0D1] min-h-[48px]">
                  Connect Xero Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Xero Configuration */}
        {showConfig && xeroConnected && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
            {/* Sync Settings */}
            <div>
              <h3 className="font-medium text-slate-800 mb-3">Sync Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Sync Frequency</label>
                  <select
                    value={syncFrequency}
                    onChange={e => setSyncFrequency(e.target.value)}
                    className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px] w-full max-w-xs"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 min-h-[48px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={e => setAutoSync(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm text-slate-700">Auto-sync new records (TradeFlow → Xero)</span>
                </label>
              </div>
            </div>

            {/* Category Mapping */}
            <div>
              <h3 className="font-medium text-slate-800 mb-3">Category Mapping</h3>
              <p className="text-sm text-slate-500 mb-3">Map TradeFlow categories to your Xero chart of accounts.</p>
              <div className="space-y-3">
                {Object.entries(categories).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-40 shrink-0 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-slate-400">→</span>
                    <input
                      type="text"
                      value={value}
                      onChange={e => setCategories({ ...categories, [key]: e.target.value })}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm min-h-[44px] flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* What Syncs */}
            <div>
              <h3 className="font-medium text-slate-800 mb-3">What Gets Synced</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <p><span className="font-medium">Spray costs</span> → Xero expense ({categories.cropProtection})</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <p><span className="font-medium">Medicine costs</span> → Xero expense ({categories.medicine})</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <p><span className="font-medium">Fertiliser costs</span> → Xero expense ({categories.fertiliser})</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <p><span className="font-medium">Vet fees</span> → Xero expense ({categories.vetFees})</p>
                </div>
              </div>
            </div>

            <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[48px]">
              Save Configuration
            </button>
          </div>
        )}
      </div>

      {/* Sencrop Integration (placeholder) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
            🌦️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-slate-800">Sencrop Weather</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">⬜ Not connected</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">Connect your Sencrop weather station for automatic weather data in spray records.</p>
            <button className="text-sm text-slate-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 min-h-[48px]">
              Connect Sencrop Account
            </button>
          </div>
        </div>
      </div>

      {/* BCMS Integration (placeholder) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
            🐄
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-slate-800">BCMS (CTS Online)</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Coming Soon</span>
            </div>
            <p className="text-sm text-slate-500">Direct BCMS submission for livestock movements. Coming in a future update.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
