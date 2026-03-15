'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SettingsData {
  farm: {
    id: string;
    name: string;
    cphNumber: string | null;
    sbiNumber: string | null;
    county: string | null;
    postcode: string | null;
    totalHectares: number | null;
    farmType: string | null;
  };
  team: Array<{
    id: string;
    userId: string;
    name: string | null;
    email: string;
    phone: string | null;
    role: string;
    userRole: string;
  }>;
}

type SettingsTab = 'profile' | 'team' | 'notifications' | 'data';

const farmTypes = ['arable', 'livestock', 'mixed', 'dairy', 'poultry', 'organic', 'other'];

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveFarm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name'),
      cphNumber: form.get('cphNumber') || null,
      sbiNumber: form.get('sbiNumber') || null,
      county: form.get('county') || null,
      postcode: form.get('postcode') || null,
      totalHectares: form.get('totalHectares') || null,
      farmType: form.get('farmType') || null,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSaveMsg('Settings saved successfully');
        const updated = await fetch('/api/settings').then(r => r.json());
        setData(updated);
      }
    } catch {
      setSaveMsg('Error saving settings');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  }

  async function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name'),
      email: form.get('email'),
      role: form.get('role'),
    };

    const res = await fetch('/api/settings/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowAddMember(false);
      const updated = await fetch('/api/settings').then(r => r.json());
      setData(updated);
    }
  }

  async function handleRemoveMember(membershipId: string) {
    if (!confirm('Remove this team member?')) return;
    const res = await fetch(`/api/settings/team?id=${membershipId}`, { method: 'DELETE' });
    if (res.ok) {
      const updated = await fetch('/api/settings').then(r => r.json());
      setData(updated);
    }
  }

  if (loading) {
    return <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />;
  }

  if (!data) {
    return <div className="text-center py-12 text-slate-500">Unable to load settings</div>;
  }

  const tabItems: { key: SettingsTab; label: string; icon: string }[] = [
    { key: 'profile', label: 'Farm Profile', icon: '🏠' },
    { key: 'team', label: 'Team', icon: '👥' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'data', label: 'Data & Privacy', icon: '🔒' },
  ];

  const quickLinks = [
    { href: '/settings/equipment', label: 'Equipment Register', icon: '🚜', desc: 'Sprayers, spreaders, calibration dates' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Settings</h1>

      {/* Quick Links */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[48px] whitespace-nowrap flex-shrink-0"
          >
            <span className="text-lg">{link.icon}</span>
            <div>
              <span className="text-sm font-medium text-slate-700 block">{link.label}</span>
              <span className="text-[11px] text-slate-400">{link.desc}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {tabItems.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Farm Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveFarm} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {saveMsg && (
            <div className={`text-sm p-3 rounded-xl border ${saveMsg.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              {saveMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Farm Name *</label>
            <input name="name" type="text" required defaultValue={data.farm.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CPH Number</label>
              <input name="cphNumber" type="text" defaultValue={data.farm.cphNumber || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" placeholder="12/345/6789" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SBI Number</label>
              <input name="sbiNumber" type="text" defaultValue={data.farm.sbiNumber || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" placeholder="123456789" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">County</label>
              <input name="county" type="text" defaultValue={data.farm.county || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Postcode</label>
              <input name="postcode" type="text" defaultValue={data.farm.postcode || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Hectares</label>
              <input name="totalHectares" type="number" step="0.1" defaultValue={data.farm.totalHectares || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Farm Type</label>
              <select name="farmType" defaultValue={data.farm.farmType || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base min-h-[48px]">
                <option value="">Select type...</option>
                {farmTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors min-h-[48px] disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Team Management */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 font-[var(--font-dm-sans)]">Team Members</h2>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors min-h-[44px]"
            >
              + Add Member
            </button>
          </div>

          {showAddMember && (
            <form onSubmit={handleAddMember} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                  <input name="name" type="text" required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                <select name="role" required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]">
                  <option value="worker">Worker</option>
                  <option value="manager">Manager</option>
                  <option value="agronomist">Agronomist (read-only)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium min-h-[44px]">Add</button>
                <button type="button" onClick={() => setShowAddMember(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[44px]">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {data.team.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{member.name || 'Unnamed'}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-gray-200 capitalize">
                  {member.role}
                </span>
                {member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-xs text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 font-[var(--font-dm-sans)]">Notification Preferences</h2>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-600">Email Notifications</h3>
            {['Compliance deadlines', 'Withdrawal expiry alerts', 'Movement reminders', 'Audit prep reminders', 'Weekly summary'].map(item => (
              <label key={item} className="flex items-center justify-between py-2 min-h-[44px]">
                <span className="text-sm text-slate-700">{item}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
              </label>
            ))}
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-600">SMS Alerts</h3>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Phone Number</label>
              <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base min-h-[48px]" placeholder="07700 900 001" />
            </div>
            {['Withdrawal expiry', 'Movement deadline', 'Audit reminder'].map(item => (
              <label key={item} className="flex items-center justify-between py-2 min-h-[44px]">
                <span className="text-sm text-slate-700">{item}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
              </label>
            ))}

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Quiet Hours (no SMS)</label>
              <div className="flex items-center gap-2">
                <input type="time" defaultValue="21:00" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
                <span className="text-sm text-slate-400">to</span>
                <input type="time" defaultValue="06:00" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm min-h-[44px]" />
              </div>
            </div>
          </div>

          <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors min-h-[48px]">
            Save Preferences
          </button>
        </div>
      )}

      {/* Data & Privacy */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 font-[var(--font-dm-sans)]">Data & Privacy</h2>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Export Your Data</h3>
            <p className="text-sm text-slate-500">Download all your farm records as CSV files.</p>
            <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 min-h-[44px]">
              📥 Export All Data (CSV)
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Data Retention</h3>
            <p className="text-sm text-slate-500">
              Compliance records (spray diaries, medicine records, movements) are retained for a minimum of 5 years as required by Red Tractor and UK regulations.
              Personal data is processed in accordance with our privacy policy.
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-red-700">Delete Account</h3>
            <p className="text-sm text-red-600">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 min-h-[44px]">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
