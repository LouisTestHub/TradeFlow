import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Field Service Software for UK Trades',
  description: 'Job management, engineer scheduling, CIS tax compliance, digital certificates (Gas Safe, NICEIC, F-Gas), fleet tracking, quoting and invoicing. Everything UK trades need in one platform.',
};

const detailedFeatures = [
  {
    title: 'Job Management & Scheduling',
    description: 'Create jobs from first customer call. Assign to engineers based on skills, location, and availability. Track progress from quote to completion. Mobile app updates in real-time. Customer history always visible — previous jobs, certificates, notes.',
    comparison: 'Paper job sheets: lost, illegible. TradeFlow: always synced, always accessible.',
    color: '#1E3A5F',
  },
  {
    title: 'Engineer Scheduling & Dispatch',
    description: 'Smart scheduling optimises routes, reduces fuel costs, maximises jobs per day. Engineers see their schedule on mobile. Office can reassign on the fly. Track engineer location (with consent) for accurate ETAs. First-time fix rate tracking.',
    comparison: 'Manual scheduling: 30 mins/day. TradeFlow AI scheduling: 2 minutes.',
    color: '#2563EB',
  },
  {
    title: 'CIS Tax Compliance',
    description: 'Auto-calculate 20%/30% CIS deductions on subcontractor payments. Verify subbies with HMRC. Sync to Xero/QuickBooks with CIS tags. Generate monthly HMRC returns with one click. Never miss a CIS deadline again.',
    comparison: 'Manual CIS tracking: error-prone, stressful. TradeFlow: automated, HMRC-ready.',
    color: '#F97316',
  },
  {
    title: 'Digital Certificates (Gas Safe, NICEIC, F-Gas)',
    description: 'Pre-filled certificate templates from previous jobs. Gas Safe CP12, NICEIC EICR, F-Gas leak checks. Attach photos as evidence. Auto-sync to customer records. Submit to compliance registers. Never lose a certificate again.',
    comparison: 'Paper certificates: filed in van, lost, illegible. TradeFlow: digital, searchable, safe.',
    color: '#EF4444',
  },
  {
    title: 'Fleet Tracking & Job Costing',
    description: 'Track engineer vehicles (GPS). Link mileage to jobs for accurate costing. Monitor fuel usage. Service reminders for vans. Job profitability tracking — know which jobs make money.',
    comparison: 'Manual mileage logs: forgotten, inaccurate. TradeFlow: automatic, linked to jobs.',
    color: '#0F766E',
  },
  {
    title: 'Quoting, Invoicing & Payments',
    description: 'Professional quotes with your branding. Job costing with parts + labour. Auto-generate invoices with CIS deductions. Integrated payments via Stripe/GoCardless. Track overdue invoices. Get paid faster.',
    comparison: 'Paper invoices: slow to send, slow to get paid. TradeFlow: instant, trackable.',
    color: '#22C55E',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="py-20 lg:py-28 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight">
                Everything You Need for <span className="text-[#1E3A5F]">Field Service Success</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600">
                TradeFlow replaces your disconnected job management, accounting, certificates, and fleet tracking with one unified platform.
              </p>
            </div>

            <div className="space-y-8">
              {detailedFeatures.map((feature, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 lg:p-10 border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-full min-h-[80px] rounded-full flex-shrink-0" style={{ backgroundColor: feature.color }} />
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mb-3">{feature.title}</h2>
                      <p className="text-slate-600 leading-relaxed mb-4">{feature.description}</p>
                      <p className="text-sm font-medium text-[#1E3A5F] bg-[#EFF6FF] inline-block px-4 py-2 rounded-lg">
                        📊 {feature.comparison}
                      </p>
                    </div>
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
