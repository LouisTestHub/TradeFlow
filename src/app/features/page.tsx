import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Field Service Software for UK Trades',
  description: 'Job management, engineer scheduling, CIS tax compliance, digital certificates (Gas Safe, NICEIC, F-Gas), fleet tracking, quoting and invoicing, supplier connections, service reminders. Everything UK trades need in one platform.',
};

const detailedFeatures = [
  {
    title: 'Job Management & Scheduling',
    description: 'Create jobs from first customer call. Assign to engineers based on skills, location, and availability. Track progress from quote to completion. Mobile app updates in real-time. Customer history always visible — previous jobs, certificates, notes. Reactive and planned maintenance workflows. Landlord portfolio management with property lists and recurring service schedules.',
    comparison: 'Paper job sheets: lost, illegible. TradeFlow: always synced, always accessible.',
    color: '#1E3A5F',
  },
  {
    title: 'Engineer Scheduling & Dispatch',
    description: 'Smart scheduling optimises routes, reduces fuel costs, maximises jobs per day. Engineers see their schedule on mobile. Office can reassign on the fly. Track engineer location (with consent) for accurate ETAs. First-time fix rate tracking. Skills-based routing — send Gas Safe engineers to boiler jobs, NICEIC engineers to electrical jobs, F-Gas engineers to AC jobs.',
    comparison: 'Manual scheduling: 30 mins/day wasted. TradeFlow AI scheduling: 2 minutes.',
    color: '#2563EB',
  },
  {
    title: 'CIS Tax Compliance',
    description: 'Auto-calculate 20%/30% CIS deductions on subcontractor payments. Verify subbies with HMRC via UTR lookup. Sync to Xero/QuickBooks with CIS tags. Generate monthly HMRC returns with one click. Never miss a CIS deadline again. CIS payment statements auto-generated and emailed to subcontractors.',
    comparison: 'Manual CIS tracking: error-prone, penalties up to £3,000. TradeFlow: automated, HMRC-ready.',
    color: '#F97316',
  },
  {
    title: 'Digital Certificates (Gas Safe, NICEIC, F-Gas)',
    description: 'Pre-filled certificate templates from previous jobs. Gas Safe CP12 landlord safety certs, NICEIC EICR condition reports, F-Gas leak checks, PAT testing records. Attach photos as evidence. Customer signatures on-screen. Auto-sync to customer records. Submit to compliance registers. Never lose a certificate again. Auto-reminders when annual certs are due.',
    comparison: 'Paper certificates: filed in the van, lost, illegible. TradeFlow: digital, searchable, safe.',
    color: '#EF4444',
  },
  {
    title: 'Fleet Tracking & Job Costing',
    description: 'Track engineer vehicles via GPS. Link mileage to jobs for accurate costing. Monitor fuel usage. Service reminders for vans — MOT, tax, insurance. Job profitability tracking — know which jobs make money and which cost you. Van stock tracking — know what parts are in each vehicle.',
    comparison: 'Manual mileage logs: forgotten, inaccurate. TradeFlow: automatic, linked to jobs.',
    color: '#0F766E',
  },
  {
    title: 'Quoting, Invoicing & Payment Links',
    description: 'Professional quotes with your branding. Quote builder with parts + labour + markup. Convert quotes to jobs with one tap. Auto-generate invoices with CIS deductions applied. Send payment links via SMS/email — customers pay instantly via Stripe or GoCardless. Track overdue invoices. Chase automations. Get paid 2x faster than paper invoicing.',
    comparison: 'Paper invoices: avg 28 days to get paid. TradeFlow payment links: avg 3 days.',
    color: '#22C55E',
  },
  {
    title: 'Xero & QuickBooks Integration',
    description: 'Two-way sync with Xero and QuickBooks. Invoices, payments, CIS deductions, customer records — all synced automatically. No more double-entry. Bank reconciliation matches instantly. Your accountant will love you.',
    comparison: 'Manual accounting sync: 3-5 hours/week. TradeFlow: real-time, zero effort.',
    color: '#6366F1',
  },
  {
    title: 'Supplier Connections',
    description: 'Order parts directly from CEF, Screwfix, Toolstation, City Plumbing, and Wolseley — all from within TradeFlow. Track supplier orders against jobs. Compare prices across suppliers. Auto-attach supplier invoices to job costs. Trade account integration for account pricing.',
    comparison: 'Calling 3 suppliers for a price: 30 mins. TradeFlow price comparison: 30 seconds.',
    color: '#8B5CF6',
  },
  {
    title: 'Service Reminders & Customer Retention',
    description: 'Automated SMS and email reminders for annual boiler services, electrical inspections, F-Gas leak checks, PAT tests. Customers book directly from the reminder link. Recurring revenue on autopilot. Landlord portfolio reminders for CP12 renewals across all properties. Never miss a renewal — never lose a customer.',
    comparison: 'Forgetting annual services: lost revenue. TradeFlow reminders: £8k+ average annual retention boost.',
    color: '#EC4899',
  },
  {
    title: 'Mobile App — Works Offline',
    description: 'Full-featured mobile app for iOS and Android. Works in basements, lofts, and rural sites with zero signal. Syncs automatically when connection returns. Engineers complete jobs, take photos, get signatures, and fill certificates — all from their phone. No signal required.',
    comparison: 'Cloud-only apps: useless without signal. TradeFlow: works everywhere.',
    color: '#14B8A6',
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
                TradeFlow replaces your disconnected job management, accounting, certificates, fleet tracking, and supplier ordering with one unified platform. The only UK field service software with Gas Safe + NICEIC + CIS built in.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {['Gas Safe ✓', 'NICEIC ✓', 'F-Gas ✓', 'CIS Tax ✓', 'Xero Sync ✓', 'Offline ✓'].map((badge) => (
                  <span key={badge} className="bg-[#EFF6FF] text-[#1E3A5F] px-4 py-2 rounded-full text-sm font-semibold border border-[#1E3A5F]/10">
                    {badge}
                  </span>
                ))}
              </div>
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

            {/* Supplier Logos */}
            <div className="mt-20 text-center">
              <h2 className="text-2xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mb-8">
                Integrated With the Suppliers You Already Use
              </h2>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                {['CEF', 'Screwfix', 'Toolstation', 'City Plumbing', 'Wolseley', 'Xero', 'QuickBooks', 'Stripe', 'GoCardless'].map((supplier) => (
                  <div key={supplier} className="bg-white rounded-xl px-6 py-4 border border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-600 text-lg">{supplier}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* From quote to payment */}
            <div className="mt-20 bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] rounded-2xl p-8 lg:p-12 text-white text-center">
              <h2 className="text-3xl font-bold font-[var(--font-dm-sans)] mb-4">
                From Quote to Payment in One Click
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Quote → Job → Certificate → Invoice → Payment link → Paid. All in TradeFlow. No copying data between systems. No chasing invoices. No spreadsheets.
              </p>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#F97316] text-white text-lg font-semibold rounded-xl hover:bg-[#EA580C] transition-all shadow-lg min-h-[48px]"
              >
                🚀 Try Demo — No Signup Required →
              </a>
            </div>
          </div>
        </section>
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
