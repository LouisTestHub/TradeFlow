'use client';

import { ScrollFadeIn } from './ScrollFadeIn';

export function UnlimitedSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#1E3A5F] to-[#2563EB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollFadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">No Limits. No Surprises.</h2>
          <p className="text-blue-100 text-lg mb-8">Every plan gives you room to grow — without per-seat gotchas.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '👷', label: 'Unlimited Engineers' },
              { icon: '🔧', label: 'Unlimited Jobs' },
              { icon: '☁️', label: 'Unlimited Storage' },
            ].map((item) => (
              <div key={item.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xl font-bold text-white">{item.label}</div>
              </div>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
