'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ReminderTemplate {
  id: string;
  name: string;
  type: string;
  icon: string;
  frequency: string;
  reminderSequence: number[];
  smsTemplate: string;
  emailSubject: string;
  emailBody: string;
  estimatedPrice: number;
  active: boolean;
  customersUsing: number;
}

const defaultTemplates: ReminderTemplate[] = [
  {
    id: '1', name: 'Annual Boiler Service', type: 'boiler_service', icon: '🔥',
    frequency: 'Annually', reminderSequence: [30, 14, 7, 1],
    smsTemplate: 'Hi {customer_name}, your annual boiler service is due on {due_date}. Book now: {booking_link}. Reply STOP to opt out.',
    emailSubject: 'Your Annual Boiler Service is Due',
    emailBody: 'Dear {customer_name},\n\nYour annual boiler service at {property_address} is due on {due_date}.\n\nRegular servicing ensures your boiler runs efficiently and safely. Book your appointment today.\n\n{booking_link}\n\nBest regards,\n{company_name}',
    estimatedPrice: 95, active: true, customersUsing: 156,
  },
  {
    id: '2', name: 'CP12 Gas Safety Certificate', type: 'cp12', icon: '🔒',
    frequency: 'Annually', reminderSequence: [30, 14, 7, 1],
    smsTemplate: 'Hi {customer_name}, your Gas Safety Certificate (CP12) expires {due_date}. This is a legal requirement for landlords. Book now: {booking_link}',
    emailSubject: 'CP12 Gas Safety Certificate Renewal',
    emailBody: 'Dear {customer_name},\n\nYour Gas Safety Certificate (CP12) at {property_address} expires on {due_date}.\n\nAs a landlord, this certificate is a legal requirement. Please arrange renewal before the expiry date.\n\n{booking_link}\n\nBest regards,\n{company_name}',
    estimatedPrice: 85, active: true, customersUsing: 89,
  },
  {
    id: '3', name: 'EICR (Electrical Inspection)', type: 'eicr', icon: '⚡',
    frequency: 'Every 5 years', reminderSequence: [60, 30, 14, 7],
    smsTemplate: 'Hi {customer_name}, your EICR at {property_address} is due for renewal. Book your electrical inspection: {booking_link}',
    emailSubject: 'EICR Electrical Inspection Due',
    emailBody: 'Dear {customer_name},\n\nYour Electrical Installation Condition Report (EICR) at {property_address} is due for renewal.\n\nEICRs are required every 5 years for rental properties. Book your inspection today.\n\n{booking_link}\n\nBest regards,\n{company_name}',
    estimatedPrice: 250, active: true, customersUsing: 67,
  },
  {
    id: '4', name: 'PAT Testing', type: 'pat', icon: '🔌',
    frequency: 'Annually', reminderSequence: [30, 14, 7],
    smsTemplate: 'Hi {customer_name}, your PAT testing is due at {property_address}. Book now: {booking_link}',
    emailSubject: 'PAT Testing Due',
    emailBody: 'Dear {customer_name},\n\nPortable Appliance Testing (PAT) is due at {property_address}.\n\nRegular PAT testing helps ensure electrical safety. Book your appointment.\n\n{booking_link}\n\nBest regards,\n{company_name}',
    estimatedPrice: 75, active: true, customersUsing: 42,
  },
  {
    id: '5', name: 'F-Gas Check', type: 'fgas', icon: '❄️',
    frequency: 'Annually', reminderSequence: [30, 14, 7, 1],
    smsTemplate: 'Hi {customer_name}, your air conditioning F-Gas check is due. Book your service: {booking_link}',
    emailSubject: 'F-Gas Annual Check Due',
    emailBody: 'Dear {customer_name},\n\nYour F-Gas compliance check for the air conditioning system at {property_address} is due.\n\nF-Gas regulations require annual leak checks. Book your appointment.\n\n{booking_link}\n\nBest regards,\n{company_name}',
    estimatedPrice: 120, active: false, customersUsing: 18,
  },
];

export default function ReminderTemplatesPage() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const toggleActive = (id: string) => {
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings/reminders" className="text-slate-400 hover:text-slate-600 min-h-[48px] min-w-[48px] flex items-center justify-center">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 font-[var(--font-dm-sans)]">Reminder Templates</h1>
          <p className="text-slate-500 mt-1">Configure service reminder messages and schedules</p>
        </div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[44px]"
        >
          + Custom Template
        </button>
      </div>

      {/* Custom Builder */}
      {showBuilder && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Create Custom Template</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Template Name</label>
              <input type="text" placeholder="e.g. Smoke Alarm Check" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]">
                <option>Every 6 months</option>
                <option>Annually</option>
                <option>Every 2 years</option>
                <option>Every 5 years</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Estimated Price (£)</label>
            <input type="number" placeholder="0.00" className="w-full max-w-xs rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">SMS Message</label>
            <textarea rows={3} placeholder="Use {customer_name}, {property_address}, {due_date}, {booking_link}" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email Subject</label>
            <input type="text" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email Body</label>
            <textarea rows={5} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 min-h-[48px]">Save Template</button>
            <button onClick={() => setShowBuilder(false)} className="px-6 py-3 border border-gray-200 rounded-xl text-slate-600 min-h-[48px]">Cancel</button>
          </div>
        </div>
      )}

      {/* Template Cards */}
      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${template.active ? 'bg-primary/10' : 'bg-gray-100'}`}>
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-800">{template.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${template.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {template.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span>{template.frequency}</span>
                    <span>·</span>
                    <span>£{template.estimatedPrice} est.</span>
                    <span>·</span>
                    <span>{template.customersUsing} customers</span>
                    <span>·</span>
                    <span>Reminders: {template.reminderSequence.join(', ')} days before</span>
                  </div>
                  
                  {editingId === template.id && (
                    <div className="space-y-3 mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">SMS Template</label>
                        <textarea defaultValue={template.smsTemplate} rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Email Subject</label>
                        <input type="text" defaultValue={template.emailSubject} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[44px]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Email Body</label>
                        <textarea defaultValue={template.emailBody} rows={5} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Reminder Sequence (days before due)</label>
                        <input type="text" defaultValue={template.reminderSequence.join(', ')} className="w-full max-w-xs rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[44px]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(editingId === template.id ? null : template.id)}
                    className="px-3 py-1.5 text-sm text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 min-h-[36px]"
                  >
                    {editingId === template.id ? 'Close' : 'Edit'}
                  </button>
                  <button
                    onClick={() => toggleActive(template.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg min-h-[36px] ${
                      template.active ? 'text-red-600 border border-red-200 hover:bg-red-50' : 'text-green-600 border border-green-200 hover:bg-green-50'
                    }`}
                  >
                    {template.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
