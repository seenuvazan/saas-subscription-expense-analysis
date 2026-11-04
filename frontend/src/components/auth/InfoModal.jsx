import React from 'react';
import { X, ShieldCheck, FileText, HelpCircle, Mail, CheckCircle2 } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, topic }) {
  if (!isOpen) return null;

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      Icon: ShieldCheck,
      description: 'How SaaSOptima protects and handles your organization’s subscription and financial data.',
      sections: [
        {
          heading: '1. Data Collection & Usage',
          body: 'SaaSOptima collects vendor invoice details, seat allocations, contract renewal dates, and department ownership strictly to provide expense analytics. We do not sell or monetize organizational data.',
        },
        {
          heading: '2. Encryption & Storage',
          body: 'All credentials, vendor feeds, and database entries are encrypted in transit via TLS 1.3 and at rest with AES-256 bit encryption.',
        },
        {
          heading: '3. Data Ownership & Retention',
          body: 'Your organization owns all subscription and audit records. You can export or request full deletion of company records at any time.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      Icon: FileText,
      description: 'Rules and terms governing the use of the SaaSOptima platform.',
      sections: [
        {
          heading: '1. Authorized Workspace Access',
          body: 'Account credentials must only be shared with authorized personnel. Administrators are responsible for managing access permissions for their employees.',
        },
        {
          heading: '2. Subscription Analytics Disclaimers',
          body: 'Financial projections, duplicate license detections, and savings suggestions are calculated based on user inputs and telemetry feeds to assist financial decision-making.',
        },
        {
          heading: '3. Service Reliability',
          body: 'We strive for 99.9% uptime for core analytics services, with maintenance schedules announced with reasonable advance notice.',
        },
      ],
    },
    security: {
      title: 'Security Architecture',
      Icon: ShieldCheck,
      description: 'Enterprise-grade safeguards protecting your SaaS financial intelligence.',
      sections: [
        {
          heading: '1. Role-Based Access Control (RBAC)',
          body: 'Granular permissions divide administrative governance (budget modifications, company-wide exports) from employee license requests.',
        },
        {
          heading: '2. Audit Logging',
          body: 'Every action—from seat de-allocations to budget threshold adjustments—is recorded in an immutable audit trail with timestamp and user ID.',
        },
        {
          heading: '3. Secure Authentication',
          body: 'Password hashing via BCrypt, JWT session management with timed expirations, and optional enterprise SSO.',
        },
      ],
    },
    faqs: {
      title: 'Frequently Asked Questions',
      Icon: HelpCircle,
      description: 'Quick answers about SaaSOptima’s subscription expense tracking capabilities.',
      sections: [
        {
          heading: 'How does SaaSOptima identify duplicate subscriptions?',
          body: 'The engine compares tool functional categories (e.g. Slack vs MS Teams, Zoom vs Google Meet) and cross-references active user rosters to detect redundant spend.',
        },
        {
          heading: 'Can I track subscriptions billed in multiple currencies?',
          body: 'Yes. SaaSOptima normalizes all global vendor expenses (USD, EUR, GBP) into Indian Rupees (INR) with real-time conversion rates.',
        },
        {
          heading: 'What happens before an annual subscription renews?',
          body: 'Automated alerts notify subscription owners at 30, 14, and 7-day intervals before notice periods close, giving you time to renegotiate or adjust seat counts.',
        },
      ],
    },
    contact: {
      title: 'Contact & Support',
      Icon: Mail,
      description: 'Reach our engineering and customer operations team.',
      sections: [
        {
          heading: 'Technical Support',
          body: 'For setup guidance or workspace questions, email support@saasoptima.com. Typical turnaround is within 4 business hours.',
        },
        {
          heading: 'Enterprise Deployment',
          body: 'For on-premises configurations, custom ERP syncs, or dedicated account managers, contact enterprise@saasoptima.com.',
        },
      ],
    },
    docs: {
      title: 'Platform Documentation',
      Icon: FileText,
      description: 'Guides on logging tools, setting department budgets, and monitoring license utilization.',
      sections: [
        {
          heading: 'Quick Start Guide',
          body: 'Sign in to your workspace, navigate to the Subscriptions tab, and click "Request Software" to add your first subscription with billing cycle and cost center.',
        },
        {
          heading: 'Setting Department Budgets',
          body: 'Administrators can define monthly and annual spending ceilings per department (Engineering, Design, Sales) to trigger threshold warnings.',
        },
      ],
    },
  };

  const currentTopic = contentMap[topic] || contentMap.privacy;
  const TopicIcon = currentTopic.Icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <TopicIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentTopic.title}</h3>
              <p className="text-[11px] text-slate-500">SaaSOptima Information Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-left">
          <p className="text-xs text-slate-600 font-medium pb-2 border-b border-slate-100">
            {currentTopic.description}
          </p>

          {currentTopic.sections.map((sec, i) => (
            <div key={i} className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                {sec.heading}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
