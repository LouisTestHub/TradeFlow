import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TradeFlow vs ServiceTitan vs Jobber vs Fergus vs Commusoft',
  description: 'Compare TradeFlow to ServiceTitan ($300+/mo US), Jobber (no UK compliance), Fergus (NZ-based), Commusoft, and spreadsheets. See why UK tradespeople choose TradeFlow.',
};

const comparisonData = {
  categories: [
    {
      name: 'Pricing & Value',
      features: [
        { name: 'Starting price (per user/month)', tradeflow: '£39', servicetitan: '$300+ (£240+)', jobber: '£55', fergus: 'NZ$99 (£50)', commusoft: '£70+', spreadsheets: 'Free' },
        { name: 'Hidden fees / setup costs', tradeflow: 'None', servicetitan: 'Yes (£5k+ setup)', jobber: 'None', fergus: 'None', commusoft: 'Setup fee', spreadsheets: '—' },
        { name: 'Contract required', tradeflow: 'No — cancel anytime', servicetitan: 'Yes (12 months)', jobber: 'No', fergus: 'No', commusoft: '12 months', spreadsheets: '—' },
        { name: 'Free trial', tradeflow: '30 days + live demo', servicetitan: 'No', jobber: '14 days', fergus: '14 days', commusoft: 'No', spreadsheets: '—' },
      ],
    },
    {
      name: 'UK-Specific Compliance (The Big Differentiator)',
      features: [
        { name: 'CIS tax compliance built-in', tradeflow: '✓ Full', servicetitan: '✗ US-focused', jobber: '✗', fergus: '✗ NZ-focused', commusoft: 'Basic', spreadsheets: 'Manual' },
        { name: 'Gas Safe CP12 certificates', tradeflow: '✓ Digital', servicetitan: '✗', jobber: '✗', fergus: '✗', commusoft: '✓ Basic', spreadsheets: 'Paper' },
        { name: 'NICEIC/NAPIT EICR certificates', tradeflow: '✓ Digital', servicetitan: '✗', jobber: '✗', fergus: '✗', commusoft: 'Limited', spreadsheets: 'Paper' },
        { name: 'F-Gas compliance tracking', tradeflow: '✓ Full', servicetitan: '✗', jobber: '✗', fergus: '✗', commusoft: '✗', spreadsheets: 'Manual' },
        { name: 'Auto certificate renewal reminders', tradeflow: '✓ SMS/Email', servicetitan: '✗', jobber: '✗', fergus: '✗', commusoft: 'Basic', spreadsheets: '✗' },
        { name: 'Xero UK integration (with CIS tags)', tradeflow: '✓ 2-way sync', servicetitan: 'Limited', jobber: '✓ (no CIS)', fergus: '✓ (NZ Xero)', commusoft: '✓', spreadsheets: 'Manual' },
      ],
    },
    {
      name: 'Core Features',
      features: [
        { name: 'Job management', tradeflow: '✓', servicetitan: '✓', jobber: '✓', fergus: '✓', commusoft: '✓', spreadsheets: 'Manual' },
        { name: 'Smart AI scheduling & routing', tradeflow: '✓ AI-powered', servicetitan: '✓', jobber: 'Basic', fergus: 'Basic', commusoft: '✓', spreadsheets: '✗' },
        { name: 'Mobile app (offline mode)', tradeflow: '✓ Full offline', servicetitan: '✓', jobber: 'Limited', fergus: 'Limited', commusoft: 'Limited', spreadsheets: '✗' },
        { name: 'Quoting & invoicing', tradeflow: '✓ + payment links', servicetitan: '✓', jobber: '✓', fergus: '✓', commusoft: '✓', spreadsheets: 'Manual' },
        { name: 'Fleet tracking (GPS)', tradeflow: '✓', servicetitan: '✓', jobber: '✓', fergus: '✗', commusoft: '✓', spreadsheets: '✗' },
        { name: 'Supplier ordering (CEF, Screwfix etc)', tradeflow: '✓ Built-in', servicetitan: '✗ US suppliers', jobber: '✗', fergus: '✗', commusoft: '✗', spreadsheets: '✗' },
        { name: 'Payment links (Stripe/GoCardless)', tradeflow: '✓', servicetitan: '✓ (US payments)', jobber: '✓', fergus: '✓', commusoft: '✓', spreadsheets: '✗' },
      ],
    },
    {
      name: 'Usability & Support',
      features: [
        { name: 'Easy to learn', tradeflow: 'Yes — 1 hour setup', servicetitan: 'Steep learning curve', jobber: 'Yes', fergus: 'Yes', commusoft: 'Moderate', spreadsheets: 'Yes' },
        { name: 'Works offline (basements/lofts)', tradeflow: '✓ Full offline sync', servicetitan: 'Partial', jobber: 'Limited', fergus: 'Limited', commusoft: '✗', spreadsheets: '✓' },
        { name: 'Setup time', tradeflow: '1 hour', servicetitan: '2-4 weeks', jobber: '2-3 days', fergus: '1-2 days', commusoft: '1-2 weeks', spreadsheets: 'Ongoing' },
        { name: 'UK-based support', tradeflow: '✓ Phone + email', servicetitan: '✗ US/Canada', jobber: '✗ Canada', fergus: '✗ New Zealand', commusoft: '✓ UK', spreadsheets: '✗' },
      ],
    },
  ],
};

const alternatives = [
  {
    name: 'ServiceTitan',
    logo: '🇺🇸',
    tagline: 'The US enterprise giant — overkill and overpriced for UK trades',
    pros: ['Enterprise-grade features', 'Mature platform (est. 2012)', 'Good for large US HVAC/plumbing'],
    cons: ['US-focused — zero UK compliance (no CIS, Gas Safe, NICEIC)', '$300+/user/month (£240+)', 'Expensive setup (£5k+)', '12-month contracts', 'Overkill for UK SMEs with 1-20 engineers'],
    bestFor: 'Large US-based HVAC/plumbing franchises with 50+ engineers and US-specific needs.',
    verdict: 'If you\'re a UK tradesperson, ServiceTitan is like buying a left-hand-drive lorry — impressive but wrong for the road.',
  },
  {
    name: 'Jobber',
    logo: '🇨🇦',
    tagline: 'Clean UI, but built for Canadian landscapers — not UK plumbers',
    pros: ['Clean, modern UI', 'Good for solo traders', 'Affordable (£55/mo)'],
    cons: ['Zero UK compliance features', 'No Gas Safe/NICEIC/F-Gas certificates', 'No CIS tax built-in', 'No UK supplier integrations', 'Limited offline mode', 'Canadian support hours'],
    bestFor: 'General field service businesses (landscaping, cleaning, handyman) — not UK trades-specific.',
    verdict: 'Great for a Canadian landscaper. Useless for a Gas Safe engineer in Birmingham.',
  },
  {
    name: 'Fergus',
    logo: '🇳🇿',
    tagline: 'Built in New Zealand — strong on quoting, weak on UK compliance',
    pros: ['Good quoting and job costing', 'Clean interface', 'Trades-focused'],
    cons: ['New Zealand-based — no UK compliance', 'No Gas Safe, NICEIC, or F-Gas certificates', 'No CIS tax features', 'NZ Xero integration (not UK-optimised)', 'No UK supplier connections', 'Support in NZ timezone'],
    bestFor: 'Kiwi and Aussie tradespeople. Not built for UK regulatory requirements.',
    verdict: 'Solid product, wrong country. No UK compliance = no deal for regulated trades.',
  },
  {
    name: 'Commusoft',
    logo: '🇬🇧',
    tagline: 'UK-based and trades-focused — but expensive with a dated UI',
    pros: ['UK-based company', 'Trades-focused', 'Some Gas Safe integration', 'UK phone support'],
    cons: ['Expensive (£70+/user — nearly 2x TradeFlow)', 'Dated, clunky UI', 'Slow customer support response times', 'No offline mode', '12-month contracts', 'Limited F-Gas support'],
    bestFor: 'Established UK trades businesses with budget for enterprise software and tolerance for older interfaces.',
    verdict: 'The closest UK competitor — but nearly twice the price with half the features.',
  },
  {
    name: 'Spreadsheets (Excel / Google Sheets)',
    logo: '📊',
    tagline: 'Free and flexible — until you lose a certificate or miss a CIS deadline',
    pros: ['Free', 'Flexible', 'You control everything', 'Everyone knows Excel'],
    cons: ['No automation whatsoever', 'Manual data entry = errors + wasted time', 'No offline sync between devices', 'Lost certificates', 'No compliance tracking', 'No scheduling or dispatch', 'Getting paid takes forever'],
    bestFor: 'Hobby businesses or solo traders who don\'t value their time at £30+/hour.',
    verdict: 'Every hour you spend on spreadsheets is an hour you\'re not earning. At £50/hr, TradeFlow pays for itself in day one.',
  },
];

export default function ComparisonPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1E3A5F] to-[#0D47A1] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold leading-tight mb-6">
              TradeFlow vs <span className="text-[#F97316]">Everyone Else</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-4">
              The only UK field service platform with Gas Safe + NICEIC + CIS + F-Gas compliance built in. See how we compare to ServiceTitan ($300+/mo), Jobber, Fergus, and Commusoft.
            </p>
            <p className="text-sm text-blue-200 italic">
              Spoiler: none of them have full UK compliance. We do. From £39/user/month.
            </p>
          </div>
        </section>

        {/* Key Differentiator Banner */}
        <section className="bg-[#F97316] py-4">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-white font-bold text-lg">
              🏆 The only platform combining Gas Safe + NICEIC + F-Gas + CIS tax in one place — from £39/user/month
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
                        <th className="py-3 px-3 text-left font-semibold text-slate-600 min-w-[140px]">Feature</th>
                        <th className="py-3 px-3 text-center font-semibold text-white bg-[#1E3A5F] rounded-t-lg min-w-[100px]">
                          TradeFlow<br />
                          <span className="text-xs font-normal text-blue-200">🇬🇧 £39/mo</span>
                        </th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-600 min-w-[100px]">
                          ServiceTitan<br />
                          <span className="text-xs font-normal">🇺🇸 $300+/mo</span>
                        </th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-600 min-w-[90px]">
                          Jobber<br />
                          <span className="text-xs font-normal">🇨🇦 £55/mo</span>
                        </th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-600 min-w-[90px]">
                          Fergus<br />
                          <span className="text-xs font-normal">🇳🇿 £50/mo</span>
                        </th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-600 min-w-[90px]">
                          Commusoft<br />
                          <span className="text-xs font-normal">🇬🇧 £70+/mo</span>
                        </th>
                        <th className="py-3 px-3 text-center font-semibold text-slate-600 min-w-[90px]">
                          Spreadsheets<br />
                          <span className="text-xs font-normal">📊</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((row, j) => (
                        <tr key={j} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-3 text-slate-700 font-medium">{row.name}</td>
                          <td className="py-3 px-3 text-center font-semibold text-[#1565C0] bg-[#EFF6FF]/50">{row.tradeflow}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{row.servicetitan}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{row.jobber}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{row.fergus}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{row.commusoft}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{row.spreadsheets}</td>
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
            <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] text-center mb-4">
              How Each Alternative Stacks Up
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              We&apos;ve done the research so you don&apos;t have to. Here&apos;s the honest truth about every option.
            </p>
            <div className="space-y-6">
              {alternatives.map((alt, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{alt.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0F172A] font-[var(--font-dm-sans)]">{alt.name}</h3>
                      <p className="text-sm text-slate-500 italic">{alt.tagline}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-[#22C55E] uppercase mb-2">Pros</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {alt.pros.map((pro, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-[#22C55E] mt-0.5 flex-shrink-0">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#EF4444] uppercase mb-2">Cons</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {alt.cons.map((con, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-[#EF4444] mt-0.5 flex-shrink-0">✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Best for</p>
                      <p className="text-sm text-slate-700">{alt.bestFor}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1565C0] uppercase mb-1">Our Verdict</p>
                      <p className="text-sm text-slate-700 font-medium italic">{alt.verdict}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TradeFlow Wins */}
        <section className="py-16 bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold font-[var(--font-dm-sans)] mb-8">
              Why 1,000+ UK Tradespeople Chose TradeFlow
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🇬🇧', title: 'Built for UK Trades', desc: 'Gas Safe, NICEIC, CIS, F-Gas — core features, not afterthoughts' },
                { icon: '💷', title: '£39/user/month', desc: 'No hidden fees, no setup costs, no contracts. Cancel anytime.' },
                { icon: '📱', title: 'Works Offline', desc: 'Basements, lofts, rural sites — works with zero signal' },
                { icon: '⚡', title: '1 Hour Setup', desc: 'Not weeks. Import customers, configure jobs, start scheduling.' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-blue-100">{item.desc}</p>
                </div>
              ))}
            </div>
            <a
              href="/login"
              className="mt-10 inline-flex items-center justify-center px-8 py-4 bg-[#F97316] text-white text-lg font-semibold rounded-xl hover:bg-[#EA580C] transition-all shadow-lg min-h-[48px]"
            >
              🚀 Try Demo — See It for Yourself →
            </a>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
