'use client';

import { ScrollFadeIn } from './ScrollFadeIn';

function GasSafeBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#D32F2F" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="34" fontSize="8" fontWeight="700" fill="#D32F2F" textAnchor="middle" fontFamily="DM Sans">GAS</text>
      <text x="40" y="46" fontSize="8" fontWeight="700" fill="#D32F2F" textAnchor="middle" fontFamily="DM Sans">SAFE</text>
      <text x="40" y="56" fontSize="5" fill="#D32F2F" textAnchor="middle" fontFamily="Inter">REGISTER</text>
    </svg>
  );
}

function NiceicBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#003DA5" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="38" fontSize="9" fontWeight="700" fill="#003DA5" textAnchor="middle" fontFamily="DM Sans">NICEIC</text>
      <text x="40" y="52" fontSize="5" fill="#003DA5" textAnchor="middle" fontFamily="Inter">CERTIFIED</text>
    </svg>
  );
}

function NapitBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#0077C8" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="38" fontSize="9" fontWeight="700" fill="#0077C8" textAnchor="middle" fontFamily="DM Sans">NAPIT</text>
      <text x="40" y="52" fontSize="5" fill="#0077C8" textAnchor="middle" fontFamily="Inter">APPROVED</text>
    </svg>
  );
}

function FGasBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#00796B" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="36" fontSize="10" fontWeight="700" fill="#00796B" textAnchor="middle" fontFamily="DM Sans">F-GAS</text>
      <text x="40" y="52" fontSize="5" fill="#00796B" textAnchor="middle" fontFamily="Inter">COMPLIANT</text>
    </svg>
  );
}

function CisBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#1E3A5F" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="38" fontSize="11" fontWeight="700" fill="#1E3A5F" textAnchor="middle" fontFamily="DM Sans">CIS</text>
      <text x="40" y="52" fontSize="5" fill="#1E3A5F" textAnchor="middle" fontFamily="Inter">TAX READY</text>
    </svg>
  );
}

export function ComplianceBadges() {
  return (
    <section className="py-16 lg:py-20 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-10">
            <h2 className="font-[var(--font-dm-sans)] text-2xl sm:text-3xl font-bold text-[#0F172A]">
              UK Trade Compliance Built In
            </h2>
            <p className="mt-3 text-slate-600">Digital certificates and compliance tracking for all major UK schemes.</p>
          </div>
        </ScrollFadeIn>
        <ScrollFadeIn delay={200}>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            <GasSafeBadge className="w-16 h-16 sm:w-20 sm:h-20" />
            <NiceicBadge className="w-16 h-16 sm:w-20 sm:h-20" />
            <NapitBadge className="w-16 h-16 sm:w-20 sm:h-20" />
            <FGasBadge className="w-16 h-16 sm:w-20 sm:h-20" />
            <CisBadge className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
