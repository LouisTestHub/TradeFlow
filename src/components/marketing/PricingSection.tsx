'use client';

import Link from 'next/link';
import { ScrollFadeIn } from './ScrollFadeIn';
import { CounterAnimation } from './CounterAnimation';
import { SeedlingIcon, PlantIcon, TreeIcon } from '@/components/icons/FeatureIcons';

const tiers = [
  {
    name: 'Starter',
    icon: <SeedlingIcon />,
    price: 39,
    annual: 390,
    popular: false,
    features: [
      'Job management',
      'Basic scheduling',
      'Mobile app (offline)',
      'Customer database',
      'Basic invoicing',
      'Up to 3 engineers',
    ],
  },
  {
    name: 'Professional',
    icon: <PlantIcon />,
    price: 59,
    annual: 590,
    popular: true,
    features: [
      'Everything in Starter +',
      'CIS tax compliance',
      'Digital certificates (Gas Safe, NICEIC, F-Gas)',
      'Smart scheduling',
      'Quoting & estimating',
      'Xero/QuickBooks sync',
      'Basic fleet tracking',
      'Email support',
    ],
  },
  {
    name: 'Business',
    icon: <TreeIcon />,
    price: 79,
    annual: 790,
    popular: false,
    features: [
      'Everything in Professional +',
      'Advanced fleet tracking',
      'Parts inventory management',
      'Custom workflows',
      'Advanced reporting & analytics',
      'API access',
      'SMS alerts',
      'Priority support',
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-[var(--font-dm-sans)] text-3xl sm:text-4xl font-bold text-[#1E293B]">
              Simple, <span className="text-[#1B5E20]">Transparent Pricing</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Per-user pricing. No hidden fees. Cancel anytime. Annual plans save £200+.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <ScrollFadeIn key={i} delay={i * 150}>
              <div
                className={`relative bg-white rounded-2xl p-8 border-2 transition-shadow ${
                  tier.popular
                    ? 'border-[#1B5E20] shadow-xl scale-[1.02]'
                    : 'border-gray-100 hover:shadow-lg'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F9A825] text-[#1E293B] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="flex justify-center mb-4">{tier.icon}</div>
                <h3 className="text-xl font-bold text-[#1E293B] font-[var(--font-dm-sans)] text-center">{tier.name}</h3>
                <div className="text-center mt-4">
                  <span className="text-4xl font-bold text-[#1B5E20] font-[var(--font-dm-sans)]">£{tier.price}</span>
                  <span className="text-slate-500">/user/month</span>
                </div>
                <p className="text-center text-sm text-slate-400 mt-1">
                  £{tier.annual}/user/year (save £{tier.price * 12 - tier.annual})
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-[#4CAF50] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-8 block text-center px-6 py-3 rounded-xl font-semibold text-base transition-colors min-h-[48px] leading-[48px] ${
                    tier.popular
                      ? 'bg-[#1B5E20] text-white hover:bg-[#145218]'
                      : 'bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#C8E6C9]'
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            </ScrollFadeIn>
          ))}
        </div>

        <ScrollFadeIn>
          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>✓ 30-day free trial</span>
              <span>✓ No credit card needed</span>
              <span>✓ Cancel anytime</span>
              <span>✓ UK-based support</span>
            </div>
            <p className="text-base text-[#1B5E20] font-medium max-w-xl mx-auto">
              💰 "Saves 5–10 hours/week on admin = £3,000–6,000/year. TradeFlow pays for itself in 8 weeks."
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
