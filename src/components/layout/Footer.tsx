'use client';

import Link from 'next/link';
import { TradeFlowLogo } from '@/components/icons/TradeFlowLogo';

const footerLinks = {
  Product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/compliance', label: 'Compliance' },
    { href: '/comparison', label: 'Compare' },
  ],
  Resources: [
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/contact', label: 'Support' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/opportunity', label: 'Opportunity' },
    { href: '/market', label: 'Market Research' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div>
            <TradeFlowLogo className="h-10 w-auto brightness-0 invert mb-4" />
            <p className="text-sm text-slate-400 mb-4">
              Complete field service platform for UK plumbers, electricians, and HVAC engineers.
            </p>
            <a href="mailto:hello@tradeflow.co.uk" className="text-sm text-[#FF6F00] hover:text-orange-300 transition-colors">
              hello@tradeflow.co.uk
            </a>
            <p className="text-xs text-slate-500 mt-6">
              A DataNDigital Product
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{heading}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-slate-800 my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} TradeFlow. Built by Data & Digital Ltd.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            🇬🇧 UK-hosted. Your data stays in the UK.
          </p>
        </div>
      </div>
    </footer>
  );
}
