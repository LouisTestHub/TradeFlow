import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TradeFlow vs ServiceTitan vs Jobber vs Spreadsheets',
  description: 'Compare TradeFlow to ServiceTitan, Jobber, Commusoft, and spreadsheets. See why UK tradespeople choose TradeFlow for field service management.',
};

const comparisonData = {
  categories: [
    {
      name: 'Pricing',
      features: [
        { name: 'Starting price (per user/month)', tradeflow: '£39', servicetitan: '£150+', jobber: '£55', spreadsheets: 'Free' },
        { name: 'Hidden fees / setup costs', tradeflow: 'None', servicetitan: 'Yes (£5k+ setup)', jobber: 'None', spreadsheets: '—' },
        { name: 'Contract required', tradeflow: 'No', servicetitan: 'Yes (12 months)', jobber: 'No', spreadsheets: '—' },
      ],
    },
    {
      name: 'UK-Specific Features',
      features: [
        { name: 'CIS tax compliance built-in', tradeflow: '✓', servicetitan: '✗ (US-focused)', jobber: '✗', spreadsheets: 'Manual' },
        { name: 'Gas Safe CP12 certificates', tradeflow: '✓', servicetitan: '✗', jobber: '✗', spreadsheets: 'Paper' },
        { name: 'NICEIC/NAPIT certificate templates', tradeflow: '✓', servicetitan: '✗', jobber: '✗', spreadsheets: 'Paper' },
        { name: 'F-Gas compliance tracking', tradeflow: '✓', servicetitan: '✗', jobber: '✗', spreadsheets: 'Manual' },
        { name: 'Xero/QuickBooks UK integration', tradeflow: '✓', servicetitan: 'Limited', jobber: '✓', spreadsheets: 'Manual export' },
      ],
    },
    {
      name: 'Core Features',
      features: [
        { name: 'Job management', tradeflow: '✓', servicetitan: '✓', jobber: '✓', spreadsheets: 'Manual' },
        { name: 'Engineer scheduling', tradeflow: 'Smart AI routing', servicetitan: '✓', jobber: 'Basic', spreadsheets: '✗' },
        { name: 'Mobile app (offline mode)', tradeflow: '✓', servicetitan: '✓', jobber: 'Limited', spreadsheets: '✗' },
        { name: 'Digital certificates', tradeflow: '✓ (UK trades)', servicetitan: '✗', jobber: '✗', spreadsheets: 'Paper' },
        { name: 'Quoting & invoicing', tradeflow: '✓', servicetitan: '✓', jobber: '✓', spreadsheets: 'Manual' },
        { name: 'Fleet tracking', tradeflow: '✓', servicetitan: '✓', jobber: '✓', spreadsheets: '✗' },
      ],
    },
    {
      name: 'Usability',
      features: [
        { name: 'Easy to learn (tradespeople, not IT experts)', tradeflow: 'Yes', servicetitan: 'Steep learning curve', jobber: 'Yes', spreadsheets: 'Yes' },
        { name: 'Works offline (no signal in basements)', tradeflow: '✓ Full offline', servicetitan: 'Partial', jobber: 'Limited', spreadsheets: '✓' },
        { name: 'Setup time', tradeflow: '1 hour', servicetitan: '2-4 weeks', jobber: '2-3 days', spreadsheets: 'Ongoing' },
        { name: 'Customer support', tradeflow: 'UK-based email/phone', servicetitan: 'US/Canada priority', jobber: 'Email/chat', spreadsheets: '✗' },
      ],
    },
  ],
};

const alternatives = [
  {
    name: 'ServiceTitan',
    logo: '🇺🇸',
    pros: ['Enterprise-grade', 'Feature-rich', 'Good for HVAC/plumbing (US)'],
    cons: ['US-focused (no CIS, Gas Safe, NICEIC)', '£150+/user/month', 'Expensive setup (£5k+)', 'Overkill for UK SMEs'],
    bestFor: 'Large US-based HVAC/plumbing franchises with 50+ engineers.',
  },
  {
    name: 'Jobber',
    logo: '🇨🇦',
    pros: ['Clean UI', 'Good for solo traders', 'Affordable (£55/mo)'],
    cons: ['No UK compliance features', 'No Gas Safe/NICEIC certs', 'No CIS tax built-in', 'Limited offline mode'],
    bestFor: 'General field service businesses (landscaping, cleaning) — not UK trades-specific.',
  },
  {
    name: 'Commusoft',
    logo: '🇬🇧',
    pros: ['UK-based', 'Trades-focused', 'Gas Safe integration'],
    cons: ['Expensive (£70+/user)', 'Clunky UI', 'Slow customer support', 'No offline mode'],
    bestFor: 'Established UK trades businesses with budget for enterprise software.',
  },
  {
    name: 'Spreadsheets (Excel/Google Sheets)',
    logo: '📊',
    pros: ['Free', 'Flexible', 'You control everything'],
    cons: ['No automation', 'Manual data entry = errors', 'No offline sync', 'Lost certificates', 'Time-consuming'],
    bestFor: 'Hobby businesses or solo traders who don&apos;t value their time.',
  },
];

export default function ComparisonPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight mb-6">
              TradeFlow vs <span className="text-[#1565C0]">The Competition</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              How TradeFlow compares to ServiceTitan, Jobber, Commusoft, and spreadsheets for UK trades businesses.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              {comparisonData.categories.map((category, i) => (
                <div key={i} className="mb-12">
                  <h2 className="text-2xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mb-6">
                    {category.name}
                  </h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="py-3 px-4 text-left font-semibold text-slate-600">Feature</th>
                        <th className="py-3 px-4 text-center font-semibold text-[#1565C0] bg-[#EFF6FF]">
                          TradeFlow<br />
                          <span className="text-xs font-normal text-slate-600">🇬🇧 UK-built</span>
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-slate-600">
                          ServiceTitan<br />
                          <span className="text-xs font-normal">🇺🇸 US</span>
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-slate-600">
                          Jobber<br />
                          <span className="text-xs font-normal">🇨🇦 Canada</span>
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-slate-600">
                          Spreadsheets<br />
                          <span className="text-xs font-normal">📊</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((row, j) => (
                        <tr key={j} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-slate-700">{row.name}</td>
                          <td className="py-3 px-4 text-center font-medium bg-[#EFF6FF]/30">{row.tradeflow}</td>
                          <td className="py-3 px-4 text-center text-slate-600">{row.servicetitan}</td>
                          <td className="py-3 px-4 text-center text-slate-600">{row.jobber}</td>
                          <td className="py-3 px-4 text-center text-slate-600">{row.spreadsheets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Alternatives */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] text-center mb-12">
              How Each Alternative Stacks Up
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {alternatives.map((alt, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{alt.logo}</div>
                    <h3 className="text-xl font-bold text-[#0F172A] font-[var(--font-dm-sans)]">{alt.name}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-[#22C55E] uppercase mb-1">Pros</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {alt.pros.map((pro, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-[#22C55E] mt-0.5">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#EF4444] uppercase mb-1">Cons</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {alt.cons.map((con, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-[#EF4444] mt-0.5">✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Best for</p>
                      <p className="text-sm text-slate-700 italic">{alt.bestFor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TradeFlow Wins */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] text-center mb-8">
              Why UK Tradespeople Choose TradeFlow
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🇬🇧',
                  title: 'Built for UK Trades',
                  desc: 'Gas Safe, NICEIC, CIS tax, F-Gas — not afterthoughts, but core features. Built by people who understand UK compliance.',
                },
                {
                  icon: '💷',
                  title: 'Transparent Pricing',
                  desc: 'From £39/user/month. No hidden fees, no setup costs, no contracts. Cancel anytime.',
                },
                {
                  icon: '📱',
                  title: 'Works Offline',
                  desc: 'Engineers work in basements, lofts, sites with no signal. TradeFlow syncs when back online.',
                },
                {
                  icon: '⚡',
                  title: 'Fast Setup',
                  desc: 'Up and running in 1 hour — not weeks. Import customers, configure job types, start scheduling.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
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
