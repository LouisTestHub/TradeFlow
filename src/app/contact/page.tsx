'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Header />
      <main className="py-20 lg:py-28 bg-[#FAFAF5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#1E293B] mb-6">
                Get in <span className="text-[#1B5E20]">Touch</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Questions about TradeFlow? Want a demo? We&apos;re here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#1B5E20] flex-shrink-0">📧</div>
                  <div>
                    <p className="font-semibold text-[#1E293B]">Email</p>
                    <a href="mailto:hello@fieldkeeper.co.uk" className="text-[#1B5E20] hover:underline">hello@fieldkeeper.co.uk</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#1B5E20] flex-shrink-0">📞</div>
                  <div>
                    <p className="font-semibold text-[#1E293B]">Phone</p>
                    <a href="tel:+442012345678" className="text-[#1B5E20] hover:underline">020 1234 5678</a>
                    <p className="text-sm text-slate-500">Monday–Friday, 9am–5pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#1B5E20] flex-shrink-0">🗓️</div>
                  <div>
                    <p className="font-semibold text-[#1E293B]">Prefer a call?</p>
                    <p className="text-slate-600">Book a free 15-minute demo and we&apos;ll walk you through TradeFlow.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {status === 'success' ? (
                <div className="bg-[#E8F5E9] rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h2 className="text-xl font-bold text-[#1B5E20] font-[var(--font-dm-sans)] mb-2">Message Sent!</h2>
                  <p className="text-slate-600">We&apos;ll get back to you within 24 hours. Usually much sooner.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                    <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 outline-none text-base min-h-[48px]" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                    <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 outline-none text-base min-h-[48px]" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                    <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 outline-none text-base min-h-[48px]" />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                    <input id="company" type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 outline-none text-base min-h-[48px]" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                    <textarea id="message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 outline-none text-base resize-none" />
                  </div>
                  <button type="submit" disabled={status === 'loading'} className="w-full py-3 bg-[#1B5E20] text-white font-semibold rounded-xl hover:bg-[#145218] transition-colors min-h-[48px] disabled:opacity-50">
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-600 text-sm text-center">Something went wrong. Please try again or email us directly.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
