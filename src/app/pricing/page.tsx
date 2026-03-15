import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingSection } from '@/components/marketing/PricingSection';
import { FetfSection } from '@/components/marketing/FetfSection';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — From £39/user/month',
  description: 'Simple, transparent pricing for UK field service software. Starter £39/user/month, Professional £59/user/month, Business £79/user/month. 30-day free trial. No credit card needed.',
};

const comparisonMatrix = [
  { feature: 'Job management', starter: true, professional: true, business: true },
  { feature: 'Basic scheduling', starter: true, professional: true, business: true },
  { feature: 'Mobile app (offline)', starter: true, professional: true, business: true },
  { feature: 'Customer database', starter: true, professional: true, business: true },
  { feature: 'Basic invoicing', starter: true, professional: true, business: true },
  { feature: 'CIS tax compliance', starter: false, professional: true, business: true },
  { feature: 'Digital certificates (Gas Safe, NICEIC, F-Gas)', starter: false, professional: true, business: true },
  { feature: 'Smart scheduling', starter: false, professional: true, business: true },
  { feature: 'Quoting & estimating', starter: false, professional: true, business: true },
  { feature: 'Xero/QuickBooks sync', starter: false, professional: true, business: true },
  { feature: 'Basic fleet tracking', starter: false, professional: true, business: true },
  { feature: 'Advanced fleet tracking', starter: false, professional: false, business: true },
  { feature: 'Parts inventory management', starter: false, professional: false, business: true },
  { feature: 'Custom workflows', starter: false, professional: false, business: true },
  { feature: 'Advanced reporting & analytics', starter: false, professional: false, business: true },
  { feature: 'API access', starter: false, professional: false, business: true },
  { feature: 'SMS alerts', starter: false, professional: false, business: true },
  { feature: 'Priority support', starter: false, professional: false, business: true },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PricingSection />

        {/* Comparison matrix */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-[#1E293B] font-[var(--font-dm-sans)] mb-12">
              Feature Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-4 pr-4 text-sm font-semibold text-slate-600">Feature</th>
                    <th className="py-4 px-4 text-sm font-semibold text-center text-slate-600">Starter<br /><span className="font-normal">£39/user/mo</span></th>
                    <th className="py-4 px-4 text-sm font-semibold text-center text-[#1B5E20]">Professional<br /><span className="font-normal">£59/user/mo</span></th>
                    <th className="py-4 px-4 text-sm font-semibold text-center text-slate-600">Business<br /><span className="font-normal">£79/user/mo</span></th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMatrix.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 pr-4 text-sm text-slate-700">{row.feature}</td>
                      {[row.starter, row.professional, row.business].map((val, j) => (
                        <td key={j} className="py-3 px-4 text-center">
                          {val ? (
                            <svg className="w-5 h-5 text-[#4CAF50] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Money back guarantee */}
            <div className="mt-16 bg-[#E8F5E9] rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-[#1B5E20] font-[var(--font-dm-sans)] mb-3">
                💪 Money-Back Guarantee
              </h3>
              <p className="text-slate-700 max-w-2xl mx-auto">
                If you don&apos;t save at least 5 hours/week on admin in your first month, we&apos;ll refund you. No questions asked.
              </p>
            </div>
          </div>
        </section>

        <FetfSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
