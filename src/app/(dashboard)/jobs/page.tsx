'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  jobNumber: string;
  title: string;
  customer: string;
  engineer: string | null;
  scheduledDate: string | null;
  status: string;
  priority: string;
  trade: string;
  totalCost: number | null;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    quote: 'bg-purple-100 text-purple-700',
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    invoiced: 'bg-teal-100 text-teal-700',
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
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[priority] || 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  );
}

function TradeBadge({ trade }: { trade: string }) {
  const icons: Record<string, string> = {
    plumbing: '🔧',
    heating: '🔥',
    electrical: '⚡',
    hvac: '❄️',
    multi: '🛠️'
  };
  return (
    <span className="text-sm">
      {icons[trade] || '📋'} {trade}
    </span>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockJobs: Job[] = Array.from({ length: 50 }, (_, i) => {
        const statuses = ['scheduled', 'in_progress', 'completed', 'invoiced', 'quote'];
        const priorities = ['urgent', 'high', 'normal', 'low'];
        const trades = ['plumbing', 'heating', 'electrical', 'hvac'];
        const customers = ['Sarah Johnson', 'Emma Williams', 'Thames Property', 'ABC Ltd', 'Claire Davis'];
        const engineers = ['James Mitchell', 'Tom Harrison', 'Michael Davies', 'Chris Thompson', null];
        const titles = [
          'Boiler service and safety inspection',
          'Central heating system repair',
          'Full electrical inspection (EICR)',
          'Emergency gas leak',
          'New bathroom suite installation',
          'Consumer unit upgrade',
          'Air conditioning installation',
          'Power flush central heating system'
        ];

        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() - Math.floor(Math.random() * 60) + i);

        return {
          id: String(i + 1),
          jobNumber: `JOB${String(10000 + i).padStart(6, '0')}`,
          title: titles[i % titles.length],
          customer: customers[i % customers.length],
          engineer: engineers[i % engineers.length],
          scheduledDate: scheduledDate.toISOString(),
          status: statuses[i % statuses.length],
          priority: priorities[i % priorities.length],
          trade: trades[i % trades.length],
          totalCost: Math.random() > 0.3 ? 150 + Math.random() * 1000 : null
        };
      });
      setJobs(mockJobs);
      setLoading(false);
    }, 300);
  }, []);

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(j => j.status === filter);

  const stats = {
    all: jobs.length,
    scheduled: jobs.filter(j => j.status === 'scheduled').length,
    in_progress: jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    invoiced: jobs.filter(j => j.status === 'invoiced').length
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Jobs
          </h1>
          <p className="text-slate-500 mt-1">{jobs.length} total jobs</p>
        </div>
        <Link 
          href="/jobs/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          + New Job
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All', count: stats.all },
          { key: 'scheduled', label: 'Scheduled', count: stats.scheduled },
          { key: 'in_progress', label: 'In Progress', count: stats.in_progress },
          { key: 'completed', label: 'Completed', count: stats.completed },
          { key: 'invoiced', label: 'Invoiced', count: stats.invoiced }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
              filter === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Job #</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Engineer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Scheduled</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Trade</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Priority</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/jobs/${job.id}`} className="text-sm font-mono text-blue-600 hover:underline">
                      {job.jobNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-slate-700 max-w-xs truncate">{job.title}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{job.customer}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{job.engineer || '-'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {job.scheduledDate 
                      ? new Date(job.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                      : '-'
                    }
                  </td>
                  <td className="px-5 py-3">
                    <TradeBadge trade={job.trade} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-3">
                    <PriorityBadge priority={job.priority} />
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-medium text-slate-700">
                    {job.totalCost ? `£${job.totalCost.toFixed(2)}` : '-'}
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
