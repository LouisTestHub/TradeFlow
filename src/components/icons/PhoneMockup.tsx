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
        <rect x="12" y="40" width="216" height="400" rx="4" fill="#F8FAFC" />

        {/* Notch */}
        <rect x="80" y="12" width="80" height="22" rx="11" fill="#0F172A" />
        <circle cx="120" cy="23" r="4" fill="#1E293B" />

        {/* Status bar */}
        <g clipPath="url(#screenClip)">
          <rect x="12" y="40" width="216" height="28" fill="#1E3A5F" />
          <text x="24" y="58" fontFamily="Inter, sans-serif" fontSize="9" fill="white" fontWeight="600">TradeFlow</text>
          <text x="180" y="58" fontFamily="Inter, sans-serif" fontSize="8" fill="white" opacity="0.8">9:41</text>

          {/* Today's Jobs Card */}
          <rect x="20" y="78" width="200" height="60" rx="8" fill="#EFF6FF" />
          <text x="30" y="95" fontFamily="DM Sans, sans-serif" fontSize="10" fill="#1E3A5F" fontWeight="700">Today&apos;s Jobs</text>
          {/* Job count circle */}
          <circle cx="180" cy="105" r="18" fill="none" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="180" cy="105" r="18" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="100" strokeDashoffset="25" transform="rotate(-90 180 105)" />
          <text x="180" y="110" fontFamily="DM Sans, sans-serif" fontSize="12" fill="#1E3A5F" fontWeight="700" textAnchor="middle">6/8</text>
          {/* Mini stats */}
          <g transform="translate(30, 102)">
            <circle cx="0" cy="0" r="3" fill="#22C55E" />
            <text x="8" y="3" fontSize="7" fill="#0F172A" fontFamily="Inter, sans-serif">4 Complete</text>
          </g>
          <g transform="translate(30, 116)">
            <circle cx="0" cy="0" r="3" fill="#2563EB" />
            <text x="8" y="3" fontSize="7" fill="#0F172A" fontFamily="Inter, sans-serif">2 In Progress</text>
          </g>
          <g transform="translate(110, 102)">
            <circle cx="0" cy="0" r="3" fill="#F97316" />
            <text x="8" y="3" fontSize="7" fill="#0F172A" fontFamily="Inter, sans-serif">2 Pending</text>
          </g>

          {/* Quick actions */}
          <text x="20" y="158" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#0F172A" fontWeight="600">Quick Actions</text>
          {[
            { x: 20, label: '+ Job', color: '#1E3A5F' },
            { x: 75, label: '+ Quote', color: '#2563EB' },
            { x: 140, label: '+ Certificate', color: '#F97316' },
          ].map((btn, i) => (
            <g key={i}>
              <rect x={btn.x} y="164" width="56" height="24" rx="12" fill={btn.color} />
              <text x={btn.x + 28} y="179" fontFamily="Inter, sans-serif" fontSize="7" fill="white" fontWeight="600" textAnchor="middle">{btn.label}</text>
            </g>
          ))}

          {/* Upcoming appointments */}
          <text x="20" y="210" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#0F172A" fontWeight="600">Next Appointments</text>
          {[
            { name: 'Boiler Service', customer: 'Mrs. Johnson, SE15', time: '10:30', color: '#F97316' },
            { name: 'EICR Certificate', customer: 'Mr. Patel, E14', time: '13:00', color: '#2563EB' },
            { name: 'Gas Safety Check', customer: 'Oak Estates, SW1', time: '15:30', color: '#1E3A5F' },
            { name: 'Emergency Callout', customer: 'Mrs. Chen, N1', time: '17:00', color: '#EF4444' },
          ].map((job, i) => (
            <g key={i} transform={`translate(20, ${220 + i * 38})`}>
              <rect x="0" y="0" width="200" height="32" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="0" y="0" width="4" height="32" rx="2" fill={job.color} />
              <text x="14" y="13" fontFamily="Inter, sans-serif" fontSize="8" fill="#0F172A" fontWeight="600">{job.name}</text>
              <text x="14" y="24" fontFamily="Inter, sans-serif" fontSize="7" fill="#64748B">{job.customer}</text>
              <text x="185" y="18" fontFamily="Inter, sans-serif" fontSize="7" fill="#64748B" textAnchor="end">{job.time}</text>
            </g>
          ))}

          {/* Van stock alert */}
          <rect x="20" y="376" width="200" height="28" rx="6" fill="#FFF7ED" />
          <text x="30" y="393" fontFamily="Inter, sans-serif" fontSize="8" fill="#F97316">🔧 Van Stock: 3 items low · CIS: £2,340 due</text>

          {/* Bottom nav */}
          <rect x="12" y="410" width="216" height="30" fill="#F8FAFC" />
          <line x1="12" y1="410" x2="228" y2="410" stroke="#E2E8F0" strokeWidth="0.5" />
          {['🏠', '📋', '🗓️', '📊', '⚙️'].map((icon, i) => (
            <text key={i} x={36 + i * 44} y="430" fontSize="14" textAnchor="middle">{icon}</text>
          ))}
        </g>

        {/* Home indicator */}
        <rect x="90" y="455" width="60" height="4" rx="2" fill="#64748B" />
      </svg>
    </div>
  );
}
