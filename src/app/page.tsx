import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/marketing/HeroSection';
import { ProblemSection } from '@/components/marketing/ProblemSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { PricingSection } from '@/components/marketing/PricingSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { FetfSection } from '@/components/marketing/FetfSection';
import { ComplianceBadges } from '@/components/marketing/ComplianceBadges';
import { FaqSection } from '@/components/marketing/FaqSection';
import { CtaSection } from '@/components/marketing/CtaSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TradeFlow — UK Field Service Software | Job Management for Plumbers, Electricians & HVAC',
  description:
    'Complete field service platform for UK trades. Job management, engineer scheduling, CIS tax compliance, digital certificates (Gas Safe, NICEIC, F-Gas), fleet tracking, and invoicing. Works offline. From £39/user/month.',
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FetfSection />
        <ComplianceBadges />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
