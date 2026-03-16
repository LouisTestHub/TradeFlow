'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Reminder {
  id: string;
  customer: string;
  address: string;
  type: string;
  dueDate: string;
  lastService: string;
  status: 'upcoming' | 'due_today' | 'overdue' | 'sent' | 'booked';
  estimatedValue: number;
  remindersCount: number;
}

function generateReminders(): Reminder[] {
  const types = ['Annual Boiler Service', 'CP12 Gas Safety', 'EICR', 'PAT Testing', 'F-Gas Check', 'Smoke Alarm Check'];
  const customers = ['Sarah Johnson', 'Emma Williams', 'Thames Property Management', 'Claire Davis', 'Premier Property Services', 'Rachel Smith', 'Karen Anderson', 'Michelle Roberts', 'London Lettings Ltd', 'Amanda Wilson'];
  const addresses = ['12 Oak Lane, SE15 3AB', '45 High St, SW1A 1AA', '78 Station Rd, E1 6AN', '23 Park Ave, N1 9AG', '91 Church Rd, WC2N 5DU', '56 Mill Lane, SE1 9SG'];
  const statuses: Reminder['status'][] = ['upcoming', 'upcoming', 'due_today', 'overdue', 'sent', 'booked'];

  return Array.from({ length: 40 }, (_, i) => {
    const daysOffset = i < 5 ? 0 : i < 15 ? Math.floor(Math.random() * 30) + 1 : -(Math.floor(Math.random() * 14) + 1);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysOffset);
    const lastService = new Date(dueDate);
    lastService.setFullYear(lastService.getFullYear() - 1);

    const status = daysOffset === 0 ? 'due_today' : daysOffset < 0 ? 'overdue' : statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: String(i + 1),
      customer: customers[i % customers.length],
      address: addresses[i % addresses.length],
      type: types[i % types.length],
      dueDate: dueDate.toISOString(),
      lastService: lastService.toISOString(),
      status,
      estimatedValue: [95, 85, 250, 75, 120, 45][i % 6],
      remindersCount: status === 'overdue' ? 3 : status === 'due_today' ? 2 : status === 'sent' ? 1 : 0,
    };
  });
}

export default function RemindersPage() {
  const [reminders] = useState(generateReminders);
  const [filter, setFilter] = useState<string>('all');

  const dueToday = reminders.filter(r => r.status === 'due_today');
  const overdue = reminders.filter(r => r.status === 'overdue');
  const upcoming = reminders.filter(r => r.status === 'upcoming' || r.status === 'sent');
  const booked = reminders.filter(r => r.status === 'booked');

  const filtered = filter === 'all' ? reminders :
    filter === 'due_today' ? dueToday :
    filter === 'overdue' ? overdue :
    filter === 'upcoming' ? upcoming :
    booked;

  const revenueForeccast = upcoming.reduce((s, r) => s + r.estimatedValue, 0) + dueToday.reduce((s, r) => s + r.estimatedValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Service Reminders</h1>
          <p className="text-slate-500 mt-1">Automated reminders for recurring services</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {[
          { href: '/settings/reminders/templates', label: 'Templates', icon: '📋', desc: 'Service reminder templates' },
          { href: '/settings/reminders/settings', label: 'Settings', icon: '⚙️', desc: 'SMS/email & scheduling' },
          { href: '/settings/reminders/history', label: 'History', icon: '📊', desc: 'Sent reminders & responses' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[48px] whitespace-nowrap flex-shrink-0"
          >
            <span className="text-lg">{link.icon}</span>
            <div>
              <span className="text-sm font-medium text-slate-700 block">{link.label}</span>
              <span className="text-[11px] text-slate-400">{link.desc}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Upcoming (30 days)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{upcoming.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-600">Due Today</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{dueToday.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-xs text-red-600">Overdue</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{overdue.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-green-600">Booked</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{booked.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-600">Revenue Forecast</p>
          <p className="text-xl font-bold text-blue-700 mt-1">£{revenueForeccast.toLocaleString('en-GB')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'due_today', label: `Due Today (${dueToday.length})` },
          { key: 'overdue', label: `Overdue (${overdue.length})` },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'booked', label: 'Booked' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-2 rounded-xl text-sm font-medium min-h-[40px] whitespace-nowrap ${
              filter === f.key ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.map((reminder) => (
          <div key={reminder.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                reminder.status === 'overdue' ? 'bg-red-100' :
                reminder.status === 'due_today' ? 'bg-amber-100' :
                reminder.status === 'booked' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                {reminder.type.includes('Boiler') ? '🔥' : reminder.type.includes('CP12') ? '🔒' : reminder.type.includes('EICR') ? '⚡' : reminder.type.includes('PAT') ? '🔌' : reminder.type.includes('F-Gas') ? '❄️' : '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-slate-800">{reminder.type}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    reminder.status === 'overdue' ? 'bg-red-100 text-red-700' :
                    reminder.status === 'due_today' ? 'bg-amber-100 text-amber-700' :
                    reminder.status === 'booked' ? 'bg-green-100 text-green-700' :
                    reminder.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {reminder.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{reminder.customer}</p>
                <p className="text-xs text-slate-400">{reminder.address}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Due: {new Date(reminder.dueDate).toLocaleDateString('en-GB')}</span>
                  <span>Last: {new Date(reminder.lastService).toLocaleDateString('en-GB')}</span>
                  <span>Est: £{reminder.estimatedValue}</span>
                  {reminder.remindersCount > 0 && <span>{reminder.remindersCount} reminder{reminder.remindersCount > 1 ? 's' : ''} sent</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 min-h-[36px]">
                  Book Job
                </button>
                <button className="px-3 py-1.5 bg-white text-slate-600 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 min-h-[36px]">
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
