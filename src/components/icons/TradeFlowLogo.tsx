'use client';

export function TradeFlowLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 48" className={className} aria-label="TradeFlow logo">
      {/* Leaf + field geometric mark */}
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>
      {/* Leaf shape */}
      <path d="M12 6C12 6 6 18 6 28c0 8 6 14 14 14s14-6 14-14c0-10-6-22-6-22s-4 8-8 12C16 22 12 6 12 6z" fill="url(#leafGrad)" />
      {/* Field lines inside leaf */}
      <path d="M12 22h12M10 27h16M8 32h20" stroke="#FAFAF5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Vein */}
      <line x1="20" y1="12" x2="20" y2="38" stroke="#FAFAF5" strokeWidth="1" opacity="0.4" />
      {/* Text */}
      <text x="42" y="20" fontFamily="'DM Sans', sans-serif" fontWeight="700" fontSize="18" fill="#1B5E20">Field</text>
      <text x="90" y="20" fontFamily="'DM Sans', sans-serif" fontWeight="700" fontSize="18" fill="#F9A825">Keeper</text>
      <text x="42" y="36" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="9" fill="#64748B" letterSpacing="2">FARM COMPLIANCE</text>
    </svg>
  );
}
