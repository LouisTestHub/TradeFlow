import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingSection } from '@/components/marketing/PricingSection';
import { FetfSection } from '@/components/marketing/FetfSection';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Solo £39 | Team £59 | Business £79/user/month',
  description: 'Simple, transparent pricing for UK field service software. Solo £39, Team £59, Business £79/user/month. Gas Safe + NICEIC + CIS included. 30-day free trial. No credit card needed.',
};

const comparisonMatrix = [
  { feature: 'Job management & tracking', solo: true, team: true, business: true },
  { feature: 'Basic scheduling & calendar', solo: true, team: true, business: true },
  { feature: 'Mobile app (works offline)', solo: true, team: true, business: true },
  { feature: 'Customer database & history', solo: true, team: true, business: true },
  { feature: 'Basic invoicing', solo: true, team: true, business: true },
  { feature: 'Up to 3 users', solo: true, team: false, business: false },
  { feature: 'CIS tax compliance (auto-calculate 20%/30%)', solo: false, team: true, business: true },
  { feature: 'Digital certificates (Gas Safe CP12, NICEIC EICR, F-Gas)', solo: false, team: true, business: true },
  { feature: 'Smart AI scheduling & route optimisation', solo: false, team: true, business: true },
  { feature: 'Quote builder (parts + labour + markup)', solo: false, team: true, business: true },
  { feature: 'Xero / QuickBooks 2-way sync', solo: false, team: true, business: true },
  { feature: 'Payment links (Stripe / GoCardless)', solo: false, team: true, business: true },
  { feature: 'Service reminders (SMS/email)', solo: false, team: true, business: true },
  { feature: 'Basic fleet tracking', solo: false, team: true, business: true },
  { feature: 'Supplier ordering (CEF, Screwfix, Toolstation)', solo: false, team: false, business: true },
  { feature: 'Advanced fleet tracking & fuel monitoring', solo: false, team: false, business: true },
  { feature: 'Parts inventory & van stock management', solo: false, team: false, business: true },
  { feature: 'Custom workflows & automations', solo: false, team: false, business: true },
  { feature: 'Advanced reporting, analytics & dashboards', solo: false, team: false, business: true },
  { feature: 'API access for custom integrations', solo: false, team: false, business: true },
  { feature: 'SMS alerts & automated chase sequences', solo: false, team: false, business: true },
  { feature: 'Priority UK phone support', solo: false, team: false, business: true },
  { feature: 'Multi-branch management', solo: false, team: false, business: true },
];

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — 30 days, full access, no credit card required. You can also try our instant demo (no signup needed) to see TradeFlow in action right now.',
  },
  {
    q: 'What\'s included in the price?',
    a: 'Everything listed in the feature matrix above. No hidden fees, no setup costs. Gas Safe, NICEIC, F-Gas certificate templates and CIS tax compliance are included in Team and Business plans — not charged as add-ons.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes — upgrade or downgrade at any time. Changes take effect on your next billing cycle. No penalty fees.',
  },
  {
    q: 'Is there a contract?',
    a: 'No. Month-to-month billing. Cancel anytime with 30 days notice. We earn your business every month.',
  },
  {
    q: 'Do I need to pay for each engineer?',
    a: 'Yes — pricing is per user/month. Solo plan includes up to 3 users. Team and Business plans are priced per user. Volume discounts available for 10+ users.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes — UK-hosted servers (AWS London), encrypted in transit (TLS 1.3) and at rest (AES-256), daily backups, ICO registered, GDPR compliant.',
  },
  {
    q: 'What about ServiceTitan — isn\'t that the market leader?',
    a: 'ServiceTitan is excellent for large US businesses — but it starts at $300+/month, requires a 12-month contract, has a £5k+ setup fee, and has zero UK compliance features (no Gas Safe, NICEIC, CIS). TradeFlow gives UK trades everything they need from £39/month.',
  },
  {
    q: 'How does TradeFlow compare to Jobber?',
    a: 'Jobber is a clean, affordable tool — but it\'s built in Canada with zero UK compliance features. No Gas Safe certificates, no NICEIC EICRs, no CIS tax, no UK supplier integrations. If you\'re a regulated UK tradesperson, Jobber won\'t cut it.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PricingSection />

        {/* Gas Safe + NICEIC + CIS Banner */}
        <section className="bg-[#F97316] py-4">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-white font-bold text-lg">
              🏆 Gas Safe + NICEIC + F-Gas + CIS tax compliance included in Team & Business plans — no add-on fees
            </p>
          </div>
        </section>

        {/* Comparison matrix */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-[#0F172A] font-[var(--font-dm-sans)] mb-4">
              Feature Comparison
            </h2>
            <p className="text-center text-slate-600 mb-12">
              Every plan includes the mobile app, offline mode, and UK-based support.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-4 pr-4 text-sm font-semibold text-slate-600">Feature</th>
                    <th className="py-4 px-4 text-sm font-semibold text-center text-slate-600">Solo<br /><span className="font-normal text-[#F97316]">£39/user/mo</span></th>
                    <th className="py-4 px-4 text-sm font-semibold text-center text-white bg-[#1E3A5F] rounded-t-lg">Team ⭐<br /><span className="font-normal text-blue-200">£59/user/mo</span></th>
                    <th className="py-4 px-4 text-sm font-semibold text-center text-slate-600">Business<br /><span className="font-normal text-[#F97316]">£79/user/mo</span></th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMatrix.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3 pr-4 text-sm text-slate-700">{row.feature}</td>
                      {[row.solo, row.team, row.business].map((val, j) => (
                        <td key={j} className={`py-3 px-4 text-center ${j === 1 ? 'bg-[#EFF6FF]/30' : ''}`}>
                          {val ? (
                            <svg className="w-5 h-5 text-[#22C55E] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Money back guarantee */}
            <div className="mt-16 bg-[#EFF6FF] rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-[#1E3A5F] font-[var(--font-dm-sans)] mb-3">
                💪 Money-Back Guarantee
              </h3>
              <p className="text-slate-700 max-w-2xl mx-auto">
                If you don&apos;t save at least 5 hours/week on admin in your first month, we&apos;ll refund you. No questions asked. That&apos;s how confident we are.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-[#0F172A] font-[var(--font-dm-sans)] mb-12">
              Pricing FAQ
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-bold text-[#0F172A] mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FetfSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
