'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Supplier {
  id: string;
  name: string;
  logo: string;
  category: string;
  connected: boolean;
  accountRef: string | null;
  monthSpend: number;
  yearSpend: number;
  invoiceCount: number;
  lastOrder: string | null;
}

const suppliers: Supplier[] = [
  { id: 'cef', name: 'CEF', logo: '⚡', category: 'Electrical', connected: true, accountRef: 'CEF-445892', monthSpend: 2340.50, yearSpend: 28450.00, invoiceCount: 47, lastOrder: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'city-plumbing', name: 'City Plumbing', logo: '🔧', category: 'Plumbing & Heating', connected: true, accountRef: 'CP-112847', monthSpend: 3150.75, yearSpend: 35200.00, invoiceCount: 62, lastOrder: new Date(Date.now() - 86400000).toISOString() },
  { id: 'wolseley', name: 'Wolseley', logo: '🏗️', category: 'Plumbing & Heating', connected: true, accountRef: 'WOL-998341', monthSpend: 1875.00, yearSpend: 22100.00, invoiceCount: 38, lastOrder: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'screwfix', name: 'Screwfix', logo: '🔩', category: 'General Trade', connected: true, accountRef: 'SF-667234', monthSpend: 890.25, yearSpend: 10450.00, invoiceCount: 89, lastOrder: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'toolstation', name: 'Toolstation', logo: '🛠️', category: 'General Trade', connected: false, accountRef: null, monthSpend: 0, yearSpend: 0, invoiceCount: 0, lastOrder: null },
  { id: 'travis-perkins', name: 'Travis Perkins', logo: '🧱', category: 'Building Materials', connected: false, accountRef: null, monthSpend: 0, yearSpend: 0, invoiceCount: 0, lastOrder: null },
  { id: 'plumb-center', name: 'Plumb Center', logo: '🚿', category: 'Plumbing & Heating', connected: true, accountRef: 'PC-334521', monthSpend: 1420.00, yearSpend: 16800.00, invoiceCount: 31, lastOrder: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'edmundson', name: 'Edmundson Electrical', logo: '💡', category: 'Electrical', connected: false, accountRef: null, monthSpend: 0, yearSpend: 0, invoiceCount: 0, lastOrder: null },
];

export default function SuppliersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'connected' | 'available'>('all');

  const connectedSuppliers = suppliers.filter(s => s.connected);
  const totalMonthSpend = connectedSuppliers.reduce((sum, s) => sum + s.monthSpend, 0);
  const totalYearSpend = connectedSuppliers.reduce((sum, s) => sum + s.yearSpend, 0);

  const filtered = suppliers.filter(s => {
    if (filter === 'connected' && !s.connected) return false;
    if (filter === 'available' && s.connected) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Suppliers</h1>
          <p className="text-slate-500 mt-1">Manage supplier connections and materials purchasing</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {[
          { href: '/settings/suppliers/invoices', label: 'Supplier Invoices', icon: '📄', desc: 'Import & match invoices' },
          { href: '/settings/suppliers/orders', label: 'Purchase Orders', icon: '📦', desc: 'Track material orders' },
          { href: '/settings/suppliers/catalogue', label: 'Product Catalogue', icon: '🔍', desc: 'Search & compare prices' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[48px] whitespace-nowrap flex-shrink-0"
          >
            <span className="text-lg">{link.icon}</span>
            <div>
              <span className="text-sm font-medium text-slate-700 block">{link.label}</span>
              <span className="text-[11px] text-slate-400">{link.desc}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Spend Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Connected Suppliers</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{connectedSuppliers.length}</p>
          <p className="text-xs text-slate-400 mt-1">of {suppliers.length} available</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">This Month Spend</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">£{totalMonthSpend.toLocaleString('en-GB', { minimumFractionDigits: 0 })}</p>
          <p className="text-xs text-green-600 mt-1">↓ 8% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Year to Date</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">£{totalYearSpend.toLocaleString('en-GB', { minimumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Total Invoices</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{connectedSuppliers.reduce((sum, s) => sum + s.invoiceCount, 0)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-xl border border-gray-200 px-4 py-2.5 text-sm min-h-[44px]"
        />
        <div className="flex gap-1">
          {(['all', 'connected', 'available'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium min-h-[44px] ${
                filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f === 'connected' ? 'Connected' : 'Available'}
            </button>
          ))}
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((supplier) => (
          <Link
            key={supplier.id}
            href={`/settings/suppliers/${supplier.id}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {supplier.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-800">{supplier.name}</h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    supplier.connected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {supplier.connected ? '🟢 Connected' : 'Not connected'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{supplier.category}</p>
                {supplier.connected ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[11px] text-slate-400">This Month</p>
                      <p className="text-sm font-semibold text-slate-800">£{supplier.monthSpend.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">YTD</p>
                      <p className="text-sm font-semibold text-slate-800">£{supplier.yearSpend.toLocaleString('en-GB', { minimumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Account</p>
                      <p className="text-sm font-medium text-slate-600">{supplier.accountRef}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Click to connect your trade account</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
