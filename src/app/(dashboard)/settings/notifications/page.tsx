'use client';

import { useState } from 'react';

const NOTIFICATION_TEMPLATES = [
  {
    id: '1',
    event: 'appointment_reminder',
    name: 'Appointment Reminder',
    description: 'Sent 24h before scheduled job',
    smsEnabled: true,
    emailEnabled: true,
    smsBody:
      'Hi {customer_name}, reminder: {engineer_name} will visit tomorrow at {time} for {job_title}. See you then! - TradeFlow',
    emailSubject: 'Appointment Reminder - {job_title}',
    emailBody:
      'Dear {customer_name},\n\nThis is a reminder that {engineer_name} will be visiting you tomorrow at {time} to complete {job_title} at {address}.\n\nIf you need to reschedule, please call us on {company_phone}.\n\nBest regards,\n{company_name}',
  },
  {
    id: '2',
    event: 'engineer_enroute',
    name: 'Engineer En Route',
    description: 'Sent when engineer starts journey',
    smsEnabled: true,
    emailEnabled: false,
    smsBody: '{engineer_name} is on the way to you now! ETA: {eta} minutes. - TradeFlow',
    emailSubject: '',
    emailBody: '',
  },
  {
    id: '3',
    event: 'job_complete',
    name: 'Job Complete',
    description: 'Sent when job marked as completed',
    smsEnabled: true,
    emailEnabled: true,
    smsBody:
      'Your {job_title} is complete! Invoice #{invoice_number} sent to your email. Thanks for choosing us! - TradeFlow',
    emailSubject: 'Job Complete - {job_title}',
    emailBody:
      'Dear {customer_name},\n\nWe are pleased to confirm that {job_title} has been completed.\n\nYour invoice #{invoice_number} is attached. Payment is due by {due_date}.\n\nThank you for your business!\n\n{company_name}',
  },
  {
    id: '4',
    event: 'invoice_sent',
    name: 'Invoice Sent',
    description: 'Sent when invoice is issued',
    smsEnabled: false,
    emailEnabled: true,
    smsBody: '',
    emailSubject: 'Invoice #{invoice_number} from {company_name}',
    emailBody:
      'Dear {customer_name},\n\nPlease find attached invoice #{invoice_number} for £{total_amount}.\n\nPayment is due by {due_date}.\n\nBank details:\nAccount: {bank_account}\nSort: {sort_code}\n\nThank you,\n{company_name}',
  },
  {
    id: '5',
    event: 'certificate_ready',
    name: 'Certificate Ready',
    description: 'Sent when certificate is issued',
    smsEnabled: false,
    emailEnabled: true,
    smsBody: '',
    emailSubject: 'Your {certificate_type} Certificate',
    emailBody:
      'Dear {customer_name},\n\nYour {certificate_type} certificate is ready and attached to this email.\n\nCertificate Number: {cert_number}\nExpiry Date: {expiry_date}\n\nPlease keep this safe for your records.\n\n{company_name}',
  },
];

export default function NotificationsSettingsPage() {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Notification Templates</h1>
        <p className="text-sm text-slate-500 mt-1">Configure SMS and email notifications for customers</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Active Templates</div>
          <div className="text-3xl font-bold text-slate-800">{NOTIFICATION_TEMPLATES.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">SMS Enabled</div>
          <div className="text-3xl font-bold text-green-600">
            {NOTIFICATION_TEMPLATES.filter((t) => t.smsEnabled).length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Email Enabled</div>
          <div className="text-3xl font-bold text-blue-600">
            {NOTIFICATION_TEMPLATES.filter((t) => t.emailEnabled).length}
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {NOTIFICATION_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() =>
                setExpandedTemplate(expandedTemplate === template.id ? null : template.id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    <h3 className="font-semibold text-slate-800">{template.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {template.smsEnabled && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      📱 SMS
                    </span>
                  )}
                  {template.emailEnabled && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      📧 Email
                    </span>
                  )}
                  <button className="text-slate-400 hover:text-slate-600">
                    {expandedTemplate === template.id ? '▼' : '▶'}
                  </button>
                </div>
              </div>
            </div>

            {expandedTemplate === template.id && (
              <div className="p-6 border-t bg-gray-50">
                {/* SMS Template */}
                {template.smsEnabled && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-700">SMS Template</label>
                      <button className="text-xs text-primary hover:underline">Edit</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm text-slate-700 font-mono whitespace-pre-wrap">
                        {template.smsBody}
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Characters: {template.smsBody.length} / 160
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Template */}
                {template.emailEnabled && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-700">Email Template</label>
                      <button className="text-xs text-primary hover:underline">Edit</button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">Subject Line</label>
                        <div className="bg-white p-3 rounded-lg border text-sm text-slate-700 font-mono">
                          {template.emailSubject}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">Email Body</label>
                        <div className="bg-white p-4 rounded-lg border text-sm text-slate-700 font-mono whitespace-pre-wrap">
                          {template.emailBody}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Variables */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs font-semibold text-blue-800 mb-2">
                    Available Variables (auto-replaced when sent):
                  </div>
                  <div className="text-xs text-blue-700 space-x-2">
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{'{customer_name}'}</code>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{'{engineer_name}'}</code>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{'{job_title}'}</code>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{'{time}'}</code>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{'{address}'}</code>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{'{company_name}'}</code>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{'{company_phone}'}</code>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                    Save Changes
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm">
                    Send Test
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 text-sm">
                    Disable
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Template Button */}
      <button className="mt-6 w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 text-slate-600 hover:text-primary font-medium transition-all">
        + Create Custom Template
      </button>
    </div>
  );
}
