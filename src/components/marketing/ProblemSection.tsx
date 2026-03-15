'use client';

import { ScrollFadeIn } from './ScrollFadeIn';
import { CounterAnimation } from './CounterAnimation';
import { PaperworkIcon, DuplicateIcon, DeadlineIcon } from '@/components/icons/FeatureIcons';

const problems = [
  {
    icon: <PaperworkIcon />,
    stat: '4–7',
    statSuffix: ' systems',
    title: 'Disconnected Tools Everywhere',
    description: 'Job management in one app, accounting in Xero, certificates in NICEIC Clik, fleet tracking separately. Enter the same job details 3-4 times. The integration nightmare is real.',
  },
  {
    icon: <DuplicateIcon />,
    stat: '5–10',
    statSuffix: ' hrs/week',
    title: 'Admin Drowning Your Team',
    description: 'Engineers enter job sheets on paper, office staff re-key into job management, then again into Xero with CIS deductions. Certificates logged manually. It\'s 2026, not 1996.',
  },
  {
    icon: <DeadlineIcon />,
    stat: '£1000s',
    statSuffix: ' at risk',
    title: 'Compliance Is a Minefield',
    description: 'Gas Safe certificates, NICEIC notifications, F-Gas leak checks, CIS monthly returns. Miss a deadline and you\'re facing fines, lost certifications, or worse.',
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Field Service Software Is <span className="text-[#EF4444]">Broken</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              UK trades businesses waste thousands of hours a year juggling disconnected systems. Sound familiar?
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {problems.map((problem, i) => (
            <ScrollFadeIn key={i} delay={i * 150}>
              <div className="text-center p-8 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{problem.icon}</div>
                <div className="text-2xl font-bold text-[#1E3A5F] font-[var(--font-dm-sans)] mb-2">
                  {problem.stat}{problem.statSuffix}
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] font-[var(--font-dm-sans)] mb-3">{problem.title}</h3>
                <p className="text-slate-600 leading-relaxed">{problem.description}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
