'use client';

import { useEffect, useState } from 'react';

interface CisRecord {
  id: string;
  monthYear: string;
  engineer: string;
  grossPayment: number;
  cisRate: number;
  cisDeduction: number;
  netPayment: number;
  hmrcSubmitted: boolean;
  hmrcReference: string | null;
}

export default function CisPage() {
  const [records, setRecords] = useState<CisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const engineers = ['James Mitchell', 'Tom Harrison', 'Michael Davies', 'Chris Thompson', 'David Wilson'];
      const months = ['2026-03', '2026-02', '2026-01', '2025-12', '2025-11', '2025-10'];
      const mockRecords: CisRecord[] = [];
      
      let id = 1;
      for (const month of months) {
        for (let i = 0; i < 5; i++) {
          const gross = 2000 + Math.random() * 3000;
          const rate = i % 2 === 0 ? 20 : 30;
          const deduction = gross * rate / 100;
          const net = gross - deduction;
          const submitted = month !== '2026-03'; // Current month not submitted
          
          mockRecords.push({
            id: String(id++),
            monthYear: month,
            engineer: engineers[i],
            grossPayment: gross,
            cisRate: rate,
            cisDeduction: deduction,
            netPayment: net,
            hmrcSubmitted: submitted,
            hmrcReference: submitted ? `HMRC${month.replace('-', '')}${id.toString().padStart(4, '0')}` : null
          });
        }
      }
      
      setRecords(mockRecords);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;
  }

  const currentMonth = records.filter(r => r.monthYear === '2026-03');
  const totalGross = currentMonth.reduce((sum, r) => sum + r.grossPayment, 0);
  const totalDeduction = currentMonth.reduce((sum, r) => sum + r.cisDeduction, 0);
  const totalNet = currentMonth.reduce((sum, r) => sum + r.netPayment, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">CIS Tax Records</h1>
        <p className="text-slate-500 mt-1">Construction Industry Scheme tax deductions</p>
      </div>

      {/* Current Month Summary */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">March 2026 Summary</h2>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Due: 19 Mar 2026</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-90">Gross Payments</p>
            <p className="text-2xl font-bold mt-1">£{totalGross.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">CIS Deductions</p>
            <p className="text-2xl font-bold mt-1">£{totalDeduction.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Net Payable</p>
            <p className="text-2xl font-bold mt-1">£{totalNet.toFixed(2)}</p>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
          Submit to HMRC →
        </button>
      </div>

      {/* All Records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Month</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Engineer</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Gross Payment</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">CIS Rate</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">CIS Deduction</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Net Payment</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">HMRC Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-slate-700">
                  {new Date(record.monthYear + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </td>
                <td className="px-5 py-3 text-sm text-slate-600">{record.engineer}</td>
                <td className="px-5 py-3 text-right text-sm text-slate-700">£{record.grossPayment.toFixed(2)}</td>
                <td className="px-5 py-3 text-right text-sm text-slate-600">{record.cisRate}%</td>
                <td className="px-5 py-3 text-right text-sm font-medium text-red-600">£{record.cisDeduction.toFixed(2)}</td>
                <td className="px-5 py-3 text-right text-sm font-medium text-green-600">£{record.netPayment.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    record.hmrcSubmitted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {record.hmrcSubmitted ? 'submitted' : 'pending'}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-mono text-slate-500">{record.hmrcReference || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
