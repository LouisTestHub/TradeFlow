'use client';

import Link from 'next/link';
import { ScrollFadeIn } from './ScrollFadeIn';

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#1B5E20]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollFadeIn>
          <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Stop Juggling Disconnected Systems.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">
            Start your free 30-day trial. No credit card. No commitment. Set up in 15 minutes.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center px-10 py-4 bg-[#F9A825] text-[#1E293B] text-lg font-bold rounded-xl hover:bg-[#F9A825]/90 transition-all shadow-lg hover:shadow-xl min-h-[48px]"
          >
            Start Free Trial
          </Link>
          <p className="mt-4 text-sm text-green-200">
            Join 2,000+ UK trades businesses making field service simple.
          </p>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
