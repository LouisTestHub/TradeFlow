import Link from 'next/link';

const menuItems = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/fields', icon: '🌾', label: 'Fields & Crops' },
  { href: '/sprays', icon: '📝', label: 'Spray Diary' },
  { href: '/livestock', icon: '🐄', label: 'Livestock' },
  { href: '/medicine', icon: '💊', label: 'Medicine & Vet' },
  { href: '/fertiliser', icon: '🌱', label: 'Fertiliser & Nutrients' },
  { href: '/sfi', icon: '🎯', label: 'SFI Actions' },
  { href: '/red-tractor', icon: '✅', label: 'Red Tractor' },
  { href: '/calendar', icon: '📅', label: 'Compliance Calendar' },
  { href: '/reports', icon: '📊', label: 'Reports' },
  { href: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Menu</h1>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-4 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow min-h-[56px]"
          >
            <span className="text-xl w-8 text-center">{item.icon}</span>
            <span className="text-base font-medium text-slate-700">{item.label}</span>
            <span className="ml-auto text-slate-300">›</span>
          </Link>
        ))}
      </div>
      <div className="pt-4">
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-2xl text-sm font-medium hover:bg-red-50 min-h-[48px]"
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}
