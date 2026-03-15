'use client';

import { ScrollFadeIn } from './ScrollFadeIn';
import {
  SprayIcon,
  LivestockIcon,
  WeatherIcon,
  ComplianceIcon,
  OfflineIcon,
  ReportIcon,
} from '@/components/icons/FeatureIcons';

const features = [
  {
    icon: <SprayIcon />,
    title: 'Job Management',
    description: 'Create jobs, schedule engineers, track progress. From first call to invoice, manage the entire customer journey in one place.',
  },
  {
    icon: <LivestockIcon />,
    title: 'Engineer Scheduling',
    description: 'Smart scheduling based on skills, location, and availability. Optimise routes, reduce fuel costs, and maximise jobs per day.',
  },
  {
    icon: <WeatherIcon />,
    title: 'CIS Tax Compliance',
    description: 'Auto-calculate CIS deductions (20%/30%), sync to Xero/QuickBooks, generate monthly returns. HMRC-ready with one click.',
  },
  {
    icon: <ComplianceIcon />,
    title: 'Digital Certificates',
    description: 'Gas Safe CP12, NICEIC EICR, F-Gas leak checks. Pre-filled templates, photo evidence, auto-sync to compliance registers. Never lose a certificate again.',
  },
  {
    icon: <OfflineIcon />,
    title: 'Offline First',
    description: 'Engineers work in basements, countryside, anywhere. Full app functionality offline — job sheets, certificates, notes. Auto-sync when back online.',
  },
  {
    icon: <ReportIcon />,
    title: 'Quoting & Invoicing',
    description: 'Professional quotes, job costing, automated invoicing with CIS. Integrated payments via Stripe/GoCardless. Get paid faster.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#0F172A]">
              One Platform. <span className="text-[#1E3A5F]">Everything You Need.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built specifically for UK trades. Every feature designed around how plumbers, electricians, and HVAC engineers actually work.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <ScrollFadeIn key={i} delay={i * 100}>
              <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg hover:border-[#2563EB]/30 transition-all group">
                <div className="mb-4 group-hover:scale-105 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#0F172A] font-[var(--font-dm-sans)] mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
