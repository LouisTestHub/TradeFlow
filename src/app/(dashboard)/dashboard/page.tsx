'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardData {
  farm: {
    name: string;
    totalHectares: number;
    farmType: string;
  };
  stats: {
    totalFields: number;
    totalHectares: number;
    arableHa: number;
    grasslandHa: number;
    cattleCount: number;
    sheepCount: number;
    pendingMovements: number;
    sprayRecordsThisSeason: number;
  };
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    dueDate: string | null;
    severity: string;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    date: string;
    icon: string;
  }>;
  compliance: {
    redTractorScore: number;
    bcmsPending: number;
    sfiStatus: string;
    nvzCompliant: boolean;
  };
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function SeverityDot({ severity }: { severity: string }) {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };
  return <span className={`w-2.5 h-2.5 rounded-full ${colors[severity as keyof typeof colors] || 'bg-gray-400'} flex-shrink-0 mt-1`} />;
}

function ComplianceIndicator({ score, label }: { score: number; label: string }) {
  const color = score >= 90 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-red-600';
  const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>
        {emoji} {score}%
      </span>
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-gray-100 rounded-2xl animate-pulse ${className}`} />;
}

function SprayWindowWidget() {
  const [weather, setWeather] = useState<{
    tempC: number | null;
    windSpeed: number | null;
    windDirection: string | null;
    rainfallMm: number | null;
  } | null>(null);

  useEffect(() => {
    // Fetch latest weather reading
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((data) => {
        if (data.weather) {
          setWeather(data.weather);
        }
      })
      .catch(() => {});
  }, []);

  // Use weather data or default values for display
  const temp = weather?.tempC ?? 12;
  const wind = weather?.windSpeed ?? 8;
  const windDir = weather?.windDirection ?? 'SW';
  const rain = weather?.rainfallMm ?? 0;

  const tempOk = temp > 5;
  const windOk = wind < 20;
  const rainOk = rain <= 2;
  const canSpray = tempOk && windOk && rainOk;

  const statusText = canSpray
    ? 'Good conditions for spraying'
    : 'Check conditions before spraying';
  const statusEmoji = canSpray ? '✅' : windOk && tempOk ? '⚠️' : '❌';
  const statusColor = canSpray
    ? 'bg-green-50 border-green-200'
    : 'bg-amber-50 border-amber-200';

  return (
    <div className={`rounded-2xl border p-5 ${statusColor}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
          Can I Spray Today?
        </h2>
        <span className="text-2xl">{statusEmoji}</span>
      </div>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{temp > 15 ? '☀️' : temp > 5 ? '☁️' : '🥶'}</span>
          <span className="text-2xl font-bold text-slate-800">{Math.round(temp)}°C</span>
        </div>
        <div className="flex gap-4 text-sm text-slate-600">
          <span>{windOk ? '✅' : '⚠️'} 💨 {Math.round(wind)} km/h {windDir}</span>
          <span>{rainOk ? '✅' : '⚠️'} 🌧️ {rain}mm</span>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm text-slate-600 flex items-center gap-1.5">
          <span>{tempOk ? '✅' : '⚠️'}</span>
          Temperature: {Math.round(temp)}°C {tempOk ? '(above 5°C min)' : '(below 5°C minimum!)'}
        </p>
        <p className="text-sm text-slate-600 flex items-center gap-1.5">
          <span>{windOk ? '✅' : '⚠️'}</span>
          Wind: {Math.round(wind)} km/h {windOk ? '(below 20 km/h max)' : '(above 20 km/h maximum!)'}
        </p>
        <p className="text-sm text-slate-600 flex items-center gap-1.5">
          <span>{rainOk ? '✅' : '⚠️'}</span>
          Rain: {rain}mm {rainOk ? '(minimal)' : '(recent rainfall)'}
        </p>
      </div>
      <p className="text-sm text-slate-500 mt-3 italic font-medium">
        {statusText}
      </p>
    </div>
  );
}

interface ComplianceScoreData {
  overall: number;
  schemes: {
    redTractor: { score: number; issues: number };
    bcms: { score: number; pending: number };
    sfi: { score: number; issues: number };
    nvz: { score: number };
    medicine: { score: number; activeWithdrawals: number };
    equipment: { score: number; needsCalibration: number };
  };
  attentionItems: string[];
}

function ComplianceHealthWidget({ fallback }: { fallback: { redTractorScore: number; bcmsPending: number; sfiStatus: string; nvzCompliant: boolean } }) {
  const [scores, setScores] = useState<ComplianceScoreData | null>(null);

  useEffect(() => {
    fetch('/api/compliance-score')
      .then((r) => r.json())
      .then((d) => { if (d.overall !== undefined) setScores(d); })
      .catch(() => {});
  }, []);

  if (!scores) {
    // Fallback to basic compliance from dashboard API
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
          Compliance Health
        </h2>
        <div className="space-y-3">
          <ComplianceIndicator label="Red Tractor" score={fallback.redTractorScore} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">BCMS</span>
            <span className={`text-sm font-semibold ${fallback.bcmsPending > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {fallback.bcmsPending > 0 ? `🟡 ${fallback.bcmsPending} pending` : '🟢 Up to date'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">SFI</span>
            <span className="text-sm font-semibold text-green-600">🟢 {fallback.sfiStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">NVZ</span>
            <span className={`text-sm font-semibold ${fallback.nvzCompliant ? 'text-green-600' : 'text-red-600'}`}>
              {fallback.nvzCompliant ? '🟢 Compliant' : '🔴 Action needed'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const overallEmoji = scores.overall >= 90 ? '🟢' : scores.overall >= 70 ? '🟡' : '🔴';
  const overallColor = scores.overall >= 90 ? 'text-green-600' : scores.overall >= 70 ? 'text-amber-600' : 'text-red-600';

  const schemeRows = [
    { label: 'Red Tractor', score: scores.schemes.redTractor.score, detail: scores.schemes.redTractor.issues > 0 ? `${scores.schemes.redTractor.issues} items due` : null },
    { label: 'BCMS', score: scores.schemes.bcms.score, detail: scores.schemes.bcms.pending > 0 ? `${scores.schemes.bcms.pending} pending` : null },
    { label: 'SFI', score: scores.schemes.sfi.score, detail: scores.schemes.sfi.issues > 0 ? `${scores.schemes.sfi.issues} actions need evidence` : null },
    { label: 'NVZ', score: scores.schemes.nvz.score, detail: null },
    { label: 'Medicine', score: scores.schemes.medicine.score, detail: scores.schemes.medicine.activeWithdrawals > 0 ? `${scores.schemes.medicine.activeWithdrawals} withdrawals` : null },
    { label: 'Equipment', score: scores.schemes.equipment.score, detail: scores.schemes.equipment.needsCalibration > 0 ? `${scores.schemes.equipment.needsCalibration} cal. due` : null },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
          Farm Compliance Health
        </h2>
        <span className={`text-lg font-bold ${overallColor}`}>{overallEmoji} {scores.overall}%</span>
      </div>
      <div className="space-y-2.5">
        {schemeRows.map((row) => {
          const barColor = row.score >= 90 ? 'bg-green-500' : row.score >= 70 ? 'bg-amber-500' : 'bg-red-500';
          const emoji = row.score >= 90 ? '🟢' : row.score >= 70 ? '🟡' : '🔴';
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">{row.label}</span>
                <div className="flex items-center gap-2">
                  {row.detail && <span className="text-[10px] text-slate-400">{row.detail}</span>}
                  <span className="text-sm font-semibold text-slate-700">{emoji} {row.score}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${row.score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      {scores.attentionItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-slate-700 mb-1.5">⚠️ {scores.attentionItems.length} items need attention:</p>
          {scores.attentionItems.slice(0, 3).map((item, i) => (
            <p key={i} className="text-xs text-slate-500 mb-0.5">• {item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-48" />
      </div>
    );
  }

  if (!data || !data.farm) {
    return <div className="text-center py-12 text-slate-500">Unable to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          {getGreeting()}, James 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {data.farm.name} • {data.farm.totalHectares} ha • {data.farm.farmType ? data.farm.farmType.charAt(0).toUpperCase() + data.farm.farmType.slice(1) : 'Farm'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {[
          { href: '/sprays/new', icon: '🌿', label: 'Log Spray' },
          { href: '/medicine/new', icon: '💊', label: 'Log Medicine' },
          { href: '/livestock/movements/new', icon: '🚛', label: 'Log Movement' },
          { href: '/fertiliser/new', icon: '🌱', label: 'Log Fertiliser' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[48px] whitespace-nowrap flex-shrink-0"
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-sm font-medium text-slate-700">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Needs Attention */}
      {data.alerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
              ⚠️ Needs Attention
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {data.alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5">
                <SeverityDot severity={alert.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{alert.message}</p>
                  {alert.dueDate && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Due: {new Date(alert.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farm Overview Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
          Farm Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Fields', value: data.stats.totalFields, sub: `${data.stats.totalHectares} ha total` },
            { label: 'Arable', value: `${data.stats.arableHa} ha`, sub: null },
            { label: 'Grassland', value: `${data.stats.grasslandHa} ha`, sub: null },
            { label: 'Cattle', value: data.stats.cattleCount, sub: null },
            { label: 'Sheep', value: data.stats.sheepCount, sub: null },
            { label: 'Spray Records', value: data.stats.sprayRecordsThisSeason, sub: 'this season' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stat.value}</p>
              {stat.sub && <p className="text-[11px] text-slate-400">{stat.sub}</p>}
            </div>
          ))}
        </div>
        {data.stats.pendingMovements > 0 && (
          <p className="text-xs text-amber-600 mt-3 font-medium">
            ⚠️ {data.stats.pendingMovements} movement{data.stats.pendingMovements !== 1 ? 's' : ''} pending BCMS submission
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {data.recentActivity.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400 text-center">No recent activity</p>
          ) : (
            data.recentActivity.slice(0, 6).map((activity, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <span className="text-lg flex-shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(activity.date)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Compliance Health — Enhanced */}
      <ComplianceHealthWidget fallback={data.compliance} />

      {/* Can I Spray Today? Widget */}
      <SprayWindowWidget />
    </div>
  );
}
