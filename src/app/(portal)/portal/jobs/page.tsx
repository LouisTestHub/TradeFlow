'use client';

const JOBS = [
  {
    id: '1',
    date: '2026-03-18',
    time: '10:00',
    title: 'Annual Boiler Service',
    engineer: 'Dave Smith',
    status: 'scheduled',
    address: '45 Oak Road, London',
  },
  {
    id: '2',
    date: '2026-03-25',
    time: '14:00',
    title: 'Gas Safety Check',
    engineer: 'Sarah Jones',
    status: 'scheduled',
    address: '45 Oak Road, London',
  },
  {
    id: '3',
    date: '2026-03-10',
    title: 'Emergency Leak Repair',
    engineer: 'Mike Brown',
    status: 'completed',
    address: '45 Oak Road, London',
  },
  {
    id: '4',
    date: '2026-02-15',
    title: 'Bathroom Installation',
    engineer: 'Dave Smith',
    status: 'completed',
    address: '45 Oak Road, London',
  },
  {
    id: '5',
    date: '2025-12-10',
    title: 'Radiator Installation',
    engineer: 'Sarah Jones',
    status: 'completed',
    address: '45 Oak Road, London',
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
};

export default function JobHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/portal" className="text-2xl">
              ← 🔧
            </a>
            <span className="font-bold text-xl text-primary">TradeFlow</span>
            <span className="text-sm text-slate-500 ml-2">Job History</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Job History</h1>

        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Job</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Engineer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {JOBS.map((job) => {
                const style = STATUS_STYLES[job.status];
                return (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {new Date(job.date).toLocaleDateString('en-GB')}
                      {job.time && <div className="text-xs text-slate-500">{job.time}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-sm">{job.title}</div>
                      <div className="text-xs text-slate-500">{job.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{job.engineer}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-primary hover:underline">View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
