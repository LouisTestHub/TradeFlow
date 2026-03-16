'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  price: number;
  unit: string;
  inStock: boolean;
  favourite: boolean;
  brand: string;
}

const categories = ['All', 'Copper & Fittings', 'Boilers & Parts', 'Electrical', 'Tools', 'Sanitaryware', 'Radiators', 'Flue & Ventilation', 'Cables & Wiring', 'Safety & PPE'];

function generateProducts(): Product[] {
  const products: Omit<Product, 'id'>[] = [
    // Copper & Fittings
    { name: '15mm Copper Pipe (3m length)', sku: 'CU15-3M', category: 'Copper & Fittings', supplier: 'City Plumbing', price: 12.45, unit: 'each', inStock: true, favourite: true, brand: 'Yorkshire' },
    { name: '22mm Copper Pipe (3m length)', sku: 'CU22-3M', category: 'Copper & Fittings', supplier: 'City Plumbing', price: 18.90, unit: 'each', inStock: true, favourite: true, brand: 'Yorkshire' },
    { name: '28mm Copper Pipe (3m length)', sku: 'CU28-3M', category: 'Copper & Fittings', supplier: 'Wolseley', price: 28.50, unit: 'each', inStock: true, favourite: false, brand: 'Yorkshire' },
    { name: '15mm Compression Elbow', sku: 'CE15-90', category: 'Copper & Fittings', supplier: 'City Plumbing', price: 2.85, unit: 'each', inStock: true, favourite: false, brand: 'Compression' },
    { name: '22mm Compression Elbow', sku: 'CE22-90', category: 'Copper & Fittings', supplier: 'City Plumbing', price: 4.20, unit: 'each', inStock: true, favourite: false, brand: 'Compression' },
    { name: '15mm Solder Ring Elbow', sku: 'SR15-90', category: 'Copper & Fittings', supplier: 'Plumb Center', price: 1.45, unit: 'each', inStock: true, favourite: false, brand: 'Yorkshire' },
    { name: '22mm Solder Ring Elbow', sku: 'SR22-90', category: 'Copper & Fittings', supplier: 'Plumb Center', price: 2.10, unit: 'each', inStock: true, favourite: false, brand: 'Yorkshire' },
    { name: '15mm x 10mm Reducer', sku: 'RED15-10', category: 'Copper & Fittings', supplier: 'City Plumbing', price: 3.15, unit: 'each', inStock: true, favourite: false, brand: 'Compression' },
    { name: '22mm Full Bore Gate Valve', sku: 'GV22-FB', category: 'Copper & Fittings', supplier: 'Wolseley', price: 12.80, unit: 'each', inStock: true, favourite: true, brand: 'Pegler' },
    { name: '15mm Isolating Valve (pair)', sku: 'IV15-PR', category: 'Copper & Fittings', supplier: 'Screwfix', price: 4.99, unit: 'pair', inStock: true, favourite: false, brand: 'JG Speedfit' },
    { name: '22mm Flexi Tap Connector 300mm', sku: 'FTC22-300', category: 'Copper & Fittings', supplier: 'Screwfix', price: 3.49, unit: 'each', inStock: true, favourite: false, brand: 'Fluidmaster' },
    { name: '15mm Chrome Radiator Valve (pair)', sku: 'RV15-CHR', category: 'Copper & Fittings', supplier: 'City Plumbing', price: 8.50, unit: 'pair', inStock: true, favourite: false, brand: 'Drayton' },
    { name: 'PTFE Tape 12mm x 12m', sku: 'PTFE-12', category: 'Copper & Fittings', supplier: 'Screwfix', price: 0.79, unit: 'roll', inStock: true, favourite: true, brand: 'Generic' },
    { name: 'Soldering Flux 100g', sku: 'FLUX-100', category: 'Copper & Fittings', supplier: 'Screwfix', price: 3.29, unit: 'each', inStock: true, favourite: false, brand: 'Frys' },
    { name: 'Lead-Free Solder Wire 250g', sku: 'SLDR-250', category: 'Copper & Fittings', supplier: 'CEF', price: 18.50, unit: 'each', inStock: true, favourite: false, brand: 'Sievert' },
    
    // Boilers & Parts
    { name: 'Worcester Greenstar 30i System', sku: 'WB-GS30i', category: 'Boilers & Parts', supplier: 'City Plumbing', price: 1245.00, unit: 'each', inStock: true, favourite: true, brand: 'Worcester Bosch' },
    { name: 'Worcester Greenstar 25i Combi', sku: 'WB-GS25C', category: 'Boilers & Parts', supplier: 'Wolseley', price: 1089.00, unit: 'each', inStock: true, favourite: true, brand: 'Worcester Bosch' },
    { name: 'Vaillant ecoTEC Plus 832', sku: 'VL-ETP832', category: 'Boilers & Parts', supplier: 'Plumb Center', price: 1150.00, unit: 'each', inStock: true, favourite: false, brand: 'Vaillant' },
    { name: 'Ideal Logic+ 30 Combi', sku: 'ID-LP30C', category: 'Boilers & Parts', supplier: 'City Plumbing', price: 875.00, unit: 'each', inStock: true, favourite: false, brand: 'Ideal' },
    { name: 'Baxi 800 Combi 30', sku: 'BX-800C30', category: 'Boilers & Parts', supplier: 'Plumb Center', price: 920.00, unit: 'each', inStock: false, favourite: false, brand: 'Baxi' },
    { name: 'Megaflo Eco 170L Unvented Cylinder', sku: 'MF-E170', category: 'Boilers & Parts', supplier: 'City Plumbing', price: 785.00, unit: 'each', inStock: true, favourite: true, brand: 'Heatrae Sadia' },
    { name: 'Megaflo Eco 210L Unvented Cylinder', sku: 'MF-E210', category: 'Boilers & Parts', supplier: 'Wolseley', price: 895.00, unit: 'each', inStock: true, favourite: false, brand: 'Heatrae Sadia' },
    { name: 'Grundfos UPS2 15-50/60 Pump', sku: 'GF-UPS2', category: 'Boilers & Parts', supplier: 'Plumb Center', price: 125.00, unit: 'each', inStock: true, favourite: true, brand: 'Grundfos' },
    { name: 'Honeywell V4043H 2-Port Valve', sku: 'HW-V4043', category: 'Boilers & Parts', supplier: 'City Plumbing', price: 42.50, unit: 'each', inStock: true, favourite: false, brand: 'Honeywell' },
    { name: 'Nest Thermostat 3rd Gen', sku: 'NEST-3G', category: 'Boilers & Parts', supplier: 'Screwfix', price: 199.99, unit: 'each', inStock: true, favourite: false, brand: 'Google Nest' },
    { name: 'Honeywell T6360 Room Thermostat', sku: 'HW-T6360', category: 'Boilers & Parts', supplier: 'City Plumbing', price: 18.50, unit: 'each', inStock: true, favourite: false, brand: 'Honeywell' },
    { name: 'Central Heating Inhibitor 500ml', sku: 'CHI-500', category: 'Boilers & Parts', supplier: 'Screwfix', price: 8.99, unit: 'each', inStock: true, favourite: true, brand: 'Sentinel X100' },
    { name: 'Magnetic System Filter 22mm', sku: 'MSF-22', category: 'Boilers & Parts', supplier: 'City Plumbing', price: 75.00, unit: 'each', inStock: true, favourite: true, brand: 'MagnaClean' },
    { name: 'Expansion Vessel 12L', sku: 'EV-12L', category: 'Boilers & Parts', supplier: 'Plumb Center', price: 38.50, unit: 'each', inStock: true, favourite: false, brand: 'Flamco' },
    { name: 'PRV 3 Bar Pressure Relief Valve', sku: 'PRV-3BAR', category: 'Boilers & Parts', supplier: 'City Plumbing', price: 14.20, unit: 'each', inStock: true, favourite: false, brand: 'Caleffi' },
    
    // Electrical
    { name: '2.5mm² T&E Cable (100m)', sku: 'TE25-100', category: 'Electrical', supplier: 'CEF', price: 89.50, unit: 'drum', inStock: true, favourite: true, brand: 'Prysmian' },
    { name: '1.5mm² T&E Cable (100m)', sku: 'TE15-100', category: 'Electrical', supplier: 'CEF', price: 62.00, unit: 'drum', inStock: true, favourite: true, brand: 'Prysmian' },
    { name: '6mm² T&E Cable (50m)', sku: 'TE60-50', category: 'Electrical', supplier: 'CEF', price: 98.00, unit: 'drum', inStock: true, favourite: false, brand: 'Prysmian' },
    { name: '10mm² T&E Cable (25m)', sku: 'TE100-25', category: 'Electrical', supplier: 'Edmundson Electrical', price: 78.50, unit: 'drum', inStock: true, favourite: false, brand: 'Prysmian' },
    { name: '18th Edition Consumer Unit 10-Way', sku: 'CU-10W', category: 'Electrical', supplier: 'CEF', price: 68.50, unit: 'each', inStock: true, favourite: true, brand: 'Hager' },
    { name: '18th Edition Consumer Unit 18-Way', sku: 'CU-18W', category: 'Electrical', supplier: 'CEF', price: 125.00, unit: 'each', inStock: true, favourite: false, brand: 'Hager' },
    { name: 'Type B MCB 32A', sku: 'MCB-B32', category: 'Electrical', supplier: 'CEF', price: 4.85, unit: 'each', inStock: true, favourite: false, brand: 'Hager' },
    { name: 'Type B MCB 20A', sku: 'MCB-B20', category: 'Electrical', supplier: 'CEF', price: 4.50, unit: 'each', inStock: true, favourite: false, brand: 'Hager' },
    { name: 'Type A RCBO 32A 30mA', sku: 'RCBO-A32', category: 'Electrical', supplier: 'CEF', price: 28.50, unit: 'each', inStock: true, favourite: true, brand: 'Hager' },
    { name: '63A Type A RCD', sku: 'RCD-A63', category: 'Electrical', supplier: 'Edmundson Electrical', price: 32.00, unit: 'each', inStock: true, favourite: false, brand: 'Hager' },
    { name: 'LED Downlight 5W IP65 (10 pack)', sku: 'LED-DL10', category: 'Electrical', supplier: 'Screwfix', price: 34.99, unit: 'pack', inStock: true, favourite: true, brand: 'LAP' },
    { name: 'Metal Back Box 35mm Single', sku: 'BB-35S', category: 'Electrical', supplier: 'Screwfix', price: 0.89, unit: 'each', inStock: true, favourite: false, brand: 'BG' },
    { name: 'Double Socket 13A Chrome', sku: 'DS-13CHR', category: 'Electrical', supplier: 'Screwfix', price: 5.99, unit: 'each', inStock: true, favourite: false, brand: 'BG Nexus' },
    { name: 'Light Switch 1G 2W Chrome', sku: 'LS-1G2W', category: 'Electrical', supplier: 'Screwfix', price: 4.49, unit: 'each', inStock: true, favourite: false, brand: 'BG Nexus' },
    { name: 'Smoke Alarm Mains Wired', sku: 'SA-MAINS', category: 'Electrical', supplier: 'CEF', price: 14.50, unit: 'each', inStock: true, favourite: false, brand: 'Aico' },
    
    // Sanitaryware
    { name: 'Close-Coupled WC Pan & Cistern', sku: 'WC-CC1', category: 'Sanitaryware', supplier: 'City Plumbing', price: 129.00, unit: 'set', inStock: true, favourite: false, brand: 'Ideal Standard' },
    { name: 'Full Pedestal Basin 550mm', sku: 'FPB-550', category: 'Sanitaryware', supplier: 'City Plumbing', price: 65.00, unit: 'each', inStock: true, favourite: false, brand: 'Ideal Standard' },
    { name: 'Bath Single Ended 1700x700', sku: 'BSE-1770', category: 'Sanitaryware', supplier: 'Wolseley', price: 89.00, unit: 'each', inStock: true, favourite: false, brand: 'Ideal Standard' },
    { name: 'Basin Mixer Tap Chrome', sku: 'BMT-CHR', category: 'Sanitaryware', supplier: 'Screwfix', price: 39.99, unit: 'each', inStock: true, favourite: false, brand: 'Bristan' },
    { name: 'Bath Shower Mixer Chrome', sku: 'BSM-CHR', category: 'Sanitaryware', supplier: 'Plumb Center', price: 65.00, unit: 'each', inStock: true, favourite: false, brand: 'Bristan' },
    { name: 'Thermostatic Shower Bar Valve', sku: 'TSV-BAR', category: 'Sanitaryware', supplier: 'City Plumbing', price: 85.00, unit: 'each', inStock: true, favourite: true, brand: 'Mira' },
    
    // Radiators
    { name: 'Type 22 Radiator 600x1000mm', sku: 'RAD-22-610', category: 'Radiators', supplier: 'City Plumbing', price: 68.50, unit: 'each', inStock: true, favourite: true, brand: 'Stelrad' },
    { name: 'Type 22 Radiator 600x1400mm', sku: 'RAD-22-614', category: 'Radiators', supplier: 'City Plumbing', price: 95.00, unit: 'each', inStock: true, favourite: false, brand: 'Stelrad' },
    { name: 'Type 11 Radiator 600x800mm', sku: 'RAD-11-608', category: 'Radiators', supplier: 'Wolseley', price: 42.00, unit: 'each', inStock: true, favourite: false, brand: 'Stelrad' },
    { name: 'Towel Radiator 1200x500 Chrome', sku: 'TR-1250-CHR', category: 'Radiators', supplier: 'Screwfix', price: 49.99, unit: 'each', inStock: true, favourite: false, brand: 'Flomasta' },
    { name: 'TRV Head 15mm Angled (pair)', sku: 'TRV-15A', category: 'Radiators', supplier: 'City Plumbing', price: 12.50, unit: 'pair', inStock: true, favourite: true, brand: 'Drayton' },
    
    // Tools
    { name: 'Pipe Cutter 15mm & 22mm', sku: 'PC-1522', category: 'Tools', supplier: 'Screwfix', price: 12.99, unit: 'each', inStock: true, favourite: true, brand: 'Rothenberger' },
    { name: 'Pipe Slice 15mm', sku: 'PS-15', category: 'Tools', supplier: 'Screwfix', price: 8.49, unit: 'each', inStock: true, favourite: false, brand: 'Rothenberger' },
    { name: 'Adjustable Wrench Set 3pc', sku: 'AW-3PC', category: 'Tools', supplier: 'Screwfix', price: 14.99, unit: 'set', inStock: true, favourite: false, brand: 'Bahco' },
    { name: 'SDS Plus Drill Bit Set 7pc', sku: 'SDS-7PC', category: 'Tools', supplier: 'Screwfix', price: 19.99, unit: 'set', inStock: true, favourite: false, brand: 'Bosch' },
    { name: 'Multi-Tool Blade Set 10pc', sku: 'MTB-10', category: 'Tools', supplier: 'Toolstation', price: 15.99, unit: 'set', inStock: true, favourite: false, brand: 'DeWalt' },
    { name: 'Flue Gas Analyser', sku: 'FGA-PRO', category: 'Tools', supplier: 'CEF', price: 425.00, unit: 'each', inStock: true, favourite: false, brand: 'Kane' },
    { name: 'Voltage Tester Pen', sku: 'VT-PEN', category: 'Tools', supplier: 'CEF', price: 24.99, unit: 'each', inStock: true, favourite: true, brand: 'Fluke' },
    
    // Flue & Ventilation  
    { name: 'Horizontal Flue Kit 60/100mm', sku: 'HFK-60100', category: 'Flue & Ventilation', supplier: 'City Plumbing', price: 85.00, unit: 'each', inStock: true, favourite: true, brand: 'Worcester' },
    { name: 'Flue Extension 500mm', sku: 'FEX-500', category: 'Flue & Ventilation', supplier: 'City Plumbing', price: 32.00, unit: 'each', inStock: true, favourite: false, brand: 'Worcester' },
    { name: 'Air Brick Vent 225x75mm', sku: 'ABV-22575', category: 'Flue & Ventilation', supplier: 'Travis Perkins', price: 4.50, unit: 'each', inStock: true, favourite: false, brand: 'Timloc' },
    { name: 'Ducting 100mm x 3m', sku: 'DUC-100-3', category: 'Flue & Ventilation', supplier: 'Screwfix', price: 6.99, unit: 'each', inStock: true, favourite: false, brand: 'Manrose' },
    
    // Safety & PPE
    { name: 'Gas Leak Detector Spray 400ml', sku: 'GLD-400', category: 'Safety & PPE', supplier: 'CEF', price: 5.99, unit: 'each', inStock: true, favourite: true, brand: 'Rocol' },
    { name: 'Safety Goggles Anti-Fog', sku: 'SG-AF', category: 'Safety & PPE', supplier: 'Screwfix', price: 3.49, unit: 'each', inStock: true, favourite: false, brand: 'DeWalt' },
    { name: 'Ear Defenders SNR 30dB', sku: 'ED-30', category: 'Safety & PPE', supplier: 'Screwfix', price: 7.99, unit: 'each', inStock: true, favourite: false, brand: '3M' },
    { name: 'Work Gloves Nitrile (10 pack)', sku: 'WG-N10', category: 'Safety & PPE', supplier: 'Screwfix', price: 5.99, unit: 'pack', inStock: true, favourite: false, brand: 'Showa' },
    { name: 'Knee Pads Professional', sku: 'KP-PRO', category: 'Safety & PPE', supplier: 'Screwfix', price: 14.99, unit: 'pair', inStock: true, favourite: false, brand: 'Redbacks' },
    { name: 'First Aid Kit 50 Person', sku: 'FAK-50', category: 'Safety & PPE', supplier: 'Screwfix', price: 24.99, unit: 'each', inStock: true, favourite: false, brand: 'St John' },
    
    // Cables & Wiring
    { name: '3-Core Flex 1.5mm² (10m)', sku: 'CF15-10', category: 'Cables & Wiring', supplier: 'CEF', price: 15.50, unit: 'each', inStock: true, favourite: false, brand: 'Prysmian' },
    { name: 'SWA Cable 4mm² 3-Core (25m)', sku: 'SWA4-25', category: 'Cables & Wiring', supplier: 'CEF', price: 145.00, unit: 'drum', inStock: true, favourite: false, brand: 'Prysmian' },
    { name: 'Cat6 Cable 305m Box', sku: 'CAT6-305', category: 'Cables & Wiring', supplier: 'CEF', price: 125.00, unit: 'box', inStock: true, favourite: false, brand: 'Excel' },
    { name: 'Wago Connectors 5-Way (50 pack)', sku: 'WAGO-5-50', category: 'Cables & Wiring', supplier: 'CEF', price: 22.50, unit: 'pack', inStock: true, favourite: true, brand: 'Wago' },
    { name: 'Cable Clips White 1.5mm (100)', sku: 'CC-W15-100', category: 'Cables & Wiring', supplier: 'Screwfix', price: 1.99, unit: 'pack', inStock: true, favourite: false, brand: 'Tower' },
    { name: 'Trunking 25x16mm (3m)', sku: 'TR-2516-3', category: 'Cables & Wiring', supplier: 'Screwfix', price: 3.49, unit: 'each', inStock: true, favourite: false, brand: 'Tower' },
  ];

  return products.map((p, i) => ({ ...p, id: String(i + 1) }));
}

export default function SupplierCataloguePage() {
  const [products] = useState(generateProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState<Set<string>>(() => new Set(products.filter(p => p.favourite).map(p => p.id)));

  const allSuppliers = ['All', ...Array.from(new Set(products.map(p => p.supplier)))];

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All' && p.category !== category) return false;
    if (supplierFilter !== 'All' && p.supplier !== supplierFilter) return false;
    if (showFavourites && !favourites.has(p.id)) return false;
    return true;
  });

  const toggleFavourite = (id: string) => {
    const next = new Set(favourites);
    if (next.has(id)) next.delete(id); else next.add(id);
    setFavourites(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/suppliers" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Product Catalogue</h1>
          <p className="text-slate-500 mt-1">{products.length} products across {allSuppliers.length - 1} suppliers</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]"
        />
        <div className="flex gap-3 flex-wrap">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm min-h-[44px]"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm min-h-[44px]"
          >
            {allSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setShowFavourites(!showFavourites)}
            className={`px-4 py-2 rounded-xl text-sm font-medium min-h-[44px] ${
              showFavourites ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            ⭐ Favourites ({favourites.size})
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">{filtered.length} products found</p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, 30).map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 line-clamp-2">{product.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{product.sku} · {product.brand}</p>
              </div>
              <button
                onClick={() => toggleFavourite(product.id)}
                className="text-lg ml-2 hover:scale-110 transition-transform"
              >
                {favourites.has(product.id) ? '⭐' : '☆'}
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{product.category}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{product.supplier}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-bold text-slate-800">£{product.price.toFixed(2)}</p>
                <p className="text-xs text-slate-400">per {product.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? '✓ In stock' : '✗ Out of stock'}
                </span>
                <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90">
                  Add to PO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 30 && (
        <p className="text-center text-sm text-slate-500">Showing 30 of {filtered.length} products. Refine your search to see more.</p>
      )}
    </div>
  );
}
