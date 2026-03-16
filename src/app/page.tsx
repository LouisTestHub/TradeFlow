import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/marketing/HeroSection';
import { TrustStatsBar } from '@/components/marketing/TrustStatsBar';
import { ReviewBadges } from '@/components/marketing/ReviewBadges';
import { ProblemSection } from '@/components/marketing/ProblemSection';
import { UnlimitedSection } from '@/components/marketing/UnlimitedSection';
import { VideoDemoSection } from '@/components/marketing/VideoDemoSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { NewFeaturesSection } from '@/components/marketing/NewFeaturesSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { SocialProofSection } from '@/components/marketing/SocialProofSection';
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
        <TrustStatsBar />
        <ReviewBadges />
        <ProblemSection />
        <UnlimitedSection />
        <VideoDemoSection />
        <FeaturesSection />
        <NewFeaturesSection />
        <HowItWorksSection />
        <SocialProofSection />
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
