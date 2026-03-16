'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ReminderHistory {
  id: string;
  customer: string;
  type: string;
  channel: 'sms' | 'email';
  sentAt: string;
  deliveryStatus: 'delivered' | 'failed' | 'pending' | 'bounced';
  response: string | null;
  revenue: number | null;
  templateName: string;
}

function generateHistory(): ReminderHistory[] {
  const customers = ['Sarah Johnson', 'Emma Williams', 'Thames Property', 'Claire Davis', 'Rachel Smith', 'Karen Anderson', 'Michelle Roberts', 'London Lettings Ltd'];
  const types = ['Annual Boiler Service', 'CP12 Gas Safety', 'EICR', 'PAT Testing', 'F-Gas Check'];
  const channels: Array<'sms' | 'email'> = ['sms', 'email'];
  const statuses: ReminderHistory['deliveryStatus'][] = ['delivered', 'delivered', 'delivered', 'delivered', 'failed', 'bounced', 'pending'];
  const responses = [null, null, null, 'Booked for 15th March', 'Will call back', null, 'Already booked elsewhere', null, 'Please call me'];

  return Array.from({ length: 60 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const response = status === 'delivered' ? responses[Math.floor(Math.random() * responses.length)] : null;
    const hasRevenue = response?.includes('Booked') || Math.random() > 0.7;
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      id: String(i + 1),
      customer: customers[Math.floor(Math.random() * customers.length)],
      type,
      channel: channels[Math.floor(Math.random() * channels.length)],
      sentAt: new Date(Date.now() - i * 86400000 * (1 + Math.random())).toISOString(),
      deliveryStatus: status,
      response,
      revenue: hasRevenue && status === 'delivered' ? [95, 85, 250, 75, 120][types.indexOf(type)] : null,
      templateName: type,
    };
  });
}

export default function ReminderHistoryPage() {
  const [history] = useState(generateHistory);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = history.filter(h => {
    if (channelFilter !== 'all' && h.channel !== channelFilter) return false;
    if (statusFilter !== 'all' && h.deliveryStatus !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalSent: history.length,
    delivered: history.filter(h => h.deliveryStatus === 'delivered').length,
    responses: history.filter(h => h.response).length,
    revenueGenerated: history.reduce((s, h) => s + (h.revenue || 0), 0),
    deliveryRate: Math.round((history.filter(h => h.deliveryStatus === 'delivered').length / history.length) * 100),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/reminders" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Reminder History</h1>
          <p className="text-slate-500 mt-1">All sent reminders with delivery status and customer responses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-slate-500">Total Sent</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalSent}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-green-600">Delivered</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.delivered}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-600">Delivery Rate</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.deliveryRate}%</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <p className="text-xs text-purple-600">Responses</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">{stats.responses}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs text-emerald-600">Revenue Generated</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">£{stats.revenueGenerated.toLocaleString('en-GB')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm min-h-[44px]"
        >
          <option value="all">All Channels</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm min-h-[44px]"
        >
          <option value="all">All Statuses</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="bounced">Bounced</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Sent</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Channel</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Response</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {new Date(entry.sentAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} {new Date(entry.sentAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{entry.customer}</td>
                  <td className="py-3 px-4 text-slate-600">{entry.type}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${entry.channel === 'sms' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {entry.channel === 'sms' ? '📱 SMS' : '📧 Email'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      entry.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      entry.deliveryStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                      entry.deliveryStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {entry.deliveryStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                    {entry.response || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-3 px-4">
                    {entry.revenue ? (
                      <span className="text-green-600 font-medium">£{entry.revenue}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
