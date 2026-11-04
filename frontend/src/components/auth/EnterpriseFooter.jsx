import React, { useState } from 'react';
import { ArrowUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import InfoModal from './InfoModal';

export default function EnterpriseFooter() {
  const [modalTopic, setModalTopic] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-600 text-xs">
      {/* Informational Topic Modal */}
      <InfoModal
        isOpen={Boolean(modalTopic)}
        topic={modalTopic}
        onClose={() => setModalTopic(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Branding (2 cols span on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#2563EB' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
                  <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
                  <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
                  <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                SaaSOptima
              </span>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Subscription expense intelligence for smarter software management.
              Gain centralized visibility across recurring licenses, upcoming renewals, and departmental software spend.
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational · SOC-2 Ready</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('hero')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('radar')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Features &amp; Radar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('analytics')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Analytics &amp; Spend
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('marquee')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Subscription Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setModalTopic('docs')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalTopic('docs')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalTopic('faqs')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalTopic('contact')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setModalTopic('privacy')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalTopic('terms')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalTopic('security')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Security Architecture
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Refined Divider */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 SaaSOptima. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-slate-400">
              Built for modern finance and engineering teams
            </span>

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              title="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
