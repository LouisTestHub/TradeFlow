'use client';

import Link from 'next/link';

const DEMO_CUSTOMER = {
  name: 'John Thompson',
  email: 'john@example.com',
  accountNumber: 'CUST-0045',
};

const UPCOMING_JOBS = [
  { id: '1', date: '2026-03-18', time: '10:00', title: 'Annual Boiler Service', engineer: 'Dave Smith' },
  { id: '2', date: '2026-03-25', time: '14:00', title: 'Gas Safety Check', engineer: 'Sarah Jones' },
];

const RECENT_JOBS = [
  {
    id: '3',
    date: '2026-03-10',
    title: 'Emergency Leak Repair',
    engineer: 'Mike Brown',
    status: 'completed',
    rating: 0,
  },
  {
    id: '4',
    date: '2026-02-15',
    title: 'Bathroom Installation',
    engineer: 'Dave Smith',
    status: 'completed',
    rating: 5,
  },
];

const DOCUMENTS = [
  { id: '1', type: 'certificate', name: 'Gas Safety Certificate CP12', date: '2026-03-10', jobId: '3' },
  { id: '2', type: 'invoice', name: 'Invoice #INV-2026-045', date: '2026-03-10', jobId: '3' },
  { id: '3', type: 'certificate', name: 'Gas Safety Certificate CP12', date: '2025-03-15', jobId: 'prev' },
];

export default function CustomerPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-xl text-primary">TradeFlow</span>
            <span className="text-sm text-slate-500 ml-2">Customer Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-700">{DEMO_CUSTOMER.name}</div>
              <div className="text-xs text-slate-500">{DEMO_CUSTOMER.accountNumber}</div>
            </div>
            <button className="px-4 py-2 text-sm text-slate-600 hover:text-red-600">Sign Out</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Welcome back, {DEMO_CUSTOMER.name}!</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Link
            href="/portal/callback"
            className="bg-white p-6 rounded-lg border-2 border-transparent hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-semibold text-slate-800 mb-2">Request a Callback</h3>
            <p className="text-sm text-slate-600">Need help? We&apos;ll call you back</p>
          </Link>

          <Link
            href="/portal/jobs"
            className="bg-white p-6 rounded-lg border-2 border-transparent hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-semibold text-slate-800 mb-2">View Job History</h3>
            <p className="text-sm text-slate-600">See all your past and upcoming jobs</p>
          </Link>

          <Link
            href="/portal/documents"
            className="bg-white p-6 rounded-lg border-2 border-transparent hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">📄</div>
            <h3 className="font-semibold text-slate-800 mb-2">Download Documents</h3>
            <p className="text-sm text-slate-600">Certificates, invoices, and receipts</p>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Upcoming Appointments</h2>
          {UPCOMING_JOBS.length === 0 ? (
            <p className="text-slate-500 text-sm">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {UPCOMING_JOBS.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">{job.title}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {new Date(job.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}{' '}
                      at {job.time}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Engineer: {job.engineer}</div>
                  </div>
                  <button className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Jobs (Pending Rating) */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {RECENT_JOBS.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{job.title}</div>
                  <div className="text-sm text-slate-600 mt-1">
                    {new Date(job.date).toLocaleDateString('en-GB')} • {job.engineer}
                  </div>
                </div>
                {job.rating === 0 ? (
                  <Link
                    href={`/portal/rate/${job.id}`}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
                  >
                    Rate Job ⭐
                  </Link>
                ) : (
                  <div className="flex gap-1">
                    {Array.from({ length: job.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Documents</h2>
          <div className="space-y-2">
            {DOCUMENTS.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{doc.type === 'certificate' ? '📜' : '💰'}</div>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{doc.name}</div>
                    <div className="text-xs text-slate-500">{new Date(doc.date).toLocaleDateString('en-GB')}</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium">
                  Download PDF
                </button>
              </div>
            ))}
          </div>
          <Link
            href="/portal/documents"
            className="block mt-4 text-center text-sm text-primary hover:underline"
          >
            View All Documents →
          </Link>
        </div>
      </main>
    </div>
  );
}
