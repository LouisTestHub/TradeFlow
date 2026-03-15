import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TradeFlow',
  description: 'Built by Data & Digital — a UK software agency. We built TradeFlow because UK trades businesses deserve better than disconnected systems and compliance chaos.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="py-20 lg:py-28 bg-[#FAFAF5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[var(--font-dm-sans)] text-4xl sm:text-5xl font-bold text-[#1E293B] leading-tight mb-8">
              Built by People Who <span className="text-[#1B5E20]">Understand UK Trades</span>
            </h1>

            <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
              <p className="text-xl leading-relaxed">
                TradeFlow is built by <strong>Data & Digital Ltd</strong> — a UK software agency specialising in operational software that makes real businesses run better.
              </p>

              <h2 className="text-2xl font-bold text-[#1E293B] font-[var(--font-dm-sans)] mt-12">Why We Built TradeFlow</h2>
              <p>
                We spent months talking to plumbers, electricians, and HVAC engineers across the UK. The same frustration came up again and again: <em>&quot;I'm juggling 4-7 different systems and still entering the same data multiple times.&quot;</em>
              </p>
              <p>
                UK trades businesses waste 5–10 hours per week on admin — entering job details into job management, then again into Xero with CIS deductions, then logging certificates separately. With 150,000+ SME trades businesses in the UK, that's millions of hours wasted on duplicate data entry.
              </p>
              <p>
                No single platform existed that covered job management, CIS tax compliance, digital certificates (Gas Safe, NICEIC, F-Gas), engineer scheduling, and fleet tracking in one unified system. So we built one.
              </p>

              <h2 className="text-2xl font-bold text-[#1E293B] font-[var(--font-dm-sans)] mt-12">Our Principles</h2>
              <ul className="space-y-3">
                <li><strong>Trades first.</strong> Every design decision starts with: &quot;Would this work for an engineer in a basement with no signal?&quot;</li>
                <li><strong>Offline by default.</strong> No signal? No problem. TradeFlow works without internet.</li>
                <li><strong>Your data is yours.</strong> We never sell customer data. UK-hosted. Encrypted. Daily backups.</li>
                <li><strong>UK compliance built in.</strong> CIS, Gas Safe, NICEIC, F-Gas — not afterthoughts, but core features.</li>
                <li><strong>Honest pricing.</strong> Per-user pricing. No hidden fees, no contracts, no surprise charges.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1E293B] font-[var(--font-dm-sans)] mt-12">Data Security</h2>
              <p>
                Your business data is sensitive. We treat it that way:
              </p>
              <ul className="space-y-2">
                <li>🇬🇧 UK-hosted servers (AWS London — no overseas data transfer)</li>
                <li>🔒 Encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li>💾 Daily encrypted backups with 30-day retention</li>
                <li>🛡️ SOC 2 Type II compliant infrastructure</li>
                <li>📋 ICO registered — GDPR compliant</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1E293B] font-[var(--font-dm-sans)] mt-12">Contact</h2>
              <p>
                Questions? Want to see a demo? Get in touch:
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:hello@fieldkeeper.co.uk" className="text-[#1B5E20] hover:underline">hello@fieldkeeper.co.uk</a><br />
                <strong>Phone:</strong> 020 1234 5678 (Monday–Friday, 9am–5pm)
              </p>
            </div>
          </div>
        </section>
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
