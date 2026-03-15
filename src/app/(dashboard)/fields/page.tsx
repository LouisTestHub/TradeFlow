'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface FieldData {
  id: string;
  name: string;
  fieldNumber: string | null;
  hectares: number;
  cropType: string | null;
  soilType: string | null;
  nvzZone: boolean;
  geometry: string | null;
  currentSeason: { year: number; crop: string; variety: string | null } | null;
  lastSpray: { date: string; products: string[] } | null;
}

function getCropIcon(cropType: string | null) {
  if (!cropType) return '🌿';
  const type = cropType.toLowerCase();
  if (type.includes('grass') || type.includes('pasture') || type.includes('silage')) return '🟩';
  if (type.includes('wood') || type.includes('copse')) return '🌳';
  return '🌾';
}

function FieldsContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';
  const [fields, setFields] = useState<FieldData[]>([]);
  const [summary, setSummary] = useState({ totalFields: 0, totalHectares: 0 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'hectares' | 'cropType'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetch('/api/fields')
      .then((res) => res.json())
      .then((json) => {
        setFields(json.fields || []);
        setSummary(json.summary || { totalFields: 0, totalHectares: 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sortedFields = [...fields].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortBy === 'hectares') cmp = a.hectares - b.hectares;
    else if (sortBy === 'cropType') cmp = (a.cropType || '').localeCompare(b.cropType || '');
    return sortDir === 'desc' ? -cmp : cmp;
  });

  function toggleSort(col: 'name' | 'hectares' | 'cropType') {
    if (sortBy === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  }

  function SortArrow({ col }: { col: string }) {
    if (sortBy !== col) return null;
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Fields & Crops
          </h1>
          <p className="text-slate-500 mt-1">
            {summary.totalFields} fields • {summary.totalHectares} ha • Season 2025/26
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <Link
              href="/fields?view=list"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              List
            </Link>
            <Link
              href="/fields?view=map"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'map' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Map
            </Link>
          </div>
          <Link
            href="/fields/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-light transition-colors min-h-[44px]"
          >
            + Add Field
          </Link>
        </div>
      </div>

      {view === 'map' ? (
        /* Map View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center relative">
            <div className="text-center p-8">
              <span className="text-5xl block mb-4">🗺️</span>
              <h3 className="text-lg font-bold text-slate-700 font-[var(--font-dm-sans)]">Map View</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                Field boundary mapping with Leaflet/Mapbox will be available when mapping libraries are configured.
                Fields with boundaries will appear as coloured polygons.
              </p>
              <div className="mt-6 space-y-2">
                {fields.map((f) => (
                  <Link
                    key={f.id}
                    href={`/fields/${f.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-primary/30 transition-colors mx-auto max-w-xs"
                  >
                    <span>{getCropIcon(f.cropType)}</span>
                    <span className="text-sm font-medium text-slate-700">{f.name}</span>
                    <span className="text-xs text-slate-400 ml-auto">{f.hectares} ha</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <>
          {/* Mobile card view */}
          <div className="space-y-3 lg:hidden">
            {sortedFields.map((field) => (
              <Link
                key={field.id}
                href={`/fields/${field.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow min-h-[48px]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{getCropIcon(field.cropType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">{field.name}</h3>
                      <span className="text-sm text-slate-500">{field.hectares} ha</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {field.currentSeason?.crop || field.cropType || 'No crop'}
                      {field.currentSeason?.variety ? ` (${field.currentSeason.variety})` : ''}
                    </p>
                    {field.lastSpray && (
                      <p className="text-xs text-slate-400 mt-1">
                        Last spray: {new Date(field.lastSpray.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                  <span className="text-green-500 mt-1">🟢</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('name')}>
                    Field <SortArrow col="name" />
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('hectares')}>
                    Size <SortArrow col="hectares" />
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('cropType')}>
                    Crop 25/26 <SortArrow col="cropType" />
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Last Spray
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedFields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/fields/${field.id}`} className="flex items-center gap-2 text-sm font-medium text-slate-800 hover:text-primary transition-colors">
                        <span>{getCropIcon(field.cropType)}</span>
                        {field.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{field.hectares} ha</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {field.currentSeason?.crop || field.cropType || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {field.lastSpray
                        ? new Date(field.lastSpray.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-green-500">🟢</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function FieldsPage() {
  return (
    <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse"/>)}</div>}>
      <FieldsContent />
    </Suspense>
  );
}
