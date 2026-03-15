'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  status: 'overdue' | 'due_soon' | 'upcoming' | 'completed';
  link?: string;
}

interface CalendarData {
  year: number;
  month: number;
  events: CalendarEvent[];
  upcoming: CalendarEvent[];
}

const CATEGORY_COLORS: Record<string, string> = {
  BCMS: 'bg-orange-100 text-orange-700 border-orange-200',
  Medicine: 'bg-purple-100 text-purple-700 border-purple-200',
  SFI: 'bg-teal-100 text-teal-700 border-teal-200',
  'Red Tractor': 'bg-red-100 text-red-700 border-red-200',
  Equipment: 'bg-blue-100 text-blue-700 border-blue-200',
  Insurance: 'bg-amber-100 text-amber-700 border-amber-200',
  NVZ: 'bg-green-100 text-green-700 border-green-200',
  Harvest: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Deadline: 'bg-gray-100 text-gray-700 border-gray-200',
  Alert: 'bg-pink-100 text-pink-700 border-pink-200',
};

const STATUS_EMOJI: Record<string, string> = {
  overdue: '🔴',
  due_soon: '🟡',
  upcoming: '🔵',
  completed: '🟢',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarPage() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [filter, setFilter] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    fetch(`/api/calendar?month=${monthStr}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentYear, currentMonth]);

  function prevMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }

  // Build calendar grid
  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0);
  const daysInMonth = lastDay.getDate();
  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;

  // Get events for each day
  function getEventsForDay(day: number): CalendarEvent[] {
    if (!data) return [];
    return data.events.filter((e) => {
      const d = new Date(e.date);
      return d.getDate() === day && (filter === 'All' || e.category === filter);
    });
  }

  const filteredUpcoming = data?.upcoming?.filter(
    (e) => filter === 'All' || e.category === filter
  ) || [];

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const allCategories = ['All', ...new Set(data?.events?.map((e) => e.category) || [])];

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-100 rounded-2xl h-16 animate-pulse" />
        <div className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
        <div className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          📅 Compliance Calendar
        </h1>
        <p className="text-slate-500 mt-1">All deadlines from all compliance modules</p>
      </div>

      {/* Month Nav + Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center text-lg">
            ←
          </button>
          <h2 className="text-lg font-bold text-slate-800 font-[var(--font-dm-sans)]">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center text-lg">
            →
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap min-h-[36px] transition-colors ${
                filter === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAY_NAMES.map((d) => (
            <div key={d} className="px-1 py-2 text-center text-xs font-semibold text-slate-500">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before start */}
          {Array.from({ length: startDow }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[60px] lg:min-h-[80px] border-b border-r border-gray-50 bg-gray-50/50" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = isCurrentMonth && day === today.getDate();
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`min-h-[60px] lg:min-h-[80px] border-b border-r border-gray-50 p-1 text-left transition-colors ${
                  isToday ? 'bg-primary/5' : isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${
                  isToday ? 'bg-primary text-white' : 'text-slate-700'
                }`}>
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`px-1 py-0.5 rounded text-[9px] lg:text-[10px] font-medium truncate border ${
                          CATEGORY_COLORS[ev.category] || 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {STATUS_EMOJI[ev.status]} {ev.category.slice(0, 4)}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[9px] text-slate-400 px-1">+{dayEvents.length - 2} more</p>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      {selectedDay && selectedDayEvents.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-blue-50 bg-blue-50/50">
            <h3 className="text-sm font-bold text-slate-800">
              {selectedDay} {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {selectedDayEvents.map((ev) => (
              <div key={ev.id} className="px-5 py-3 flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{STATUS_EMOJI[ev.status]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{ev.title}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                    CATEGORY_COLORS[ev.category] || 'bg-gray-100 text-gray-600'
                  }`}>
                    {ev.category}
                  </span>
                </div>
                {ev.link && (
                  <Link
                    href={ev.link}
                    className="text-xs text-primary hover:underline min-h-[36px] flex items-center"
                  >
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colour Key */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <span>🔴 Overdue</span>
          <span>🟡 Due within 7 days</span>
          <span>🔵 Due within 30 days</span>
          <span>🟢 Completed</span>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-base font-bold text-slate-800 font-[var(--font-dm-sans)]">
            ⏰ Upcoming Deadlines
          </h2>
        </div>
        {filteredUpcoming.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400">
            No upcoming deadlines this month 🎉
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredUpcoming.map((ev) => (
              <div key={ev.id} className="px-5 py-3.5 flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{STATUS_EMOJI[ev.status]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{ev.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${
                  CATEGORY_COLORS[ev.category] || 'bg-gray-100 text-gray-600'
                }`}>
                  {ev.category}
                </span>
                {ev.link && (
                  <Link href={ev.link} className="text-xs text-primary hover:underline min-h-[36px] flex items-center flex-shrink-0">
                    →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
