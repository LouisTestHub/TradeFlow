'use client';

import { useEffect, useState } from 'react';

interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  assignedTo: string | null;
  motExpiry: string;
  taxExpiry: string;
  serviceDate: string;
  currentKm: number;
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockVehicles: Vehicle[] = [
        { id: '1', registration: 'VX65 ABC', make: 'Ford', model: 'Transit Custom', year: 2015, assignedTo: 'James Mitchell', motExpiry: '2026-06-15', taxExpiry: '2026-09-01', serviceDate: '2026-01-15', currentKm: 45230 },
        { id: '2', registration: 'VJ18 XYZ', make: 'Ford', model: 'Transit Custom', year: 2018, assignedTo: 'Tom Harrison', motExpiry: '2026-08-20', taxExpiry: '2026-10-01', serviceDate: '2025-12-10', currentKm: 38750 },
        { id: '3', registration: 'VK21 DEF', make: 'Ford', model: 'Transit Custom', year: 2021, assignedTo: 'Michael Davies', motExpiry: '2027-03-15', taxExpiry: '2026-11-01', serviceDate: '2026-02-20', currentKm: 22100 },
        { id: '4', registration: 'VL23 GHI', make: 'Ford', model: 'Transit', year: 2023, assignedTo: 'Chris Thompson', motExpiry: '2028-01-10', taxExpiry: '2027-01-01', serviceDate: '2026-01-05', currentKm: 15400 },
        { id: '5', registration: 'VM19 JKL', make: 'Vauxhall', model: 'Vivaro', year: 2019, assignedTo: 'David Wilson', motExpiry: '2026-11-30', taxExpiry: '2026-12-01', serviceDate: '2025-11-20', currentKm: 41000 },
        { id: '6', registration: 'VN20 MNO', make: 'Vauxhall', model: 'Vivaro', year: 2020, assignedTo: 'Robert Brown', motExpiry: '2027-04-22', taxExpiry: '2026-10-01', serviceDate: '2026-01-10', currentKm: 32500 },
        { id: '7', registration: 'VP22 PQR', make: 'Mercedes', model: 'Sprinter', year: 2022, assignedTo: null, motExpiry: '2027-09-10', taxExpiry: '2027-03-01', serviceDate: '2026-02-15', currentKm: 18200 },
        { id: '8', registration: 'VR23 STU', make: 'Mercedes', model: 'Vito', year: 2023, assignedTo: 'Paul Anderson', motExpiry: '2028-02-18', taxExpiry: '2027-02-01', serviceDate: '2026-01-25', currentKm: 12800 },
        { id: '9', registration: 'VS24 VWX', make: 'Ford', model: 'Transit Custom', year: 2024, assignedTo: 'Mark Taylor', motExpiry: '2029-03-05', taxExpiry: '2027-03-01', serviceDate: '2026-02-28', currentKm: 8500 },
        { id: '10', registration: 'VT24 YZA', make: 'Vauxhall', model: 'Combo', year: 2024, assignedTo: 'Steven Smith', motExpiry: '2029-04-12', taxExpiry: '2027-04-01', serviceDate: '2026-03-01', currentKm: 6200 },
      ];
      setVehicles(mockVehicles);
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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Fleet</h1>
          <p className="text-slate-500 mt-1">{vehicles.length} vehicles</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          + Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Registration</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Vehicle</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Year</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Assigned To</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">MOT Expiry</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Tax Expiry</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Last Service</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">Mileage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vehicles.map(vehicle => {
              const motDays = Math.floor((new Date(vehicle.motExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const motWarning = motDays < 30 && motDays > 0;
              const taxDays = Math.floor((new Date(vehicle.taxExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const taxWarning = taxDays < 30 && taxDays > 0;
              
              return (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono font-bold text-slate-800">{vehicle.registration}</td>
                  <td className="px-5 py-3 text-sm text-slate-700">{vehicle.make} {vehicle.model}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{vehicle.year}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{vehicle.assignedTo || '-'}</td>
                  <td className="px-5 py-3 text-sm">
                    <span className={motWarning ? 'text-yellow-600 font-medium' : 'text-slate-600'}>
                      {new Date(vehicle.motExpiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {motWarning && ' ⚠️'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm">
                    <span className={taxWarning ? 'text-yellow-600 font-medium' : 'text-slate-600'}>
                      {new Date(vehicle.taxExpiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {taxWarning && ' ⚠️'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {new Date(vehicle.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-slate-700">{vehicle.currentKm.toLocaleString()} km</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
