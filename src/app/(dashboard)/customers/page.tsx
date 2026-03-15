'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  phone: string;
  postcode: string;
  propertyType: string;
  jobsCount: number;
  totalSpent: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const names = ['Sarah Johnson', 'Emma Williams', 'Thames Property Management', 'ABC Facilities', 
                    'Claire Davis', 'Lisa Taylor', 'Helen Brown', 'Premier Property Services', 'Rachel Smith',
                    'London Lettings Ltd', 'Karen Anderson', 'Michelle Roberts', 'Amanda Wilson', 'Laura Martin'];
      const mockCustomers = names.map((name, i) => ({
        id: String(i + 1),
        name,
        accountNumber: `CUST${String(1000 + i).padStart(6, '0')}`,
        phone: `020 7946 ${String(2000 + i).padStart(4, '0')}`,
        postcode: ['SW1A 1AA', 'E1 6AN', 'WC2N 5DU', 'N1 9AG', 'SE1 9SG'][i % 5],
        propertyType: i % 4 === 0 ? 'commercial' : (i % 5 === 0 ? 'landlord' : 'residential'),
        jobsCount: Math.floor(Math.random() * 50) + 1,
        totalSpent: Math.random() * 25000 + 500
      }));
      setCustomers(mockCustomers);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Customers</h1>
          <p className="text-slate-500 mt-1">{customers.length} total customers</p>
        </div>
        <Link href="/customers/new" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          + Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Account #</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Phone</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Postcode</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Jobs</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-mono text-blue-600">{customer.accountNumber}</td>
                <td className="px-5 py-3 text-sm font-medium text-slate-700">{customer.name}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{customer.phone}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{customer.postcode}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    customer.propertyType === 'commercial' ? 'bg-purple-100 text-purple-700' :
                    customer.propertyType === 'landlord' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {customer.propertyType}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-sm text-slate-700">{customer.jobsCount}</td>
                <td className="px-5 py-3 text-right text-sm font-medium text-slate-700">£{customer.totalSpent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
