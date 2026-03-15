'use client';

import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am-6pm

const JOB_TYPES: Record<string, { color: string; bg: string }> = {
  plumbing: { color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300' },
  electrical: { color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300' },
  hvac: { color: 'text-green-700', bg: 'bg-green-100 border-green-300' },
  gas: { color: 'text-red-700', bg: 'bg-red-100 border-red-300' },
};

const ENGINEERS = [
  { id: '1', name: 'Dave Smith', color: 'bg-blue-50' },
  { id: '2', name: 'Sarah Jones', color: 'bg-green-50' },
  { id: '3', name: 'Mike Brown', color: 'bg-purple-50' },
  { id: '4', name: 'Lisa Wilson', color: 'bg-orange-50' },
];

const DEMO_JOBS = [
  { id: 'j1', title: 'Boiler Service - 45 Oak Rd', type: 'plumbing', engineer: '1', day: 0, hour: 9, duration: 2 },
  { id: 'j2', title: 'Rewire - 12 Elm St', type: 'electrical', engineer: '2', day: 0, hour: 8, duration: 4 },
  { id: 'j3', title: 'Gas Safety Check - 78 Maple Ave', type: 'gas', engineer: '1', day: 1, hour: 14, duration: 1 },
  { id: 'j4', title: 'AC Install - Unit 5B', type: 'hvac', engineer: '3', day: 2, hour: 9, duration: 3 },
  { id: 'j5', title: 'Emergency Leak - 91 Pine Ln', type: 'plumbing', engineer: '4', day: 0, hour: 13, duration: 2 },
];

const UNASSIGNED_JOBS = [
  { id: 'u1', title: 'Bathroom Fit - 33 High St', type: 'plumbing', customer: 'Mr Thompson' },
  { id: 'u2', title: 'PAT Testing - Office Block C', type: 'electrical', customer: 'ABC Ltd' },
  { id: 'u3', title: 'Radiator Install - 8 Church Rd', type: 'hvac', customer: 'Mrs Davies' },
];

export default function SchedulingPage() {
  const [view, setView] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <div className="p-6 max-w-[1800px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Scheduling</h1>
          <p className="text-sm text-slate-500 mt-1">Drag and drop to assign jobs to engineers</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 border rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                view === 'week' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                view === 'day' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              Day View
            </button>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
            + New Job
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex gap-4 text-xs">
        <span className="text-slate-600 font-semibold">Job Types:</span>
        {Object.entries(JOB_TYPES).map(([type, style]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded border-2 ${style.bg}`} />
            <span className="capitalize text-slate-600">{type}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded-lg border overflow-auto">
          <div className="grid grid-cols-[120px_repeat(5,1fr)] min-w-[1200px]">
            {/* Header */}
            <div className="sticky top-0 bg-gray-50 border-b p-3 font-semibold text-sm text-slate-700">
              Engineer
            </div>
            {DAYS.map((day) => (
              <div key={day} className="sticky top-0 bg-gray-50 border-b border-l p-3 text-center">
                <div className="font-semibold text-sm text-slate-700">{day}</div>
                <div className="text-xs text-slate-500">Mar {17 + DAYS.indexOf(day)}</div>
              </div>
            ))}

            {/* Engineer Rows */}
            {ENGINEERS.map((engineer) => (
              <>
                <div className={`p-3 border-b ${engineer.color} font-medium text-sm text-slate-700 flex items-center`}>
                  {engineer.name}
                </div>
                {DAYS.map((_, dayIdx) => (
                  <div key={dayIdx} className="border-l border-b p-2 min-h-[120px] relative">
                    {DEMO_JOBS.filter((j) => j.engineer === engineer.id && j.day === dayIdx).map((job) => {
                      const style = JOB_TYPES[job.type as keyof typeof JOB_TYPES];
                      return (
                        <div
                          key={job.id}
                          className={`p-2 rounded border-2 ${style.bg} ${style.color} mb-2 cursor-move text-xs`}
                        >
                          <div className="font-semibold">{job.hour}:00 ({job.duration}h)</div>
                          <div className="mt-1 line-clamp-2">{job.title}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>

        {/* Unassigned Jobs Sidebar */}
        <div className="w-80 bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            📋 Unassigned Jobs
            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
              {UNASSIGNED_JOBS.length}
            </span>
          </h3>
          <div className="space-y-2">
            {UNASSIGNED_JOBS.map((job) => {
              const style = JOB_TYPES[job.type as keyof typeof JOB_TYPES];
              return (
                <div
                  key={job.id}
                  className={`p-3 rounded border-2 ${style.bg} ${style.color} cursor-move hover:shadow-lg transition-shadow`}
                >
                  <div className="font-semibold text-sm">{job.title}</div>
                  <div className="text-xs mt-1 opacity-80">{job.customer}</div>
                  <div className="text-xs mt-1 capitalize opacity-60">{job.type}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase">This Week</h4>
            <div className="text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Scheduled:</span>
                <span className="font-semibold">{DEMO_JOBS.length} jobs</span>
              </div>
              <div className="flex justify-between">
                <span>Unassigned:</span>
                <span className="font-semibold text-red-600">{UNASSIGNED_JOBS.length} jobs</span>
              </div>
              <div className="flex justify-between">
                <span>Engineers:</span>
                <span className="font-semibold">{ENGINEERS.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
