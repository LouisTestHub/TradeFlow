'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function PublicPaymentPage() {
  const params = useParams();
  const token = params.token as string;
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  // Mock invoice data (would come from API in production)
  const invoice = {
    number: 'INV000035',
    date: '14 March 2026',
    dueDate: '13 April 2026',
    company: 'TradeFlow Services Ltd',
    companyAddress: '45 High Street, London, SE1 9SG',
    companyPhone: '020 7946 0958',
    companyEmail: 'accounts@tradeflow-services.co.uk',
    customer: 'Sarah Johnson',
    customerAddress: '12 Oak Lane, London, SE15 3AB',
    items: [
      { description: 'Annual Boiler Service — Worcester Greenstar 30i', qty: 1, price: 95.00 },
      { description: 'Central Heating Inhibitor (Sentinel X100)', qty: 1, price: 12.50 },
      { description: 'Magnetic Filter Clean', qty: 1, price: 35.00 },
      { description: 'CO Detector Battery Replacement', qty: 2, price: 8.50 },
    ],
    subtotal: 159.50,
    vat: 31.90,
    total: 191.40,
    gasSafeNumber: '123456',
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 2500);
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">✅</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful</h1>
          <p className="text-slate-500 mb-4">Thank you for your payment of <strong>£{invoice.total.toFixed(2)}</strong></p>
          <div className="bg-green-50 rounded-xl p-4 text-left text-sm space-y-1 mb-6">
            <p><span className="text-slate-500">Invoice:</span> <span className="font-medium text-slate-700">{invoice.number}</span></p>
            <p><span className="text-slate-500">Amount:</span> <span className="font-medium text-slate-700">£{invoice.total.toFixed(2)}</span></p>
            <p><span className="text-slate-500">Reference:</span> <span className="font-medium text-slate-700">PAY-{token.slice(0, 8).toUpperCase()}</span></p>
            <p><span className="text-slate-500">Date:</span> <span className="font-medium text-slate-700">{new Date().toLocaleDateString('en-GB')}</span></p>
          </div>
          <p className="text-xs text-slate-400 mb-4">A receipt has been emailed to you</p>
          <button className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 min-h-[48px] w-full">
            📄 Download Receipt (PDF)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-bold text-lg text-primary">TradeFlow</span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">🔒 Secure Payment</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Invoice Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Invoice {invoice.number}</h1>
              <p className="text-sm text-slate-500">From {invoice.company}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">£{invoice.total.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Due {invoice.dueDate}</p>
            </div>
          </div>

          <hr className="border-gray-100 my-4" />

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">From</p>
              <p className="font-medium text-slate-700">{invoice.company}</p>
              <p className="text-slate-500">{invoice.companyAddress}</p>
              <p className="text-slate-500">{invoice.companyPhone}</p>
              <p className="text-xs text-slate-400 mt-1">Gas Safe: {invoice.gasSafeNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">To</p>
              <p className="font-medium text-slate-700">{invoice.customer}</p>
              <p className="text-slate-500">{invoice.customerAddress}</p>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-slate-500">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2 text-slate-700">{item.description}</td>
                  <td className="py-2 text-right text-slate-600">{item.qty}</td>
                  <td className="py-2 text-right text-slate-600">£{item.price.toFixed(2)}</td>
                  <td className="py-2 text-right font-medium text-slate-800">£{(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan={3} className="py-2 text-right text-slate-500">Subtotal</td>
                <td className="py-2 text-right font-medium">£{invoice.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-1 text-right text-slate-500">VAT (20%)</td>
                <td className="py-1 text-right">£{invoice.vat.toFixed(2)}</td>
              </tr>
              <tr className="font-bold text-lg">
                <td colSpan={3} className="py-2 text-right text-slate-800">Total</td>
                <td className="py-2 text-right text-slate-800">£{invoice.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <button className="text-sm text-primary hover:underline">📄 Download Invoice (PDF)</button>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Pay Now</h2>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${
                paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-slate-600 hover:bg-gray-50'
              }`}
            >
              💳 Pay by Card
            </button>
            <button
              onClick={() => setPaymentMethod('bank')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${
                paymentMethod === 'bank' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-slate-600 hover:bg-gray-50'
              }`}
            >
              🏦 Bank Transfer
            </button>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Card Number</label>
                <input type="text" placeholder="4242 4242 4242 4242" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Expiry</label>
                  <input type="text" placeholder="MM / YY" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">CVC</label>
                  <input type="text" placeholder="123" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Name on Card</label>
                <input type="text" placeholder="S Johnson" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
              </div>
              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full bg-primary text-white py-4 rounded-xl text-base font-semibold hover:bg-primary/90 transition-colors min-h-[56px] disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Processing payment...
                  </span>
                ) : (
                  `Pay £${invoice.total.toFixed(2)}`
                )}
              </button>
              <p className="text-center text-xs text-slate-400">Payments processed securely by Stripe</p>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-5 space-y-3">
                <h3 className="font-medium text-blue-800">Bank Transfer Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-blue-600">Account Name:</span></div>
                  <div className="font-medium text-blue-900">TradeFlow Services Ltd</div>
                  <div><span className="text-blue-600">Bank:</span></div>
                  <div className="font-medium text-blue-900">Barclays Business</div>
                  <div><span className="text-blue-600">Sort Code:</span></div>
                  <div className="font-medium text-blue-900">20-45-67</div>
                  <div><span className="text-blue-600">Account Number:</span></div>
                  <div className="font-medium text-blue-900">12345678</div>
                  <div><span className="text-blue-600">Reference:</span></div>
                  <div className="font-medium text-blue-900">{invoice.number}</div>
                  <div><span className="text-blue-600">Amount:</span></div>
                  <div className="font-medium text-blue-900">£{invoice.total.toFixed(2)}</div>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Please use the invoice number as your payment reference. Allow 1-2 business days for the payment to clear.
              </p>
            </div>
          )}
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-sm text-slate-500 mb-3">Or scan QR code to pay on your phone</p>
          <div className="w-32 h-32 bg-gray-100 rounded-xl mx-auto flex items-center justify-center">
            <span className="text-4xl">📱</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">tradeflow.app/pay/{token}</p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pb-8 space-y-1">
          <p>{invoice.company} · {invoice.companyAddress}</p>
          <p>{invoice.companyPhone} · {invoice.companyEmail}</p>
          <p>Gas Safe Registered: {invoice.gasSafeNumber}</p>
        </div>
      </div>
    </div>
  );
}
