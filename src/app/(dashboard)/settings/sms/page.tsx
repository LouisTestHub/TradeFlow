'use client';

import { useState } from 'react';
import Link from 'next/link';

const alertTypes = [
  { key: 'bcms_deadline', label: 'BCMS movement deadline', desc: '1 day before BCMS submission due' },
  { key: 'bcms_overdue', label: 'BCMS movement overdue', desc: 'Day of deadline if not submitted' },
  { key: 'withdrawal_clear', label: 'Withdrawal period clear', desc: 'Day before meat/milk withdrawal ends' },
  { key: 'course_dose', label: 'Course medicine next dose', desc: 'Day of next dose in a course' },
  { key: 'audit_reminder', label: 'Red Tractor audit reminder', desc: '7 days before scheduled audit' },
  { key: 'insurance_expiry', label: 'Insurance expiry warning', desc: '7 days before insurance expires' },
  { key: 'equipment_calibration', label: 'Equipment calibration due', desc: '14 days before calibration due' },
  { key: 'sfi_evidence', label: 'SFI evidence due', desc: '14 days before evidence submission deadline' },
];

export default function SmsSettingsPage() {
  const [phone, setPhone] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('21:00');
  const [quietEnd, setQuietEnd] = useState('06:00');
  const [alerts, setAlerts] = useState<Record<string, boolean>>(
    Object.fromEntries(alertTypes.map(a => [a.key, true]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);

  function toggleAlert(key: string) {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Stub — would POST to /api/settings/sms
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function sendTestSms() {
    setTestSent(false);
    // Stub — would POST to /api/sms/test
    await new Promise(r => setTimeout(r, 1000));
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600">← Settings</Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-xl font-bold text-slate-800">SMS Alerts</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Global toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">SMS Alerts</h2>
              <p className="text-sm text-slate-500 mt-0.5">Receive critical alerts via text message</p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {enabled && (
          <>
            {/* Phone number */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3">Phone Number</h2>
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+44 7XXX XXXXXX"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={sendTestSms}
                  disabled={!phone}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Send Test
                </button>
              </div>
              {testSent && (
                <p className="text-xs text-green-600 mt-2">✓ Test SMS would be sent to {phone}</p>
              )}
              <p className="text-xs text-slate-400 mt-2">UK mobile numbers only. Standard SMS rates may apply.</p>
            </div>

            {/* Alert toggles */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3">Alert Types</h2>
              <div className="space-y-3">
                {alertTypes.map(alert => (
                  <div key={alert.key} className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{alert.label}</p>
                      <p className="text-xs text-slate-400">{alert.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAlert(alert.key)}
                      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${alerts[alert.key] ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${alerts[alert.key] ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiet hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-1">Quiet Hours</h2>
              <p className="text-xs text-slate-400 mb-3">No SMS during these hours — alerts queue until quiet hours end</p>
              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">From</label>
                  <input
                    type="time"
                    value={quietStart}
                    onChange={e => setQuietStart(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <span className="text-slate-400 mt-5">to</span>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Until</label>
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={e => setQuietEnd(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rate limit info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Rate limit:</strong> Maximum 10 SMS per day. If more alerts are triggered, they&apos;ll be sent via email instead.
                Similar alerts are batched into a single message.
              </p>
            </div>
          </>
        )}

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save SMS Settings'}
          </button>
          {saved && <span className="text-sm text-green-600">✓ Settings saved</span>}
        </div>
      </form>
    </div>
  );
}
