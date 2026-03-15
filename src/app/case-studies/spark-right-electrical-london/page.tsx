import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spark Right Electrical — Scaled 3 to 12 Engineers, 100% NICEIC Compliance',
  description: 'London electrical contractor Marcus Osei grew from 3 to 12 NICEIC engineers, increased revenue by £180k/year, and achieved 100% compliance with TradeFlow.',
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
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&h=900&fit=crop&q=80"
              alt="Electrician working on consumer unit"
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
                <p className="text-slate-600 mt-2">NICEIC engineers hired</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#FF6F00]">+£180k/year</p>
                <p className="text-slate-600 mt-2">Revenue increase</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#FF6F00]">100%</p>
                <p className="text-slate-600 mt-2">NICEIC cert compliance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 lg:py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)]">The Challenge</h2>
              <p className="text-slate-700 leading-relaxed">
                Marcus Osei started Spark Right Electrical in 2019 with 2 other NICEIC-approved electricians, 
                focusing on domestic and light commercial work across East London. By 2024, they had steady work 
                but were stuck at 3 engineers. NICEIC compliance was a nightmare — certificates were completed on 
                paper, often lost or misfiled, and chasing clients for signatures took hours every week.
              </p>
              <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-slate-700">
                &quot;We wanted to grow, but our systems couldn&apos;t scale. NICEIC paperwork was chaos — 
                half the time we&apos;d have to redo certificates because the original was illegible or lost. 
                We had no visibility into which jobs were profitable. Hiring a 4th engineer meant I&apos;d 
                need office admin just to keep track of everyone. The maths didn&apos;t work.&quot;
              </blockquote>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">The Solution</h2>
              <p className="text-slate-700 leading-relaxed">
                Marcus switched to TradeFlow in September 2024. The platform&apos;s digital certificates and 
                compliance tracking transformed operations:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li><strong>Digital NICEIC certificates</strong> — Engineers complete EICR, Minor Works, and 
                Installation Certificates on-site. Auto-filed, searchable, NICEIC-ready. Zero lost paperwork 
                since switching.</li>
                <li><strong>Compliance dashboard</strong> — Real-time view of all outstanding certificates, 
                overdue inspections, and cert status across all 12 engineers. NICEIC audits went from stressful 
                to straightforward.</li>
                <li><strong>Smart engineer dispatch</strong> — TradeFlow auto-assigns jobs based on skills (EV 
                charging, PAT testing, emergency call-outs), location, and availability. &quot;I went from 2 
                hours/day on scheduling to 15 minutes.&quot;</li>
                <li><strong>Job costing and parts tracking</strong> — &quot;We can see which jobs are profitable 
                and which are losing money on parts. We&apos;ve tightened our quoting and margins improved 12%.&quot;</li>
              </ul>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">The Results</h2>
              <p className="text-slate-700 leading-relaxed">
                With TradeFlow handling operations and compliance, Marcus started hiring. In 18 months:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li>Grew from <strong>3 to 12 NICEIC-approved engineers</strong></li>
                <li>Annual revenue increased by <strong>£180,000</strong></li>
                <li><strong>100% NICEIC certificate compliance</strong> — zero lost or misfiled certs</li>
                <li>Won 3 commercial maintenance contracts (digital certificates gave professional edge)</li>
                <li>Engineer utilisation up 23% — smarter scheduling = less windscreen time, more billable hours</li>
                <li>First-time fix rate improved from 68% to 89% (better job history visibility and parts tracking)</li>
              </ul>

              <blockquote className="border-l-4 border-[#1565C0] pl-4 italic text-slate-700 bg-[#EFF6FF] p-4 rounded-r-xl">
                &quot;TradeFlow gave us the operational backbone to scale. We went from 3 engineers doing 
                £180k/year to 12 engineers doing £520k/year — and I&apos;m still the only person in the office. 
                NICEIC compliance went from a weekly headache to automatic. That wouldn&apos;t have been 
                possible with our old setup.&quot;
                <footer className="not-italic font-semibold text-[#0F172A] mt-2">— Marcus Osei, Director</footer>
              </blockquote>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">Game-Changing Features</h2>
              <div className="grid sm:grid-cols-2 gap-6 not-prose">
                {[
                  { icon: '📋', title: 'Digital NICEIC Certificates', desc: 'EICR, Minor Works, Installation certs. Completed on-site, auto-filed, NICEIC-ready.' },
                  { icon: '✅', title: '100% Compliance Tracking', desc: 'Real-time dashboard of all certs, overdue inspections, and engineer status.' },
                  { icon: '🗓️', title: 'Smart Scheduling', desc: 'Auto-assign jobs by skill, location, availability. Route optimisation built-in.' },
                  { icon: '📦', title: 'Job Costing & Parts', desc: 'Track profitability per job. Know which work makes money and which loses it.' },
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
                Marcus is now targeting commercial maintenance contracts. With TradeFlow&apos;s compliance tracking 
                (NICEIC, PAT testing schedules, emergency call-out SLAs), he&apos;s confident they can manage 
                multi-site contracts without drowning in admin.
              </p>
              <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-slate-700">
                &quot;We&apos;re bidding on contracts that would have terrified us 18 months ago. TradeFlow 
                handles the operational complexity — scheduling, compliance, invoicing — so we can focus on 
                delivering quality electrical work and winning new business.&quot;
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
