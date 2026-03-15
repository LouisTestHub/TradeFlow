'use client';

import { useEffect, useState } from 'react';

interface AuditItemData {
  id: string;
  requirement: string;
  category: string | null;
  status: string;
  effectiveStatus: string;
  autoLinked: boolean;
  autoLinkSource: string;
  evidenceUrl: string | null;
  notes: string | null;
}

interface RTData {
  id: string;
  auditDate: string | null;
  auditor: string | null;
  status: string;
  daysUntilAudit: number | null;
  complianceScore: number;
  totalItems: number;
  compliantItems: number;
  categories: Record<string, AuditItemData[]>;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'compliant': return <span className="text-lg">✅</span>;
    case 'non_compliant': return <span className="text-lg">❌</span>;
    case 'na': return <span className="text-lg text-gray-400">N/A</span>;
    default: return <span className="text-lg">⚠️</span>;
  }
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? 'text-green-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';
  const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
  return (
    <div className="text-center">
      <span className="text-4xl block mb-1">{emoji}</span>
      <span className={`text-3xl font-bold ${color}`}>{score}%</span>
      <p className="text-xs text-slate-500 mt-1">Compliance Score</p>
    </div>
  );
}

export default function RedTractorPage() {
  const [data, setData] = useState<RTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [uploadingItem, setUploadingItem] = useState<string | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');

  useEffect(() => {
    fetch('/api/red-tractor')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        // Expand categories with issues by default
        const withIssues = new Set<string>();
        if (d.categories) {
          for (const [cat, items] of Object.entries(d.categories)) {
            if ((items as AuditItemData[]).some((i) => i.effectiveStatus !== 'compliant' && i.effectiveStatus !== 'na')) {
              withIssues.add(cat);
            }
          }
        }
        setExpandedCategories(withIssues);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  async function handleUploadEvidence(itemId: string) {
    const res = await fetch('/api/red-tractor/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        fileName: 'manual-upload',
        notes: uploadNotes || 'Evidence uploaded',
      }),
    });

    if (res.ok) {
      // Refresh data
      const refreshed = await fetch('/api/red-tractor');
      const d = await refreshed.json();
      setData(d);
      setUploadingItem(null);
      setUploadNotes('');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />)}
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-slate-500">Unable to load Red Tractor data</div>;
  }

  const categories = data.categories || {};
  const categoryNames = Object.keys(categories);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
          ✅ Red Tractor Audit Preparation
        </h1>
        <p className="text-slate-500 mt-1">Track compliance and prepare for your next audit</p>
      </div>

      {/* Audit Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-2 lg:col-span-1 flex justify-center lg:justify-start">
            <ScoreRing score={data.complianceScore} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Next Audit</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {data.auditDate
                ? new Date(data.auditDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'TBC'}
            </p>
            {data.daysUntilAudit !== null && (
              <p className={`text-xs font-medium mt-0.5 ${
                data.daysUntilAudit <= 30 ? 'text-red-600' : data.daysUntilAudit <= 90 ? 'text-amber-600' : 'text-slate-500'
              }`}>
                {data.daysUntilAudit > 0 ? `${data.daysUntilAudit} days` : 'Overdue!'}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Auditor</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{data.auditor || 'TBC'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Items Evidenced</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {data.compliantItems} of {data.totalItems}
            </p>
          </div>
        </div>
      </div>

      {/* Checklist by Category */}
      {categoryNames.map((catName) => {
        const items = categories[catName];
        const compliant = items.filter((i) => i.effectiveStatus === 'compliant' || i.effectiveStatus === 'na').length;
        const total = items.length;
        const allGood = compliant === total;
        const isExpanded = expandedCategories.has(catName);

        const catEmoji = allGood ? '✅' : compliant >= total * 0.8 ? '🟡' : '🔴';

        return (
          <div key={catName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleCategory(catName)}
              className="w-full px-5 py-4 flex items-center justify-between text-left min-h-[56px] hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{catEmoji}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{catName}</h3>
                  <p className="text-xs text-slate-500">{compliant}/{total} items evidenced</p>
                </div>
              </div>
              <span className="text-slate-400 text-lg">{isExpanded ? '▼' : '▶'}</span>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.id} className="px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <StatusIcon status={item.effectiveStatus} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700">{item.requirement}</p>
                        {item.autoLinked && (
                          <p className="text-xs text-green-600 mt-0.5">
                            🔗 Auto-linked from {item.autoLinkSource}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                        )}
                        {item.effectiveStatus === 'pending' && !item.autoLinked && (
                          <div className="mt-2">
                            {uploadingItem === item.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={uploadNotes}
                                  onChange={(e) => setUploadNotes(e.target.value)}
                                  placeholder="Notes (e.g. certificate reference)"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[44px]"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUploadEvidence(item.id)}
                                    className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 min-h-[40px]"
                                  >
                                    ✅ Mark as Evidenced
                                  </button>
                                  <button
                                    onClick={() => { setUploadingItem(null); setUploadNotes(''); }}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-slate-600 min-h-[40px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setUploadingItem(item.id)}
                                className="text-xs text-primary hover:underline min-h-[36px] px-1"
                              >
                                📎 Upload Evidence
                              </button>
                            )}
                          </div>
                        )}
                        {item.effectiveStatus === 'non_compliant' && (
                          <div className="mt-2">
                            {uploadingItem === item.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={uploadNotes}
                                  onChange={(e) => setUploadNotes(e.target.value)}
                                  placeholder="Corrective action taken..."
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[44px]"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUploadEvidence(item.id)}
                                    className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 min-h-[40px]"
                                  >
                                    ✅ Mark as Resolved
                                  </button>
                                  <button
                                    onClick={() => { setUploadingItem(null); setUploadNotes(''); }}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-slate-600 min-h-[40px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setUploadingItem(item.id)}
                                className="text-xs text-red-600 hover:underline min-h-[36px] px-1"
                              >
                                ❌ Resolve Non-Compliance
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
