import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UK Trades Compliance — Gas Safe, NICEIC, NAPIT, F-Gas & CIS',
  description: 'TradeFlow handles Gas Safe CP12, NICEIC EICR, NAPIT certification, F-Gas compliance, and CIS tax deductions automatically. Stay compliant without the admin burden.',
};

const complianceSchemes = [
  {
    name: 'Gas Safe Register',
    icon: '🔥',
    color: '#1565C0',
    description: 'Digital CP12 landlord gas safety certificates, boiler installation records, emergency call-out logs.',
    features: [
      'Pre-filled CP12 templates from previous visits',
      'Attach photos as evidence (boiler serial, flue terminal)',
      'Auto-submit to Gas Safe portal (coming soon)',
      'Annual safety check reminders sent to customers',
      'Searchable certificate archive — never lose a CP12 again',
    ],
    whoNeeds: 'All Gas Safe registered engineers working on gas appliances, boilers, or pipework.',
  },
  {
    name: 'NICEIC',
    icon: '⚡',
    color: '#FF6F00',
    description: 'EICR (Electrical Installation Condition Reports), minor works certificates, installation certificates.',
    features: [
      'Digital EICR with C1/C2/C3 defect coding',
      'PAT testing schedules and certificates',
      'Installation certificates for new circuits, consumer units, EV chargers',
      'Auto-sync to NICEIC database (manual submission for now)',
      'Certificate distribution to landlords/homeowners via email/SMS',
    ],
    whoNeeds: 'NICEIC-approved electricians working on domestic or commercial electrical installations.',
  },
  {
    name: 'NAPIT',
    icon: '🔌',
    color: '#0F766E',
    description: 'Alternative to NICEIC for electrical certification. Same EICR, PAT, installation cert workflows.',
    features: [
      'NAPIT-approved certificate templates',
      'Electrical Installation Certificates (EIC)',
      'Minor Electrical Installation Works Certificates (MEIWC)',
      'Periodic Inspection and Testing (EICR)',
      'Sync to NAPIT portal (manual submission for now)',
    ],
    whoNeeds: 'NAPIT-registered electricians and electrical contractors.',
  },
  {
    name: 'F-Gas Compliance',
    icon: '❄️',
    color: '#2563EB',
    description: 'Track refrigerant handling, leak checks, and F-Gas certification for air conditioning and refrigeration engineers.',
    features: [
      'Refrigerant usage logging (R32, R410A, R134a)',
      'F-Gas leak check schedules and certificates',
      'Installation and decommissioning records',
      'Customer F-Gas equipment registers',
      'Annual leak check reminders',
    ],
    whoNeeds: 'Air conditioning and refrigeration engineers handling F-Gas refrigerants.',
  },
  {
    name: 'CIS Tax Compliance',
    icon: '💷',
    color: '#EF4444',
    description: 'Construction Industry Scheme tax deductions for subcontractors. Auto-calculate 20%/30% CIS, sync to Xero/QuickBooks.',
    features: [
      'Auto-calculate 20% or 30% CIS deductions on subcontractor payments',
      'Verify subbies with HMRC (manual check with UTR)',
      'CIS deduction statements for subcontractors',
      'Monthly CIS return summaries (export to HMRC CIS portal)',
      'Sync CIS-tagged invoices to Xero/QuickBooks',
    ],
    whoNeeds: 'Any trades business hiring subcontractors (subbies) under CIS rules.',
  },
];

export default function CompliancePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Stay Compliant Without the <span className="text-[#FF6F00]">Admin Chaos</span>
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Gas Safe, NICEIC, NAPIT, F-Gas, CIS tax — TradeFlow handles UK trades compliance so you can focus on the job, not the paperwork.
            </p>
          </div>
        </section>

        {/* Why Compliance Matters */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] text-center mb-8">
              Why UK Trades Compliance Matters
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#FFF7ED] rounded-xl p-6 border border-[#FF6F00]/20">
                <div className="text-3xl mb-2">⚖️</div>
                <h3 className="font-bold text-[#0F172A] mb-2">Legal Requirement</h3>
                <p className="text-sm text-slate-700">
                  Gas Safe, NICEIC, and F-Gas compliance is legally required. Non-compliance = fines, insurance voidance, prosecution.
                </p>
              </div>
              <div className="bg-[#EFF6FF] rounded-xl p-6 border border-[#1565C0]/20">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-bold text-[#0F172A] mb-2">Liability Protection</h3>
                <p className="text-sm text-slate-700">
                  Digital certificates with timestamps, photos, and customer signatures protect you if a job is questioned later.
                </p>
              </div>
              <div className="bg-[#F0FDF4] rounded-xl p-6 border border-[#22C55E]/20">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-bold text-[#0F172A] mb-2">Tax Efficiency</h3>
                <p className="text-sm text-slate-700">
                  CIS compliance ensures subcontractors are paid correctly and HMRC gets accurate monthly returns — avoiding penalties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Schemes */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] text-center mb-12">
              Supported Compliance Schemes
            </h2>
            <div className="space-y-8">
              {complianceSchemes.map((scheme, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${scheme.color}15`, color: scheme.color }}
                    >
                      {scheme.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mb-2">
                        {scheme.name}
                      </h3>
                      <p className="text-slate-600 mb-4">{scheme.description}</p>
                      <p className="text-sm text-slate-500 italic mb-4">
                        <strong>Who needs this:</strong> {scheme.whoNeeds}
                      </p>
                    </div>
                  </div>
                  <div className="ml-[72px]">
                    <p className="font-semibold text-[#0F172A] mb-2">Features:</p>
                    <ul className="space-y-2">
                      {scheme.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg
                            className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] text-center mb-12">
              How Compliance Works in TradeFlow
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'Engineer completes job on-site',
                  desc: 'Gas Safe CP12, NICEIC EICR, or F-Gas leak check — filled in on mobile app while at the customer&apos;s property.',
                },
                {
                  step: '2',
                  title: 'Attach photos and customer signature',
                  desc: 'Take photos as evidence (boiler serial, fusebox, refrigerant label). Get customer signature on-screen.',
                },
                {
                  step: '3',
                  title: 'Certificate auto-saved and filed',
                  desc: 'Instantly synced to cloud, searchable by customer/address/date. Engineer and office both have access.',
                },
                {
                  step: '4',
                  title: 'Auto-distributed to customer and authorities',
                  desc: 'Email/SMS to customer. Manual or auto-submit to Gas Safe, NICEIC, NAPIT portals (depending on scheme).',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#1565C0] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
