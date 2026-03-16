'use client';

import { ScrollFadeIn } from './ScrollFadeIn';

const features = [
  {
    icon: '📊',
    title: 'Xero Integration',
    desc: 'Automatic two-way sync with Xero. Invoices, payments, CIS deductions, and contacts — all in perfect sync. No more double entry.',
    badge: 'Integration',
  },
  {
    icon: '🏪',
    title: 'Supplier Connections',
    desc: 'Order directly from CEF, Screwfix, Toolstation, and more. Price lists auto-update, purchase orders sync to jobs, and costs track automatically.',
    badge: 'Supply Chain',
  },
  {
    icon: '🔔',
    title: 'Service Reminders',
    desc: 'Automated reminders for boiler services, electrical inspections, and F-Gas checks. Never miss a callback. Turn one-off jobs into recurring revenue.',
    badge: 'Retention',
  },
  {
    icon: '💳',
    title: 'Payment Links',
    desc: 'Send payment links via SMS or email. Customers pay instantly via card or bank transfer. Funds clear in 24 hours. Chase-free invoicing.',
    badge: 'Payments',
  },
];

export function NewFeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <span className="inline-block bg-[#F97316]/10 text-[#F97316] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              New Features
            </span>
            <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Just Launched — Built for UK Trades
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              New integrations and tools designed to save you time, get you paid faster, and keep customers coming back.
            </p>
          </div>
        </ScrollFadeIn>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <ScrollFadeIn key={feature.title} delay={i * 100}>
              <div className="flex gap-6 bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-[#2563EB]/30 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center text-3xl">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[#0F172A]">{feature.title}</h3>
                    <span className="text-xs font-medium bg-[#1E3A5F]/10 text-[#1E3A5F] px-2 py-0.5 rounded-full">{feature.badge}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
