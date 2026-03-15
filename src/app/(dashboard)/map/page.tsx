'use client';

import { useState } from 'react';

const DEMO_JOBS = [
  {
    id: '1',
    title: 'Boiler Service',
    address: '45 Oak Road, London',
    lat: 51.515,
    lng: -0.09,
    status: 'in_progress',
    engineer: 'Dave Smith',
    type: 'plumbing',
    scheduled: '10:00',
  },
  {
    id: '2',
    title: 'Emergency Leak',
    address: '78 High Street, London',
    lat: 51.52,
    lng: -0.12,
    status: 'scheduled',
    engineer: 'Sarah Jones',
    type: 'plumbing',
    scheduled: '14:00',
  },
  {
    id: '3',
    title: 'Rewire - Kitchen',
    address: '12 Elm Avenue, London',
    lat: 51.51,
    lng: -0.08,
    status: 'completed',
    engineer: 'Mike Brown',
    type: 'electrical',
    scheduled: '09:00',
  },
  {
    id: '4',
    title: 'AC Installation',
    address: 'Unit 5B Park Plaza, London',
    lat: 51.525,
    lng: -0.15,
    status: 'en_route',
    engineer: 'Lisa Wilson',
    type: 'hvac',
    scheduled: '11:30',
  },
  {
    id: '5',
    title: 'Gas Safety Check',
    address: '91 Church Lane, London',
    lat: 51.505,
    lng: -0.1,
    status: 'scheduled',
    engineer: 'Dave Smith',
    type: 'gas',
    scheduled: '15:00',
  },
];

const ENGINEERS_LOCATIONS = [
  { id: '1', name: 'Dave Smith', lat: 51.516, lng: -0.091, status: 'on_job' },
  { id: '2', name: 'Sarah Jones', lat: 51.51, lng: -0.14, status: 'driving' },
  { id: '3', name: 'Mike Brown', lat: 51.509, lng: -0.079, status: 'break' },
  { id: '4', name: 'Lisa Wilson', lat: 51.522, lng: -0.145, status: 'driving' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },
  en_route: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Route' },
  in_progress: { bg: 'bg-green-100', text: 'text-green-700', label: 'In Progress' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completed' },
};

export default function MapPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showEngineers, setShowEngineers] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredJobs =
    filterStatus === 'all' ? DEMO_JOBS : DEMO_JOBS.filter((j) => j.status === filterStatus);

  return (
    <div className="p-6 max-w-[1800px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Job Map</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time view of all active jobs and engineer locations</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Jobs</option>
            <option value="scheduled">Scheduled</option>
            <option value="en_route">En Route</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setShowEngineers(!showEngineers)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              showEngineers ? 'bg-primary text-white' : 'bg-gray-100 text-slate-600'
            }`}
          >
            {showEngineers ? '✓' : ''} Show Engineers
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Map Placeholder */}
        <div className="flex-1 bg-white rounded-lg border p-8 relative" style={{ minHeight: '600px' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Map View</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Interactive map showing all job locations and engineer positions.
                <br />
                <span className="text-xs italic">
                  (In production: integrate Google Maps, Mapbox, or Leaflet with live GPS tracking)
                </span>
              </p>
            </div>
          </div>

          {/* Map Pins Overlay (demo) */}
          <div className="absolute inset-0 pointer-events-none">
            {filteredJobs.map((job, idx) => (
              <div
                key={job.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${20 + idx * 15}%`,
                  top: `${30 + (idx % 3) * 20}%`,
                }}
              >
                <button
                  onClick={() => setSelectedJob(job.id)}
                  className={`transform hover:scale-110 transition-transform ${
                    selectedJob === job.id ? 'scale-125' : ''
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg ${
                        STATUS_STYLES[job.status].bg
                      }`}
                    >
                      📍
                    </div>
                    {selectedJob === job.id && (
                      <div className="absolute left-10 top-0 bg-white p-3 rounded-lg shadow-xl z-10 w-64 border-2 border-primary">
                        <div className="font-semibold text-sm text-slate-800">{job.title}</div>
                        <div className="text-xs text-slate-600 mt-1">{job.address}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {job.engineer} • {job.scheduled}
                        </div>
                        <div
                          className={`mt-2 px-2 py-1 rounded text-xs font-medium inline-block ${STATUS_STYLES[job.status].bg} ${STATUS_STYLES[job.status].text}`}
                        >
                          {STATUS_STYLES[job.status].label}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}

            {showEngineers &&
              ENGINEERS_LOCATIONS.map((eng, idx) => (
                <div
                  key={eng.id}
                  className="absolute"
                  style={{
                    left: `${25 + idx * 18}%`,
                    top: `${25 + (idx % 2) * 30}%`,
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xl shadow-lg border-2 border-white">
                      👷
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {eng.name}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Job List Sidebar */}
        <div className="w-96 bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-slate-800 mb-3">
            Today&apos;s Jobs
            <span className="ml-2 text-sm text-slate-500">({filteredJobs.length})</span>
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredJobs.map((job) => {
              const style = STATUS_STYLES[job.status];
              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 hover:shadow-md transition-all ${
                    selectedJob === job.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-800">{job.title}</div>
                      <div className="text-xs text-slate-600 mt-1">{job.address}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {job.engineer} • {job.scheduled}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${style.bg} ${style.text}`}>
                      {style.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase">Live Status</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(STATUS_STYLES).map(([key, style]) => {
                const count = DEMO_JOBS.filter((j) => j.status === key).length;
                return (
                  <div key={key} className={`p-2 rounded ${style.bg}`}>
                    <div className={`text-xs ${style.text} opacity-70`}>{style.label}</div>
                    <div className={`text-lg font-bold ${style.text}`}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
