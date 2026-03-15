'use client';

const BRANCHES = [
  {
    id: '1',
    name: 'London HQ',
    address: '123 High Street, London',
    postcode: 'SW1A 1AA',
    phone: '020 7123 4567',
    email: 'london@tradeflow.com',
    engineers: 12,
    activeJobs: 28,
    isActive: true,
    manager: 'Sarah Jones',
  },
  {
    id: '2',
    name: 'Manchester Branch',
    address: '45 Market Street, Manchester',
    postcode: 'M1 1AA',
    phone: '0161 123 4567',
    email: 'manchester@tradeflow.com',
    engineers: 8,
    activeJobs: 15,
    isActive: true,
    manager: 'Mike Brown',
  },
  {
    id: '3',
    name: 'Birmingham Branch',
    address: '78 Bull Ring, Birmingham',
    postcode: 'B5 4AA',
    phone: '0121 123 4567',
    email: 'birmingham@tradeflow.com',
    engineers: 6,
    activeJobs: 11,
    isActive: true,
    manager: 'Dave Smith',
  },
  {
    id: '4',
    name: 'Leeds Office',
    address: '12 City Square, Leeds',
    postcode: 'LS1 1AA',
    phone: '0113 123 4567',
    email: 'leeds@tradeflow.com',
    engineers: 4,
    activeJobs: 7,
    isActive: false,
    manager: 'Lisa Wilson',
  },
];

const BRANCH_STATS = [
  { branch: 'London HQ', revenue: 45000, jobs: 42, engineers: 12 },
  { branch: 'Manchester', revenue: 28000, jobs: 28, engineers: 8 },
  { branch: 'Birmingham', revenue: 22000, jobs: 24, engineers: 6 },
];

export default function BranchesPage() {
  const totalEngineers = BRANCHES.reduce((acc, b) => acc + b.engineers, 0);
  const totalJobs = BRANCHES.reduce((acc, b) => acc + b.activeJobs, 0);
  const activeBranches = BRANCHES.filter((b) => b.isActive).length;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Multi-Branch Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage locations, assign engineers, and track performance</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
          + Add Branch
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Total Branches</div>
          <div className="text-3xl font-bold text-slate-800">{BRANCHES.length}</div>
          <div className="text-xs text-green-600 mt-1">{activeBranches} active</div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Total Engineers</div>
          <div className="text-3xl font-bold text-slate-800">{totalEngineers}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Active Jobs</div>
          <div className="text-3xl font-bold text-primary">{totalJobs}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Combined Revenue (MTD)</div>
          <div className="text-3xl font-bold text-green-600">£95k</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branches List */}
        <div className="lg:col-span-2 space-y-4">
          {BRANCHES.map((branch) => (
            <div key={branch.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                    🏪
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-800">{branch.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          branch.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{branch.address}</div>
                    <div className="text-sm text-slate-500">{branch.postcode}</div>
                  </div>
                </div>
                <button className="text-sm text-primary hover:underline">Edit</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Phone</div>
                  <div className="text-sm text-slate-700 font-medium">{branch.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Email</div>
                  <div className="text-sm text-slate-700 font-medium">{branch.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Manager</div>
                  <div className="text-sm text-slate-700 font-medium">{branch.manager}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Status</div>
                  <div className="text-sm text-slate-700 font-medium">
                    {branch.isActive ? 'Operational' : 'Closed'}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Engineers:</span>
                  <span className="font-semibold text-slate-800">{branch.engineers}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Active Jobs:</span>
                  <span className="font-semibold text-primary">{branch.activeJobs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Branch Performance */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Performance (MTD)</h2>
            <div className="space-y-4">
              {BRANCH_STATS.map((stat, idx) => (
                <div key={stat.branch}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{stat.branch}</div>
                      <div className="text-xs text-slate-500">
                        {stat.jobs} jobs • {stat.engineers} engineers
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">£{(stat.revenue / 1000).toFixed(0)}k</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(stat.revenue / 50000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm font-medium text-left">
                📊 Branch Reports
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm font-medium text-left">
                👷 Assign Engineers
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm font-medium text-left">
                📋 Transfer Jobs
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm font-medium text-left">
                ⚙️ Branch Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
