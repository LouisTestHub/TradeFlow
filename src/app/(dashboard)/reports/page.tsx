'use client';

import Link from 'next/link';

const complianceReports = [
  {
    type: 'red-tractor',
    icon: '📋',
    title: 'Red Tractor Audit Pack',
    description: 'Complete evidence pack for Red Tractor audit. Farm details, spray records, medicine, movements, fertiliser, NVZ plan, equipment, and compliance score.',
    formats: ['screen', 'pdf'],
  },
  {
    type: 'bcms',
    icon: '🐄',
    title: 'BCMS Movement Report',
    description: 'All livestock movements for selected period with BCMS submission status. CSV format matches BCMS batch upload template.',
    formats: ['screen', 'csv'],
  },
  {
    type: 'spray',
    icon: '🌾',
    title: 'Spray Report',
    description: 'All spray records by field or date. Includes weather data, operator, equipment, products, and rates.',
    formats: ['screen', 'csv'],
  },
  {
    type: 'medicine',
    icon: '💊',
    title: 'Medicine Report',
    description: 'All treatments with withdrawal status, batch tracking, vet details, and costs.',
    formats: ['screen', 'csv'],
  },
  {
    type: 'sfi',
    icon: '🎯',
    title: 'SFI Evidence Pack',
    description: 'Evidence pack for each SFI action. Photos, GPS locations, observations, and completion status.',
    formats: ['screen', 'pdf'],
  },
  {
    type: 'nvz',
    icon: '🌱',
    title: 'NVZ Nutrient Summary',
    description: 'Annual nutrient plan by field. Per-field N/P/K applied vs limits, whole farm organic N average.',
    formats: ['screen', 'csv'],
  },
];

const farmReports = [
  {
    type: 'farm-summary',
    icon: '🏠',
    title: 'Farm Summary',
    description: 'Whole farm overview — fields, stock count, compliance scores, season highlights, upcoming deadlines.',
    formats: ['screen', 'pdf'],
  },
  {
    type: 'season',
    icon: '📊',
    title: 'Season Summary',
    description: 'Per-field inputs cost — spray, fertiliser, seed costs. Gross margin per field with yield data.',
    formats: ['screen', 'csv'],
  },
  {
    type: 'expense',
    icon: '💰',
    title: 'Expense Report',
    description: 'All costs by category — crop protection, veterinary & medicine, fertiliser. Estimated totals.',
    formats: ['screen', 'csv'],
  },
];

function ReportCard({ report }: { report: typeof complianceReports[0] }) {
  return (
    <Link
      href={`/reports/${report.type}`}
      className="block bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-primary/30 transition-all min-h-[180px]"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{report.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 text-base">{report.title}</h3>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">{report.description}</p>
      <div className="flex items-center gap-2">
        {report.formats.includes('screen') && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">View</span>
        )}
        {report.formats.includes('pdf') && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">PDF</span>
        )}
        {report.formats.includes('csv') && (
          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-medium">CSV</span>
        )}
      </div>
    </Link>
  );
}

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 mt-1">Generate compliance packs, farm reports, and financial summaries</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          Compliance Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {complianceReports.map(r => <ReportCard key={r.type} report={r} />)}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full" />
          Farm Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {farmReports.map(r => <ReportCard key={r.type} report={r} />)}
        </div>
      </div>
    </div>
  );
}
