'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/companies', label: 'Companies', icon: '🏢' },
  { href: '/admin/support', label: 'Support', icon: '🎫' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/products', label: 'Product DB', icon: '🗄️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔧</span>
          <span className="font-bold text-lg">TradeFlow</span>
          <span className="bg-red-500 text-xs font-bold px-2 py-0.5 rounded-full ml-2">ADMIN</span>
        </div>
        <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors min-h-[48px] flex items-center">
          ← Back to App
        </Link>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="hidden lg:block w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-52px)] sticky top-[52px]">
          <nav className="px-3 py-4 space-y-1">
            {adminNavItems.map(item => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Admin Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <nav className="flex overflow-x-auto">
            {adminNavItems.map(item => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-3 text-xs min-w-[64px] min-h-[48px] ${
                    isActive ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
