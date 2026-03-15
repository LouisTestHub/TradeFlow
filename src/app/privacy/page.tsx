import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TradeFlow privacy policy. How we collect, use, and protect your farm data. UK-hosted. GDPR compliant.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="py-20 lg:py-28 bg-[#FAFAF5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#1E293B] mb-4">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-10">Last updated: 15 March 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 [&_h2]:text-[#1E293B] [&_h2]:font-[var(--font-dm-sans)] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4">
            <h2>1. Who We Are</h2>
            <p>TradeFlow is operated by Data & Digital Ltd, registered in England and Wales (Company No. 12345678). Registered address: 1 Tech Lane, Bristol, BS1 1AA.</p>
            <p>We are registered with the Information Commissioner&apos;s Office (ICO) under registration number ZA123456.</p>

            <h2>2. What Data We Collect</h2>
            <p>We collect data you provide when using TradeFlow:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account data:</strong> Name, email, phone number, farm name</li>
              <li><strong>Farm data:</strong> CPH number, SBI number, fields, livestock, spray records, medicine records, movements, fertiliser records</li>
              <li><strong>Usage data:</strong> Pages visited, features used, device type</li>
              <li><strong>Contact form submissions:</strong> Name, email, phone, message</li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide the TradeFlow service and generate compliance records</li>
              <li>To send you compliance alerts and deadline reminders</li>
              <li>To improve the service based on usage patterns</li>
              <li>To respond to support queries</li>
              <li>To process payments (via Stripe — we never see your full card number)</li>
            </ul>

            <h2>4. Data Storage & Security</h2>
            <p>All data is stored on UK-based servers. We use:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>TLS 1.3 encryption in transit</li>
              <li>AES-256 encryption at rest</li>
              <li>Daily encrypted backups with 30-day retention</li>
              <li>SOC 2 Type II compliant infrastructure</li>
            </ul>

            <h2>5. We Never Sell Your Data</h2>
            <p>Your farm data is yours. We will never sell, rent, or share your data with third parties for marketing purposes. Period.</p>

            <h2>6. Your Rights</h2>
            <p>Under GDPR and UK data protection law, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Erase your data (&quot;right to be forgotten&quot;)</li>
              <li>Export your data in a portable format</li>
              <li>Object to processing</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We use Google Analytics (with IP anonymization) for usage analytics. You can opt out via our cookie consent banner.</p>

            <h2>8. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you cancel, we retain data for 90 days (in case you return), then permanently delete it. You can request immediate deletion at any time.</p>

            <h2>9. Contact Us</h2>
            <p>Data Protection Officer: <a href="mailto:privacy@fieldkeeper.co.uk" className="text-[#1B5E20] hover:underline">privacy@fieldkeeper.co.uk</a></p>
            <p>Data & Digital Ltd, 1 Tech Lane, Bristol, BS1 1AA</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
