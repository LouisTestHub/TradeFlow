'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TradeFlowLogo } from '@/components/icons/TradeFlowLogo';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/comparison', label: 'Compare' },
  { href: '/opportunity', label: 'Opportunity' },
  { href: '/market', label: 'Market Research' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="TradeFlow home">
            <TradeFlowLogo className="h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-[#1565C0] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-[#1565C0] transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#1565C0] text-white text-sm font-semibold rounded-lg hover:bg-[#0D47A1] transition-colors shadow-sm"
            >
              Try Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-3 -mr-2 text-slate-600 hover:text-[#1565C0]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-white">
          <nav className="flex flex-col p-6 gap-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-slate-700 hover:text-[#1565C0] py-3 px-4 rounded-lg hover:bg-[#EFF6FF] transition-colors min-h-[48px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-4 border-gray-200" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-slate-700 hover:text-[#1565C0] py-3 px-4 rounded-lg hover:bg-[#EFF6FF] transition-colors min-h-[48px] flex items-center"
            >
              Login
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center px-6 py-4 bg-[#1565C0] text-white text-lg font-semibold rounded-lg hover:bg-[#0D47A1] transition-colors min-h-[48px]"
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
