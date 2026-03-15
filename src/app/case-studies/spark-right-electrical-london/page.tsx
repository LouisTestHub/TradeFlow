import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spark Right Electrical — Scaled from 3 to 12 Engineers in 18 Months',
  description: 'London electrical contractor Marcus Osei grew from 3 to 12 NICEIC engineers, increased revenue by £180k/year, and improved first-time fix rate to 89% with TradeFlow.',
};

export default function SparkRightCaseStudy() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&h=900&fit=crop"
              alt="Electrician at work"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm">
              ← Back to case studies
            </Link>
            <p className="text-sm font-medium mb-2 opacity-90">Electrical Services • London</p>
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold leading-tight mb-6">
              How Spark Right Electrical Scaled from 3 to 12 Engineers in 18 Months
            </h1>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="opacity-80">Company</p>
                <p className="font-semibold">Spark Right Electrical Ltd</p>
              </div>
              <div>
                <p className="opacity-80">Director</p>
                <p className="font-semibold">Marcus Osei</p>
              </div>
              <div>
                <p className="opacity-80">Location</p>
                <p className="font-semibold">Hackney, London</p>
              </div>
              <div>
                <p className="opacity-80">Using TradeFlow Since</p>
                <p className="font-semibold">September 2024</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-[#FF6F00]">3 → 12</p>
                <p className="text-slate-600 mt-2">Engineers hired</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#FF6F00]">+£180k/year</p>
                <p className="text-slate-600 mt-2">Revenue increase</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#FF6F00]">68% → 89%</p>
                <p className="text-slate-600 mt-2">First-time fix rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 lg:py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)]">The Problem</h2>
              <p className="text-slate-700 leading-relaxed">
                Marcus Osei started Spark Right Electrical in 2019 with 2 other NICEIC-approved electricians, focusing on domestic and light commercial work across East London. By 2024, they had steady work but were stuck at 3 engineers.
              </p>
              <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-slate-700">
                &quot;We wanted to grow, but our systems couldn&apos;t scale. We were using a basic job app, Excel for invoicing, NICEIC certificates on paper, and WhatsApp for dispatch. Hiring a 4th engineer meant I&apos;d need to hire an office admin just to coordinate everyone. The maths didn&apos;t work.&quot;
              </blockquote>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">What Changed</h2>
              <p className="text-slate-700 leading-relaxed">
                Marcus switched to TradeFlow in September 2024. The platform&apos;s smart scheduling and digital certificates let him scale operations without hiring office staff:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li><strong>Smart engineer dispatch</strong> — TradeFlow automatically assigns jobs based on skills (EV charging, PAT testing, emergency call-outs), engineer location, and availability. &quot;I went from spending 2 hours/day on scheduling to 15 minutes.&quot;</li>
                <li><strong>Digital NICEIC certificates</strong> — Engineers complete EICR, PAT, and installation certificates on-site. Auto-filed, auto-synced, searchable. No more lost paperwork.</li>
                <li><strong>Parts tracking</strong> — &quot;We can see which jobs are profitable and which are losing money on parts. We&apos;ve tightened our quoting and margins have improved 12%.&quot;</li>
                <li><strong>Customer portal</strong> — Clients can see job history, certificates, and invoices. &quot;We look more professional than competitors 3x our size.&quot;</li>
              </ul>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">The Results</h2>
              <p className="text-slate-700 leading-relaxed">
                With TradeFlow handling operations, Marcus started hiring. In 18 months:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li>Grew from 3 to 12 NICEIC-approved engineers</li>
                <li>Annual revenue increased by £180,000</li>
                <li>First-time fix rate improved from 68% to 89% (better parts tracking, job history visibility)</li>
                <li>Won 3 commercial maintenance contracts (looking professional with digital certificates helped)</li>
                <li>Engineer utilisation up 23% — smarter scheduling = less windscreen time, more billable hours</li>
              </ul>

              <blockquote className="border-l-4 border-[#1565C0] pl-4 italic text-slate-700 bg-[#EFF6FF] p-4 rounded-r-xl">
                &quot;TradeFlow gave us the operational backbone to scale. We went from 3 engineers doing £180k/year to 12 engineers doing £520k/year — and I&apos;m still the only person in the office. That wouldn&apos;t have been possible with our old setup.&quot;
                <footer className="not-italic font-semibold text-[#0F172A] mt-2">— Marcus Osei, Director</footer>
              </blockquote>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">Game-Changing Features</h2>
              <div className="grid sm:grid-cols-2 gap-6 not-prose">
                {[
                  { icon: '🗓️', title: 'Smart Scheduling', desc: 'Auto-assign jobs by skill, location, availability. Route optimisation built-in' },
                  { icon: '📋', title: 'Digital NICEIC Certificates', desc: 'EICR, PAT, installation certs. Completed on-site, auto-filed, NICEIC-ready' },
                  { icon: '📦', title: 'Parts Tracking', desc: 'Job costing with parts + labour. Know which jobs are profitable' },
                  { icon: '👥', title: 'Customer Portal', desc: 'Clients see job history, certificates, invoices. Professional image' },
                ].map((feature, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-bold text-[#0F172A] mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">What&apos;s Next</h2>
              <p className="text-slate-700 leading-relaxed">
                Marcus is now looking at expanding into commercial maintenance contracts. With TradeFlow&apos;s compliance tracking (NICEIC, PAT testing schedules, emergency call-out SLAs), he&apos;s confident they can manage multi-site contracts without drowning in admin.
              </p>
              <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-slate-700">
                &quot;We&apos;re bidding on contracts that would have terrified us 18 months ago. TradeFlow handles the operational complexity — scheduling, compliance, invoicing — so we can focus on delivering quality electrical work and winning new business.&quot;
              </blockquote>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
