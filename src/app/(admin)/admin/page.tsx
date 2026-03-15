'use client';

import { useState, useEffect } from 'react';

interface DashboardData {
  stats: {
    totalCompanies: number;
    totalUsers: number;
    activeCompanies: number;
    trialCompanies: number;
    recordsToday: number;
    mrr: number;
    arr: number;
  };
  recentActivity: { id: string; action: string; entity: string; user: string; company: string; createdAt: string }[];
  recentSupport: { id: string; name: string; email: string; message: string; createdAt: string }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border p-6 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-2" /><div className="h-4 bg-gray-100 rounded w-20" /></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Companies" value={stats?.totalCompanies || 0} />
        <StatCard label="Total Users" value={stats?.totalUsers || 0} />
        <StatCard label="Active (30d)" value={stats?.activeCompanies || 0} color="text-green-600" />
        <StatCard label="Trials" value={stats?.trialCompanies || 0} color="text-blue-600" />
      </div>

      {/* Revenue */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-slate-500 mb-1">MRR</p>
          <p className="text-2xl font-bold text-slate-900">£{stats?.mrr?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-slate-500 mb-1">ARR</p>
          <p className="text-2xl font-bold text-slate-900">£{stats?.arr?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Records Today</p>
          <p className="text-2xl font-bold text-primary">{stats?.recordsToday || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {data?.recentActivity?.length ? data.recentActivity.map(a => (
              <div key={a.id} className="flex items-start gap-3 text-sm border-b border-gray-50 pb-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700">{a.action} {a.entity && `— ${a.entity}`}</p>
                  <p className="text-xs text-slate-400">{a.user} {a.company && `• ${a.company}`} • {timeAgo(a.createdAt)}</p>
                </div>
              </div>
            )) : <p className="text-sm text-slate-400">No recent activity</p>}
          </div>
        </div>

        {/* Recent Support */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Support Tickets</h2>
          <div className="space-y-3">
            {data?.recentSupport?.length ? data.recentSupport.map(t => (
              <div key={t.id} className="text-sm border-b border-gray-50 pb-2">
                <p className="font-medium text-slate-700">{t.name}</p>
                <p className="text-slate-500 truncate">{t.message}</p>
                <p className="text-xs text-slate-400">{t.email} • {timeAgo(t.createdAt)}</p>
              </div>
            )) : <p className="text-sm text-slate-400">No support tickets</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-slate-900' }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
