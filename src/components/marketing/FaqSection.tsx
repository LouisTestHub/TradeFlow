'use client';

import { ScrollFadeIn } from './ScrollFadeIn';

const faqs = [
  {
    q: 'Does it work without internet?',
    a: 'Yes. Full offline mode on mobile. Engineers can complete job sheets, generate certificates, capture photos with no signal. Everything auto-syncs when back online.',
  },
  {
    q: 'What compliance schemes does it cover?',
    a: 'Gas Safe Register (CP12, CP15, CP42), NICEIC EICR and certificates, NAPIT, F-Gas leak checks, and CIS tax compliance. All UK-specific requirements built in.',
  },
  {
    q: 'How much does it cost?',
    a: 'From £39/user/month (Starter) to £79/user/month (Business). Most trades choose Professional at £59/user/month. Annual plans save £200+. 30-day free trial, no credit card needed.',
  },
  {
    q: 'Is my data safe?',
    a: 'UK-hosted servers (AWS London). Your data is yours — we never sell it. Encrypted in transit and at rest. Daily backups. GDPR compliant.',
  },
  {
    q: 'Does it integrate with Xero or QuickBooks?',
    a: 'Yes — deep two-way sync with Xero and QuickBooks. Jobs auto-create invoices with CIS deductions calculated. Customer data syncs both ways.',
  },
  {
    q: 'Can it handle CIS tax compliance?',
    a: 'Yes. Auto-calculate 20%/30% CIS deductions, verify subcontractors with HMRC, sync to Xero/QuickBooks, and generate monthly CIS returns. HMRC-ready with one click.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans cancel anytime. Annual plans refundable within first 30 days. Export all your data before you leave (CSV, PDF).',
  },
  {
    q: 'What about existing records — can I import?',
    a: 'Yes. CSV import for customers, jobs, and historical records. We\'ll help you migrate during your free trial. Onboarding support included.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Frequently Asked <span className="text-[#1E3A5F]">Questions</span>
            </h2>
          </div>
        </ScrollFadeIn>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollFadeIn key={i} delay={i * 50}>
              <details className="group bg-[#F8FAFC] rounded-xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between p-5 sm:p-6 font-semibold text-[#0F172A] cursor-pointer min-h-[48px] hover:bg-[#EFF6FF]/50 transition-colors">
                  <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                  <svg className="faq-chevron w-5 h-5 flex-shrink-0 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </ScrollFadeIn>
          ))}
        </div>
      </div>

      {/* FAQ Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
