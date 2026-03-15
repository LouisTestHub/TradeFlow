'use client';

import Link from 'next/link';

const moreItems = [
  { href: '/customers', label: 'Customers', icon: '👥', description: 'Manage customer database' },
  { href: '/quotes', label: 'Quotes', icon: '📝', description: 'View and create quotes' },
  { href: '/invoices', label: 'Invoices', icon: '💰', description: 'Manage invoices and payments' },
  { href: '/certificates', label: 'Certificates', icon: '📜', description: 'Gas Safe, NICEIC, F-Gas certificates' },
  { href: '/fleet', label: 'Fleet', icon: '🚐', description: 'Vehicle and fleet management' },
  { href: '/cis', label: 'CIS Tax', icon: '💷', description: 'CIS tax records and submissions' },
  { href: '/calendar', label: 'Calendar', icon: '📅', description: 'Schedule and calendar view' },
  { href: '/reports', label: 'Reports', icon: '📊', description: 'Business reports and analytics' },
  { href: '/settings', label: 'Settings', icon: '⚙️', description: 'App settings and preferences' },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">More</h1>
        <p className="text-slate-500 mt-1">Additional features and tools</p>
      </div>

      <div className="grid gap-3">
        {moreItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all min-h-[72px]"
          >
            <span className="text-3xl w-14 h-14 flex items-center justify-center bg-gray-50 rounded-xl flex-shrink-0">
              {item.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-slate-800">{item.label}</p>
              <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>
            </div>
            <span className="text-slate-300 flex-shrink-0">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
