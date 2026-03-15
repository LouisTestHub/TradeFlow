'use client';

export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-label="Farmer with tablet in field">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="40%" stopColor="#FFF3C4" />
          <stop offset="100%" stopColor="#E8F5E9" />
        </linearGradient>
        <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#388E3C" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#F9A825" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="600" height="400" fill="url(#skyGrad)" rx="12" />

      {/* Sun */}
      <circle cx="480" cy="80" r="50" fill="url(#sunGrad)" opacity="0.8">
        <animate attributeName="r" values="50;53;50" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1={480 + Math.cos((angle * Math.PI) / 180) * 60}
          y1={80 + Math.sin((angle * Math.PI) / 180) * 60}
          x2={480 + Math.cos((angle * Math.PI) / 180) * 75}
          y2={80 + Math.sin((angle * Math.PI) / 180) * 75}
          stroke="#F9A825"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}

      {/* Clouds */}
      <g opacity="0.6">
        <ellipse cx="120" cy="70" rx="50" ry="20" fill="white" />
        <ellipse cx="100" cy="65" rx="30" ry="15" fill="white" />
        <ellipse cx="145" cy="65" rx="35" ry="15" fill="white" />
      </g>
      <g opacity="0.4">
        <ellipse cx="340" cy="50" rx="40" ry="15" fill="white" />
        <ellipse cx="320" cy="45" rx="25" ry="12" fill="white" />
        <ellipse cx="360" cy="45" rx="28" ry="12" fill="white" />
      </g>

      {/* Far hills */}
      <path d="M0 280 Q100 200 200 250 Q300 200 400 240 Q500 200 600 260 L600 400 L0 400 Z" fill="url(#hillGrad1)" opacity="0.6" />

      {/* Near hills */}
      <path d="M0 310 Q80 260 180 290 Q280 250 380 280 Q480 250 600 300 L600 400 L0 400 Z" fill="url(#hillGrad2)" />

      {/* Field lines (crop rows) */}
      <g stroke="#1B5E20" strokeWidth="1" opacity="0.3">
        <path d="M50 340 Q200 310 400 330 Q500 310 600 340" fill="none" />
        <path d="M0 360 Q150 335 350 350 Q500 335 600 360" fill="none" />
        <path d="M0 380 Q200 360 400 375 Q500 365 600 380" fill="none" />
      </g>

      {/* Tractor silhouette (far) */}
      <g transform="translate(420, 260) scale(0.5)" opacity="0.4">
        <rect x="0" y="10" width="60" height="25" rx="3" fill="#1B5E20" />
        <rect x="-10" y="5" width="30" height="20" rx="3" fill="#1B5E20" />
        <circle cx="10" cy="38" r="12" fill="#1B5E20" />
        <circle cx="48" cy="38" r="8" fill="#1B5E20" />
        <rect x="55" y="15" width="3" height="12" fill="#1B5E20" />
      </g>

      {/* Farmer figure */}
      <g transform="translate(180, 200)">
        {/* Body */}
        <ellipse cx="0" cy="-5" rx="4" ry="5" fill="#D7A86E" /> {/* Head */}
        {/* Cap */}
        <path d="M-5 -8 Q0 -14 5 -8" fill="#1B5E20" />
        <rect x="-6" y="-8" width="12" height="3" rx="1" fill="#1B5E20" />
        {/* Torso */}
        <rect x="-8" y="0" width="16" height="30" rx="3" fill="#2E7D32" />
        {/* Arms */}
        <rect x="-14" y="2" width="6" height="22" rx="3" fill="#2E7D32" transform="rotate(-10 -11 2)" />
        <rect x="8" y="2" width="6" height="22" rx="3" fill="#2E7D32" transform="rotate(15 11 2)" />
        {/* Hands holding tablet */}
        <circle cx="-12" cy="24" r="3" fill="#D7A86E" />
        <circle cx="16" cy="22" r="3" fill="#D7A86E" />
        {/* Legs */}
        <rect x="-7" y="30" width="6" height="30" rx="2" fill="#5D4037" />
        <rect x="1" y="30" width="6" height="30" rx="2" fill="#5D4037" />
        {/* Boots */}
        <rect x="-8" y="58" width="8" height="5" rx="2" fill="#3E2723" />
        <rect x="0" y="58" width="8" height="5" rx="2" fill="#3E2723" />
        {/* Tablet in hands */}
        <g transform="translate(-4, 14) rotate(-5)">
          <rect x="0" y="0" width="22" height="16" rx="2" fill="#1E293B" />
          <rect x="1.5" y="1.5" width="19" height="13" rx="1" fill="#E8F5E9" />
          {/* Screen content */}
          <rect x="3" y="3" width="6" height="3" rx="0.5" fill="#4CAF50" />
          <rect x="11" y="3" width="8" height="3" rx="0.5" fill="#F9A825" />
          <rect x="3" y="7.5" width="16" height="1" rx="0.5" fill="#C8E6C9" />
          <rect x="3" y="10" width="12" height="1" rx="0.5" fill="#C8E6C9" />
          <rect x="3" y="12" width="8" height="1" rx="0.5" fill="#A5D6A7" />
        </g>
      </g>

      {/* Fence posts */}
      <g stroke="#5D4037" strokeWidth="2.5" opacity="0.5">
        <line x1="60" y1="300" x2="60" y2="330" />
        <line x1="110" y1="295" x2="110" y2="325" />
        <line x1="60" y1="310" x2="110" y2="305" strokeWidth="1.5" />
        <line x1="60" y1="320" x2="110" y2="315" strokeWidth="1.5" />
      </g>

      {/* Sheep dots in field */}
      <g fill="white" opacity="0.6">
        <circle cx="320" cy="310" r="4" />
        <circle cx="335" cy="315" r="3.5" />
        <circle cx="350" cy="308" r="4" />
        <circle cx="310" cy="318" r="3" />
        <circle cx="360" cy="320" r="3.5" />
      </g>
    </svg>
  );
}
