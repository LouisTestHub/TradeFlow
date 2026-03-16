'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReminderSettingsPage() {
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [defaultSequence, setDefaultSequence] = useState('30, 14, 7, 1');
  const [optOutMessage, setOptOutMessage] = useState('Reply STOP to opt out of reminders');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/reminders" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Reminder Settings</h1>
          <p className="text-slate-500 mt-1">Configure SMS, email and scheduling preferences</p>
        </div>
      </div>

      {/* SMS Configuration */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">📱 SMS Reminders</h3>
            <p className="text-sm text-slate-500">Send reminder texts via SMS</p>
          </div>
          <button
            onClick={() => setSmsEnabled(!smsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${smsEnabled ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        
        {smsEnabled && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">SMS Provider</label>
              <select className="w-full max-w-sm rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]">
                <option>Twilio (Recommended)</option>
                <option>MessageBird</option>
                <option>Vonage</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">API Key / Account SID</label>
                <input type="password" defaultValue="●●●●●●●●●●●●" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Auth Token</label>
                <input type="password" defaultValue="●●●●●●●●●●●●" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">From Number</label>
              <input type="tel" defaultValue="+44 7700 900 001" className="w-full max-w-sm rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Quiet Hours (no SMS)</label>
              <div className="flex items-center gap-2">
                <input type="time" defaultValue="20:00" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm min-h-[44px]" />
                <span className="text-sm text-slate-400">to</span>
                <input type="time" defaultValue="08:00" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm min-h-[44px]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">SMS Credits Remaining</label>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-800">2,847</span>
                <button className="text-sm text-primary hover:underline">Top Up</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Configuration */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">📧 Email Reminders</h3>
            <p className="text-sm text-slate-500">Send reminder emails to customers</p>
          </div>
          <button
            onClick={() => setEmailEnabled(!emailEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailEnabled ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        
        {emailEnabled && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">From Email</label>
              <input type="email" defaultValue="reminders@tradeflow-services.co.uk" className="w-full max-w-md rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Reply-To Email</label>
              <input type="email" defaultValue="bookings@tradeflow-services.co.uk" className="w-full max-w-md rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            </div>
          </div>
        )}
      </div>

      {/* Default Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-slate-800">📅 Default Reminder Schedule</h3>
        <p className="text-sm text-slate-500">Set the default reminder sequence for new templates (days before due date)</p>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Reminder Days (comma-separated)</label>
          <input
            type="text"
            value={defaultSequence}
            onChange={(e) => setDefaultSequence(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]"
          />
          <p className="text-xs text-slate-400 mt-1">e.g. &quot;30, 14, 7, 1&quot; sends reminders 30, 14, 7, and 1 day before the due date</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Preferred Send Time</label>
          <input type="time" defaultValue="09:00" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm min-h-[44px]" />
        </div>
      </div>

      {/* Opt-Out */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-slate-800">🚫 Opt-Out Settings</h3>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Opt-Out Message (appended to SMS)</label>
          <input
            type="text"
            value={optOutMessage}
            onChange={(e) => setOptOutMessage(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary" />
          <div>
            <p className="text-sm font-medium text-slate-700">Include unsubscribe link in emails</p>
            <p className="text-xs text-slate-500">Required by UK email marketing regulations</p>
          </div>
        </label>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-slate-800">🎨 Email Branding</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Company Logo URL</label>
            <input type="url" placeholder="https://..." className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Brand Colour</label>
            <div className="flex items-center gap-2">
              <input type="color" defaultValue="#2D5A27" className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
              <input type="text" defaultValue="#2D5A27" className="rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[44px] w-28" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Email Footer Text</label>
          <textarea
            rows={2}
            defaultValue="TradeFlow Services Ltd | Gas Safe: 123456 | NICEIC: 789012"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
        Save All Settings
      </button>
    </div>
  );
}
