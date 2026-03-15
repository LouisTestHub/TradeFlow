'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CalendarEvent {
  date: string;
  type: 'treatment' | 'meat_clear' | 'milk_clear';
  animalTag: string;
  animalId: string;
  productName: string;
  recordId: string;
}

interface ActiveWithdrawal {
  animalTag: string;
  animalId: string;
  productName: string;
  treatmentDate: string;
  meatClearDate: string | null;
  milkClearDate: string | null;
  meatProgress: number;
  milkProgress: number;
  meatActive: boolean;
  milkActive: boolean;
  recordId: string;
}

interface MovementWarning {
  animalTag: string;
  movementDate: string;
  destination: string;
  withdrawalClearDate: string | null;
  productName: string | null;
}

export default function WithdrawalCalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeWithdrawals, setActiveWithdrawals] = useState<ActiveWithdrawal[]>([]);
  const [movementWarnings, setMovementWarnings] = useState<MovementWarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/medicine/calendar?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        setActiveWithdrawals(data.activeWithdrawals || []);
        setMovementWarnings(data.movementWarnings || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const monthName = new Date(year, month - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // Build calendar grid
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = Array(startDow).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const isToday = (day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` === todayStr;
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/medicine" className="text-sm text-slate-500 hover:text-primary mb-1 inline-block">← Medicine Records</Link>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Withdrawal Calendar</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-lg">←</button>
          <span className="font-semibold text-slate-700 min-w-[140px] text-center">{monthName}</span>
          <button onClick={nextMonth} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-lg">→</button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-slate-400 uppercase">{d}</div>
              ))}
            </div>
            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 border-b border-gray-50 last:border-b-0">
                {week.map((day, di) => {
                  if (!day) return <div key={di} className="min-h-[80px] sm:min-h-[100px] bg-gray-50/50" />;
                  const dayEvents = getEventsForDay(day);
                  const isTodayDay = isToday(day);

                  return (
                    <div key={di} className={`min-h-[80px] sm:min-h-[100px] p-1.5 border-r border-gray-50 last:border-r-0 ${isTodayDay ? 'bg-primary/5' : ''}`}>
                      <div className={`text-xs font-medium mb-1 ${isTodayDay ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-500'}`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map((e, ei) => (
                          <Link key={ei} href={`/medicine/${e.recordId}`}
                            className={`block text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate ${
                              e.type === 'treatment' ? 'bg-purple-100 text-purple-700' :
                              e.type === 'meat_clear' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {e.type === 'treatment' ? '💊' : '🟢'} {e.animalTag.slice(-4)}
                            <span className="hidden sm:inline"> {e.type === 'treatment' ? e.productName.split(' ')[0] : e.type === 'meat_clear' ? 'MEAT' : 'MILK'}</span>
                          </Link>
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{dayEvents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-200 rounded" /> 💊 Treatment given</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-200 rounded" /> 🟢 Meat withdrawal clear</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-200 rounded" /> 🟢 Milk withdrawal clear</span>
          </div>

          {/* Movement Warnings */}
          {movementWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h2 className="font-bold text-amber-800 flex items-center gap-2 mb-3">⚠️ Movement Conflicts</h2>
              {movementWarnings.map((w, i) => (
                <div key={i} className="text-sm text-amber-700 bg-amber-100/50 rounded-xl px-4 py-3 mb-2">
                  <p><strong>{w.animalTag}</strong> has a pending movement to {w.destination} on {formatDate(w.movementDate)}</p>
                  <p>This animal is STILL under withdrawal ({w.productName}) until {formatDate(w.withdrawalClearDate)}.</p>
                  <p className="font-bold">Movement to slaughter BLOCKED.</p>
                </div>
              ))}
            </div>
          )}

          {/* Currently Under Withdrawal */}
          {activeWithdrawals.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-slate-700 mb-4">Currently Under Withdrawal</h2>
              <div className="space-y-4">
                {activeWithdrawals.map((w, i) => (
                  <Link key={i} href={`/medicine/${w.recordId}`} className="block bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-mono font-medium">{w.animalTag}</span>
                        <span className="text-sm text-slate-500 ml-2">— {w.productName}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      Treated: {formatDate(w.treatmentDate)}
                      {w.meatActive && <span> • 🥩 Meat clear: {formatDate(w.meatClearDate)}</span>}
                      {w.milkActive && <span> • 🥛 Milk clear: {formatDate(w.milkClearDate)}</span>}
                    </div>
                    {w.meatActive && (
                      <div className="mb-1">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>🥩 Meat</span>
                          <span>{w.meatProgress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${w.meatProgress}%` }} />
                        </div>
                      </div>
                    )}
                    {w.milkActive && (
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>🥛 Milk</span>
                          <span>{w.milkProgress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${w.milkProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
