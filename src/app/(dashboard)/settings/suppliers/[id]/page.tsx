'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface SupplierOrder {
  id: string;
  poNumber: string;
  date: string;
  items: number;
  total: number;
  status: string;
  jobRef: string;
}

interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  total: number;
  matched: boolean;
  poRef: string | null;
}

const supplierData: Record<string, { name: string; logo: string; category: string; accountRef: string; connected: boolean; branch: string; repName: string; repPhone: string; repEmail: string }> = {
  'cef': { name: 'CEF', logo: '⚡', category: 'Electrical', accountRef: 'CEF-445892', connected: true, branch: 'CEF Croydon', repName: 'Dave Richards', repPhone: '020 8686 1234', repEmail: 'dave.richards@cef.co.uk' },
  'city-plumbing': { name: 'City Plumbing', logo: '🔧', category: 'Plumbing & Heating', accountRef: 'CP-112847', connected: true, branch: 'City Plumbing Lewisham', repName: 'Mike Johnson', repPhone: '020 8318 5678', repEmail: 'mike.j@cityplumbing.co.uk' },
  'wolseley': { name: 'Wolseley', logo: '🏗️', category: 'Plumbing & Heating', accountRef: 'WOL-998341', connected: true, branch: 'Wolseley Bromley', repName: 'Steve Clarke', repPhone: '020 8290 9012', repEmail: 'sclarke@wolseley.co.uk' },
  'screwfix': { name: 'Screwfix', logo: '🔩', category: 'General Trade', accountRef: 'SF-667234', connected: true, branch: 'Screwfix Penge', repName: 'Online Only', repPhone: '0333 112 3112', repEmail: 'trade@screwfix.com' },
  'toolstation': { name: 'Toolstation', logo: '🛠️', category: 'General Trade', accountRef: '', connected: false, branch: '', repName: '', repPhone: '', repEmail: '' },
  'travis-perkins': { name: 'Travis Perkins', logo: '🧱', category: 'Building Materials', accountRef: '', connected: false, branch: '', repName: '', repPhone: '', repEmail: '' },
  'plumb-center': { name: 'Plumb Center', logo: '🚿', category: 'Plumbing & Heating', accountRef: 'PC-334521', connected: true, branch: 'Plumb Center Catford', repName: 'Tony Morris', repPhone: '020 8697 3456', repEmail: 'tony.m@plumbcenter.co.uk' },
  'edmundson': { name: 'Edmundson Electrical', logo: '💡', category: 'Electrical', accountRef: '', connected: false, branch: '', repName: '', repPhone: '', repEmail: '' },
};

function generateOrders(): SupplierOrder[] {
  const statuses = ['delivered', 'dispatched', 'processing', 'collected'];
  return Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    poNumber: `PO-${String(3000 + i).padStart(6, '0')}`,
    date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    items: Math.floor(Math.random() * 8) + 1,
    total: Math.random() * 500 + 50,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    jobRef: `JOB${String(100 + i).padStart(6, '0')}`,
  }));
}

function generateInvoices(): SupplierInvoice[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    invoiceNumber: `SI-${String(8000 + i).padStart(6, '0')}`,
    date: new Date(Date.now() - i * 86400000 * 5).toISOString(),
    total: Math.random() * 800 + 30,
    matched: Math.random() > 0.3,
    poRef: Math.random() > 0.2 ? `PO-${String(3000 + i).padStart(6, '0')}` : null,
  }));
}

export default function SupplierDetailPage() {
  const params = useParams();
  const supplierId = params.id as string;
  const supplier = supplierData[supplierId];
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'invoices' | 'settings'>('overview');
  const [orders] = useState(generateOrders);
  const [invoices] = useState(generateInvoices);

  if (!supplier) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Supplier not found</p>
        <Link href="/settings/suppliers" className="text-primary hover:underline mt-2 inline-block">← Back to suppliers</Link>
      </div>
    );
  }

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: '📊' },
    { key: 'orders' as const, label: 'Orders', icon: '📦' },
    { key: 'invoices' as const, label: 'Invoices', icon: '📄' },
    { key: 'settings' as const, label: 'Settings', icon: '⚙️' },
  ];

  const monthlySpend = [1240, 1890, 2100, 1750, 2340, 1960, 2450, 2100, 1800, 2200, 2680, 2340];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/suppliers" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">{supplier.logo}</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">{supplier.name}</h1>
            <p className="text-sm text-slate-500">{supplier.category} {supplier.connected && `· Account: ${supplier.accountRef}`}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
          supplier.connected ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-500'
        }`}>
          {supplier.connected ? '🟢 Connected' : 'Not Connected'}
        </span>
      </div>

      {!supplier.connected ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">{supplier.logo}</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Connect {supplier.name}</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Link your {supplier.name} trade account to import invoices, track orders, and compare prices automatically.
          </p>
          <div className="max-w-sm mx-auto space-y-3 mb-6">
            <input type="text" placeholder="Account Number" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            <input type="text" placeholder="Branch Name" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            <input type="email" placeholder="Account Email" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[48px]">
            Connect Account
          </button>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] ${
                  activeTab === tab.key ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">This Month</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">£2,340</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">Year to Date</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">£28,450</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">Open Orders</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">3</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-slate-500">Unmatched Invoices</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">2</p>
                </div>
              </div>

              {/* Spend Chart Placeholder */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Monthly Spend</h3>
                <div className="flex items-end gap-2 h-40">
                  {monthlySpend.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary/20 rounded-t-lg hover:bg-primary/40 transition-colors"
                        style={{ height: `${(val / Math.max(...monthlySpend)) * 120}px` }}
                      />
                      <span className="text-[10px] text-slate-400">
                        {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Rep */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-3">Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Branch:</span> <span className="font-medium text-slate-700 ml-2">{supplier.branch}</span></div>
                  <div><span className="text-slate-500">Account Ref:</span> <span className="font-medium text-slate-700 ml-2">{supplier.accountRef}</span></div>
                  <div><span className="text-slate-500">Rep:</span> <span className="font-medium text-slate-700 ml-2">{supplier.repName}</span></div>
                  <div><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-700 ml-2">{supplier.repPhone}</span></div>
                  <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-700 ml-2">{supplier.repEmail}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">PO Number</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Job Ref</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Items</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Total</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-slate-700">{order.poNumber}</td>
                        <td className="py-3 px-4 text-slate-600">{new Date(order.date).toLocaleDateString('en-GB')}</td>
                        <td className="py-3 px-4 text-primary">{order.jobRef}</td>
                        <td className="py-3 px-4 text-slate-600">{order.items}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">£{order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'dispatched' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'collected' ? 'bg-teal-100 text-teal-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoices */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Invoice No.</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">PO Ref</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Total</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-slate-700">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4 text-slate-600">{new Date(inv.date).toLocaleDateString('en-GB')}</td>
                        <td className="py-3 px-4 text-slate-600">{inv.poRef || '—'}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">£{inv.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            inv.matched ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {inv.matched ? '✓ Matched' : 'Unmatched'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Auto-Match Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Auto-match by PO number</p>
                      <p className="text-xs text-slate-500">Automatically match supplier invoices to purchase orders</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Auto-approve matched invoices</p>
                      <p className="text-xs text-slate-500">Automatically approve invoices that match a PO within 5% tolerance</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Auto-allocate to jobs</p>
                      <p className="text-xs text-slate-500">Automatically add matched materials costs to the linked job</p>
                    </div>
                  </label>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-red-700 mb-1">Disconnect Supplier</h3>
                <p className="text-xs text-red-600 mb-3">This will stop syncing invoices and orders. Historical data will be retained.</p>
                <button className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 min-h-[44px]">
                  Disconnect {supplier.name}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
