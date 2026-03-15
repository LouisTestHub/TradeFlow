'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import OfflineIndicator from './OfflineIndicator';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/jobs', label: 'Jobs', icon: '📋' },
  { href: '/engineers', label: 'Engineers', icon: '👷' },
  { href: '/customers', label: 'Customers', icon: '👥' },
  { href: '/quotes', label: 'Quotes', icon: '📝' },
  { href: '/invoices', label: 'Invoices', icon: '💰' },
  { href: '/certificates', label: 'Certificates', icon: '📜' },
  { href: '/fleet', label: 'Fleet', icon: '🚐' },
  { href: '/cis', label: 'CIS Tax', icon: '💷' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/reports', label: 'Reports', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

interface SidebarProps {
  farmName: string;
  userName: string;
  syncStatus: 'online' | 'syncing' | 'offline';
}

export default function Sidebar({ farmName, userName, syncStatus }: SidebarProps) {
  const pathname = usePathname();

  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online (synced)', text: 'text-green-700' },
    syncing: { color: 'bg-yellow-500', label: 'Syncing...', text: 'text-yellow-700' },
    offline: { color: 'bg-red-500', label: 'Offline mode', text: 'text-red-700' },
  };

  const status = statusConfig[syncStatus];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <span className="text-2xl">🌿</span>
        <span className="font-[var(--font-dm-sans)] font-bold text-lg text-primary">TradeFlow</span>
      </div>

      {/* Farm name */}
      <div className="px-6 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-slate-800">{farmName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sync status */}
      <div className="px-4 py-3 border-t border-gray-100">
        <OfflineIndicator />
        <div className="flex items-center gap-2 px-2 mt-2">
          <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
          <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 px-2">Last sync: just now</p>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{userName}</p>
            <Link href="/login" className="text-xs text-slate-400 hover:text-red-500 transition-colors">
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
