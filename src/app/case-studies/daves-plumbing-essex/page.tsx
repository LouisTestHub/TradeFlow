import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dave's Plumbing & Heating — 15 Hours/Week Saved, £28K Revenue Added",
  description: 'Essex plumber Dave Thompson saved 15 hours/week on admin, added £28k revenue in 6 months, and grew from 1 to 6 engineers after switching to TradeFlow.',
};

export default function DavesPlumbingCaseStudy() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1600&h=900&fit=crop&q=80"
              alt="Plumber working on boiler installation"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm">
              ← Back to case studies
            </Link>
            <p className="text-sm font-medium mb-2 opacity-90">Plumbing & Heating • Essex</p>
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold leading-tight mb-6">
              How Dave&apos;s Plumbing Saved 15 Hours/Week and Added £28k Revenue
            </h1>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="opacity-80">Company</p>
                <p className="font-semibold">Dave&apos;s Plumbing & Heating</p>
              </div>
              <div>
                <p className="opacity-80">Owner</p>
                <p className="font-semibold">Dave Thompson</p>
              </div>
              <div>
                <p className="opacity-80">Location</p>
                <p className="font-semibold">Basildon, Essex</p>
              </div>
              <div>
                <p className="opacity-80">Using TradeFlow Since</p>
                <p className="font-semibold">March 2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-[#1565C0]">15 hrs/week</p>
                <p className="text-slate-600 mt-2">Time saved on admin</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#1565C0]">£28,000</p>
                <p className="text-slate-600 mt-2">Extra revenue (6 months)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#1565C0]">1 → 6</p>
                <p className="text-slate-600 mt-2">Engineers hired</p>
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
                Dave Thompson started Dave&apos;s Plumbing & Heating as a solo Gas Safe registered plumber in 
                2018, covering Basildon and surrounding areas. By 2024, he was turning down work because he 
                was drowning in admin. Missed appointments were costing him customers, and lost invoices meant 
                money was left on the table every month.
              </p>
              <blockquote className="border-l-4 border-[#1565C0] pl-4 italic text-slate-700">
                &quot;I was spending Sunday evenings writing up Gas Safe certificates from scribbled job sheets, 
                chasing late invoices via text, and trying to remember which customer owed me what. I&apos;d 
                miss appointments because they were written on scraps of paper in the van. I was losing 15–20 
                hours a week on paperwork and still dropping the ball. I became a plumber to fix boilers, not 
                fight with spreadsheets.&quot;
              </blockquote>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">The Solution</h2>
              <p className="text-slate-700 leading-relaxed">
                Dave switched to TradeFlow in March 2025. Within the first month:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li><strong>Digital Gas Safe CP12 certificates</strong> — pre-filled from previous jobs, completed 
                on-site on his phone, auto-synced to customer records. No more Sunday paperwork.</li>
                <li><strong>Automated appointment reminders</strong> — customers receive SMS/email reminders 24 
                hours before the job. Missed appointments dropped to near zero.</li>
                <li><strong>Invoice tracking</strong> — every job auto-generates an invoice. Dave can see unpaid 
                invoices at a glance and send polite reminders with one tap.</li>
                <li><strong>Customer history at his fingertips</strong> — &quot;Every time I arrive at a job, I 
                can see previous certificates, parts used, photos. Customers love that I remember their boiler 
                model from 2 years ago.&quot;</li>
              </ul>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">The Results</h2>
              <p className="text-slate-700 leading-relaxed">
                With 15 hours/week freed up, Dave started taking on the jobs he&apos;d been turning down. Within 
                6 months:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li>Revenue increased by <strong>£28,000</strong> (extra jobs he previously didn&apos;t have time for)</li>
                <li>Hired <strong>5 additional Gas Safe engineers</strong> — TradeFlow&apos;s multi-engineer scheduling 
                made it manageable</li>
                <li>Invoice payment time dropped from 32 days to 14 days (better tracking = better cash flow)</li>
                <li>Zero lost certificates — everything digital, backed up, searchable</li>
                <li>Missed appointments down 95% — automated SMS reminders keep customers on track</li>
              </ul>

              <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-slate-700 bg-[#FFF7ED] p-4 rounded-r-xl">
                &quot;TradeFlow gave me my weekends back. I&apos;m doing more jobs, making more money, and I&apos;ve 
                got time to grow the business instead of drowning in paperwork. We went from just me to 6 
                engineers in under a year. Best decision I made in 2025.&quot;
                <footer className="not-italic font-semibold text-[#0F172A] mt-2">— Dave Thompson, Owner</footer>
              </blockquote>

              <h2 className="text-3xl font-bold text-[#0F172A] font-[var(--font-dm-sans)] mt-12">Favourite Features</h2>
              <div className="grid sm:grid-cols-2 gap-6 not-prose">
                {[
                  { icon: '📋', title: 'Digital Gas Safe Certificates', desc: 'Pre-filled CP12s, completed on phone, auto-filed. No more Sunday admin.' },
                  { icon: '📲', title: 'Automated SMS Reminders', desc: '24hr appointment reminders sent automatically. Missed appointments down 95%.' },
                  { icon: '💰', title: 'Invoice Tracking', desc: 'See unpaid invoices at a glance. Send reminders with one tap. Get paid faster.' },
                  { icon: '🗓️', title: 'Multi-Engineer Scheduling', desc: 'Route optimisation, job assignment, live updates. Manage 6 engineers easily.' },
                ].map((feature, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-bold text-[#0F172A] mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                ))}
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
