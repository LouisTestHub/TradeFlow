'use client';

import { useState } from 'react';

const DEMO_STOCK = [
  {
    id: '1',
    partNumber: 'P-1045',
    description: '22mm Copper Elbow',
    category: 'plumbing',
    supplier: 'Plumb Center',
    unitCost: 2.5,
    retailPrice: 5.0,
    stockLevel: 45,
    reorderLevel: 20,
    location: 'Warehouse A',
  },
  {
    id: '2',
    partNumber: 'E-2034',
    description: '13A Socket - White',
    category: 'electrical',
    supplier: 'CEF',
    unitCost: 3.2,
    retailPrice: 6.5,
    stockLevel: 12,
    reorderLevel: 15,
    location: 'Van 1',
  },
  {
    id: '3',
    partNumber: 'H-3021',
    description: 'Radiator Valve TRV',
    category: 'hvac',
    supplier: 'City Plumbing',
    unitCost: 12.5,
    retailPrice: 25.0,
    stockLevel: 8,
    reorderLevel: 10,
    location: 'Warehouse A',
  },
  {
    id: '4',
    partNumber: 'P-1089',
    description: 'Boiler Filter Magnaclean',
    category: 'plumbing',
    supplier: 'Plumb Center',
    unitCost: 45.0,
    retailPrice: 90.0,
    stockLevel: 3,
    reorderLevel: 5,
    location: 'Warehouse B',
  },
  {
    id: '5',
    partNumber: 'E-2101',
    description: 'MCB 32A Type B',
    category: 'electrical',
    supplier: 'Rexel',
    unitCost: 8.5,
    retailPrice: 17.0,
    stockLevel: 22,
    reorderLevel: 10,
    location: 'Van 2',
  },
];

const CATEGORIES = ['all', 'plumbing', 'electrical', 'hvac', 'general'];
const LOCATIONS = ['all', 'Warehouse A', 'Warehouse B', 'Van 1', 'Van 2'];

export default function StockPage() {
  const [filter, setFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

  const filteredStock = DEMO_STOCK.filter((item) => {
    const categoryMatch = filter === 'all' || item.category === filter;
    const locationMatch = locationFilter === 'all' || item.location === locationFilter;
    const lowStockMatch = !showLowStock || item.stockLevel <= item.reorderLevel;
    return categoryMatch && locationMatch && lowStockMatch;
  });

  const lowStockCount = DEMO_STOCK.filter((item) => item.stockLevel <= item.reorderLevel).length;
  const totalValue = DEMO_STOCK.reduce((acc, item) => acc + item.unitCost * item.stockLevel, 0);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Parts & Stock Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track inventory, reorder alerts, and van stock</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
            📥 Stock Movement
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
            + Add Part
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Total Parts</div>
          <div className="text-2xl font-bold text-slate-800">{DEMO_STOCK.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Low Stock Items</div>
          <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Total Stock Value</div>
          <div className="text-2xl font-bold text-green-600">£{totalValue.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Locations</div>
          <div className="text-2xl font-bold text-slate-800">{LOCATIONS.length - 1}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Category</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'all' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                showLowStock ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-slate-600'
              }`}
            >
              {showLowStock ? '✓' : ''} Low Stock Only
            </button>
          </div>

          <div className="ml-auto text-sm text-slate-600">
            Showing {filteredStock.length} of {DEMO_STOCK.length} parts
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Part #</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                Description
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                Category
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                Supplier
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                Unit Cost
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Stock</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                Location
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((item) => {
              const isLowStock = item.stockLevel <= item.reorderLevel;
              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-700">{item.partNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.supplier}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 text-right">£{item.unitCost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.stockLevel}
                    </span>
                    {isLowStock && (
                      <div className="text-xs text-red-600 mt-1">⚠️ Reorder at {item.reorderLevel}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.location}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-primary hover:underline">Edit</button>
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
