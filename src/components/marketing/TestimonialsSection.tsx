'use client';

import { ScrollFadeIn } from './ScrollFadeIn';

const testimonials = [
  {
    quote: 'Finally — one system for jobs, certificates, and CIS. No more juggling three separate apps. My office manager loves me again.',
    name: 'Mike T.',
    farm: 'T&M Heating, Manchester',
    initials: 'MT',
  },
  {
    quote: 'The Gas Safe certificate templates saved me hours every week. Auto-filled from previous jobs, photos attached, sync to customer record. Brilliant.',
    name: 'Sarah K.',
    farm: 'SK Plumbing Services, Bristol',
    initials: 'SK',
  },
  {
    quote: 'CIS compliance was a nightmare. TradeFlow calculates deductions, syncs to Xero, generates HMRC returns. Worth every penny.',
    name: 'Robert P.',
    farm: 'ProElectrics Ltd, Birmingham',
    initials: 'RP',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#1E293B]">
              What Trades <span className="text-[#1B5E20]">Say</span>
            </h2>
          </div>
        </ScrollFadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <ScrollFadeIn key={i} delay={i * 150}>
              <div className="bg-[#FAFAF5] rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-[#F9A825]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-6 italic">
                  &quot;{t.quote}&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B5E20] flex items-center justify-center text-white text-sm font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B] text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.farm}</p>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
