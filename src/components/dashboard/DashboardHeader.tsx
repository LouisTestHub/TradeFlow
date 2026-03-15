'use client';

interface DashboardHeaderProps {
  syncStatus: 'online' | 'syncing' | 'offline';
}

export default function DashboardHeader({ syncStatus }: DashboardHeaderProps) {
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Synced' },
    syncing: { color: 'bg-yellow-500 animate-pulse', label: 'Syncing' },
    offline: { color: 'bg-red-500', label: 'Offline' },
  };

  const status = statusConfig[syncStatus];

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-[var(--font-dm-sans)] font-bold text-primary">TradeFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
            <span className={`w-2 h-2 rounded-full ${status.color}`} />
            <span className="text-[11px] font-medium text-slate-500">{status.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
