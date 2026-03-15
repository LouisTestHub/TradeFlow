'use client';

import { ScrollFadeIn } from './ScrollFadeIn';
import { SetupIcon, RecordIcon, AutoGenIcon, ExportIcon } from '@/components/icons/FeatureIcons';

const steps = [
  {
    icon: <SetupIcon />,
    step: '1',
    title: 'Set Up Your Business',
    description: 'Add your team, customers, service areas, and price lists. Import existing data from CSV. Takes 15 minutes.',
  },
  {
    icon: <RecordIcon />,
    step: '2',
    title: 'Engineers Work in the Field',
    description: 'Mobile app works offline. Complete job sheets, generate certificates, capture photos, get signatures. All syncs automatically.',
  },
  {
    icon: <AutoGenIcon />,
    step: '3',
    title: 'Office Auto-Updates',
    description: 'Jobs sync to office dashboard. Certificates auto-file. CIS deductions calculate. Invoices generate. No manual re-entry.',
  },
  {
    icon: <ExportIcon />,
    step: '4',
    title: 'Get Paid & Stay Compliant',
    description: 'Send invoices with one click. Track payments. Export CIS returns for HMRC. Submit Gas Safe/NICEIC certificates. Done.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#1E293B]">
              How It <span className="text-[#1B5E20]">Works</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From setup to getting paid — the complete workflow in four simple steps.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <ScrollFadeIn key={i} delay={i * 150}>
              <div className="text-center relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-[#E8F5E9]" />
                )}
                <div className="relative z-10 flex justify-center mb-4">{step.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1B5E20] text-white text-sm font-bold mb-3">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-[#1E293B] font-[var(--font-dm-sans)] mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
