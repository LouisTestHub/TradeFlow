'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardData {
  company: {
    name: string;
    tradingName: string;
  };
  stats: {
    jobsToday: number;
    jobsWeek: number;
    jobsInProgress: number;
    jobsScheduled: number;
    totalEngineers: number;
    engineersActive: number;
    engineersOnJob: number;
    revenueMonth: number;
    revenueYear: number;
    invoicesUnpaid: number;
    invoicesOverdue: number;
    quotesOutstanding: number;
    certificatesExpiringSoon: number;
  };
  todaysJobs: Array<{
    id: string;
    jobNumber: string;
    title: string;
    scheduledTime: string;
    engineer: string;
    customer: string;
    status: string;
    priority: string;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: string;
    actionUrl?: string;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    date: string;
    icon: string;
  }>;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function SeverityDot({ severity }: { severity: string }) {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };
  return <span className={`w-2.5 h-2.5 rounded-full ${colors[severity as keyof typeof colors] || 'bg-gray-400'} flex-shrink-0 mt-1`} />;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-600'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    normal: 'bg-gray-100 text-gray-600',
    low: 'bg-blue-100 text-blue-600'
  };
  const icons: Record<string, string> = {
    urgent: '🔥',
    high: '⚡',
    normal: '📋',
    low: '➡️'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[priority] || 'bg-gray-100 text-gray-600'}`}>
      {icons[priority]} {priority}
    </span>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-gray-100 rounded-2xl animate-pulse ${className}`} />;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - will be replaced with real API call
    setTimeout(() => {
      setData({
        company: {
          name: 'TradeFlow Services Ltd',
          tradingName: 'TradeFlow'
        },
        stats: {
          jobsToday: 12,
          jobsWeek: 47,
          jobsInProgress: 5,
          jobsScheduled: 23,
          totalEngineers: 20,
          engineersActive: 18,
          engineersOnJob: 8,
          revenueMonth: 45280,
          revenueYear: 524390,
          invoicesUnpaid: 15,
          invoicesOverdue: 3,
          quotesOutstanding: 8,
          certificatesExpiringSoon: 12
        },
        todaysJobs: [
          {
            id: '1',
            jobNumber: 'JOB010001',
            title: 'Boiler service and safety inspection',
            scheduledTime: '08:00',
            engineer: 'James Mitchell',
            customer: 'Sarah Johnson',
            status: 'in_progress',
            priority: 'normal'
          },
          {
            id: '2',
            jobNumber: 'JOB010002',
            title: 'Emergency gas leak - unsafe appliance',
            scheduledTime: '09:30',
            engineer: 'Tom Harrison',
            customer: 'Thames Property Management',
            status: 'scheduled',
            priority: 'urgent'
          },
          {
            id: '3',
            jobNumber: 'JOB010003',
            title: 'Full electrical inspection (EICR)',
            scheduledTime: '10:00',
            engineer: 'Michael Davies',
            customer: 'Emma Williams',
            status: 'scheduled',
            priority: 'normal'
          },
          {
            id: '4',
            jobNumber: 'JOB010004',
            title: 'Central heating system repair - no heating upstairs',
            scheduledTime: '13:00',
            engineer: 'Chris Thompson',
            customer: 'Claire Davis',
            status: 'scheduled',
            priority: 'high'
          }
        ],
        alerts: [
          {
            id: '1',
            type: 'certificate',
            message: 'James Mitchell - Gas Safe certificate expires in 30 days',
            severity: 'medium',
            actionUrl: '/engineers'
          },
          {
            id: '2',
            type: 'fleet',
            message: 'Vehicle VX65 ABC - MOT expires in 14 days',
            severity: 'high',
            actionUrl: '/fleet'
          },
          {
            id: '3',
            type: 'invoice',
            message: '3 invoices overdue - total £12,450',
            severity: 'high',
            actionUrl: '/invoices'
          },
          {
            id: '4',
            type: 'cis',
            message: 'Monthly CIS return due by 19th March 2026',
            severity: 'medium',
            actionUrl: '/cis'
          }
        ],
        recentActivity: [
          {
            type: 'job',
            description: 'Job JOB010045 completed by Tom Harrison',
            date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            icon: '✅'
          },
          {
            type: 'invoice',
            description: 'Invoice INV000234 paid - £2,450',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: '💰'
          },
          {
            type: 'certificate',
            description: 'Gas Safe CP12 issued - Job JOB010045',
            date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            icon: '📜'
          },
          {
            type: 'quote',
            description: 'Quote QT001234 accepted by ABC Property Ltd',
            date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            icon: '📝'
          },
          {
            type: 'job',
            description: 'Emergency job created - Gas leak at 123 High Street',
            date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            icon: '🔥'
          }
        ]
      });
      setLoading(false);
    }, 500);
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

  if (!data) {
    return <div className="text-center py-12 text-slate-500">Unable to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          {getGreeting()} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {data.company.tradingName} • {data.stats.jobsToday} jobs today • {data.stats.engineersActive}/{data.stats.totalEngineers} engineers active
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {[
          { href: '/jobs/new', icon: '📋', label: 'New Job' },
          { href: '/quotes/new', icon: '📝', label: 'New Quote' },
          { href: '/invoices/new', icon: '💰', label: 'New Invoice' },
          { href: '/customers/new', icon: '👤', label: 'New Customer' },
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

      {/* Alerts */}
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
                </div>
                {alert.actionUrl && (
                  <Link href={alert.actionUrl} className="text-xs text-blue-600 hover:underline flex-shrink-0">
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium">Jobs Today</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{data.stats.jobsToday}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{data.stats.jobsInProgress} in progress</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium">Revenue (Month)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">£{(data.stats.revenueMonth / 1000).toFixed(1)}k</p>
          <p className="text-[11px] text-green-600 mt-0.5">↑ 12% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium">Engineers</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{data.stats.engineersActive}/{data.stats.totalEngineers}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{data.stats.engineersOnJob} on jobs now</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium">Unpaid Invoices</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{data.stats.invoicesUnpaid}</p>
          <p className="text-[11px] text-red-600 mt-0.5">{data.stats.invoicesOverdue} overdue</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
            📅 Today's Schedule
          </h2>
          <Link href="/calendar" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {data.todaysJobs.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400 text-center">No jobs scheduled for today</p>
          ) : (
            data.todaysJobs.map((job) => (
              <Link 
                key={job.id} 
                href={`/jobs/${job.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-bold text-slate-700 w-12 flex-shrink-0">{job.scheduledTime}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400">{job.jobNumber}</span>
                    <StatusBadge status={job.status} />
                    <PriorityBadge priority={job.priority} />
                  </div>
                  <p className="text-sm text-slate-700 truncate font-medium">{job.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {job.engineer} • {job.customer}
                  </p>
                </div>
                <span className="text-slate-300">→</span>
              </Link>
            ))
          )}
        </div>
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/jobs" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow">
          <p className="text-sm opacity-90">This Week</p>
          <p className="text-3xl font-bold mt-1">{data.stats.jobsWeek}</p>
          <p className="text-xs opacity-75 mt-1">jobs</p>
        </Link>
        <Link href="/quotes" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow">
          <p className="text-sm opacity-90">Outstanding</p>
          <p className="text-3xl font-bold mt-1">{data.stats.quotesOutstanding}</p>
          <p className="text-xs opacity-75 mt-1">quotes</p>
        </Link>
        <Link href="/certificates" className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow">
          <p className="text-sm opacity-90">Expiring Soon</p>
          <p className="text-3xl font-bold mt-1">{data.stats.certificatesExpiringSoon}</p>
          <p className="text-xs opacity-75 mt-1">certificates</p>
        </Link>
      </div>
    </div>
  );
}
