'use client';

import Link from 'next/link';
import { ScrollFadeIn } from './ScrollFadeIn';
import { GrantIcon } from '@/components/icons/FeatureIcons';

export function FetfSection() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="flex flex-col md:flex-row items-center gap-8 text-white">
            <div className="flex-shrink-0">
              <GrantIcon className="w-20 h-20 bg-white/10 rounded-2xl p-2" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-200 mb-2">🇬🇧 Built for UK Trades</p>
              <h2 className="font-[var(--font-dm-sans)] text-2xl sm:text-3xl font-bold mb-3">
                UK Compliance First. No US/AU Bolt-Ons.
              </h2>
              <p className="text-green-100 leading-relaxed max-w-2xl">
                Built from the ground up for UK plumbers, electricians, and HVAC engineers. CIS tax, Gas Safe, NICEIC, F-Gas — not afterthoughts. Native integrations with Xero, QuickBooks, and HMRC.
              </p>
            </div>
            <Link
              href="#pricing"
              className="flex-shrink-0 inline-flex items-center justify-center px-6 py-4 bg-white text-[#1B5E20] font-semibold rounded-xl hover:bg-green-50 transition-colors min-h-[48px] whitespace-nowrap"
            >
              See Pricing →
            </Link>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
