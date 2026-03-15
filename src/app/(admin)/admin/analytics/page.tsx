'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  stats: {
    totalFarms: number;
    totalUsers: number;
    activeFarms: number;
    trialFarms: number;
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl border p-6 h-48 animate-pulse" />)}
      </div>
    );
  }

  const stats = data?.stats;
  const totalFarms = stats?.totalFarms || 1;

  // Placeholder analytics data
  const featureUsage = [
    { name: 'Spray Diary', pct: 92 },
    { name: 'Livestock', pct: 78 },
    { name: 'Medicine', pct: 71 },
    { name: 'Fields & Crops', pct: 95 },
    { name: 'Fertiliser', pct: 64 },
    { name: 'SFI Actions', pct: 42 },
    { name: 'Red Tractor', pct: 58 },
    { name: 'Reports', pct: 35 },
  ];

  const regions = [
    { county: 'Devon', farms: Math.round(totalFarms * 0.15) },
    { county: 'Somerset', farms: Math.round(totalFarms * 0.12) },
    { county: 'Yorkshire', farms: Math.round(totalFarms * 0.11) },
    { county: 'Norfolk', farms: Math.round(totalFarms * 0.09) },
    { county: 'Shropshire', farms: Math.round(totalFarms * 0.08) },
    { county: 'Suffolk', farms: Math.round(totalFarms * 0.07) },
    { county: 'Lincolnshire', farms: Math.round(totalFarms * 0.06) },
    { county: 'Other', farms: Math.round(totalFarms * 0.32) },
  ];

  const planDistribution = [
    { plan: 'Free Trial', count: stats?.trialFarms || 0, color: 'bg-blue-500' },
    { plan: 'Starter (£20/mo)', count: Math.round(totalFarms * 0.25), color: 'bg-green-500' },
    { plan: 'Standard (£30/mo)', count: Math.round(totalFarms * 0.45), color: 'bg-primary' },
    { plan: 'Farm Pro (£45/mo)', count: Math.round(totalFarms * 0.12), color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Analytics</h1>

      {/* Feature Usage */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Feature Usage (% of farms)</h2>
        <div className="space-y-3">
          {featureUsage.map(f => (
            <div key={f.name} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-32 shrink-0">{f.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4">
                <div
                  className="bg-primary rounded-full h-4 transition-all"
                  style={{ width: `${f.pct}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 w-10 text-right">{f.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Geographic Distribution</h2>
          <div className="space-y-2">
            {regions.map(r => (
              <div key={r.county} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-sm text-slate-700">{r.county}</span>
                <span className="text-sm font-medium text-slate-800">{r.farms} farms</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Plan Distribution</h2>
          <div className="space-y-3">
            {planDistribution.map(p => (
              <div key={p.plan} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${p.color} shrink-0`} />
                <span className="text-sm text-slate-600 flex-1">{p.plan}</span>
                <span className="text-sm font-bold text-slate-800">{p.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            {planDistribution.map(p => (
              <div
                key={p.plan}
                className={`h-6 rounded-full ${p.color}`}
                style={{ width: `${Math.max(5, (p.count / totalFarms) * 100)}%` }}
                title={`${p.plan}: ${p.count}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Retention placeholder */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">User Growth (Placeholder)</h2>
        <div className="flex items-end gap-1 h-40">
          {[35, 42, 48, 55, 62, 68, 72, 80, 88, 95, 105, 120].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/80 rounded-t"
                style={{ height: `${(v / 120) * 100}%` }}
              />
              <span className="text-[10px] text-slate-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Monthly farm signups (placeholder data)</p>
      </div>
    </div>
  );
}
