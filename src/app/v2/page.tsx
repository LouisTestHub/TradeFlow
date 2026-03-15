'use client';

import { ScrollFadeIn } from '@/components/marketing/ScrollFadeIn';
import { CounterAnimation } from '@/components/marketing/CounterAnimation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/* ─── SVG Icons ─── */

function PoundIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10M10 20c0-6 3-8 3-14a3 3 0 10-6 0" />
      <path d="M6 12h8" />
    </svg>
  );
}

function TaxIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 7v10M15 7v10M7 12h10" />
    </svg>
  );
}

function PipelineIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM9 14h6v6H9z" />
      <path d="M7 10v2a2 2 0 002 2h0M17 10v2a2 2 0 01-2 2h0" />
    </svg>
  );
}

function NetworkIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v4M10.5 12.5L7 17M13.5 12.5L17 17" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

function MarketplaceIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14" />
      <rect x="8" y="11" width="3" height="5" rx="0.5" />
      <rect x="13" y="11" width="3" height="5" rx="0.5" />
    </svg>
  );
}

function ComplianceIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5.25-3.5 9.75-8 11-4.5-1.25-8-5.75-8-11V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function BankIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2" />
      <path d="M12 12v2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HardwareIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
      <path d="M9 6h6M9 9h6" />
    </svg>
  );
}

function AIIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
      <path d="M8 14s-4 2-4 6h16c0-4-4-6-4-6" />
      <circle cx="9" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="15" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function MoatIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V6l4-3 4 3 4-3 4 3v15" />
      <path d="M4 21h16" />
      <rect x="8" y="11" width="3" height="5" />
      <rect x="13" y="11" width="3" height="5" />
    </svg>
  );
}

function QuoteIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity={0.3}>
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.292 0-2.43-.654-2.917-1.679zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.292 0-2.43-.654-2.917-1.679z" />
    </svg>
  );
}

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

/* ─── Section Components ─── */

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-950 via-green-900 to-slate-900 text-white overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
        <ScrollFadeIn>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-amber-200">Internal Strategy Document</span>
          </div>
        </ScrollFadeIn>
        <ScrollFadeIn delay={100}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
            TradeFlow V2
            <span className="block text-amber-400 mt-2">The Platform That Pays For Itself</span>
          </h1>
        </ScrollFadeIn>
        <ScrollFadeIn delay={200}>
          <p className="mt-6 text-lg sm:text-xl text-green-100/80 max-w-2xl mx-auto">
            From job management tool to the financial operating system for UK trades
          </p>
        </ScrollFadeIn>
        <ScrollFadeIn delay={300}>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-green-200/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Payments
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              MTD Compliance
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              AI Productivity
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Trade Network
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

function ProblemsSection() {
  const problems = [
    {
      icon: <PoundIcon className="w-8 h-8 text-amber-500" />,
      stat: 49,
      suffix: '%',
      label: 'invoices paid late',
      title: 'Getting Paid',
      desc: 'Traders are acting as unpaid banks for their customers. Payment collection is the hardest part of the job — harder than the actual work.',
    },
    {
      icon: <TaxIcon className="w-8 h-8 text-amber-500" />,
      stat: 2028,
      suffix: '',
      prefix: 'By ',
      label: 'every tradesperson captured',
      title: 'Tax Admin Explosion',
      desc: 'Making Tax Digital is the biggest change in 30+ years. The £20k threshold by 2028 means every full-time tradesperson needs quarterly digital submissions.',
      noCounter: true,
    },
    {
      icon: <PipelineIcon className="w-8 h-8 text-amber-500" />,
      stat: 100,
      suffix: '%',
      label: 'pipeline dependent',
      title: 'Finding the Next Job',
      desc: 'Pipeline is life-or-death for small firms. Word of mouth, Checkatrade, MyBuilder — all separate systems that don\'t connect to job management.',
    },
    {
      icon: <NetworkIcon className="w-8 h-8 text-amber-500" />,
      stat: 0,
      suffix: '',
      label: 'ecosystem access',
      title: 'Nobody Talks to Each Other',
      desc: 'Every field service tool is an isolated silo. No small-firm access to contractor ecosystems like Procore, Constructionline, or council tendering.',
      noCounter: true,
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">The Real Problems</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Four crises facing every UK tradesperson — and nobody&apos;s solving them properly
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((p, i) => (
            <ScrollFadeIn key={p.title} delay={i * 100}>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-green-200 transition-all duration-300 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                    <div className="text-2xl font-bold text-green-800 mt-1">
                      {p.noCounter ? (
                        <span>{p.title === 'Tax Admin Explosion' ? 'By 2028' : 'Zero'}</span>
                      ) : (
                        <CounterAnimation end={p.stat} suffix={p.suffix} prefix={p.prefix} />
                      )}
                      <span className="text-sm font-normal text-slate-500 ml-2">{p.label}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaySection({
  number,
  title,
  subtitle,
  description,
  icon,
  stats,
  steps,
  revenue,
  dark = false,
}: {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  stats: { value: string; label: string }[];
  steps?: string[];
  revenue?: string;
  dark?: boolean;
}) {
  const bg = dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
  const subtextColor = dark ? 'text-slate-300' : 'text-slate-600';
  const cardBg = dark ? 'bg-slate-800/50 border-slate-700' : 'bg-green-50/50 border-green-100';
  const statColor = dark ? 'text-amber-400' : 'text-green-800';
  const stepBg = dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200';

  return (
    <section className={`${bg} py-20 sm:py-24`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="flex items-center gap-4 mb-6">
            <span className="flex-shrink-0 w-12 h-12 bg-green-800 text-white rounded-xl flex items-center justify-center text-lg font-bold">
              {number}
            </span>
            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              {icon}
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
          <p className="text-lg font-medium text-amber-600 mt-2">{subtitle}</p>
          <p className={`mt-4 text-lg ${subtextColor} max-w-3xl leading-relaxed`}>{description}</p>
        </ScrollFadeIn>

        {/* Stats row */}
        <ScrollFadeIn delay={100}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
            {stats.map((s) => (
              <div key={s.label} className={`${cardBg} border rounded-xl p-5`}>
                <div className={`text-2xl font-bold ${statColor}`}>{s.value}</div>
                <div className={`text-sm mt-1 ${subtextColor}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollFadeIn>

        {/* Steps */}
        {steps && steps.length > 0 && (
          <ScrollFadeIn delay={200}>
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className={`${stepBg} border rounded-xl p-4 flex gap-4 items-start`}>
                    <span className="flex-shrink-0 w-7 h-7 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className={`${subtextColor} text-sm leading-relaxed`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollFadeIn>
        )}

        {/* Revenue model */}
        {revenue && (
          <ScrollFadeIn delay={300}>
            <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-1">Revenue Model</h4>
              <p className={subtextColor}>{revenue}</p>
            </div>
          </ScrollFadeIn>
        )}
      </div>
    </section>
  );
}

function PlaysContainer() {
  return (
    <>
      {/* Plays heading */}
      <section className="bg-green-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold">The 6 Groundbreaking Plays</h2>
            <p className="mt-4 text-green-200/80 text-lg max-w-2xl mx-auto">
              Each play solves a real problem, generates real revenue, and compounds into something competitors can&apos;t copy.
            </p>
          </ScrollFadeIn>
        </div>
      </section>

      <PlaySection
        number={1}
        title='Job Marketplace — "Uber for Subbies"'
        subtitle="Two-sided marketplace embedded in the workflow tool"
        description="Main contractors post jobs via API. Verified local traders see them alongside existing bookings. One tap to accept — job drops into schedule, customer details populate, CIS calculates, invoice auto-generates. No phone tag, no chasing, no Checkatrade fees."
        icon={<MarketplaceIcon className="w-7 h-7" />}
        stats={[
          { value: '15-mile', label: 'Radius matching' },
          { value: 'Pre-vetted', label: 'Gas Safe, NICEIC, CIS verified' },
          { value: '1 Tap', label: 'Accept → Schedule → Invoice' },
        ]}
        steps={[
          'FM company posts job via TradeFlow API: "Need Gas Safe plumber in SE15, boiler swap Thursday, £450 day rate"',
          'Job appears in verified plumbers\' apps within 15-mile radius — alongside their existing bookings',
          'Trader taps to accept. Job drops into schedule, customer details populate, CIS auto-calculates',
          'Job complete → invoice auto-generates → payment collected → CIS submitted. One system, zero admin.',
        ]}
        revenue="3-5% of jobs sourced through marketplace OR flat fee per posted job. Trader pays NOTHING — free work landing in their app."
      />

      <PlaySection
        number={2}
        title="MTD as Invisible Compliance"
        subtitle="The trader doesn't think about tax. They do jobs. The tax just happens."
        description="Trader logs jobs, invoices, expenses, mileage throughout the quarter. End of quarter: 'Your Q1 summary is ready — income £18,400, expenses £6,200. Tap to submit to HMRC.' One tap. Done. No Xero, no accountant, no separate MTD software."
        icon={<ComplianceIcon className="w-7 h-7" />}
        dark
        stats={[
          { value: 'Apr 2026', label: '£50k+ threshold' },
          { value: 'Apr 2027', label: '£30k+ threshold' },
          { value: 'Apr 2028', label: '£20k+ — everyone' },
        ]}
        steps={[
          'Trader uses TradeFlow normally — logging jobs, invoices, expenses, mileage',
          'End of quarter notification: "Your Q1 summary is ready"',
          'One tap: income, expenses, CIS deductions — all submitted to HMRC via API',
          'Year-end: final declaration auto-generated. Tax liability estimated in real-time.',
        ]}
        revenue="£19/month MTD-only tier as standalone entry product. Every MTD user is a future full-platform upsell."
      />

      <PlaySection
        number={3}
        title="Open Banking Payments"
        subtitle="Get Paid Instantly — bank-to-bank, no card fees"
        description="'Pay by Bank' button on every TradeFlow invoice. Customer gets text/email → taps 'Pay Now' → authenticates with Face ID → money lands INSTANTLY. No card fees, no Stripe 1.5%+, no waiting. Automatic reconciliation updates MTD records and sends customer receipt."
        icon={<BankIcon className="w-7 h-7" />}
        stats={[
          { value: '0.2-0.5%', label: 'vs cards at 1.5-3%' },
          { value: '£2-4k', label: 'Annual saving on £150k revenue' },
          { value: '2bn+', label: 'Open banking API calls, July 2025' },
        ]}
        steps={[
          'Trader sends invoice via TradeFlow — includes "Pay by Bank" button',
          'Customer taps link → authenticates in banking app (Face ID/fingerprint)',
          'Money lands in trader\'s account INSTANTLY — no holding period',
          'TradeFlow auto-matches payment to invoice → marks paid → updates MTD quarterly record → sends receipt',
        ]}
        revenue="Variable Recurring Payments (VRPs) for ongoing service contracts. First commercial VRP made November 2025 — brand new infrastructure virtually nobody in field service is using."
      />

      <PlaySection
        number={4}
        title="Hardware That Matters"
        subtitle="£15 devices that save thousands in expenses"
        description="Purpose-built hardware at near-cost prices: automatic mileage logging, AI receipt scanning, NFC equipment tags, and portable receipt printers. Each device feeds data directly into the TradeFlow ecosystem and MTD records."
        icon={<HardwareIcon className="w-7 h-7" />}
        dark
        stats={[
          { value: '£15', label: 'OBD-II van tracker' },
          { value: '£6,750+', label: 'Annual mileage allowance unlocked' },
          { value: '£0.10', label: 'NFC tag per installation' },
        ]}
        steps={[
          '£15 OBD-II tracker plugs into van — auto-logs every journey with addresses and distances',
          'Phone camera scans Screwfix receipt → AI reads line items, VAT, allocates to current job',
          'NFC tag on installed equipment → tap phone for full history: model, serial, warranty, parts, notes',
          '£25 Bluetooth printer: job complete → receipt prints → QR code for instant "Pay by Bank" payment',
        ]}
        revenue="Hardware sold at cost or given free with Professional subscription. The value is in the data — mileage, expenses, equipment history — all feeding into MTD and the platform ecosystem."
      />

      <PlaySection
        number={5}
        title="AI That Saves Hours"
        subtitle="One hour saved per day, five days a week"
        description="Voice-to-job-notes transcription, AI quoting from historical data, smart scheduling with optimal routes, and automated service reminders that generate thousands in repeat revenue — all running silently in the background."
        icon={<AIIcon className="w-7 h-7" />}
        stats={[
          { value: '1 hour', label: 'Saved daily (5 jobs × 10-15min)' },
          { value: '60 sec', label: 'Professional quote vs 20 minutes' },
          { value: '£000s', label: 'Return revenue from auto follow-ups' },
        ]}
        steps={[
          'Engineer speaks: "Replaced expansion vessel, Vaillant ecoTEC plus 835, fitted new PRV, pressure set to 1.2 bar"',
          'AI transcribes, extracts parts/model numbers, populates job sheet, drafts customer message',
          'Smart scheduling: 3 jobs tomorrow → optimal route order, estimated arrival times, auto-sends customer texts',
          '"Mrs. Johnson\'s boiler service due in 30 days. Gas Safe cert expiring. Draft reminder sent for your approval."',
        ]}
      />

      <PlaySection
        number={6}
        title="The Trade Network Effect"
        subtitle="The moat — every new trader makes the platform more valuable"
        description="Network effects that no competitor can replicate. Cross-trade referrals, verified reputation scores, aggregate buying power for sole traders, and insurance rates based on actual compliance data. This is what turns a tool into a platform."
        icon={<MoatIcon className="w-7 h-7" />}
        dark
        stats={[
          { value: 'Verified', label: 'Reputation from real completions' },
          { value: 'Aggregate', label: 'Buying power for sole traders' },
          { value: 'Lower', label: 'Insurance from compliance data' },
        ]}
        steps={[
          'Plumber on bathroom refit → tap "Need a tiler" → find TradeFlow-verified tiler within radius',
          'Send sub-job → CIS auto-calculates → payment flows through platform',
          'Reputation score built from verified job completions — worth more than Checkatrade reviews',
          'Material suppliers offer volume discounts. Insurance companies offer better rates. The network compounds.',
        ]}
        revenue="Every new trader makes the marketplace more valuable for every other trader, every contractor posting jobs, every customer. Tradify/ServiceM8/Jobber are individual tools — TradeFlow is a network."
      />
    </>
  );
}

function AdvisorsSection() {
  const advisors = [
    {
      name: 'Alex Hormozi',
      role: 'Offer Design & Unit Economics',
      quote: 'Get Paid Guarantee — milestone payments, automated chasing, instant payment links. Bundle with £19/month MTD-lite tier.',
      color: 'border-amber-500',
    },
    {
      name: 'Richard Branson',
      role: 'Brand, Experience & Culture',
      quote: "Create the 'job complete' hero moment — certificate + invoice + payment in under 60 seconds. That's the story people tell.",
      color: 'border-green-500',
    },
    {
      name: 'Charlie Munger',
      role: 'Inversion & Mental Models',
      quote: 'Pick ONE problem — getting paid — and solve it so well it alone justifies the subscription. Revenue solves every other problem.',
      color: 'border-blue-500',
    },
    {
      name: 'Naval Ravikant',
      role: 'Leverage & Specific Knowledge',
      quote: 'Become HMRC-recognised MTD-compatible platform. Regulatory moat + forced adoption + financial data layer = your true asset.',
      color: 'border-purple-500',
    },
    {
      name: 'Jason Lemkin',
      role: 'SaaS Metrics & Path to £1M ARR',
      quote: 'Build MTD as £19/month standalone entry product. Every MTD user is a future full-platform upsell.',
      color: 'border-cyan-500',
    },
    {
      name: 'Aaron Ross',
      role: 'Predictable Revenue',
      quote: 'Build accountant partnerships. Every small-town accountant with 20 trade clients is your lowest-CAC channel.',
      color: 'border-orange-500',
    },
    {
      name: 'Mark Roberge',
      role: 'Data-Driven Sales',
      quote: 'Louis sells first 50 personally. Document every objection. That data IS the sales playbook.',
      color: 'border-rose-500',
    },
    {
      name: 'Chris Voss',
      role: 'Closing Skeptical Buyers',
      quote: "'Try on One Job' — one real job through TradeFlow before committing. No credit card, no contract.",
      color: 'border-teal-500',
    },
  ];

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What Our Advisory Board Says</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Eight world-class advisors. One unanimous conclusion: build the financial operating system.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisors.map((a, i) => (
            <ScrollFadeIn key={a.name} delay={i * 75}>
              <div className={`bg-white rounded-2xl p-6 border-t-4 ${a.color} shadow-sm hover:shadow-md transition-shadow h-full flex flex-col`}>
                <QuoteIcon className="w-8 h-8 text-slate-400 mb-3" />
                <p className="text-slate-700 text-sm leading-relaxed flex-grow italic">&ldquo;{a.quote}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="font-semibold text-slate-900 text-sm">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.role}</div>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function VerdictsSection() {
  const verdicts = [
    { question: 'Payment protection?', verdict: 'UNANIMOUS YES', icon: 'yes', detail: 'Milestone payments, chasing, instant links' },
    { question: 'MTD platform?', verdict: 'UNANIMOUS YES', icon: 'yes', detail: 'Regulatory tailwind, recognised MTD software' },
    { question: 'Job marketplace?', verdict: 'NO (V3/V4)', icon: 'no', detail: 'Premature — need 10,000+ active trades first' },
    { question: 'Constructionline integration?', verdict: 'YES', icon: 'yes', detail: 'Auto-verify compliance credentials' },
    { question: 'The moat?', verdict: 'MTD + payment data + compliance', icon: 'info', detail: 'Financial operating system, not features' },
    { question: 'Pricing?', verdict: 'Add £19/month MTD-only tier', icon: 'info', detail: 'Wedge product, keep existing tiers' },
    { question: 'vs Checkatrade/MyBuilder?', verdict: "Complement, don't compete", icon: 'info', detail: '"Checkatrade sends leads, TradeFlow manages them"' },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Board Verdicts</h2>
            <p className="mt-4 text-lg text-slate-600">The key V2 decisions — settled by consensus</p>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-green-900 text-white">
                  <th className="text-left text-sm font-semibold px-6 py-4">Question</th>
                  <th className="text-left text-sm font-semibold px-6 py-4">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {verdicts.map((v, i) => (
                  <tr key={v.question} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 text-sm">{v.question}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{v.detail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {v.icon === 'yes' && (
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-4 h-4" />
                          </span>
                        )}
                        {v.icon === 'no' && (
                          <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <XIcon className="w-4 h-4" />
                          </span>
                        )}
                        {v.icon === 'info' && (
                          <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">→</span>
                        )}
                        <span className="font-semibold text-sm text-slate-800">{v.verdict}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const phases = [
    {
      phase: 1,
      title: 'Getting Paid',
      items: ['Instant payment links', 'Automated chasing', 'Open banking integration'],
      color: 'bg-green-800',
      status: 'Priority',
    },
    {
      phase: 2,
      title: 'MTD Compliance',
      items: ['Invisible quarterly submissions', 'HMRC recognised platform', 'CIS + MTD unified'],
      color: 'bg-green-700',
      status: 'Strategic',
    },
    {
      phase: 3,
      title: 'AI Productivity',
      items: ['Voice-to-job-notes', 'Smart quoting engine', 'Automated follow-ups'],
      color: 'bg-amber-600',
      status: 'Growth',
    },
    {
      phase: 4,
      title: 'Hardware',
      items: ['OBD-II mileage tracker', 'AI receipt scanning', 'NFC equipment tags'],
      color: 'bg-amber-500',
      status: 'Expansion',
    },
    {
      phase: 5,
      title: 'Trade Network & Marketplace',
      items: ['Cross-trade referrals', 'Reputation scores', 'Aggregate buying power'],
      color: 'bg-slate-600',
      status: 'V3/V4',
    },
  ];

  return (
    <section className="bg-green-950 text-white py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">V2 Priority Roadmap</h2>
            <p className="mt-4 text-green-200/70 text-lg">Sequenced by consensus: lead with payments, follow with MTD</p>
          </div>
        </ScrollFadeIn>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-green-800 hidden sm:block" />

          <div className="space-y-6">
            {phases.map((p, i) => (
              <ScrollFadeIn key={p.phase} delay={i * 100}>
                <div className="flex gap-4 sm:gap-6 items-start">
                  {/* Phase badge */}
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 ${p.color} rounded-2xl flex flex-col items-center justify-center relative z-10`}>
                    <span className="text-xs font-medium opacity-70">Phase</span>
                    <span className="text-lg font-bold leading-none">{p.phase}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow bg-green-900/50 border border-green-800/50 rounded-xl p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold">{p.title}</h3>
                      <span className="text-xs font-medium bg-white/10 text-green-200 px-2.5 py-1 rounded-full">{p.status}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {p.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-green-100/80">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MoatSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why Competitors Can&apos;t Follow</h2>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <div className="bg-gradient-to-br from-green-50 to-amber-50 border border-green-200 rounded-2xl p-8 sm:p-10 text-center mb-10">
            <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
              &ldquo;Every competitor is a <span className="text-slate-500">digital filing cabinet</span>.
              <br />
              TradeFlow V2 is a <span className="text-green-800">platform that actively generates revenue</span> for the trader.&rdquo;
            </p>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={200}>
          <div className="bg-green-900 text-white rounded-2xl p-8 sm:p-10 text-center">
            <h3 className="text-lg font-semibold text-amber-400 mb-4">The Test</h3>
            <p className="text-2xl sm:text-3xl font-bold">
              More jobs. Faster payment. Less admin.
            </p>
            <p className="text-green-200/70 mt-4 text-lg">
              Everything TradeFlow builds must pass this test.
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const v1Items = [
    'Job management',
    'Invoice generation',
    'Quote creation',
    'Customer database',
    'Calendar/scheduling',
    'Sync to Xero/QuickBooks',
    'CIS calculations',
    'Certificate management',
  ];

  const v2Items = [
    'Instant open banking payments',
    'Invisible MTD compliance',
    'AI voice notes & quoting',
    'Jobs flowing IN through marketplace',
    'Automatic mileage & expense tracking',
    'Cross-trade referral network',
    'Hardware ecosystem (OBD-II, NFC, printer)',
    'Revenue generation for the trader',
  ];

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">V1 vs V2</h2>
            <p className="mt-4 text-lg text-slate-600">From digital filing cabinet to financial operating system</p>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* V1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center font-bold text-sm">V1</span>
                <div>
                  <h3 className="font-bold text-slate-900">Digital Filing Cabinet</h3>
                  <p className="text-xs text-slate-500">Put jobs in, get invoices out</p>
                </div>
              </div>
              <ul className="space-y-3">
                {v1Items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* V2 */}
            <div className="bg-green-900 text-white border border-green-700 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-amber-500 text-amber-950 text-xs font-bold px-3 py-1 rounded-full">NEW</div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-amber-500 text-amber-950 rounded-xl flex items-center justify-center font-bold text-sm">V2</span>
                <div>
                  <h3 className="font-bold">Financial Operating System</h3>
                  <p className="text-xs text-green-200/70">Platform that pays for itself</p>
                </div>
              </div>
              <ul className="space-y-3">
                {v2Items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-green-100">
                    <CheckIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function V2Page() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemsSection />
        <PlaysContainer />
        <AdvisorsSection />
        <VerdictsSection />
        <RoadmapSection />
        <MoatSection />
        <ComparisonSection />
      </main>
      <Footer />
    </>
  );
}
