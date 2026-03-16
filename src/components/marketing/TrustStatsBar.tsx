'use client';

export function TrustStatsBar() {
  return (
    <section className="bg-[#1E3A5F] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { value: '1,000+', label: 'UK Tradespeople' },
            { value: '£5M+', label: 'Invoiced' },
            { value: '10,000+', label: 'Jobs Completed' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-bold text-[#F97316] tabular-nums">{stat.value}</div>
              <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
