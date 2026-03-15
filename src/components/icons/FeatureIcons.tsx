'use client';

const iconSize = 64;

export function SprayIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#E8F5E9" />
      <g transform="translate(12, 8)">
        {/* Spray bottle body */}
        <rect x="12" y="16" width="16" height="30" rx="3" fill="#2E7D32" />
        <rect x="14" y="12" width="12" height="8" rx="2" fill="#1B5E20" />
        {/* Nozzle */}
        <rect x="17" y="4" width="6" height="10" rx="1" fill="#5D4037" />
        <rect x="15" y="2" width="10" height="4" rx="2" fill="#795548" />
        {/* Spray droplets */}
        <circle cx="8" cy="10" r="2" fill="#4CAF50" opacity="0.6" />
        <circle cx="4" cy="16" r="1.5" fill="#4CAF50" opacity="0.4" />
        <circle cx="6" cy="6" r="1.5" fill="#4CAF50" opacity="0.5" />
        <circle cx="2" cy="12" r="1" fill="#4CAF50" opacity="0.3" />
        {/* Level indicator */}
        <rect x="14" y="28" width="12" height="14" rx="1" fill="#4CAF50" opacity="0.4" />
      </g>
    </svg>
  );
}

export function LivestockIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#FFF3E0" />
      <g transform="translate(10, 12)">
        {/* Cow body */}
        <ellipse cx="22" cy="24" rx="16" ry="12" fill="#5D4037" />
        {/* Head */}
        <ellipse cx="40" cy="18" rx="8" ry="7" fill="#5D4037" />
        {/* Snout */}
        <ellipse cx="45" cy="20" rx="4" ry="3" fill="#D7A86E" />
        {/* Eye */}
        <circle cx="42" cy="16" r="1.5" fill="white" />
        <circle cx="42.5" cy="16" r="0.8" fill="#1E293B" />
        {/* Horns */}
        <path d="M36 11 Q34 6 36 4" stroke="#795548" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M40 10 Q42 5 40 3" stroke="#795548" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Ear tag */}
        <rect x="44" y="13" width="4" height="6" rx="1" fill="#F9A825" />
        <text x="46" y="18" fontSize="4" fill="#1E293B" fontFamily="Inter" textAnchor="middle" fontWeight="700">ID</text>
        {/* Legs */}
        <rect x="12" y="32" width="3" height="10" rx="1" fill="#4E342E" />
        <rect x="20" y="33" width="3" height="10" rx="1" fill="#4E342E" />
        <rect x="26" y="33" width="3" height="10" rx="1" fill="#4E342E" />
        <rect x="32" y="32" width="3" height="10" rx="1" fill="#4E342E" />
        {/* Spots */}
        <ellipse cx="18" cy="22" rx="4" ry="3" fill="white" opacity="0.6" />
        <ellipse cx="28" cy="26" rx="3" ry="2" fill="white" opacity="0.6" />
      </g>
    </svg>
  );
}

export function WeatherIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#E3F2FD" />
      <g transform="translate(10, 10)">
        {/* Thermometer */}
        <rect x="6" y="4" width="8" height="28" rx="4" fill="white" stroke="#1565C0" strokeWidth="1.5" />
        <circle cx="10" cy="36" r="7" fill="white" stroke="#1565C0" strokeWidth="1.5" />
        <rect x="8" y="14" width="4" height="22" rx="2" fill="#EF5350" />
        <circle cx="10" cy="36" r="5" fill="#EF5350" />
        {/* Scale marks */}
        <line x1="14" y1="10" x2="18" y2="10" stroke="#1565C0" strokeWidth="1" />
        <line x1="14" y1="16" x2="18" y2="16" stroke="#1565C0" strokeWidth="1" />
        <line x1="14" y1="22" x2="18" y2="22" stroke="#1565C0" strokeWidth="1" />
        {/* Sun */}
        <circle cx="32" cy="14" r="8" fill="#F9A825" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <line key={i} x1={32 + Math.cos(a * Math.PI / 180) * 11} y1={14 + Math.sin(a * Math.PI / 180) * 11} x2={32 + Math.cos(a * Math.PI / 180) * 14} y2={14 + Math.sin(a * Math.PI / 180) * 14} stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
        ))}
        {/* Wind lines */}
        <path d="M24 30 Q32 28 38 30" stroke="#64B5F6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M26 34 Q34 32 42 34" stroke="#64B5F6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M22 38 Q30 36 36 38" stroke="#64B5F6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function ComplianceIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#F3E5F5" />
      <g transform="translate(12, 8)">
        {/* Calendar */}
        <rect x="2" y="6" width="36" height="38" rx="4" fill="white" stroke="#7B1FA2" strokeWidth="1.5" />
        <rect x="2" y="6" width="36" height="10" rx="4" fill="#7B1FA2" />
        <rect x="2" y="12" width="36" height="4" fill="#7B1FA2" />
        {/* Calendar hooks */}
        <rect x="10" y="2" width="3" height="8" rx="1.5" fill="#4A148C" />
        <rect x="27" y="2" width="3" height="8" rx="1.5" fill="#4A148C" />
        {/* Check marks */}
        <path d="M8 24 l3 3 l5-5" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 32 l3 3 l5-5" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 40 l3 3 l5-5" stroke="#F9A825" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Text lines */}
        <rect x="20" y="24" width="14" height="2" rx="1" fill="#E0E0E0" />
        <rect x="20" y="32" width="10" height="2" rx="1" fill="#E0E0E0" />
        <rect x="20" y="40" width="12" height="2" rx="1" fill="#E0E0E0" />
      </g>
    </svg>
  );
}

export function OfflineIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <rect width="64" height="64" rx="16" fill="#E0F2F1" />
      <g transform="translate(10, 8)">
        {/* Phone outline */}
        <rect x="8" y="2" width="28" height="44" rx="4" fill="white" stroke="#00695C" strokeWidth="1.5" />
        <rect x="10" y="8" width="24" height="30" rx="1" fill="#E0F2F1" />
        {/* Screen content */}
        <rect x="12" y="12" width="10" height="6" rx="2" fill="#4CAF50" />
        <rect x="12" y="22" width="20" height="2" rx="1" fill="#B2DFDB" />
        <rect x="12" y="28" width="16" height="2" rx="1" fill="#B2DFDB" />
        <rect x="12" y="34" width="12" height="2" rx="1" fill="#B2DFDB" />
        {/* Home button area */}
        <circle cx="22" cy="42" r="2" fill="none" stroke="#00695C" strokeWidth="1" />
        {/* Offline badge */}
        <g transform="translate(28, 0)">
          <circle cx="8" cy="8" r="10" fill="#00695C" />
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
      <rect width="64" height="64" rx="16" fill="#FFF8E1" />
      <g transform="translate(12, 8)">
        {/* Chart background */}
        <rect x="2" y="2" width="36" height="38" rx="4" fill="white" stroke="#F57F17" strokeWidth="1.5" />
        {/* Bars */}
        <rect x="8" y="24" width="5" height="12" rx="1" fill="#4CAF50" />
        <rect x="16" y="18" width="5" height="18" rx="1" fill="#2E7D32" />
        <rect x="24" y="14" width="5" height="22" rx="1" fill="#1B5E20" />
        <rect x="32" y="20" width="5" height="16" rx="1" fill="#F9A825" />
        {/* Trend line */}
        <polyline points="10,22 18,16 26,12 34,18" stroke="#F57F17" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Axis */}
        <line x1="6" y1="8" x2="6" y2="38" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="6" y1="38" x2="38" y2="38" stroke="#E0E0E0" strokeWidth="1" />
        {/* Title bar */}
        <rect x="6" y="4" width="16" height="3" rx="1" fill="#F9A825" opacity="0.5" />
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
        <rect x="8" y="8" width="44" height="56" rx="3" fill="#E0E0E0" transform="rotate(3 30 36)" />
        <rect x="6" y="6" width="44" height="56" rx="3" fill="#EEEEEE" transform="rotate(-2 28 34)" />
        <rect x="4" y="4" width="44" height="56" rx="3" fill="white" stroke="#BDBDBD" strokeWidth="1" />
        {/* Lines */}
        <rect x="10" y="12" width="28" height="2" rx="1" fill="#E0E0E0" />
        <rect x="10" y="18" width="32" height="2" rx="1" fill="#E0E0E0" />
        <rect x="10" y="24" width="24" height="2" rx="1" fill="#E0E0E0" />
        <rect x="10" y="30" width="30" height="2" rx="1" fill="#E0E0E0" />
        <rect x="10" y="36" width="20" height="2" rx="1" fill="#E0E0E0" />
        {/* Warning badge */}
        <circle cx="48" cy="8" r="12" fill="#EF5350" />
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
        <path d="M30 8 A22 22 0 0 1 52 30" stroke="#F9A825" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M52 30 A22 22 0 0 1 30 52" stroke="#F9A825" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M30 52 A22 22 0 0 1 8 30" stroke="#F9A825" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M8 30 A22 22 0 0 1 30 8" stroke="#F9A825" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Arrow heads */}
        <polygon points="52,26 52,34 56,30" fill="#F9A825" />
        <polygon points="34,52 26,52 30,56" fill="#F9A825" />
        <polygon points="8,34 8,26 4,30" fill="#F9A825" />
        <polygon points="26,8 34,8 30,4" fill="#F9A825" />
        {/* Center screens */}
        <rect x="18" y="20" width="10" height="8" rx="1" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="0.5" />
        <rect x="32" y="20" width="10" height="8" rx="1" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="0.5" />
        <rect x="25" y="32" width="10" height="8" rx="1" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

export function DeadlineIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <g transform="translate(10, 8)">
        {/* Clock */}
        <circle cx="30" cy="30" r="24" fill="white" stroke="#EF5350" strokeWidth="2.5" />
        <circle cx="30" cy="30" r="20" fill="white" />
        {/* Clock face marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
          <line key={i} x1={30 + Math.cos((a - 90) * Math.PI / 180) * 17} y1={30 + Math.sin((a - 90) * Math.PI / 180) * 17} x2={30 + Math.cos((a - 90) * Math.PI / 180) * 19} y2={30 + Math.sin((a - 90) * Math.PI / 180) * 19} stroke="#BDBDBD" strokeWidth={i % 3 === 0 ? 2 : 1} />
        ))}
        {/* Hands */}
        <line x1="30" y1="30" x2="30" y2="16" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="30" x2="42" y2="30" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="30" r="2.5" fill="#1E293B" />
        {/* Danger X overlay */}
        <g transform="translate(42, 2)">
          <circle cx="10" cy="10" r="10" fill="#EF5350" />
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
      <circle cx="32" cy="32" r="30" fill="#E8F5E9" />
      <g transform="translate(12, 12)">
        {/* Barn */}
        <polygon points="20,6 4,16 36,16" fill="#5D4037" />
        <rect x="6" y="16" width="28" height="20" fill="#795548" />
        <rect x="14" y="22" width="12" height="14" rx="6" fill="#3E2723" />
        {/* Field lines */}
        <line x1="0" y1="36" x2="40" y2="36" stroke="#4CAF50" strokeWidth="2" />
        <line x1="4" y1="40" x2="36" y2="40" stroke="#66BB6A" strokeWidth="1.5" opacity="0.6" />
      </g>
    </svg>
  );
}

export function RecordIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <circle cx="32" cy="32" r="30" fill="#E8F5E9" />
      <g transform="translate(14, 10)">
        {/* Hand */}
        <path d="M8 30 Q2 28 4 22 Q6 18 10 20 L10 12 Q10 8 14 8 Q18 8 18 12 L18 10 Q18 6 22 6 Q26 6 26 10 L26 28 Q26 36 18 38 L8 38 Q4 38 4 34 Z" fill="#D7A86E" />
        {/* Phone in hand */}
        <rect x="10" y="6" width="16" height="28" rx="2" fill="#1E293B" />
        <rect x="11.5" y="9" width="13" height="22" rx="1" fill="#E8F5E9" />
        {/* Screen elements */}
        <rect x="13" y="11" width="6" height="3" rx="1" fill="#4CAF50" />
        <rect x="13" y="16" width="10" height="1.5" rx="0.5" fill="#C8E6C9" />
        <rect x="13" y="19.5" width="8" height="1.5" rx="0.5" fill="#C8E6C9" />
        <rect x="13" y="23" width="10" height="4" rx="1" fill="#2E7D32" />
      </g>
    </svg>
  );
}

export function AutoGenIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <circle cx="32" cy="32" r="30" fill="#E8F5E9" />
      <g transform="translate(10, 10)">
        {/* Magic wand */}
        <rect x="6" y="26" width="4" height="20" rx="1" fill="#F9A825" transform="rotate(-45 8 36)" />
        <polygon points="22,14 26,10 30,14 26,18" fill="#F9A825" />
        {/* Sparkles */}
        <g fill="#F9A825">
          <polygon points="36,8 37,12 40,10 37,10" />
          <polygon points="14,6 15,10 18,8 15,8" />
          <polygon points="38,22 39,26 42,24 39,24" />
          <circle cx="28" cy="6" r="1.5" />
          <circle cx="40" cy="16" r="1" />
        </g>
        {/* Papers generated */}
        <rect x="22" y="20" width="18" height="22" rx="2" fill="white" stroke="#4CAF50" strokeWidth="1" />
        <rect x="25" y="24" width="10" height="1.5" rx="0.5" fill="#C8E6C9" />
        <rect x="25" y="28" width="12" height="1.5" rx="0.5" fill="#C8E6C9" />
        <rect x="25" y="32" width="8" height="1.5" rx="0.5" fill="#C8E6C9" />
        <path d="M26 36 l2 2 l4-4" stroke="#4CAF50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function ExportIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <circle cx="32" cy="32" r="30" fill="#E8F5E9" />
      <g transform="translate(14, 8)">
        {/* Document */}
        <rect x="4" y="4" width="28" height="36" rx="3" fill="white" stroke="#1B5E20" strokeWidth="1.5" />
        <path d="M22 4 L32 14 L22 14 Z" fill="#E8F5E9" stroke="#1B5E20" strokeWidth="1" />
        {/* PDF badge */}
        <rect x="8" y="18" width="16" height="8" rx="2" fill="#EF5350" />
        <text x="16" y="24" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Inter">PDF</text>
        {/* Download arrow */}
        <line x1="18" y1="30" x2="18" y2="38" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" />
        <polyline points="14,35 18,39 22,35" stroke="#1B5E20" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Lines */}
        <rect x="8" y="8" width="12" height="1.5" rx="0.5" fill="#E0E0E0" />
        <rect x="8" y="12" width="16" height="1.5" rx="0.5" fill="#E0E0E0" />
      </g>
    </svg>
  );
}

// Compliance badges
export function RedTractorBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#EF5350" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="34" fontSize="8" fontWeight="700" fill="#EF5350" textAnchor="middle" fontFamily="DM Sans">RED</text>
      <text x="40" y="46" fontSize="7" fontWeight="700" fill="#EF5350" textAnchor="middle" fontFamily="DM Sans">TRACTOR</text>
      <path d="M28 52 L52 52" stroke="#EF5350" strokeWidth="1.5" />
      <text x="40" y="60" fontSize="5" fill="#EF5350" textAnchor="middle" fontFamily="Inter">ASSURED</text>
    </svg>
  );
}

export function BcmsBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#1565C0" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="38" fontSize="10" fontWeight="700" fill="#1565C0" textAnchor="middle" fontFamily="DM Sans">BCMS</text>
      <text x="40" y="50" fontSize="5" fill="#1565C0" textAnchor="middle" fontFamily="Inter">CTS READY</text>
    </svg>
  );
}

export function SfiBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#2E7D32" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="38" fontSize="12" fontWeight="700" fill="#2E7D32" textAnchor="middle" fontFamily="DM Sans">SFI</text>
      <text x="40" y="50" fontSize="5" fill="#2E7D32" textAnchor="middle" fontFamily="Inter">COMPLIANT</text>
    </svg>
  );
}

export function NvzBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#00695C" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="38" fontSize="10" fontWeight="700" fill="#00695C" textAnchor="middle" fontFamily="DM Sans">NVZ</text>
      <text x="40" y="50" fontSize="5" fill="#00695C" textAnchor="middle" fontFamily="Inter">NUTRIENT</text>
    </svg>
  );
}

export function PesticideBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={80} height={80}>
      <circle cx="40" cy="40" r="36" fill="#E65100" />
      <circle cx="40" cy="40" r="32" fill="white" />
      <text x="40" y="34" fontSize="7" fontWeight="700" fill="#E65100" textAnchor="middle" fontFamily="DM Sans">PESTICIDE</text>
      <text x="40" y="46" fontSize="7" fontWeight="700" fill="#E65100" textAnchor="middle" fontFamily="DM Sans">REGS</text>
      <text x="40" y="56" fontSize="5" fill="#E65100" textAnchor="middle" fontFamily="Inter">COMPLIANT</text>
    </svg>
  );
}

// Pricing tier icons
export function SeedlingIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} width={48} height={48}>
      <line x1="24" y1="42" x2="24" y2="20" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 28 Q16 22 10 28 Q16 18 24 22" fill="#4CAF50" />
      <path d="M24 22 Q32 16 38 22 Q32 12 24 16" fill="#66BB6A" />
    </svg>
  );
}

export function PlantIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} width={48} height={48}>
      <line x1="24" y1="44" x2="24" y2="12" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 34 Q14 28 8 34 Q14 24 24 28" fill="#4CAF50" />
      <path d="M24 26 Q34 20 40 26 Q34 16 24 20" fill="#66BB6A" />
      <path d="M24 18 Q14 12 8 18 Q14 8 24 12" fill="#81C784" />
      <path d="M24 12 Q32 6 36 12 Q32 4 24 8" fill="#A5D6A7" />
    </svg>
  );
}

export function TreeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} width={48} height={48}>
      <rect x="21" y="32" width="6" height="12" rx="1" fill="#5D4037" />
      <ellipse cx="24" cy="20" rx="16" ry="18" fill="#1B5E20" />
      <ellipse cx="18" cy="18" rx="10" ry="12" fill="#2E7D32" />
      <ellipse cx="30" cy="18" rx="10" ry="12" fill="#388E3C" />
      <ellipse cx="24" cy="14" rx="8" ry="10" fill="#43A047" />
    </svg>
  );
}

// FETF grant icon
export function GrantIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} width={iconSize} height={iconSize}>
      <g transform="translate(6, 6)">
        {/* Building */}
        <rect x="12" y="18" width="28" height="30" fill="#1B5E20" rx="2" />
        <polygon points="6,18 26,4 46,18" fill="#2E7D32" />
        {/* Columns */}
        <rect x="16" y="22" width="3" height="22" fill="#E8F5E9" rx="1" />
        <rect x="24" y="22" width="3" height="22" fill="#E8F5E9" rx="1" />
        <rect x="32" y="22" width="3" height="22" fill="#E8F5E9" rx="1" />
        {/* Door */}
        <rect x="22" y="36" width="8" height="12" rx="4" fill="#1B5E20" stroke="#E8F5E9" strokeWidth="1" />
        {/* Pound sign */}
        <circle cx="42" cy="14" r="10" fill="#F9A825" />
        <text x="42" y="19" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="DM Sans">£</text>
      </g>
    </svg>
  );
}
