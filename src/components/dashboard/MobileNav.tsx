'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/jobs', label: 'Jobs', icon: '📋' },
  { href: '#add', label: 'Add', icon: '➕', isAction: true },
  { href: '/engineers', label: 'Engineers', icon: '👷' },
  { href: '/more', label: 'More', icon: '⋯' },
];

const quickActions = [
  { href: '/jobs/new', label: 'New Job', icon: '📋' },
  { href: '/quotes/new', label: 'New Quote', icon: '📝' },
  { href: '/invoices/new', label: 'New Invoice', icon: '💰' },
  { href: '/customers/new', label: 'New Customer', icon: '👤' },
  { href: '/engineers/new', label: 'Add Engineer', icon: '👷' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [showActions, setShowActions] = useState(false);

  return (
    <>
      {/* Quick Action Sheet Overlay */}
      {showActions && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowActions(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pb-safe animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 pb-3">
              <h3 className="text-lg font-bold text-slate-800 font-[var(--font-dm-sans)]">
                What are you recording?
              </h3>
            </div>
            <div className="px-4 pb-6 space-y-1">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setShowActions(false)}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 transition-colors min-h-[56px]"
                >
                  <span className="text-2xl w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    {action.icon}
                  </span>
                  <span className="text-base font-medium text-slate-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            if (tab.isAction) {
              return (
                <button
                  key={tab.href}
                  onClick={() => setShowActions(true)}
                  className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] -mt-4"
                >
                  <span className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shadow-primary/30">
                    {tab.icon}
                  </span>
                </button>
              );
            }

            const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] ${
                  isActive ? 'text-primary' : 'text-slate-400'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
