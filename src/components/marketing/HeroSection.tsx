'use client';

import Link from 'next/link';
import { HeroIllustration } from '@/components/icons/HeroIllustration';
import { PhoneMockup } from '@/components/icons/PhoneMockup';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight tracking-tight">
              Complete{' '}
              <span className="text-[#1E3A5F]">Field Service Platform</span>{' '}
              <span className="text-[#F97316]">for UK Trades</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Job management, engineer scheduling, CIS tax compliance, digital certificates, fleet tracking, and invoicing — all in one platform. Built specifically for UK plumbers, electricians, and HVAC engineers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#1E3A5F] text-white text-lg font-semibold rounded-xl hover:bg-[#162D4A] transition-all shadow-lg hover:shadow-xl min-h-[48px]"
              >
                Start Free Trial
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#1E3A5F] text-lg font-semibold rounded-xl border-2 border-[#1E3A5F] hover:bg-[#EFF6FF] transition-all min-h-[48px]"
              >
                See How It Works →
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Works offline
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                CIS tax compliant
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                From £39/user/month
              </span>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Background illustration */}
            <div className="absolute inset-0 -z-10 opacity-30 hidden lg:block">
              <HeroIllustration className="w-full h-full" />
            </div>
            <div className="w-56 sm:w-64 lg:w-72">
              <PhoneMockup className="animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
