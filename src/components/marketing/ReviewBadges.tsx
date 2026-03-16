'use client';

export function ReviewBadges() {
  return (
    <section className="py-10 bg-[#F8FAFC] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 mb-6">Trusted by UK trades. Rated by the industry.</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {[
            { name: 'Capterra', rating: '4.8/5' },
            { name: 'G2', rating: '4.8/5' },
            { name: 'Software Advice', rating: '4.9/5' },
            { name: 'GetApp', rating: '4.8/5' },
          ].map((badge) => (
            <div key={badge.name} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div>
                <span className="text-sm font-semibold text-[#0F172A]">{badge.rating}</span>
                <span className="text-xs text-slate-500 ml-1">on {badge.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
