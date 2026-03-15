'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SfiAction {
  id: string;
  actionCode: string;
  actionName: string;
  fieldName: string | null;
  hectares: number | null;
  paymentPerHa: number | null;
  evidenceCount: number;
  submittedCount: number;
  status: 'completed' | 'in_progress' | 'not_started';
}

interface SfiAgreement {
  id: string;
  sfiRef: string;
  startDate: string;
  endDate: string;
  totalAnnualPayment: number | null;
  status: string;
  actions: SfiAction[];
  totalActions: number;
  actionsWithEvidence: number;
  completedActions: number;
  progressPercent: number;
  actionPayments: number;
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    completed: { icon: '✅', label: 'Done', color: 'bg-green-100 text-green-700' },
    in_progress: { icon: '🔵', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    not_started: { icon: '⬜', label: 'Not Started', color: 'bg-gray-100 text-gray-600' },
  };
  const c = config[status as keyof typeof config] || config.not_started;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${c.color}`}>
      {c.icon} {c.label}
    </span>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  const color = percent >= 80 ? 'bg-green-500' : percent >= 50 ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function SfiPage() {
  const [agreements, setAgreements] = useState<SfiAgreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sfi')
      .then((r) => r.json())
      .then((data) => { setAgreements(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (agreements.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🎯</span>
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          No SFI Agreements
        </h1>
        <p className="text-slate-500 mt-2">
          No Sustainable Farming Incentive agreements found.
        </p>
      </div>
    );
  }

  const agreement = agreements[0];

  // Calculate payment breakdown
  const managementPayment = 2000;
  const totalThisYear = (agreement.totalAnnualPayment || 0) + managementPayment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            🎯 Sustainable Farming Incentive
          </h1>
          <p className="text-slate-500 mt-1">Track your SFI actions and evidence</p>
        </div>
        <Link
          href="/sfi/evidence/new"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[44px]"
        >
          📸 Log Evidence
        </Link>
      </div>

      {/* Agreement Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
          Agreement Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Agreement Ref</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{agreement.sfiRef}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Start Date</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {new Date(agreement.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">End Date</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {new Date(agreement.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status</p>
            <p className="mt-0.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${
                agreement.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {agreement.status === 'active' ? '🟢' : '⚪'} {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs text-green-700 font-medium">Annual Payment</p>
            <p className="text-xl font-bold text-green-800">
              £{(agreement.totalAnnualPayment || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-blue-700 font-medium">Management Payment</p>
            <p className="text-xl font-bold text-blue-800">£{managementPayment.toLocaleString()}</p>
            <p className="text-[10px] text-blue-600">Year 1 only</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 col-span-2 lg:col-span-1">
            <p className="text-xs text-amber-700 font-medium">Total This Year</p>
            <p className="text-xl font-bold text-amber-800">£{totalThisYear.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Payment Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)] mb-4">
          💰 Payment Tracker
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 font-medium">Expected</p>
            <p className="text-lg font-bold text-slate-800">£{totalThisYear.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-green-600 font-medium">Received</p>
            <p className="text-lg font-bold text-green-700">
              £{Math.round(totalThisYear * 0.5).toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-blue-600 font-medium">Remaining</p>
            <p className="text-lg font-bold text-blue-700">
              £{Math.round(totalThisYear * 0.5).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">Payments made quarterly in arrears</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Overall Progress
          </h2>
          <span className="text-sm font-semibold text-slate-600">
            {agreement.progressPercent}%
          </span>
        </div>
        <ProgressBar percent={agreement.progressPercent} />
        <p className="text-xs text-slate-500 mt-2">
          {agreement.actionsWithEvidence} of {agreement.totalActions} actions have evidence
          {agreement.completedActions > 0 && ` • ${agreement.completedActions} fully submitted`}
        </p>
      </div>

      {/* Actions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Actions Progress
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Code</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Area</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">£/ha</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Evidence</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agreement.actions.map((action) => (
                <tr key={action.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/sfi/${action.id}`} className="text-sm font-mono font-semibold text-primary hover:underline">
                      {action.actionCode}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/sfi/${action.id}`} className="text-sm text-slate-700 hover:text-primary">
                      {action.actionName}
                    </Link>
                    {action.fieldName && (
                      <p className="text-xs text-slate-400">{action.fieldName}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {action.hectares ? `${action.hectares} ha` : '—'}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {action.paymentPerHa ? `£${action.paymentPerHa}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {action.evidenceCount > 0 ? `📷 ${action.evidenceCount}` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={action.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-50">
          {agreement.actions.map((action) => (
            <Link
              key={action.id}
              href={`/sfi/${action.id}`}
              className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors min-h-[64px]"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-xs font-mono font-bold text-primary">{action.actionCode}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{action.actionName}</p>
                <div className="flex items-center gap-2 mt-1">
                  {action.hectares && (
                    <span className="text-xs text-slate-500">{action.hectares} ha</span>
                  )}
                  {action.paymentPerHa && (
                    <span className="text-xs text-slate-500">£{action.paymentPerHa}/ha</span>
                  )}
                  {action.evidenceCount > 0 && (
                    <span className="text-xs text-slate-500">📷 {action.evidenceCount}</span>
                  )}
                </div>
              </div>
              <StatusBadge status={action.status} />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-24 right-4 lg:hidden z-30">
        <Link
          href="/sfi/evidence/new"
          className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 text-2xl"
        >
          📸
        </Link>
      </div>
    </div>
  );
}
