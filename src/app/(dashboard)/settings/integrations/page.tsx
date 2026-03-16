'use client';

import Link from 'next/link';

const integrations = [
  {
    id: 'xero',
    name: 'Xero',
    description: 'Sync invoices, contacts, and payments with Xero accounting',
    icon: '💼',
    iconBg: 'bg-[#13B5EA]/10',
    status: 'active' as const,
    href: '/settings/integrations/xero',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Connect QuickBooks Online for accounting sync',
    icon: '📗',
    iconBg: 'bg-green-50',
    status: 'coming_soon' as const,
    href: '#',
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Integrate with Sage 50 or Sage Business Cloud',
    icon: '📘',
    iconBg: 'bg-emerald-50',
    status: 'coming_soon' as const,
    href: '#',
  },
  {
    id: 'freeagent',
    name: 'FreeAgent',
    description: 'Sync with FreeAgent for small business accounting',
    icon: '📙',
    iconBg: 'bg-orange-50',
    status: 'coming_soon' as const,
    href: '#',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept card payments and manage payment links',
    icon: '💳',
    iconBg: 'bg-purple-50',
    status: 'active' as const,
    href: '/settings/payments/settings',
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Two-way calendar sync for job scheduling',
    icon: '📅',
    iconBg: 'bg-blue-50',
    status: 'coming_soon' as const,
    href: '#',
  },
];

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: 'Available', className: 'bg-green-50 text-green-600 border-green-200' },
  connected: { label: '🟢 Connected', className: 'bg-green-50 text-green-700 border-green-200' },
  coming_soon: { label: 'Coming Soon', className: 'bg-gray-50 text-gray-500 border-gray-200' },
};

export default function IntegrationsHubPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Integrations</h1>
          <p className="text-slate-500 mt-1">Connect TradeFlow with your favourite tools</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Available</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{integrations.filter(i => i.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Connected</p>
          <p className="text-2xl font-bold text-green-600 mt-1">0</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Coming Soon</p>
          <p className="text-2xl font-bold text-slate-400 mt-1">{integrations.filter(i => i.status === 'coming_soon').length}</p>
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => {
          const status = statusLabels[integration.status];
          const isClickable = integration.status === 'active';
          
          const card = (
            <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all ${isClickable ? 'hover:shadow-md hover:border-gray-200 cursor-pointer' : 'opacity-75'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${integration.iconBg} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-slate-800">{integration.name}</h3>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{integration.description}</p>
                </div>
              </div>
            </div>
          );

          if (isClickable) {
            return <Link key={integration.id} href={integration.href}>{card}</Link>;
          }
          return <div key={integration.id}>{card}</div>;
        })}
      </div>
    </div>
  );
}
