'use client';

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 28000, cost: 12000 },
  { month: 'Feb', revenue: 32000, cost: 14000 },
  { month: 'Mar', revenue: 45000, cost: 18000 },
];

const OUTSTANDING_INVOICES = [
  { id: 'INV-2026-045', customer: 'Mr Thompson', amount: 450, dueDate: '2026-03-25', days: 5 },
  { id: 'INV-2026-038', customer: 'ABC Lettings', amount: 1250, dueDate: '2026-03-20', days: 0 },
  { id: 'INV-2026-031', customer: 'Mrs Davies', amount: 320, dueDate: '2026-03-15', days: -3 },
];

const ENGINEER_REVENUE = [
  { name: 'Dave Smith', revenue: 18500, jobs: 42, avgJob: 440 },
  { name: 'Sarah Jones', revenue: 16200, jobs: 38, avgJob: 426 },
  { name: 'Mike Brown', revenue: 14800, jobs: 35, avgJob: 422 },
  { name: 'Lisa Wilson', revenue: 12300, jobs: 28, avgJob: 439 },
];

const JOB_PROFITABILITY = [
  { id: 'JOB-456', title: 'Boiler Install - Oak Rd', revenue: 2400, cost: 1100, margin: 54 },
  { id: 'JOB-453', title: 'Rewire - High St', revenue: 4500, cost: 2200, margin: 51 },
  { id: 'JOB-449', title: 'Bathroom Fit - Elm Ave', revenue: 3200, cost: 1800, margin: 43 },
];

export default function RevenuePage() {
  const thisMonth = MONTHLY_DATA[2];
  const totalRevenue = thisMonth.revenue;
  const totalCost = thisMonth.cost;
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const totalOutstanding = OUTSTANDING_INVOICES.reduce((acc, inv) => acc + inv.amount, 0);
  const overdueCount = OUTSTANDING_INVOICES.filter((inv) => inv.days < 0).length;

  const cisDeductions = 1240; // Demo value

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Revenue Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Financial overview and performance tracking</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">This Month Revenue</div>
          <div className="text-3xl font-bold text-green-600">£{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">↗ +15% vs last month</div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Net Profit</div>
          <div className="text-3xl font-bold text-slate-800">£{totalProfit.toLocaleString()}</div>
          <div className="text-xs text-slate-600 mt-1">{profitMargin}% margin</div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Outstanding Invoices</div>
          <div className="text-3xl font-bold text-orange-600">£{totalOutstanding.toLocaleString()}</div>
          <div className="text-xs text-red-600 mt-1">{overdueCount} overdue</div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">CIS Deductions (YTD)</div>
          <div className="text-3xl font-bold text-slate-800">£{cisDeductions.toLocaleString()}</div>
          <div className="text-xs text-slate-600 mt-1">Subcontractor tax</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Monthly Revenue vs Cost</h2>
          <div className="space-y-4">
            {MONTHLY_DATA.map((data) => {
              const maxValue = 50000;
              const revenueWidth = (data.revenue / maxValue) * 100;
              const costWidth = (data.cost / maxValue) * 100;
              return (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 w-12">{data.month}</span>
                    <div className="flex-1 ml-4">
                      <div className="relative h-10">
                        <div
                          className="absolute left-0 h-5 bg-green-200 rounded"
                          style={{ width: `${revenueWidth}%` }}
                        >
                          <span className="absolute right-2 text-xs font-semibold text-green-800 leading-5">
                            £{(data.revenue / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div
                          className="absolute left-0 top-5 h-5 bg-red-200 rounded"
                          style={{ width: `${costWidth}%` }}
                        >
                          <span className="absolute right-2 text-xs font-semibold text-red-800 leading-5">
                            £{(data.cost / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-slate-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span className="text-slate-600">Cost</span>
            </div>
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Outstanding Invoices</h2>
          <div className="space-y-3">
            {OUTSTANDING_INVOICES.map((inv) => (
              <div
                key={inv.id}
                className={`p-3 rounded-lg border-2 ${
                  inv.days < 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-mono text-slate-600">{inv.id}</div>
                  <div className="text-sm font-bold text-slate-800">£{inv.amount}</div>
                </div>
                <div className="text-sm text-slate-700">{inv.customer}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Due: {new Date(inv.dueDate).toLocaleDateString('en-GB')}
                  {inv.days < 0 && (
                    <span className="ml-2 text-red-600 font-semibold">
                      {Math.abs(inv.days)} days overdue
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
            View All Invoices →
          </button>
        </div>
      </div>

      {/* Engineer Revenue Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Engineer Revenue Rankings</h2>
          <div className="space-y-3">
            {ENGINEER_REVENUE.map((eng, idx) => (
              <div key={eng.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm">{eng.name}</div>
                  <div className="text-xs text-slate-500">
                    {eng.jobs} jobs • £{eng.avgJob} avg
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">£{eng.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Profitability */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Top Profitable Jobs</h2>
          <div className="space-y-3">
            {JOB_PROFITABILITY.map((job) => (
              <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-mono text-slate-600">{job.id}</div>
                    <div className="text-sm font-semibold text-slate-800 mt-1">{job.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{job.margin}%</div>
                    <div className="text-xs text-slate-500">margin</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Revenue: £{job.revenue}</span>
                  <span>Cost: £{job.cost}</span>
                  <span className="font-semibold text-green-600">
                    Profit: £{job.revenue - job.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
