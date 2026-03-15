'use client';

const DOCUMENTS = [
  {
    id: '1',
    type: 'certificate',
    name: 'Gas Safety Certificate CP12',
    date: '2026-03-10',
    jobId: 'JOB-456',
    jobTitle: 'Annual Gas Service',
  },
  {
    id: '2',
    type: 'invoice',
    name: 'Invoice #INV-2026-045',
    date: '2026-03-10',
    jobId: 'JOB-456',
    jobTitle: 'Annual Gas Service',
  },
  {
    id: '3',
    type: 'certificate',
    name: 'Gas Safety Certificate CP12',
    date: '2025-03-15',
    jobId: 'JOB-389',
    jobTitle: 'Boiler Service',
  },
  {
    id: '4',
    type: 'invoice',
    name: 'Invoice #INV-2026-038',
    date: '2026-02-15',
    jobId: 'JOB-445',
    jobTitle: 'Bathroom Installation',
  },
  {
    id: '5',
    type: 'invoice',
    name: 'Invoice #INV-2025-512',
    date: '2025-12-10',
    jobId: 'JOB-412',
    jobTitle: 'Radiator Install',
  },
];

export default function DocumentsPage() {
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
            <span className="text-sm text-slate-500 ml-2">Documents</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Documents</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50 text-left">
            📜 Certificates ({DOCUMENTS.filter((d) => d.type === 'certificate').length})
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50 text-left">
            💰 Invoices ({DOCUMENTS.filter((d) => d.type === 'invoice').length})
          </button>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Document
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Job</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {DOCUMENTS.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-2xl">{doc.type === 'certificate' ? '📜' : '💰'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 text-sm">{doc.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{doc.jobTitle}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(doc.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/90">
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
