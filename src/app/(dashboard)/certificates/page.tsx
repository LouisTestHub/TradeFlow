'use client';

import { useEffect, useState } from 'react';

interface Certificate {
  id: string;
  certificateNumber: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  engineer: string;
  customer: string;
  address: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockCertificates: Certificate[] = Array.from({ length: 40 }, (_, i) => {
        const types = ['gas_safe_cp12', 'niceic_eicr', 'niceic_minor_works', 'fgas_install'];
        const typeLabels: Record<string, string> = {
          gas_safe_cp12: 'Gas Safe CP12',
          niceic_eicr: 'NICEIC EICR',
          niceic_minor_works: 'NICEIC Minor Works',
          fgas_install: 'F-Gas Install'
        };
        const type = types[i % types.length];
        const issueDate = new Date();
        issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 365));
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + (type.includes('gas') ? 1 : 5));
        
        return {
          id: String(i + 1),
          certificateNumber: `${type.includes('gas') ? 'CP12' : type.includes('eicr') ? 'EICR' : 'CERT'}-${String(100000 + i).padStart(8, '0')}`,
          type: typeLabels[type],
          issueDate: issueDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          status: new Date() < expiryDate ? 'valid' : 'expired',
          engineer: ['James Mitchell', 'Tom Harrison', 'Michael Davies'][i % 3],
          customer: ['Sarah Johnson', 'Thames Property', 'Emma Williams', 'ABC Ltd'][i % 4],
          address: `${10 + i} High Street, London`
        };
      });
      setCertificates(mockCertificates);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Certificates</h1>
        <p className="text-slate-500 mt-1">{certificates.length} certificates issued</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Certificate #</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Address</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Engineer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Issue Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Expiry Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {certificates.map(cert => {
              const daysUntilExpiry = Math.floor((new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const expiringSoon = daysUntilExpiry < 30 && daysUntilExpiry > 0;
              
              return (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-blue-600">{cert.certificateNumber}</td>
                  <td className="px-5 py-3 text-sm text-slate-700">{cert.type}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{cert.customer}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{cert.address}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{cert.engineer}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {new Date(cert.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {new Date(cert.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      cert.status === 'valid' && !expiringSoon ? 'bg-green-100 text-green-700' :
                      expiringSoon ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {cert.status === 'valid' && expiringSoon ? 'expiring soon' : cert.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
