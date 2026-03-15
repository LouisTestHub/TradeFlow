'use client';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Calendar</h1>
        <p className="text-slate-500 mt-1">Job schedule and calendar view</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <span className="text-6xl">📅</span>
        <h3 className="text-lg font-bold text-slate-800 mt-4">Calendar View</h3>
        <p className="text-slate-500 mt-2">Interactive calendar for job scheduling coming soon</p>
      </div>
    </div>
  );
}
