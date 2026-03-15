'use client';

export function TradeFlowLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 48" className={className} aria-label="TradeFlow logo">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
      </defs>
      {/* Wrench + flow mark */}
      <g transform="translate(4, 4)">
        {/* Shield shape */}
        <path d="M20 2 L34 8 L34 24 C34 32 20 40 20 40 C20 40 6 32 6 24 L6 8 Z" fill="url(#logoGrad)" />
        {/* Wrench inside shield */}
        <path d="M15 14 L18 11 C19 10 21 10 22 11 L25 14 L23 16 L21 14 L17 18 L14 21 L12 19 L15 16 Z" fill="white" opacity="0.9" />
        {/* Checkmark */}
        <path d="M16 24 L19 27 L26 20" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Text */}
      <text x="44" y="20" fontFamily="'DM Sans', sans-serif" fontWeight="700" fontSize="18" fill="#1E3A5F">Trade</text>
      <text x="100" y="20" fontFamily="'DM Sans', sans-serif" fontWeight="700" fontSize="18" fill="#F97316">Flow</text>
      <text x="44" y="36" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="9" fill="#64748B" letterSpacing="2">FIELD SERVICE SOFTWARE</text>
    </svg>
  );
}
