import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies — Real Results from UK Tradespeople',
  description: 'See how UK plumbers, electricians, and HVAC engineers use TradeFlow to save time, grow revenue, and eliminate admin chaos.',
};

const caseStudies = [
  {
    slug: 'daves-plumbing-essex',
    company: "Dave's Plumbing & Heating",
    location: 'Basildon, Essex',
    trade: 'Plumbing & Heating',
    engineer: 'Dave Thompson',
    headline: 'Saved 15 hours/week and added £28K revenue in 6 months',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop&q=80',
    stats: [
      { label: 'Time saved', value: '15 hrs/week' },
      { label: 'Revenue increase', value: '£28k in 6mo' },
      { label: 'Engineers hired', value: '1 → 6' },
    ],
  },
  {
    slug: 'spark-right-electrical-london',
    company: 'Spark Right Electrical',
    location: 'Hackney, London',
    trade: 'Electrical Services',
    engineer: 'Marcus Osei',
    headline: 'Scaled from 3 to 12 NICEIC engineers — +£180k/year revenue',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&q=80',
    stats: [
      { label: 'Engineers', value: '3 → 12' },
      { label: 'Revenue increase', value: '+£180k/year' },
      { label: 'First-time fix', value: '68% → 89%' },
    ],
  },
  {
    slug: 'coolflow-hvac-birmingham',
    company: 'CoolFlow HVAC',
    location: 'Solihull, Birmingham',
    trade: 'HVAC & Refrigeration',
    engineer: 'James Kavanagh',
    headline: 'F-Gas audit passed first time, 25% more jobs/week, retention up 40%',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop&q=80',
    stats: [
      { label: 'F-Gas audit', value: 'Passed' },
      { label: 'More jobs/week', value: '+25%' },
      { label: 'Retention up', value: '+40%' },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="py-20 lg:py-28 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight">
                Real Results from <span className="text-[#1565C0]">UK Tradespeople</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600">
                See how plumbers, electricians, and HVAC engineers are using TradeFlow to save time, grow revenue, and eliminate admin chaos.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {caseStudies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#1565C0] to-[#0D47A1] relative overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.company}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm font-medium opacity-90">{study.trade} • {study.location}</p>
                      <h2 className="text-xl font-bold font-[var(--font-dm-sans)] mt-1">{study.company}</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-base font-semibold text-[#0F172A] mb-4">&quot;{study.headline}&quot;</p>
                    <div className="grid grid-cols-3 gap-3">
                      {study.stats.map((stat, i) => (
                        <div key={i}>
                          <p className="text-xl font-bold text-[#1565C0]">{stat.value}</p>
                          <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-[#FF6F00] font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read full story →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
