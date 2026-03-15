'use client';

export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-label="Field service engineer with van and house">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <linearGradient id="vanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="houseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="600" height="400" fill="url(#skyGrad)" rx="12" />

      {/* Clouds */}
      <g opacity="0.5">
        <ellipse cx="120" cy="60" rx="50" ry="18" fill="white" />
        <ellipse cx="100" cy="55" rx="30" ry="14" fill="white" />
        <ellipse cx="145" cy="55" rx="35" ry="14" fill="white" />
      </g>
      <g opacity="0.35">
        <ellipse cx="420" cy="45" rx="40" ry="14" fill="white" />
        <ellipse cx="400" cy="40" rx="25" ry="11" fill="white" />
        <ellipse cx="440" cy="40" rx="28" ry="11" fill="white" />
      </g>

      {/* Ground / road */}
      <rect x="0" y="310" width="600" height="90" fill="#E2E8F0" rx="0" />
      <rect x="0" y="310" width="600" height="4" fill="#CBD5E1" />
      {/* Pavement */}
      <rect x="0" y="340" width="600" height="60" fill="#F1F5F9" />

      {/* House */}
      <g transform="translate(380, 120)">
        {/* House body */}
        <rect x="0" y="40" width="160" height="150" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" rx="2" />
        {/* Roof */}
        <polygon points="-10,40 80,0 170,40" fill="#1E3A5F" />
        <polygon points="0,40 80,8 160,40" fill="#2563EB" />
        {/* Chimney */}
        <rect x="120" y="10" width="20" height="35" fill="#64748B" />
        {/* Door */}
        <rect x="60" y="120" width="40" height="70" rx="3" fill="#1E3A5F" />
        <circle cx="92" cy="158" r="3" fill="#F97316" />
        {/* Windows */}
        <rect x="15" y="60" width="35" height="35" rx="2" fill="#BFDBFE" stroke="#1E3A5F" strokeWidth="1.5" />
        <line x1="32.5" y1="60" x2="32.5" y2="95" stroke="#1E3A5F" strokeWidth="1" />
        <line x1="15" y1="77.5" x2="50" y2="77.5" stroke="#1E3A5F" strokeWidth="1" />
        <rect x="110" y="60" width="35" height="35" rx="2" fill="#BFDBFE" stroke="#1E3A5F" strokeWidth="1.5" />
        <line x1="127.5" y1="60" x2="127.5" y2="95" stroke="#1E3A5F" strokeWidth="1" />
        <line x1="110" y1="77.5" x2="145" y2="77.5" stroke="#1E3A5F" strokeWidth="1" />
        {/* Boiler visible through window */}
        <rect x="116" y="66" width="12" height="16" rx="2" fill="#F97316" opacity="0.6" />
        <rect x="119" y="62" width="6" height="6" rx="1" fill="#94A3B8" />
        {/* Pipe from boiler */}
        <line x1="122" y1="82" x2="122" y2="95" stroke="#94A3B8" strokeWidth="2" />
      </g>

      {/* Service Van */}
      <g transform="translate(60, 210)">
        {/* Van body */}
        <rect x="0" y="20" width="200" height="90" rx="6" fill="url(#vanGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Van cab */}
        <path d="M160 20 L200 20 L220 50 L220 110 L200 110 L200 20" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Windscreen */}
        <path d="M202 25 L218 48 L218 70 L202 70 Z" fill="#BFDBFE" />
        {/* Side panel - company branding */}
        <rect x="10" y="30" width="140" height="70" rx="3" fill="#1E3A5F" />
        <text x="80" y="58" fontSize="14" fontWeight="700" fill="white" textAnchor="middle" fontFamily="DM Sans">TradeFlow</text>
        <text x="80" y="75" fontSize="8" fill="#F97316" textAnchor="middle" fontFamily="Inter">Field Service Solutions</text>
        <text x="80" y="90" fontSize="7" fill="#94A3B8" textAnchor="middle" fontFamily="Inter">0800 123 4567</text>
        {/* Headlight */}
        <circle cx="218" cy="85" r="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
        {/* Wheels */}
        <circle cx="50" cy="115" r="18" fill="#334155" />
        <circle cx="50" cy="115" r="10" fill="#64748B" />
        <circle cx="50" cy="115" r="4" fill="#94A3B8" />
        <circle cx="190" cy="115" r="18" fill="#334155" />
        <circle cx="190" cy="115" r="10" fill="#64748B" />
        <circle cx="190" cy="115" r="4" fill="#94A3B8" />
        {/* Ladder rack on roof */}
        <rect x="20" y="10" width="150" height="4" rx="2" fill="#94A3B8" />
        <rect x="40" y="4" width="4" height="10" rx="1" fill="#94A3B8" />
        <rect x="100" y="4" width="4" height="10" rx="1" fill="#94A3B8" />
        <rect x="150" y="4" width="4" height="10" rx="1" fill="#94A3B8" />
        {/* Ladder on rack */}
        <rect x="30" y="2" width="120" height="3" rx="1" fill="#D97706" />
        <g stroke="#D97706" strokeWidth="1.5">
          <line x1="50" y1="0" x2="50" y2="5" />
          <line x1="70" y1="0" x2="70" y2="5" />
          <line x1="90" y1="0" x2="90" y2="5" />
          <line x1="110" y1="0" x2="110" y2="5" />
          <line x1="130" y1="0" x2="130" y2="5" />
        </g>
      </g>

      {/* Engineer figure */}
      <g transform="translate(310, 218)">
        {/* Hard hat / hi-vis */}
        <ellipse cx="0" cy="-8" rx="7" ry="7" fill="#D7A86E" /> {/* Head */}
        {/* Hard hat */}
        <path d="M-8 -12 Q0 -20 8 -12" fill="#F97316" />
        <rect x="-9" y="-12" width="18" height="4" rx="2" fill="#F97316" />
        {/* Hi-vis vest torso */}
        <rect x="-12" y="-1" width="24" height="35" rx="3" fill="#F97316" />
        {/* Hi-vis reflective strips */}
        <rect x="-12" y="10" width="24" height="3" rx="1" fill="#FEF3C7" />
        <rect x="-12" y="20" width="24" height="3" rx="1" fill="#FEF3C7" />
        {/* Arms */}
        <rect x="-18" y="1" width="6" height="24" rx="3" fill="#F97316" />
        <rect x="12" y="1" width="6" height="24" rx="3" fill="#F97316" />
        {/* Hands */}
        <circle cx="-15" cy="26" r="4" fill="#D7A86E" />
        <circle cx="15" cy="26" r="4" fill="#D7A86E" />
        {/* Legs (work trousers) */}
        <rect x="-10" y="34" width="8" height="34" rx="2" fill="#1E3A5F" />
        <rect x="2" y="34" width="8" height="34" rx="2" fill="#1E3A5F" />
        {/* Work boots */}
        <rect x="-11" y="66" width="10" height="6" rx="2" fill="#1E293B" />
        <rect x="1" y="66" width="10" height="6" rx="2" fill="#1E293B" />
        {/* Tablet in hands */}
        <g transform="translate(-8, 16) rotate(-5)">
          <rect x="0" y="0" width="26" height="18" rx="2" fill="#0F172A" />
          <rect x="2" y="2" width="22" height="14" rx="1" fill="#EFF6FF" />
          {/* Screen content */}
          <rect x="4" y="4" width="8" height="3" rx="0.5" fill="#2563EB" />
          <rect x="14" y="4" width="8" height="3" rx="0.5" fill="#F97316" />
          <rect x="4" y="9" width="18" height="1.5" rx="0.5" fill="#BFDBFE" />
          <rect x="4" y="12" width="14" height="1.5" rx="0.5" fill="#BFDBFE" />
        </g>
      </g>

      {/* Tool icons floating */}
      {/* Wrench */}
      <g transform="translate(320, 170)" opacity="0.6">
        <circle cx="0" cy="0" r="14" fill="#EFF6FF" />
        <path d="M-5 -5 L-2 -2 L4 -8 L6 -6 L0 0 L3 3 L5 1 L7 3 L3 7 L-7 -3 Z" fill="#1E3A5F" />
      </g>
      {/* Multimeter */}
      <g transform="translate(360, 185)" opacity="0.5">
        <circle cx="0" cy="0" r="12" fill="#FFF7ED" />
        <rect x="-5" y="-7" width="10" height="14" rx="1.5" fill="#F97316" />
        <rect x="-3" y="-5" width="6" height="5" rx="1" fill="#0F172A" />
        <circle cx="0" cy="4" r="2" fill="#0F172A" />
      </g>
      {/* Pipe */}
      <g transform="translate(290, 185)" opacity="0.5">
        <circle cx="0" cy="0" r="11" fill="#EFF6FF" />
        <rect x="-6" y="-3" width="12" height="6" rx="3" fill="#64748B" />
        <rect x="-8" y="-4" width="4" height="8" rx="1" fill="#94A3B8" />
        <rect x="4" y="-4" width="4" height="8" rx="1" fill="#94A3B8" />
      </g>
    </svg>
  );
}
