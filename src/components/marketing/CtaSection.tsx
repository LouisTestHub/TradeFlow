'use client';

import Link from 'next/link';
import { ScrollFadeIn } from './ScrollFadeIn';

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1E3A5F] via-[#2563EB] to-[#1E3A5F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollFadeIn>
          <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Stop Juggling Disconnected Systems.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Start your free 30-day trial. No credit card. No commitment. Set up in 15 minutes.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center px-10 py-4 bg-[#F97316] text-white text-lg font-bold rounded-xl hover:bg-[#EA580C] transition-all shadow-lg hover:shadow-xl min-h-[48px]"
          >
            Start Free Trial
          </Link>
          <p className="mt-4 text-sm text-blue-200">
            Join 2,000+ UK trades businesses making field service simple.
          </p>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
