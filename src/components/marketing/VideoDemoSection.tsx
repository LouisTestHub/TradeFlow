'use client';

import { ScrollFadeIn } from './ScrollFadeIn';

export function VideoDemoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollFadeIn>
          <p className="text-sm font-semibold text-[#1E3A5F] uppercase tracking-wider mb-2">Product Demo</p>
          <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
            See TradeFlow in 2 Minutes
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Watch how UK tradespeople manage jobs, schedule engineers, and stay CIS-compliant — all from one platform.
          </p>
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
            {/* Placeholder dashboard thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-3 gap-4 p-8 h-full">
                  <div className="bg-white/10 rounded-lg" />
                  <div className="bg-white/10 rounded-lg col-span-2" />
                  <div className="bg-white/10 rounded-lg col-span-2" />
                  <div className="bg-white/10 rounded-lg" />
                </div>
              </div>
              <div className="w-20 h-20 bg-[#F97316] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-10">2:08</div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
