'use client';

import { useState } from 'react';

const JOB_TEMPLATES = [
  {
    id: 'boiler-install',
    name: 'Boiler Installation',
    category: 'Plumbing & Heating',
    items: [
      { description: 'Worcester Bosch Greenstar 30CDi Combi Boiler', qty: 1, unitPrice: 950 },
      { description: 'Installation Labour (2 days)', qty: 16, unitPrice: 45 },
      { description: 'Copper Pipework & Fittings', qty: 1, unitPrice: 120 },
      { description: 'Magnetic Filter (Magnaclean)', qty: 1, unitPrice: 85 },
      { description: 'Flue Kit & Supports', qty: 1, unitPrice: 65 },
      { description: 'Gas Safety Certificate', qty: 1, unitPrice: 0 },
    ],
  },
  {
    id: 'rewire-2bed',
    name: 'Full Rewire - 2 Bed House',
    category: 'Electrical',
    items: [
      { description: 'Consumer Unit (18 way)', qty: 1, unitPrice: 180 },
      { description: 'Electrical Installation Labour (5 days)', qty: 40, unitPrice: 50 },
      { description: 'Cable (Twin & Earth 2.5mm²)', qty: 200, unitPrice: 0.8 },
      { description: 'Sockets & Switches (White)', qty: 30, unitPrice: 4 },
      { description: 'Light Fittings (Basic)', qty: 8, unitPrice: 15 },
      { description: 'EICR Testing & Certification', qty: 1, unitPrice: 150 },
    ],
  },
  {
    id: 'bathroom-fit',
    name: 'Bathroom Suite Installation',
    category: 'Plumbing',
    items: [
      { description: 'Bathroom Suite (Bath, Basin, Toilet)', qty: 1, unitPrice: 650 },
      { description: 'Installation Labour (3 days)', qty: 24, unitPrice: 45 },
      { description: 'Tiling (6m²)', qty: 6, unitPrice: 35 },
      { description: 'Plumbing Materials & Fittings', qty: 1, unitPrice: 180 },
      { description: 'Waste & Drainage', qty: 1, unitPrice: 95 },
    ],
  },
];

export default function QuoteBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [quoteItems, setQuoteItems] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');

  const loadTemplate = (templateId: string) => {
    const template = JOB_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setQuoteItems(template.items);
      setSelectedTemplate(templateId);
    }
  };

  const subtotal = quoteItems.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Automated Quote Builder</h1>
          <p className="text-sm text-slate-500 mt-1">Generate professional quotes in seconds</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
            Save Draft
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
            📄 Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Templates</h3>
            <div className="space-y-2">
              {JOB_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 hover:border-primary transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-800">{template.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{template.category}</div>
                </button>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              + Create Custom Quote
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg border p-4 mt-4">
            <h3 className="font-semibold text-slate-800 mb-4">Customer Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Property Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Valid Until</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Quote Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-slate-800">Quote Items</h3>
            </div>

            {quoteItems.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Items Added</h3>
                <p className="text-sm text-slate-500">
                  Select a template from the left or add custom items
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">
                          Description
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase w-24">
                          Qty
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase w-32">
                          Unit Price
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase w-32">
                          Total
                        </th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-slate-800">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-right">{item.qty}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-right">
                            £{item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800 text-right">
                            £{(item.qty * item.unitPrice).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-red-600 hover:text-red-800 text-sm">✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="max-w-md ml-auto space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-semibold text-slate-800">£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">VAT (20%):</span>
                      <span className="font-semibold text-slate-800">£{vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg border-t pt-2">
                      <span className="font-semibold text-slate-800">Total:</span>
                      <span className="font-bold text-primary">£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t">
                  <button className="w-full px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                    + Add Line Item
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
