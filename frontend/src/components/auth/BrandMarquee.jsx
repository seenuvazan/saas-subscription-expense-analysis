import React from 'react';
import { BrandIcons } from './BrandIcons';

const BRAND_LIST = [
  { name: 'ChatGPT', category: 'Generative AI', icon: BrandIcons.ChatGPT },
  { name: 'Claude', category: 'AI Intelligence', icon: BrandIcons.Claude },
  { name: 'Gemini', category: 'Multimodal AI', icon: BrandIcons.Gemini },
  { name: 'GitHub', category: 'Dev & CI/CD', icon: BrandIcons.GitHub },
  { name: 'Figma', category: 'Product Design', icon: BrandIcons.Figma },
  { name: 'Notion', category: 'Knowledge Base', icon: BrandIcons.Notion },
  { name: 'Slack', category: 'Team Chat', icon: BrandIcons.Slack },
  { name: 'Zoom', category: 'Conferencing', icon: BrandIcons.Zoom },
  { name: 'Canva', category: 'Creative Suite', icon: BrandIcons.Canva },
  { name: 'Microsoft 365', category: 'Productivity', icon: BrandIcons.Microsoft365 },
  { name: 'Adobe Creative Cloud', category: 'Design & Media', icon: BrandIcons.Adobe },
  { name: 'Dropbox', category: 'Cloud Storage', icon: BrandIcons.Dropbox },
  { name: 'AWS Cloud', category: 'Infrastructure', icon: BrandIcons.AWS },
  { name: 'Datadog', category: 'Observability', icon: BrandIcons.Datadog },
  { name: 'Jira Software', category: 'Issue Tracking', icon: BrandIcons.Jira },
  { name: 'Salesforce', category: 'CRM & Sales', icon: BrandIcons.Salesforce },
];

export default function BrandMarquee() {
  // Two identical arrays joined to ensure a gapless infinite loop
  const duplicatedBrands = [...BRAND_LIST, ...BRAND_LIST];

  return (
    <section id="marquee" className="py-16 bg-slate-50 border-y border-slate-200/80 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          One workspace for the tools you use.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Bring clarity to your growing software stack. Track costs, seats, and contract dates across all your services.
        </p>
      </div>

      {/* Marquee Track with gradient edge masks */}
      <div className="relative w-full marquee-container mask-radial-edges overflow-hidden py-3">
        <div className="animate-marquee-ltr flex items-center gap-4 will-change-transform">
          {duplicatedBrands.map((brand, idx) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${idx}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 flex-shrink-0 cursor-default"
                title={`${brand.name} (${brand.category})`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-snug whitespace-nowrap">
                    {brand.name}
                  </p>
                  <p className="text-[10px] text-slate-500 whitespace-nowrap">
                    {brand.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent category tracking notice */}
      <div className="max-w-3xl mx-auto px-4 text-center mt-6">
        <p className="text-[11px] text-slate-400 leading-normal">
          Visual representation of software categories SaaSOptima is engineered to monitor.
          Brand marks remain the property of their respective owners.
        </p>
      </div>
    </section>
  );
}
