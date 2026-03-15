import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'TradeFlow terms of service. Terms and conditions for using the TradeFlow field service management platform.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="py-20 lg:py-28 bg-[#FAFAF5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#1E293B] mb-4">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-10">Last updated: 15 March 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 [&_h2]:text-[#1E293B] [&_h2]:font-[var(--font-dm-sans)] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4">
            <h2>1. Service Description</h2>
            <p>TradeFlow is a field service management and compliance platform operated by Data & Digital Ltd (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By using TradeFlow, you agree to these terms.</p>

            <h2>2. Accounts</h2>
            <p>You are responsible for maintaining the security of your account credentials. You must be at least 18 years old to create an account. You must provide accurate information during registration.</p>

            <h2>3. Free Trial</h2>
            <p>New accounts receive a 30-day free trial with full access to all features. No credit card is required. At the end of the trial, you must select a paid plan to continue using the service.</p>

            <h2>4. Subscriptions & Billing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Monthly plans are billed monthly and can be cancelled at any time</li>
              <li>Annual plans are billed upfront and offer a discount (equivalent to 2 months free)</li>
              <li>Annual plans are refundable within the first 30 days</li>
              <li>Prices are in GBP and include VAT where applicable</li>
              <li>We may change prices with 30 days&apos; notice</li>
            </ul>

            <h2>5. Your Data</h2>
            <p>You retain ownership of all data you enter into TradeFlow. We provide tools to export your data at any time. Upon account deletion, we will permanently remove your data within 90 days (or immediately upon request).</p>

            <h2>6. Compliance Records</h2>
            <p>TradeFlow generates compliance records based on the data you enter. While we strive for accuracy, you are ultimately responsible for the accuracy of your compliance records. TradeFlow is a tool to assist with compliance, not a substitute for professional advice.</p>

            <h2>7. Availability</h2>
            <p>We aim for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced in advance. The offline mode ensures core functionality remains available without internet access.</p>

            <h2>8. Acceptable Use</h2>
            <p>You may not use TradeFlow for any unlawful purpose, attempt to gain unauthorised access to other accounts, or interfere with the service&apos;s operation.</p>

            <h2>9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Data & Digital Ltd shall not be liable for any indirect, incidental, or consequential damages arising from the use of TradeFlow. Our total liability is limited to the amount you have paid us in the 12 months preceding the claim.</p>

            <h2>10. Changes to Terms</h2>
            <p>We may update these terms from time to time. Material changes will be communicated via email at least 30 days before they take effect.</p>

            <h2>11. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the English courts.</p>

            <h2>12. Contact</h2>
            <p>For questions about these terms: <a href="mailto:legal@tradeflow.co.uk" className="text-[#1B5E20] hover:underline">legal@tradeflow.co.uk</a></p>
            <p>Data & Digital Ltd, 1 Tech Lane, Bristol, BS1 1AA</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
