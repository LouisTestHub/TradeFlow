'use client';

const TODAY_JOBS = [
  {
    id: '1',
    time: '09:00',
    title: 'Boiler Service',
    customer: 'Mr Thompson',
    address: '45 Oak Road, London SW1 2AB',
    postcode: 'SW1 2AB',
    phone: '07700 900123',
    status: 'scheduled',
    notes: 'Annual service - customer reports strange noises',
  },
  {
    id: '2',
    time: '11:30',
    title: 'Emergency Leak',
    customer: 'Mrs Davies',
    address: '78 High Street, London SW2 4CD',
    postcode: 'SW2 4CD',
    phone: '07700 900456',
    status: 'en_route',
    notes: 'Kitchen sink leak - urgent',
  },
  {
    id: '3',
    time: '14:00',
    title: 'Gas Safety Check',
    customer: 'ABC Lettings',
    address: 'Unit 5B Park Plaza, London SW3 5EF',
    postcode: 'SW3 5EF',
    phone: '07700 900789',
    status: 'scheduled',
    notes: 'Annual CP12 - tenant present',
  },
];

export default function MobilePage() {
  return (
    <div className="p-4 max-w-md mx-auto bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Mobile Header */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Today&apos;s Jobs</h1>
            <p className="text-xs text-slate-500">Tuesday, 18 March 2026</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-2xl">
            👷
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="text-xs text-blue-700 font-medium">Scheduled</div>
            <div className="text-xl font-bold text-blue-800">2</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2">
            <div className="text-xs text-yellow-700 font-medium">En Route</div>
            <div className="text-xl font-bold text-yellow-800">1</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-xs text-green-700 font-medium">Done</div>
            <div className="text-xl font-bold text-green-800">0</div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {TODAY_JOBS.map((job) => (
          <div key={job.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Job Header */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">{job.time}</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">{job.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{job.customer}</div>
                </div>
                <div className="text-2xl">📍</div>
              </div>
            </div>

            {/* Job Details */}
            <div className="p-4 space-y-3">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Address</div>
                <div className="text-sm text-slate-700">{job.address}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                  📞 Call
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium">
                  🗺️ Navigate
                </button>
              </div>

              {job.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-yellow-800 mb-1">NOTES</div>
                  <div className="text-sm text-yellow-900">{job.notes}</div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-3 border-t space-y-2">
                <button className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
                  ▶ Start Job
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm">
                    📷 Photos
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm">
                    📦 Parts
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-1 py-2 text-primary">
            <span className="text-2xl">📋</span>
            <span className="text-xs font-medium">Jobs</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-slate-400 hover:text-slate-600">
            <span className="text-2xl">⏱️</span>
            <span className="text-xs font-medium">Time</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-slate-400 hover:text-slate-600">
            <span className="text-2xl">👤</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Padding for fixed bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}
