'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';

const reportMeta: Record<string, { title: string; icon: string; csvAvailable: boolean }> = {
  'red-tractor': { title: 'Red Tractor Audit Pack', icon: '📋', csvAvailable: false },
  'bcms': { title: 'BCMS Movement Report', icon: '🐄', csvAvailable: true },
  'spray': { title: 'Spray Report', icon: '🌾', csvAvailable: true },
  'medicine': { title: 'Medicine Report', icon: '💊', csvAvailable: true },
  'sfi': { title: 'SFI Evidence Pack', icon: '🎯', csvAvailable: false },
  'nvz': { title: 'NVZ Nutrient Summary', icon: '🌱', csvAvailable: true },
  'farm-summary': { title: 'Farm Summary', icon: '🏠', csvAvailable: false },
  'season': { title: 'Season Summary', icon: '📊', csvAvailable: true },
  'expense': { title: 'Expense Report', icon: '💰', csvAvailable: true },
};

export default function ReportViewPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const meta = reportMeta[type] || { title: 'Report', icon: '📄', csvAvailable: false };
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('season');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const getDateParams = useCallback(() => {
    const now = new Date();
    let from: string, to: string;
    switch (dateRange) {
      case 'last12':
        from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
        break;
      case 'custom':
        from = customFrom || new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        to = customTo || now.toISOString().split('T')[0];
        break;
      default: // season
        from = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
    }
    return `from=${from}&to=${to}`;
  }, [dateRange, customFrom, customTo]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${type}?${getDateParams()}`);
      const json = await res.json();
      setData(json);
    } catch { setData(null); }
    setLoading(false);
  }, [type, getDateParams]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const downloadCsv = () => {
    window.open(`/api/reports/${type}/csv?${getDateParams()}`, '_blank');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/reports" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <span className="text-3xl">{meta.icon}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{meta.title}</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]"
            >
              <option value="season">This Season</option>
              <option value="last12">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]"
                />
              </div>
            </>
          )}

          <button
            onClick={fetchReport}
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[48px]"
          >
            Generate
          </button>

          <div className="flex gap-2 ml-auto">
            {meta.csvAvailable && (
              <button
                onClick={downloadCsv}
                className="border border-gray-300 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 min-h-[48px]"
              >
                📥 CSV
              </button>
            )}
            <button
              onClick={printReport}
              className="border border-gray-300 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 min-h-[48px]"
            >
              🖨️ Print / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : data ? (
        <div className="print:bg-white" id="report-content">
          {type === 'red-tractor' && <RedTractorReport data={data} />}
          {type === 'bcms' && <BcmsReport data={data} />}
          {type === 'spray' && <SprayReport data={data} />}
          {type === 'medicine' && <MedicineReport data={data} />}
          {type === 'sfi' && <SfiReport data={data} />}
          {type === 'nvz' && <NvzReport data={data} />}
          {type === 'farm-summary' && <FarmSummaryReport data={data} />}
          {type === 'season' && <SeasonReport data={data} />}
          {type === 'expense' && <ExpenseReport data={data} />}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-slate-500">
          Failed to load report data. Try again.
        </div>
      )}
    </div>
  );
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4 print:border print:rounded-none print:mb-2 print:break-inside-avoid">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: (string | number | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-2 font-medium text-slate-500 text-xs uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-2 text-slate-700">{cell ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function RedTractorReport({ data }: { data: any }) {
  const { farm, sections } = data;
  return (
    <div>
      {/* Branded Header */}
      <div className="bg-primary text-white rounded-2xl p-6 mb-4 print:rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🌿 TradeFlow — Red Tractor Audit Pack</h2>
            <p className="text-white/80 mt-1">{farm?.name} • CPH: {farm?.cphNumber || 'N/A'} • SBI: {farm?.sbiNumber || 'N/A'}</p>
          </div>
          <div className="text-right text-sm text-white/70">
            <p>Generated: {fmtDate(data.generatedAt)}</p>
            <p>{data.dateRange?.from ? `${fmtDate(data.dateRange.from)} — ${fmtDate(data.dateRange.to)}` : ''}</p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <Section title="Table of Contents">
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
          <li>Farm Details</li>
          <li>Field Register ({sections.fieldRegister?.length || 0} fields)</li>
          <li>Spray Records ({sections.sprayRecords?.length || 0} records)</li>
          <li>Medicine Records ({sections.medicineRecords?.length || 0} records)</li>
          <li>Movement Records ({sections.movementRecords?.length || 0} records)</li>
          <li>Fertiliser Records ({sections.fertiliserRecords?.length || 0} records)</li>
          <li>NVZ Nutrient Plan</li>
          <li>Equipment Register ({sections.equipmentRegister?.length || 0} items)</li>
          <li>SFI Actions ({sections.sfiActions?.length || 0} actions)</li>
          <li>Compliance Score</li>
        </ol>
      </Section>

      {/* 1. Farm Details */}
      <Section title="1. Farm Details">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Farm Name:</span> <span className="font-medium">{farm?.name}</span></div>
          <div><span className="text-slate-500">CPH:</span> <span className="font-medium">{farm?.cphNumber || 'N/A'}</span></div>
          <div><span className="text-slate-500">SBI:</span> <span className="font-medium">{farm?.sbiNumber || 'N/A'}</span></div>
          <div><span className="text-slate-500">County:</span> <span className="font-medium">{farm?.county || 'N/A'}</span></div>
          <div><span className="text-slate-500">Postcode:</span> <span className="font-medium">{farm?.postcode || 'N/A'}</span></div>
          <div><span className="text-slate-500">Farm Type:</span> <span className="font-medium capitalize">{farm?.farmType || 'N/A'}</span></div>
          <div><span className="text-slate-500">Total Hectares:</span> <span className="font-medium">{farm?.totalHectares || 'N/A'}</span></div>
        </div>
      </Section>

      {/* 2. Field Register */}
      <Section title="2. Field Register">
        <DataTable
          headers={['Field', 'No.', 'Hectares', 'Crop', 'Soil', 'NVZ']}
          rows={(sections.fieldRegister || []).map((f: any) => [
            f.name, f.fieldNumber || '—', f.hectares, f.cropType || '—', f.soilType || '—',
            f.nvzZone ? '✅' : '—',
          ])}
        />
      </Section>

      {/* 3. Spray Records */}
      <Section title="3. Spray Records">
        {sections.sprayRecords?.length > 0 ? (
          <DataTable
            headers={['Date', 'Field', 'Products', 'Rate', 'Operator', 'Equipment', 'Weather']}
            rows={sections.sprayRecords.map((s: any) => [
              fmtDate(s.date), s.field,
              s.products?.map((p: any) => p.name).join(', ') || '—',
              s.products?.[0] ? `${s.products[0].doseRate} ${s.products[0].doseUnit || ''}` : '—',
              s.operator || '—', s.equipment || '—',
              s.weather ? `${s.weather.temp}°C, ${s.weather.wind}km/h ${s.weather.windDir || ''}` : '—',
            ])}
          />
        ) : <p className="text-sm text-slate-500">No spray records in this period.</p>}
      </Section>

      {/* 4. Medicine Records */}
      <Section title="4. Medicine Records">
        {sections.medicineRecords?.length > 0 ? (
          <DataTable
            headers={['Date', 'Product', 'Batch', 'Dose', 'Animals', 'WD Meat', 'WD Milk', 'Vet']}
            rows={sections.medicineRecords.map((m: any) => [
              fmtDate(m.date), m.product, m.batchNumber || '—', m.dose || '—',
              m.animals?.join(', ') || '—',
              m.withdrawalMeat ? `${m.withdrawalMeat}d` : '—',
              m.withdrawalMilk ? `${m.withdrawalMilk}d` : '—',
              m.vet?.name || '—',
            ])}
          />
        ) : <p className="text-sm text-slate-500">No medicine records in this period.</p>}
      </Section>

      {/* 5. Movement Records */}
      <Section title="5. Movement Records">
        {sections.movementRecords?.length > 0 ? (
          <DataTable
            headers={['Date', 'Type', 'From CPH', 'To CPH', 'Count', 'Species', 'BCMS']}
            rows={sections.movementRecords.map((m: any) => [
              fmtDate(m.date), m.type, m.fromCph, m.toCph, m.animalCount, m.species || '—',
              m.bcmsSubmitted ? '✅' : '⏳',
            ])}
          />
        ) : <p className="text-sm text-slate-500">No movement records in this period.</p>}
      </Section>

      {/* 6. Fertiliser Records */}
      <Section title="6. Fertiliser Records">
        {sections.fertiliserRecords?.length > 0 ? (
          <DataTable
            headers={['Date', 'Field', 'Type', 'Product', 'Rate', 'N', 'P', 'K', 'NVZ']}
            rows={sections.fertiliserRecords.map((f: any) => [
              fmtDate(f.date), f.field, f.productType, f.productName || '—',
              f.rateKgHa ? `${f.rateKgHa} kg/ha` : '—',
              f.nContent || '—', f.pContent || '—', f.kContent || '—',
              f.nvzCompliant ? '✅' : '❌',
            ])}
          />
        ) : <p className="text-sm text-slate-500">No fertiliser records in this period.</p>}
      </Section>

      {/* 7. NVZ Nutrient Plan */}
      <Section title="7. NVZ Nutrient Plan">
        {sections.nvzPlan?.length > 0 ? (
          <DataTable
            headers={['Field', 'Year', 'Planned N', 'Planned P', 'Planned K', 'Actual N', 'Actual P', 'Actual K', 'Compliant']}
            rows={sections.nvzPlan.map((np: any) => [
              np.field, np.year, np.plannedN ?? '—', np.plannedP ?? '—', np.plannedK ?? '—',
              np.actualN ?? '—', np.actualP ?? '—', np.actualK ?? '—',
              np.compliant ? '✅' : '❌',
            ])}
          />
        ) : <p className="text-sm text-slate-500">No nutrient plans set.</p>}
      </Section>

      {/* 8. Equipment Register */}
      <Section title="8. Equipment Register">
        {sections.equipmentRegister?.length > 0 ? (
          <DataTable
            headers={['Name', 'Type', 'Nozzle', 'Tank (L)', 'Calibration', 'MOT Expiry']}
            rows={sections.equipmentRegister.map((e: any) => [
              e.name, e.type, e.nozzleType || '—', e.tankCapacity || '—',
              e.calibrationDate ? fmtDate(e.calibrationDate) : '—',
              e.motExpiry ? fmtDate(e.motExpiry) : '—',
            ])}
          />
        ) : <p className="text-sm text-slate-500">No equipment registered.</p>}
      </Section>

      {/* 9. SFI Actions */}
      <Section title="9. SFI Actions">
        {sections.sfiActions?.length > 0 ? (
          <DataTable
            headers={['Code', 'Name', 'Hectares', 'Evidence', 'Submitted']}
            rows={sections.sfiActions.map((a: any) => [
              a.code, a.name, a.hectares || '—', a.evidenceCount, a.submittedCount,
            ])}
          />
        ) : <p className="text-sm text-slate-500">No SFI actions recorded.</p>}
      </Section>

      {/* 10. Compliance Score */}
      <Section title="10. Compliance Score Summary">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{sections.complianceScore?.overall || 0}%</span>
          </div>
          <div className="text-sm space-y-1">
            <p><span className="text-slate-500">Compliant Items:</span> {sections.complianceScore?.compliantItems || 0} / {sections.complianceScore?.totalItems || 0}</p>
            <p><span className="text-slate-500">Audit Status:</span> <span className="capitalize">{sections.complianceScore?.auditStatus || 'Not started'}</span></p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 mt-6 print:mt-2">
        Generated by TradeFlow • {fmtDate(data.generatedAt)} • Page {'{'}page{'}'} of {'{'}pages{'}'}
      </div>
    </div>
  );
}

function BcmsReport({ data }: { data: any }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{data.totalMovements}</p>
          <p className="text-sm text-slate-500">Total Movements</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{data.submitted}</p>
          <p className="text-sm text-slate-500">Submitted to BCMS</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{data.pending}</p>
          <p className="text-sm text-slate-500">Pending</p>
        </div>
      </div>
      <Section title="Movement Records">
        <DataTable
          headers={['Date', 'Type', 'From CPH', 'To CPH', 'Species', 'Count', 'Animals', 'BCMS']}
          rows={(data.movements || []).map((m: any) => [
            fmtDate(m.date), m.movementType, m.fromCph, m.toCph, m.species || '—', m.animalCount,
            m.animals?.map((a: any) => a.earTag).join(', ') || '—',
            m.bcmsSubmitted ? `✅ ${m.bcmsRef || ''}` : '⏳ Pending',
          ])}
        />
      </Section>
    </div>
  );
}

function SprayReport({ data }: { data: any }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{data.totalApplications}</p>
          <p className="text-sm text-slate-500">Total Applications</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{data.totalFields}</p>
          <p className="text-sm text-slate-500">Fields Sprayed</p>
        </div>
      </div>
      {(data.byField || []).map((field: any) => (
        <Section key={field.fieldName} title={`${field.fieldName} (${field.hectares || '?'} ha) — ${field.applications} applications`}>
          <DataTable
            headers={['Date', 'Products', 'Rate', 'Operator', 'Equipment', 'Temp', 'Wind']}
            rows={field.records.map((r: any) => [
              fmtDate(r.date),
              r.products?.map((p: any) => p.name).join(', ') || '—',
              r.products?.[0] ? `${r.products[0].doseRate} ${r.products[0].doseUnit || ''}` : '—',
              r.operator || '—', r.equipment || '—',
              r.weather?.tempC != null ? `${r.weather.tempC}°C` : '—',
              r.weather?.windSpeedKmh != null ? `${r.weather.windSpeedKmh} km/h` : '—',
            ])}
          />
        </Section>
      ))}
    </div>
  );
}

function MedicineReport({ data }: { data: any }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{data.totalTreatments}</p>
          <p className="text-sm text-slate-500">Total Treatments</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{data.activeWithdrawals}</p>
          <p className="text-sm text-slate-500">Active Withdrawals</p>
        </div>
      </div>
      <Section title="Treatment Records">
        <DataTable
          headers={['Date', 'Product', 'Batch', 'Dose', 'Route', 'Animals', 'WD Status', 'Vet']}
          rows={(data.records || []).map((m: any) => [
            fmtDate(m.date), m.product, m.batchNumber || '—', m.dose || '—', m.route || '—',
            m.animals?.map((a: any) => a.earTag).join(', ') || '—',
            m.withdrawal?.active ? (
              <span className="text-red-600 font-medium">Active until {fmtDate(m.withdrawal.endDate)}</span>
            ) : m.withdrawal?.endDate ? (
              <span className="text-green-600">Clear</span>
            ) : '—',
            m.vet?.name || '—',
          ])}
        />
      </Section>
    </div>
  );
}

function SfiReport({ data }: { data: any }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{data.totalActions}</p>
          <p className="text-sm text-slate-500">Total Actions</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{data.totalEvidence}</p>
          <p className="text-sm text-slate-500">Evidence Entries</p>
        </div>
      </div>
      {(data.agreements || []).map((agreement: any) => (
        <div key={agreement.ref}>
          <Section title={`Agreement: ${agreement.ref || 'Draft'} (${agreement.status})`}>
            <div className="text-sm text-slate-600 mb-4">
              <p>Period: {fmtDate(agreement.startDate)} — {fmtDate(agreement.endDate)}</p>
              <p>Annual Payment: £{agreement.totalPayment?.toLocaleString() || '0'}</p>
            </div>
          </Section>
          {agreement.actions?.map((action: any) => (
            <Section key={action.code} title={`${action.code} — ${action.name}`}>
              <div className="text-sm text-slate-600 mb-3">
                <p>Field: {action.field || 'N/A'} • Area: {action.hectares || '—'} ha • Payment: £{action.paymentPerHa || '—'}/ha</p>
                <p>Evidence: {action.submittedEvidence}/{action.totalEvidence} submitted</p>
              </div>
              {action.evidence?.length > 0 ? (
                <DataTable
                  headers={['Date', 'Description', 'Photo', 'GPS', 'Status']}
                  rows={action.evidence.map((e: any) => [
                    fmtDate(e.date), e.description || '—',
                    e.photoUrl ? '📷 Attached' : '—',
                    e.lat && e.lng ? `${e.lat.toFixed(4)}, ${e.lng.toFixed(4)}` : '—',
                    e.status === 'submitted' ? '✅ Submitted' : '📝 Draft',
                  ])}
                />
              ) : <p className="text-sm text-slate-400">No evidence recorded yet.</p>}
            </Section>
          ))}
        </div>
      ))}
    </div>
  );
}

function NvzReport({ data }: { data: any }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{data.wholeFarmOrganicNPerHa} kg/ha</p>
          <p className="text-sm text-slate-500">Whole Farm Organic N Average</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className={`text-2xl font-bold ${data.compliant ? 'text-green-600' : 'text-red-600'}`}>
            {data.compliant ? '✅ Compliant' : '❌ Over Limit'}
          </p>
          <p className="text-sm text-slate-500">NVZ Limit: {data.nvzLimit} kg N/ha</p>
        </div>
      </div>
      <Section title="Per-Field Nutrient Summary">
        <DataTable
          headers={['Field', 'Ha', 'N Applied', 'P Applied', 'K Applied', 'Organic N', 'Planned N', 'NVZ']}
          rows={(data.perField || []).map((f: any) => [
            f.fieldName, f.hectares, f.appliedN, f.appliedP, f.appliedK, f.organicN,
            f.plannedN ?? '—', f.nvzCompliant ? '✅' : '❌',
          ])}
        />
      </Section>
      {data.nutrientPlans?.length > 0 && (
        <Section title="Nutrient Plans">
          <DataTable
            headers={['Field', 'Year', 'Plan N', 'Plan P', 'Plan K', 'Actual N', 'Actual P', 'Actual K', 'Status']}
            rows={data.nutrientPlans.map((np: any) => [
              np.field, np.year, np.plannedN ?? '—', np.plannedP ?? '—', np.plannedK ?? '—',
              np.actualN ?? '—', np.actualP ?? '—', np.actualK ?? '—',
              np.compliant ? '✅' : '❌',
            ])}
          />
        </Section>
      )}
    </div>
  );
}

function FarmSummaryReport({ data }: { data: any }) {
  const { farm, overview, compliance, seasonHighlights, upcomingDeadlines } = data;
  return (
    <div>
      <div className="bg-primary text-white rounded-2xl p-6 mb-4">
        <h2 className="text-xl font-bold">🌿 {farm?.name} — Farm Summary</h2>
        <p className="text-white/70 mt-1">Generated: {fmtDate(data.generatedAt)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{overview?.totalFields || 0}</p>
          <p className="text-sm text-slate-500">Fields</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{overview?.totalHectares || 0}</p>
          <p className="text-sm text-slate-500">Hectares</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{overview?.cattleCount || 0}</p>
          <p className="text-sm text-slate-500">Cattle</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{overview?.sheepCount || 0}</p>
          <p className="text-sm text-slate-500">Sheep</p>
        </div>
      </div>

      <Section title="Compliance">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-primary">{compliance?.redTractorScore != null ? `${compliance.redTractorScore}%` : 'N/A'}</p>
            <p className="text-sm text-slate-500">Red Tractor Score</p>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">{compliance?.sfiAgreements || 0}</p>
            <p className="text-sm text-slate-500">Active SFI Agreements</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-600">{compliance?.outstandingAlerts || 0}</p>
            <p className="text-sm text-slate-500">Outstanding Alerts</p>
          </div>
        </div>
      </Section>

      <Section title="Season Highlights">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-xl font-bold">{seasonHighlights?.totalSprays || 0}</p><p className="text-sm text-slate-500">Spray Applications</p></div>
          <div><p className="text-xl font-bold">{seasonHighlights?.totalTreatments || 0}</p><p className="text-sm text-slate-500">Medicine Treatments</p></div>
          <div><p className="text-xl font-bold">{seasonHighlights?.totalMovements || 0}</p><p className="text-sm text-slate-500">Livestock Movements</p></div>
        </div>
      </Section>

      {upcomingDeadlines?.length > 0 && (
        <Section title="Upcoming Deadlines">
          <div className="space-y-2">
            {upcomingDeadlines.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-slate-700">{d.message}</span>
                <span className="text-slate-500">{d.dueDate ? fmtDate(d.dueDate) : 'No date'}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function SeasonReport({ data }: { data: any }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">£{data.totals?.totalInputCost?.toLocaleString() || 0}</p>
          <p className="text-sm text-slate-500">Total Input Cost</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">£{data.totals?.totalSprayCost?.toLocaleString() || 0}</p>
          <p className="text-sm text-slate-500">Spray Cost</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">£{data.totals?.totalFertCost?.toLocaleString() || 0}</p>
          <p className="text-sm text-slate-500">Fertiliser Cost</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">£{data.totals?.totalSeedCost?.toLocaleString() || 0}</p>
          <p className="text-sm text-slate-500">Seed Cost</p>
        </div>
      </div>
      <Section title="Per-Field Summary">
        <DataTable
          headers={['Field', 'Ha', 'Crop', 'Yield (t)', 'Spray £', 'Fert £', 'Seed £', 'Total £', 'Gross Margin £']}
          rows={(data.perField || []).map((f: any) => [
            f.fieldName, f.hectares, f.crop || '—', f.yieldTonnes ?? '—',
            `£${f.inputs.sprayCost}`, `£${f.inputs.fertCost}`, `£${f.inputs.seedCost}`,
            `£${f.inputs.totalInputCost}`, f.grossMargin != null ? `£${f.grossMargin}` : '—',
          ])}
        />
      </Section>
      <p className="text-xs text-slate-400 mt-2">Note: Costs are estimates based on placeholder values. Enter actual product costs for accurate figures.</p>
    </div>
  );
}

function ExpenseReport({ data }: { data: any }) {
  const cats = data.categories || {};
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4 text-center">
        <p className="text-3xl font-bold text-slate-900">£{data.totalEstimatedCost?.toLocaleString() || 0}</p>
        <p className="text-sm text-slate-500">Total Estimated Expenses</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {Object.entries(cats).map(([key, cat]: [string, any]) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-xl font-bold text-slate-900">£{cat.estimatedCost?.toLocaleString() || 0}</p>
            <p className="text-sm text-slate-500">{cat.label}</p>
            <p className="text-xs text-slate-400">{cat.count} entries</p>
          </div>
        ))}
      </div>

      {Object.entries(cats).map(([key, cat]: [string, any]) => (
        <Section key={key} title={cat.label}>
          <DataTable
            headers={['Date', 'Description', 'Field/Animal', 'Est. Cost']}
            rows={(cat.items || []).map((item: any) => [
              fmtDate(item.date), item.description, item.field || `${item.animalCount || '—'} animals`,
              `£${item.estimatedCost || 0}`,
            ])}
          />
        </Section>
      ))}

      <p className="text-xs text-slate-400 mt-2">{data.note}</p>
    </div>
  );
}
