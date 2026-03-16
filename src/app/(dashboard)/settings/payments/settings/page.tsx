'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PaymentSettingsPage() {
  const [stripeConnected, setStripeConnected] = useState(false);
  const [autoReceipt, setAutoReceipt] = useState(true);
  const [lateFees, setLateFees] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/payments" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Payment Settings</h1>
          <p className="text-slate-500 mt-1">Configure payment processing and billing preferences</p>
        </div>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl shrink-0">💳</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-slate-800">Stripe Connect</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stripeConnected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {stripeConnected ? '🟢 Connected' : '⬜ Not connected'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-4">Accept card payments directly from invoices and payment links</p>

            {stripeConnected ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Account ID:</span> <span className="font-medium text-slate-700 ml-2">acct_1Abc2DEfGhIjKL</span></div>
                  <div><span className="text-slate-500">Status:</span> <span className="font-medium text-green-600 ml-2">Active</span></div>
                  <div><span className="text-slate-500">Payouts:</span> <span className="font-medium text-slate-700 ml-2">Next: £4,230 (Tomorrow)</span></div>
                  <div><span className="text-slate-500">Fee rate:</span> <span className="font-medium text-slate-700 ml-2">1.4% + 20p (UK cards)</span></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="text-sm text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/5 min-h-[44px]">
                    View Stripe Dashboard
                  </button>
                  <button
                    onClick={() => setStripeConnected(false)}
                    className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 min-h-[44px]"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  {['Accept Visa, Mastercard, Amex', 'Automatic payouts to your bank', 'PCI DSS compliant', '1.4% + 20p per transaction (UK cards)'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {item}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStripeConnected(true)}
                  className="bg-[#635BFF] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#5349E0] min-h-[48px]"
                >
                  Connect with Stripe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-slate-800">Accepted Payment Methods</h3>
        <div className="space-y-3">
          {[
            { method: 'Card Payments', desc: 'Via Stripe (requires connection above)', enabled: stripeConnected, icon: '💳' },
            { method: 'Bank Transfer', desc: 'Show bank details on invoices', enabled: true, icon: '🏦' },
            { method: 'Cash', desc: 'Record cash payments manually', enabled: true, icon: '💵' },
            { method: 'Cheque', desc: 'Record cheque payments', enabled: true, icon: '📝' },
            { method: 'Payment Links', desc: 'Shareable payment links via SMS/email', enabled: true, icon: '🔗' },
          ].map((item) => (
            <label key={item.method} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={item.enabled} readOnly className="w-5 h-5 rounded border-gray-300 text-primary" />
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-slate-700">{item.method}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-slate-800">🏦 Bank Details (shown on invoices)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Account Name</label>
            <input type="text" defaultValue="TradeFlow Services Ltd" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Bank Name</label>
            <input type="text" defaultValue="Barclays Business" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Sort Code</label>
            <input type="text" defaultValue="20-45-67" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Account Number</label>
            <input type="text" defaultValue="12345678" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-slate-800">📋 Default Payment Terms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Default Terms</label>
            <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]">
              <option>Due on receipt</option>
              <option>Net 7 days</option>
              <option>Net 14 days</option>
              <option selected>Net 30 days</option>
              <option>Net 60 days</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Overdue Reminder</label>
            <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]">
              <option>None</option>
              <option selected>3 days after due</option>
              <option>7 days after due</option>
              <option>14 days after due</option>
            </select>
          </div>
        </div>
      </div>

      {/* Late Fees */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">⏰ Late Payment Fees</h3>
            <p className="text-sm text-slate-500">Automatically apply fees to overdue invoices</p>
          </div>
          <button
            onClick={() => setLateFees(!lateFees)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lateFees ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lateFees ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        {lateFees && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fee Type</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]">
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fee Amount</label>
              <input type="number" defaultValue="2" step="0.5" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Grace Period (days)</label>
              <input type="number" defaultValue="7" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            </div>
          </div>
        )}
      </div>

      {/* Auto Receipt */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">🧾 Auto-Receipt</h3>
            <p className="text-sm text-slate-500">Automatically email receipts when payments are received</p>
          </div>
          <button
            onClick={() => setAutoReceipt(!autoReceipt)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoReceipt ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoReceipt ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
        Save Payment Settings
      </button>
    </div>
  );
}
