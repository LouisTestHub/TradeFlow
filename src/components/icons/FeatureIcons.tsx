'use client';

const iconSize = 64;

// Feature section icons — trades themed
export function SprayIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      <g transform="translate(12, 10)">
        {/* Clipboard */}
        <rect x="6" y="6" width="28" height="36" rx="3" fill="white" stroke="#1E3A5F" strokeWidth="1.5" />
        <rect x="14" y="2" width="12" height="6" rx="3" fill="#1E3A5F" />
        {/* Job lines */}
        <rect x="10" y="14" width="16" height="2" rx="1" fill="#2563EB" />
        <rect x="10" y="20" width="20" height="2" rx="1" fill="#CBD5E1" />
        <rect x="10" y="26" width="14" height="2" rx="1" fill="#CBD5E1" />
        {/* Checkmarks */}
        <path d="M10 32 l2 2 l4-4" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M10 38 l2 2 l4-4" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Wrench overlay */}
        <g transform="translate(24, 26)">
          <circle cx="8" cy="8" r="10" fill="#F97316" opacity="0.9" />
          <path d="M5 5 L7 7 L11 3 L13 5 L9 9 L11 11 L9 13 L3 7 Z" fill="white" />
        </g>
      </g>
    </svg>
  );
}

export function SchedulingIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      <g transform="translate(10, 10)">
        {/* Calendar grid */}
        <rect x="4" y="6" width="36" height="32" rx="4" fill="white" stroke="#F97316" strokeWidth="1.5" />
        <rect x="4" y="6" width="36" height="10" rx="4" fill="#F97316" />
        <rect x="4" y="12" width="36" height="4" fill="#F97316" />
        {/* Calendar pegs */}
        <rect x="12" y="2" width="3" height="8" rx="1.5" fill="#1E3A5F" />
        <rect x="29" y="2" width="3" height="8" rx="1.5" fill="#1E3A5F" />
        {/* Time slots with engineer avatars */}
        <circle cx="12" cy="22" r="3" fill="#2563EB" />
        <rect x="18" y="20" width="18" height="3" rx="1" fill="#BFDBFE" />
        <circle cx="12" cy="30" r="3" fill="#F97316" />
        <rect x="18" y="28" width="14" height="3" rx="1" fill="#FED7AA" />
        <circle cx="12" cy="38" r="3" fill="#22C55E" />
        <rect x="18" y="36" width="16" height="3" rx="1" fill="#BBF7D0" />
      </g>
    </svg>
  );
}

export function WeatherIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#FEF2F2" />
      <g transform="translate(8, 8)">
        {/* Pound sign in circle */}
        <circle cx="24" cy="24" r="20" fill="white" stroke="#1E3A5F" strokeWidth="1.5" />
        <text x="24" y="22" fontSize="16" fontWeight="700" fill="#1E3A5F" textAnchor="middle" fontFamily="DM Sans">£</text>
        {/* CIS text */}
        <text x="24" y="34" fontSize="7" fontWeight="600" fill="#F97316" textAnchor="middle" fontFamily="Inter">CIS</text>
        {/* Percentage badge */}
        <g transform="translate(32, 4)">
          <circle cx="8" cy="8" r="9" fill="#1E3A5F" />
          <text x="8" y="11" fontSize="7" fontWeight="700" fill="white" textAnchor="middle" fontFamily="Inter">20%</text>
        </g>
        {/* Checkmark */}
        <g transform="translate(32, 32)">
          <circle cx="8" cy="8" r="8" fill="#22C55E" />
          <path d="M5 8 l2 2 l4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export function ComplianceIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      <g transform="translate(10, 8)">
        {/* Certificate document */}
        <rect x="4" y="4" width="36" height="42" rx="3" fill="white" stroke="#1E3A5F" strokeWidth="1.5" />
        {/* Certificate header ribbon */}
        <rect x="4" y="4" width="36" height="12" rx="3" fill="#1E3A5F" />
        <rect x="4" y="12" width="36" height="4" fill="#1E3A5F" />
        <text x="22" y="13" fontSize="6" fontWeight="700" fill="white" textAnchor="middle" fontFamily="Inter">GAS SAFE</text>
        {/* Certificate content */}
        <rect x="10" y="22" width="24" height="2" rx="1" fill="#CBD5E1" />
        <rect x="10" y="28" width="18" height="2" rx="1" fill="#CBD5E1" />
        {/* Stamp/seal */}
        <circle cx="30" cy="38" r="7" fill="none" stroke="#22C55E" strokeWidth="1.5" />
        <path d="M27 38 l2 2 l4-4" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Photo icon */}
        <rect x="8" y="32" width="12" height="10" rx="2" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1" />
        <circle cx="14" cy="36" r="2" fill="#2563EB" />
      </g>
    </svg>
  );
}

export function OfflineIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      <g transform="translate(10, 8)">
        {/* Phone outline */}
        <rect x="8" y="2" width="28" height="44" rx="4" fill="white" stroke="#1E3A5F" strokeWidth="1.5" />
        <rect x="10" y="8" width="24" height="30" rx="1" fill="#F8FAFC" />
        {/* Screen content */}
        <rect x="12" y="12" width="10" height="6" rx="2" fill="#2563EB" />
        <rect x="12" y="22" width="20" height="2" rx="1" fill="#BFDBFE" />
        <rect x="12" y="28" width="16" height="2" rx="1" fill="#BFDBFE" />
        <rect x="12" y="34" width="12" height="2" rx="1" fill="#BFDBFE" />
        {/* Home button area */}
        <circle cx="22" cy="42" r="2" fill="none" stroke="#1E3A5F" strokeWidth="1" />
        {/* Offline badge */}
        <g transform="translate(28, 0)">
          <circle cx="8" cy="8" r="10" fill="#1E3A5F" />
          <path d="M3 8 L8 4 L13 8 M5 8 L8 6 L11 8" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <line x1="2" y1="13" x2="14" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export function ReportIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      <g transform="translate(12, 8)">
        {/* Invoice document */}
        <rect x="2" y="2" width="36" height="42" rx="3" fill="white" stroke="#F97316" strokeWidth="1.5" />
        {/* Header */}
        <rect x="6" y="6" width="16" height="3" rx="1" fill="#1E3A5F" />
        <rect x="6" y="12" width="28" height="2" rx="1" fill="#CBD5E1" />
        <rect x="6" y="18" width="28" height="2" rx="1" fill="#CBD5E1" />
        {/* Amount */}
        <rect x="6" y="26" width="28" height="8" rx="2" fill="#FFF7ED" stroke="#F97316" strokeWidth="0.5" />
        <text x="20" y="32" fontSize="6" fontWeight="700" fill="#F97316" textAnchor="middle" fontFamily="DM Sans">£1,250.00</text>
        {/* Pay button */}
        <rect x="8" y="38" width="24" height="6" rx="3" fill="#22C55E" />
        <text x="20" y="43" fontSize="5" fontWeight="600" fill="white" textAnchor="middle" fontFamily="Inter">PAID ✓</text>
      </g>
    </svg>
  );
}

// Problem section icons
export function PaperworkIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <g transform="translate(10, 5)">
        {/* Stacked papers */}
        <rect x="8" y="8" width="44" height="56" rx="3" fill="#E2E8F0" transform="rotate(3 30 36)" />
        <rect x="6" y="6" width="44" height="56" rx="3" fill="#F1F5F9" transform="rotate(-2 28 34)" />
        <rect x="4" y="4" width="44" height="56" rx="3" fill="white" stroke="#CBD5E1" strokeWidth="1" />
        {/* Lines */}
        <rect x="10" y="12" width="28" height="2" rx="1" fill="#E2E8F0" />
        <rect x="10" y="18" width="32" height="2" rx="1" fill="#E2E8F0" />
        <rect x="10" y="24" width="24" height="2" rx="1" fill="#E2E8F0" />
        <rect x="10" y="30" width="30" height="2" rx="1" fill="#E2E8F0" />
        <rect x="10" y="36" width="20" height="2" rx="1" fill="#E2E8F0" />
        {/* Warning badge */}
        <circle cx="48" cy="8" r="12" fill="#EF4444" />
        <text x="48" y="13" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">!</text>
      </g>
    </svg>
  );
}

export function DuplicateIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <g transform="translate(10, 10)">
        {/* Circular arrows */}
        <path d="M30 8 A22 22 0 0 1 52 30" stroke="#F97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M52 30 A22 22 0 0 1 30 52" stroke="#F97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M30 52 A22 22 0 0 1 8 30" stroke="#F97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M8 30 A22 22 0 0 1 30 8" stroke="#F97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Arrow heads */}
        <polygon points="52,26 52,34 56,30" fill="#F97316" />
        <polygon points="34,52 26,52 30,56" fill="#F97316" />
        <polygon points="8,34 8,26 4,30" fill="#F97316" />
        <polygon points="26,8 34,8 30,4" fill="#F97316" />
        {/* Center screens */}
        <rect x="18" y="20" width="10" height="8" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="32" y="20" width="10" height="8" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="25" y="32" width="10" height="8" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

export function DeadlineIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <g transform="translate(10, 8)">
        {/* Clock */}
        <circle cx="30" cy="30" r="24" fill="white" stroke="#EF4444" strokeWidth="2.5" />
        <circle cx="30" cy="30" r="20" fill="white" />
        {/* Clock face marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
          <line key={i} x1={30 + Math.cos((a - 90) * Math.PI / 180) * 17} y1={30 + Math.sin((a - 90) * Math.PI / 180) * 17} x2={30 + Math.cos((a - 90) * Math.PI / 180) * 19} y2={30 + Math.sin((a - 90) * Math.PI / 180) * 19} stroke="#CBD5E1" strokeWidth={i % 3 === 0 ? 2 : 1} />
        ))}
        {/* Hands */}
        <line x1="30" y1="30" x2="30" y2="16" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="30" x2="42" y2="30" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="30" r="2.5" fill="#0F172A" />
        {/* Danger X overlay */}
        <g transform="translate(42, 2)">
          <circle cx="10" cy="10" r="10" fill="#EF4444" />
          <line x1="6" y1="6" x2="14" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="6" x2="6" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

// How it works icons
export function SetupIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <circle cx="32" cy="32" r="30" fill="#EFF6FF" />
      <g transform="translate(14, 12)">
        {/* Laptop */}
        <rect x="2" y="4" width="32" height="22" rx="2" fill="white" stroke="#1E3A5F" strokeWidth="1.5" />
        <rect x="4" y="6" width="28" height="16" rx="1" fill="#F8FAFC" />
        {/* Screen content */}
        <rect x="7" y="9" width="10" height="3" rx="1" fill="#2563EB" />
        <rect x="7" y="14" width="22" height="2" rx="0.5" fill="#BFDBFE" />
        <rect x="7" y="18" width="16" height="2" rx="0.5" fill="#BFDBFE" />
        {/* Laptop base */}
        <rect x="-2" y="26" width="40" height="3" rx="1.5" fill="#1E3A5F" />
        {/* Gear icon */}
        <circle cx="28" cy="10" r="4" fill="none" stroke="#F97316" strokeWidth="1.5" />
        <circle cx="28" cy="10" r="1.5" fill="#F97316" />
      </g>
    </svg>
  );
}

export function RecordIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <circle cx="32" cy="32" r="30" fill="#EFF6FF" />
      <g transform="translate(14, 10)">
        {/* Hand */}
        <path d="M8 30 Q2 28 4 22 Q6 18 10 20 L10 12 Q10 8 14 8 Q18 8 18 12 L18 10 Q18 6 22 6 Q26 6 26 10 L26 28 Q26 36 18 38 L8 38 Q4 38 4 34 Z" fill="#D7A86E" />
        {/* Phone in hand */}
        <rect x="10" y="6" width="16" height="28" rx="2" fill="#0F172A" />
        <rect x="11.5" y="9" width="13" height="22" rx="1" fill="#EFF6FF" />
        {/* Screen elements */}
        <rect x="13" y="11" width="6" height="3" rx="1" fill="#2563EB" />
        <rect x="13" y="16" width="10" height="1.5" rx="0.5" fill="#BFDBFE" />
        <rect x="13" y="19.5" width="8" height="1.5" rx="0.5" fill="#BFDBFE" />
        <rect x="13" y="23" width="10" height="4" rx="1" fill="#1E3A5F" />
      </g>
    </svg>
  );
}

export function AutoGenIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <circle cx="32" cy="32" r="30" fill="#EFF6FF" />
      <g transform="translate(10, 10)">
        {/* Lightning bolt / automation */}
        <polygon points="24,6 16,24 22,24 18,38 30,18 24,18" fill="#F97316" />
        {/* Papers generated */}
        <rect x="22" y="20" width="18" height="22" rx="2" fill="white" stroke="#1E3A5F" strokeWidth="1" />
        <rect x="25" y="24" width="10" height="1.5" rx="0.5" fill="#BFDBFE" />
        <rect x="25" y="28" width="12" height="1.5" rx="0.5" fill="#BFDBFE" />
        <rect x="25" y="32" width="8" height="1.5" rx="0.5" fill="#BFDBFE" />
        <path d="M26 36 l2 2 l4-4" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Sync arrows */}
        <path d="M8 22 Q4 18 8 14" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
        <polygon points="8,12 10,16 6,16" fill="#2563EB" />
        <path d="M8 30 Q12 34 8 38" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
        <polygon points="8,40 6,36 10,36" fill="#2563EB" />
      </g>
    </svg>
  );
}

export function ExportIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <circle cx="32" cy="32" r="30" fill="#EFF6FF" />
      <g transform="translate(14, 8)">
        {/* Document */}
        <rect x="4" y="4" width="28" height="36" rx="3" fill="white" stroke="#1E3A5F" strokeWidth="1.5" />
        <path d="M22 4 L32 14 L22 14 Z" fill="#EFF6FF" stroke="#1E3A5F" strokeWidth="1" />
        {/* Pound sign */}
        <text x="16" y="28" fontSize="16" fontWeight="700" fill="#22C55E" textAnchor="middle" fontFamily="DM Sans">£</text>
        {/* Checkmark circle */}
        <g transform="translate(22, 26)">
          <circle cx="6" cy="6" r="7" fill="#22C55E" />
          <path d="M3 6 l2 2 l4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        {/* Lines */}
        <rect x="8" y="8" width="12" height="1.5" rx="0.5" fill="#CBD5E1" />
        <rect x="8" y="12" width="16" height="1.5" rx="0.5" fill="#CBD5E1" />
      </g>
    </svg>
  );
}

// Pricing tier icons
export function SeedlingIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} width={48} height={48}>
      {/* Single engineer */}
      <circle cx="24" cy="14" r="8" fill="#EFF6FF" stroke="#1E3A5F" strokeWidth="1.5" />
      <circle cx="24" cy="12" r="4" fill="#1E3A5F" />
      <path d="M16 30 Q16 22 24 22 Q32 22 32 30" fill="#1E3A5F" />
      <rect x="18" y="28" width="12" height="3" rx="1" fill="#F97316" />
    </svg>
  );
}

export function PlantIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} width={48} height={48}>
      {/* Two engineers */}
      <circle cx="16" cy="12" r="4" fill="#2563EB" />
      <path d="M10 26 Q10 20 16 20 Q22 20 22 26" fill="#2563EB" />
      <circle cx="32" cy="12" r="4" fill="#F97316" />
      <path d="M26 26 Q26 20 32 20 Q38 20 38 26" fill="#F97316" />
      {/* Van below */}
      <rect x="10" y="32" width="28" height="12" rx="3" fill="#1E3A5F" />
      <rect x="30" y="34" width="8" height="8" rx="2" fill="#BFDBFE" />
      <circle cx="16" cy="44" r="3" fill="#334155" />
      <circle cx="32" cy="44" r="3" fill="#334155" />
    </svg>
  );
}

export function TreeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} width={48} height={48}>
      {/* Building/HQ */}
      <rect x="8" y="8" width="32" height="36" rx="3" fill="#1E3A5F" />
      {/* Windows grid */}
      <rect x="12" y="12" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="21" y="12" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="30" y="12" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="12" y="22" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="21" y="22" width="6" height="6" rx="1" fill="#F97316" />
      <rect x="30" y="22" width="6" height="6" rx="1" fill="#BFDBFE" />
      {/* Door */}
      <rect x="18" y="34" width="12" height="10" rx="2" fill="#F97316" />
    </svg>
  );
}

// Grant / ROI icon
export function GrantIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <g transform="translate(6, 6)">
        {/* UK Map outline simplified */}
        <rect x="8" y="4" width="36" height="44" rx="4" fill="#1E3A5F" />
        {/* Flag stripes */}
        <line x1="8" y1="26" x2="44" y2="26" stroke="white" strokeWidth="3" />
        <line x1="26" y1="4" x2="26" y2="48" stroke="white" strokeWidth="3" />
        <line x1="8" y1="26" x2="44" y2="26" stroke="#EF4444" strokeWidth="1.5" />
        <line x1="26" y1="4" x2="26" y2="48" stroke="#EF4444" strokeWidth="1.5" />
        {/* Shield badge */}
        <g transform="translate(30, 28)">
          <circle cx="10" cy="10" r="12" fill="#F97316" />
          <text x="10" y="14" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="DM Sans">✓</text>
        </g>
      </g>
    </svg>
  );
}

// Compliance badges — these are kept in ComplianceBadges.tsx
export function CertificationBadge({ className = '' }: { className?: string }) {
  return <GasSafeBadge className={className} />;
}
export function BcmsBadge({ className = '' }: { className?: string }) {
  return <NiceicBadge className={className} />;
}
export function SfiBadge({ className = '' }: { className?: string }) {
  return <NapitBadge className={className} />;
}
export function NvzBadge({ className = '' }: { className?: string }) {
  return <FGasBadge className={className} />;
}
export function PesticideBadge({ className = '' }: { className?: string }) {
  return <CisBadge className={className} />;
}

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
