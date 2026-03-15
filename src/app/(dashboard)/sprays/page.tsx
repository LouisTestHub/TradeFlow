'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface SprayRecord {
  id: string;
  date: string;
  startTime: string | null;
  field: { id: string; name: string; hectares: number };
  operator: { id: string; name: string | null };
  equipment: { id: string; name: string } | null;
  areaTreatedHa: number | null;
  reason: string | null;
  status: string;
  products: Array<{
    productName: string;
    activeIngredient: string | null;
    doseRate: number | null;
    doseUnit: string | null;
  }>;
  weather: {
    tempC: number | null;
    windSpeedKmh: number | null;
    windDirection: string | null;
  } | null;
}

interface FieldOption {
  id: string;
  name: string;
}

type ViewMode = 'list' | 'calendar';

const PRODUCT_TYPE_COLORS: Record<string, string> = {
  herbicide: 'bg-green-500',
  fungicide: 'bg-blue-500',
  insecticide: 'bg-red-500',
  'growth regulator': 'bg-orange-500',
  molluscicide: 'bg-purple-500',
  default: 'bg-slate-400',
};

function getProductType(activeIngredient: string | null): string {
  if (!activeIngredient) return 'default';
  const ai = activeIngredient.toLowerCase();
  const herbicides = ['glyphosate', 'fluroxypyr', 'pendimethalin', 'mesosulfuron', 'pinoxaden', 'propyzamide', 'diflufenican', 'flufenacet', 'prosulfocarb', 'chlorotoluron', 'clodinafop', 'nicosulfuron', 'clomazone', 'clethodim', 'thifensulfuron', 'halauxifen', 'florasulam', 'isoproturon', 'tri-allate', 'carfentrazone', 'picolinafen', 'aminopyralid', 'mcpa', 'clopyralid', 'metribuzin', 'metsulfuron', 'iodosulfuron', 'sulcotrione', 'mesotrione'];
  const fungicides = ['prothioconazole', 'azoxystrobin', 'mefentrifluconazole', 'fluxapyroxad', 'tebuconazole', 'chlorothalonil', 'epoxiconazole', 'bixafen', 'benzovindiflupyr', 'boscalid', 'pyraclostrobin', 'mancozeb', 'dimethomorph', 'fluazinam', 'fluopyram'];
  const insecticides = ['lambda-cyhalothrin', 'pymetrozine', 'flonicamid', 'spirotetramat'];
  const growthRegs = ['trinexapac-ethyl'];
  const molluscicides = ['metaldehyde'];

  if (herbicides.some(h => ai.includes(h))) return 'herbicide';
  if (fungicides.some(f => ai.includes(f))) return 'fungicide';
  if (insecticides.some(i => ai.includes(i))) return 'insecticide';
  if (growthRegs.some(g => ai.includes(g))) return 'growth regulator';
  if (molluscicides.some(m => ai.includes(m))) return 'molluscicide';
  return 'default';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function CalendarView({ sprays, onDateClick }: { sprays: SprayRecord[]; onDateClick: (date: string) => void }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday start

  const spraysByDate: Record<string, SprayRecord[]> = {};
  sprays.forEach((s) => {
    const d = new Date(s.date).toISOString().split('T')[0];
    if (!spraysByDate[d]) spraysByDate[d] = [];
    spraysByDate[d].push(s);
  });

  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthLabel = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-50"
        >
          ‹
        </button>
        <h3 className="text-base font-bold text-slate-800">{monthLabel}</h3>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-50"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-400 py-2 border-b border-gray-50">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-16 border-b border-r border-gray-50" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const daysSprays = spraysByDate[dateStr] || [];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;
          return (
            <button
              key={day}
              onClick={() => daysSprays.length > 0 ? onDateClick(dateStr) : onDateClick(dateStr)}
              className={`h-16 border-b border-r border-gray-50 p-1 text-left hover:bg-gray-50 transition-colors ${
                isToday ? 'bg-primary/5' : ''
              }`}
            >
              <span className={`text-xs ${isToday ? 'font-bold text-primary' : 'text-slate-600'}`}>{day}</span>
              {daysSprays.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {daysSprays.slice(0, 3).map((s, si) => {
                    const type = getProductType(s.products[0]?.activeIngredient || null);
                    return (
                      <span
                        key={si}
                        className={`w-2 h-2 rounded-full ${PRODUCT_TYPE_COLORS[type] || PRODUCT_TYPE_COLORS.default}`}
                      />
                    );
                  })}
                  {daysSprays.length > 3 && (
                    <span className="text-[9px] text-slate-400">+{daysSprays.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="px-5 py-3 border-t border-gray-50 flex flex-wrap gap-3">
        {Object.entries(PRODUCT_TYPE_COLORS)
          .filter(([k]) => k !== 'default')
          .map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-[11px] text-slate-500 capitalize">{type}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function SpraysPage() {
  const [sprays, setSprays] = useState<SprayRecord[]>([]);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterField, setFilterField] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [displayCount, setDisplayCount] = useState(10);

  const loadSprays = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterField) params.set('fieldId', filterField);
      if (filterProduct) params.set('product', filterProduct);
      params.set('limit', '200');
      const res = await fetch(`/api/sprays?${params}`);
      const data = await res.json();
      setSprays(data.sprays || []);
      setTotal(data.total || 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [filterField, filterProduct]);

  useEffect(() => {
    loadSprays();
  }, [loadSprays]);

  useEffect(() => {
    fetch('/api/fields')
      .then((r) => r.json())
      .then((data) => setFields((data.fields || []).map((f: { id: string; name: string }) => ({ id: f.id, name: f.name }))))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const displayedSprays = sprays.slice(0, displayCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">
            Spray Diary
          </h1>
          <p className="text-sm text-slate-500 mt-1">{total} records this season</p>
        </div>
        <Link
          href="/sprays/new"
          className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors min-h-[48px] flex items-center gap-2"
        >
          <span>+</span> Log Spray
        </Link>
      </div>

      {/* View Toggle + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2.5 text-sm font-medium min-h-[44px] ${
              viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2.5 text-sm font-medium min-h-[44px] ${
              viewMode === 'calendar' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'
            }`}
          >
            Calendar
          </button>
        </div>

        <select
          value={filterField}
          onChange={(e) => { setFilterField(e.target.value); setDisplayCount(10); }}
          className="px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm min-h-[44px]"
        >
          <option value="">All Fields</option>
          {fields.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={filterProduct}
          onChange={(e) => { setFilterProduct(e.target.value); setDisplayCount(10); }}
          placeholder="Search product..."
          className="px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm min-h-[44px] w-40"
        />
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <CalendarView
          sprays={sprays}
          onDateClick={() => setViewMode('list')}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {displayedSprays.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-lg text-slate-400 mb-3">No spray records yet</p>
              <Link
                href="/sprays/new"
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl min-h-[48px]"
              >
                + Log Your First Spray
              </Link>
            </div>
          ) : (
            displayedSprays.map((spray) => {
              const primaryType = getProductType(spray.products[0]?.activeIngredient || null);
              return (
                <Link
                  key={spray.id}
                  href={`/sprays/${spray.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Date column */}
                    <div className="text-center min-w-[52px]">
                      <p className="text-xs text-slate-400 uppercase">
                        {new Date(spray.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {new Date(spray.date).getDate()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(spray.date).toLocaleDateString('en-GB', { month: 'short' })}
                      </p>
                    </div>

                    {/* Type indicator */}
                    <div
                      className={`w-1 self-stretch rounded-full ${
                        PRODUCT_TYPE_COLORS[primaryType] || PRODUCT_TYPE_COLORS.default
                      }`}
                    />

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">
                          {spray.field.name}
                          <span className="text-slate-400 font-normal ml-1">
                            ({spray.areaTreatedHa || spray.field.hectares} ha)
                          </span>
                        </h3>
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {spray.products.map((p, i) => (
                          <p key={i} className="text-sm text-slate-600">
                            {p.productName}
                            {p.doseRate && (
                              <span className="text-slate-400 ml-1">
                                {p.doseRate} {p.doseUnit || 'l/ha'}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                      {spray.reason && (
                        <p className="text-xs text-slate-400 mt-1">{spray.reason}</p>
                      )}
                    </div>

                    {/* Weather */}
                    {spray.weather && (
                      <div className="text-right text-xs text-slate-400 flex-shrink-0">
                        {spray.weather.tempC != null && (
                          <p>{Math.round(spray.weather.tempC)}°C</p>
                        )}
                        {spray.weather.windSpeedKmh != null && (
                          <p>
                            {Math.round(spray.weather.windSpeedKmh)} km/h
                            {spray.weather.windDirection ? ` ${spray.weather.windDirection}` : ''}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          )}

          {displayCount < sprays.length && (
            <button
              onClick={() => setDisplayCount((c) => c + 10)}
              className="w-full py-3 text-sm font-medium text-primary bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 min-h-[48px]"
            >
              Load More ({sprays.length - displayCount} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
