'use client';

import { useState } from 'react';

export default function CallbackRequestPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/portal" className="text-2xl">
              ← 🔧
            </a>
            <span className="font-bold text-xl text-primary">TradeFlow</span>
            <span className="text-sm text-slate-500 ml-2">Request a Callback</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {submitted ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Received!</h2>
            <p className="text-slate-600 mb-6">
              We&apos;ve received your callback request. Our team will contact you shortly.
            </p>
            <a
              href="/portal"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Back to Dashboard
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Request a Callback</h1>
            <p className="text-slate-600 mb-6">
              Fill in the form below and we&apos;ll call you back as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="07XXX XXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Best Time to Call
                </label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Morning (9am - 12pm)</option>
                  <option>Afternoon (12pm - 5pm)</option>
                  <option>Evening (5pm - 7pm)</option>
                  <option>Anytime</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What can we help you with?
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell us what you need..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                >
                  Request Callback
                </button>
                <a
                  href="/portal"
                  className="px-6 py-3 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Cancel
                </a>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
