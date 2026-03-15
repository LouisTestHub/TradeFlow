'use client';

export function PhoneMockup({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ animation: 'float 6s ease-in-out infinite' }}>
      <svg viewBox="0 0 240 480" className="w-full h-auto drop-shadow-2xl" aria-label="TradeFlow app on phone">
        <defs>
          <linearGradient id="phoneFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <clipPath id="screenClip">
            <rect x="12" y="40" width="216" height="400" rx="4" />
          </clipPath>
        </defs>

        {/* Phone body */}
        <rect width="240" height="480" rx="28" fill="url(#phoneFrame)" />

        {/* Screen */}
        <rect x="12" y="40" width="216" height="400" rx="4" fill="#FAFAF5" />

        {/* Notch */}
        <rect x="80" y="12" width="80" height="22" rx="11" fill="#0F172A" />
        <circle cx="120" cy="23" r="4" fill="#1E293B" />

        {/* Status bar */}
        <g clipPath="url(#screenClip)">
          <rect x="12" y="40" width="216" height="28" fill="#1B5E20" />
          <text x="24" y="58" fontFamily="Inter, sans-serif" fontSize="9" fill="white" fontWeight="600">TradeFlow</text>
          <text x="180" y="58" fontFamily="Inter, sans-serif" fontSize="8" fill="white" opacity="0.8">9:41</text>

          {/* Compliance Health Score */}
          <rect x="20" y="78" width="200" height="60" rx="8" fill="#E8F5E9" />
          <text x="30" y="95" fontFamily="DM Sans, sans-serif" fontSize="10" fill="#1B5E20" fontWeight="700">Compliance Health</text>
          {/* Score circle */}
          <circle cx="180" cy="105" r="18" fill="none" stroke="#E0E0E0" strokeWidth="4" />
          <circle cx="180" cy="105" r="18" fill="none" stroke="#4CAF50" strokeWidth="4" strokeDasharray="100" strokeDashoffset="13" transform="rotate(-90 180 105)" />
          <text x="180" y="110" fontFamily="DM Sans, sans-serif" fontSize="12" fill="#1B5E20" fontWeight="700" textAnchor="middle">87%</text>
          {/* Mini stats */}
          <g transform="translate(30, 102)">
            <circle cx="0" cy="0" r="3" fill="#4CAF50" />
            <text x="8" y="3" fontSize="7" fill="#1E293B" fontFamily="Inter, sans-serif">Spray: OK</text>
          </g>
          <g transform="translate(30, 116)">
            <circle cx="0" cy="0" r="3" fill="#4CAF50" />
            <text x="8" y="3" fontSize="7" fill="#1E293B" fontFamily="Inter, sans-serif">Livestock: OK</text>
          </g>
          <g transform="translate(100, 102)">
            <circle cx="0" cy="0" r="3" fill="#F9A825" />
            <text x="8" y="3" fontSize="7" fill="#1E293B" fontFamily="Inter, sans-serif">Audit: Due</text>
          </g>

          {/* Quick actions */}
          <text x="20" y="158" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1E293B" fontWeight="600">Quick Actions</text>
          {/* Action buttons */}
          {[
            { x: 20, label: '+ Spray', color: '#2E7D32' },
            { x: 75, label: '+ Medicine', color: '#1565C0' },
            { x: 140, label: '+ Movement', color: '#E65100' },
          ].map((btn, i) => (
            <g key={i}>
              <rect x={btn.x} y="164" width="52" height="24" rx="12" fill={btn.color} />
              <text x={btn.x + 26} y="179" fontFamily="Inter, sans-serif" fontSize="7" fill="white" fontWeight="600" textAnchor="middle">{btn.label}</text>
            </g>
          ))}

          {/* Fields list */}
          <text x="20" y="210" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1E293B" fontWeight="600">Your Fields</text>
          {[
            { name: 'Top Meadow', crop: 'Winter Wheat', ha: '24.5 ha', color: '#4CAF50' },
            { name: 'Lower Barley', crop: 'Spring Barley', ha: '18.3 ha', color: '#8BC34A' },
            { name: 'Long Acre', crop: 'OSR', ha: '32.1 ha', color: '#FFC107' },
            { name: 'Home Paddock', crop: 'Pasture', ha: '8.7 ha', color: '#66BB6A' },
          ].map((field, i) => (
            <g key={i} transform={`translate(20, ${220 + i * 38})`}>
              <rect x="0" y="0" width="200" height="32" rx="6" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
              <rect x="0" y="0" width="4" height="32" rx="2" fill={field.color} />
              <text x="14" y="13" fontFamily="Inter, sans-serif" fontSize="8" fill="#1E293B" fontWeight="600">{field.name}</text>
              <text x="14" y="24" fontFamily="Inter, sans-serif" fontSize="7" fill="#64748B">{field.crop}</text>
              <text x="185" y="18" fontFamily="Inter, sans-serif" fontSize="7" fill="#64748B" textAnchor="end">{field.ha}</text>
            </g>
          ))}

          {/* Weather bar */}
          <rect x="20" y="376" width="200" height="28" rx="6" fill="#E3F2FD" />
          <text x="30" y="393" fontFamily="Inter, sans-serif" fontSize="8" fill="#1565C0">☀️ 14°C · Wind 12 km/h SW · No rain</text>

          {/* Bottom nav */}
          <rect x="12" y="410" width="216" height="30" fill="#FAFAF5" />
          <line x1="12" y1="410" x2="228" y2="410" stroke="#E0E0E0" strokeWidth="0.5" />
          {['🏠', '🌾', '🐄', '📊', '⚙️'].map((icon, i) => (
            <text key={i} x={36 + i * 44} y="430" fontSize="14" textAnchor="middle">{icon}</text>
          ))}
        </g>

        {/* Home indicator */}
        <rect x="90" y="455" width="60" height="4" rx="2" fill="#64748B" />
      </svg>
    </div>
  );
}
