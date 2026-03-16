import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CoolFlow HVAC — F-Gas Audit Passed First Time, 25% More Jobs/Week',
  description: 'Birmingham HVAC company CoolFlow passed their F-Gas audit first time, increased jobs by 25% per week, and improved customer retention by 40% with TradeFlow.',
};

export default function CoolFlowHvacCaseStudy() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#00838F] to-[#006064] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1600&h=900&fit=crop&q=80"
              alt="HVAC engineer working on air conditioning unit"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm">
              ← Back to case studies
            </Link>
            <p className="text-sm font-medium mb-2 opacity-90">HVAC &amp; Refrigeration • Birmingham</p>
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold leading-tight mb-6">
              How CoolFlow HVAC Passed Their F-Gas Audit First Time and Grew 25%
            </h1>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="opacity-80">Company</p>
                <p className="font-semibold">CoolFlow HVAC Ltd</p>
              </div>
              <div>
                <p className="opacity-80">Director</p>
                <p className="font-semibold">James Kavanagh</p>
              </div>
              <div>
                <p className="opacity-80">Location</p>
                <p className="font-semibold">Solihull, Birmingham</p>
              </div>
              <div>
                <p className="opacity-80">Using TradeFlow Since</p>
                <p className="font-semibold">January 2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-[#00838F]">First time</p>
                <p className="text-slate-600 mt-2">F-Gas audit passed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#00838F]">+25%</p>
                <p className="text-slate-600 mt-2">More jobs per week</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#00838F]">+40%</p>
                <p className="text-slate-600 mt-2">Customer retention improvement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 lg:py-20 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)]">The Challenge</h2>
                <p className="text-slate-700 leading-relaxed">
                  CoolFlow HVAC is a Birmingham-based air conditioning and refrigeration company running 8 vans 
                  and 6 F-Gas certified engineers. Director James Kavanagh had built the business on reputation 
                  — commercial AC installations, maintenance contracts, and emergency call-outs for restaurants, 
                  offices, and server rooms across the West Midlands.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  But F-Gas compliance was becoming unmanageable. Every refrigerant handling event needs logging — 
                  the type, quantity, and GWP of every gas charged, recovered, or disposed of. With 6 engineers 
                  doing 15–20 jobs per week, the paperwork was relentless. Engineers would scribble F-Gas data on 
                  job sheets, sometimes forgetting to log recovery amounts. The spreadsheet tracking system was 
                  months behind. When the F-Gas assessor called for a spot audit, James knew they&apos;d fail.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Scheduling was another bottleneck. Without a central system, double-bookings were common, 
                  emergency call-outs disrupted planned maintenance, and engineers were criss-crossing the city 
                  inefficiently. Customer retention had dropped because maintenance visits were being missed or 
                  rescheduled too often.
                </p>

                <blockquote className="border-l-4 border-[#00838F] pl-4 italic text-slate-700">
                  &quot;I was terrified of the F-Gas audit. We had gaps in our records going back 6 months. 
                  Engineers were doing great work on site but the compliance paperwork was a disaster. And 
                  we were losing maintenance customers because we kept rescheduling their visits. Something 
                  had to change.&quot;
                </blockquote>

                <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">The Solution</h2>
                <p className="text-slate-700 leading-relaxed">
                  CoolFlow adopted TradeFlow in January 2025, focusing on F-Gas compliance tracking, 
                  engineer scheduling, and maintenance contract management:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li><strong>Digital F-Gas logging</strong> — Engineers log refrigerant type, quantity, GWP, 
                  and handling action on their phone at the point of work. Auto-calculates CO₂ equivalent. 
                  Full audit trail for every gas transaction.</li>
                  <li><strong>Compliance certificates</strong> — F-Gas certificates, commissioning reports, 
                  and maintenance records completed on-site and auto-filed against the asset and customer.</li>
                  <li><strong>Smart scheduling</strong> — Maintenance contracts auto-schedule based on service 
                  intervals. Emergency call-outs slot in around planned work. Route optimisation reduces 
                  drive time across Birmingham.</li>
                  <li><strong>Customer portal</strong> — Clients can see their equipment register, service 
                  history, upcoming maintenance, and download certificates. &quot;Our biggest clients love 
                  the transparency — it&apos;s why they renew.&quot;</li>
                </ul>

                <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">The Results</h2>
                <p className="text-slate-700 leading-relaxed">
                  Within 6 months of switching to TradeFlow:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li><strong>F-Gas audit passed first time</strong> — complete digital records for every 
                  refrigerant transaction, zero gaps, assessor commented on &quot;best record-keeping 
                  they&apos;d seen from an SME&quot;</li>
                  <li><strong>25% more jobs per week</strong> — smarter scheduling and route optimisation 
                  freed up capacity without hiring additional engineers</li>
                  <li><strong>Customer retention up 40%</strong> — maintenance visits no longer missed, 
                  customer portal providing transparency and trust</li>
                  <li><strong>Emergency response time halved</strong> — system identifies nearest available 
                  engineer with the right F-Gas certification level</li>
                  <li><strong>Zero compliance gaps</strong> — real-time dashboard shows F-Gas log status 
                  for every job, flagging any incomplete records immediately</li>
                </ul>

                <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-slate-700 bg-[#FFF7ED] p-4 rounded-r-xl">
                  &quot;When the F-Gas assessor walked in, I pulled up every record on TradeFlow in 30 seconds. 
                  He said it was the best documentation he&apos;d seen from a company our size. That moment alone 
                  justified the investment. But the real win is the 25% more jobs — we&apos;re making significantly 
                  more revenue with the same team, just by being smarter about scheduling and routes.&quot;
                  <footer className="not-italic font-semibold text-[#0F172A] mt-2">— James Kavanagh, Director</footer>
                </blockquote>

                <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">Key Features for HVAC</h2>
                <div className="grid sm:grid-cols-2 gap-6 not-prose">
                  {[
                    { icon: '❄️', title: 'F-Gas Compliance Logging', desc: 'Every refrigerant event tracked — type, quantity, GWP, CO₂ equivalent. Full audit trail.' },
                    { icon: '📋', title: 'Digital Certificates', desc: 'Commissioning, maintenance, and F-Gas certs completed on-site, auto-filed.' },
                    { icon: '🗓️', title: 'Smart Maintenance Scheduling', desc: 'Auto-schedule service intervals. Emergency call-outs routed to nearest engineer.' },
                    { icon: '👤', title: 'Customer Portal', desc: 'Equipment register, service history, upcoming maintenance. Clients love the transparency.' },
                  ].map((feature, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h3 className="font-bold text-[#0F172A] mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-24 space-y-6">
                  <h3 className="font-bold text-[#0F172A]">Company Profile</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-slate-500">Company</div>
                      <div className="font-semibold text-[#0F172A]">CoolFlow HVAC Ltd</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Director</div>
                      <div className="font-semibold text-[#0F172A]">James Kavanagh</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Location</div>
                      <div className="font-semibold text-[#0F172A]">Solihull, Birmingham</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Fleet</div>
                      <div className="font-semibold text-[#0F172A]">8 vans, 6 engineers</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Sector</div>
                      <div className="font-semibold text-[#0F172A]">HVAC &amp; Refrigeration</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Key Challenge</div>
                      <div className="font-semibold text-[#0F172A]">F-Gas compliance &amp; scheduling</div>
                    </div>
                  </div>
                  <hr className="border-slate-200" />
                  <div>
                    <h4 className="font-bold text-[#0F172A] mb-3">Get Similar Results</h4>
                    <p className="text-sm text-slate-600 mb-4">See how TradeFlow handles F-Gas compliance for HVAC businesses.</p>
                    <Link href="/register" className="block bg-[#1565C0] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#0D47A1] transition mb-2">
                      Start Free Trial
                    </Link>
                    <Link href="/contact" className="block bg-white text-[#1565C0] text-center py-3 rounded-lg font-semibold border border-[#1565C0] hover:bg-[#F8FAFC] transition">
                      Book a Demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
