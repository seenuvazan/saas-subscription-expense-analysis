import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  FolderKanban,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  FileCheck,
  RefreshCw,
  Bell
} from 'lucide-react';
import { BrandIcons } from './BrandIcons';

export default function AnalyticsShowcase() {
  const [activeStage, setActiveStage] = useState('discover'); // 'discover' | 'organize' | 'monitor' | 'optimize'
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stages = [
    {
      id: 'discover',
      step: '01',
      title: 'Discover',
      subtitle: 'Unify scattered apps',
      Icon: Compass,
      headline: 'Surface every tool across your company.',
      description:
        'Connect identity providers, credit card feeds, and invoice receipts to automatically map every active software tool in your organization.',
    },
    {
      id: 'organize',
      step: '02',
      title: 'Organize',
      subtitle: 'Structure by department',
      Icon: FolderKanban,
      headline: 'Assign owners, categories, and cost centers.',
      description:
        'Group applications into structured functional stacks. Tag departmental owners and cost centers so billing responsibility is transparent.',
    },
    {
      id: 'monitor',
      step: '03',
      title: 'Monitor',
      subtitle: 'Track renewals & dates',
      Icon: Calendar,
      headline: 'Never get surprised by an auto-renewal.',
      description:
        'Keep track of renewal timelines, notice periods, and contract milestones with automated proactive alerts before cancellation windows close.',
    },
    {
      id: 'optimize',
      step: '04',
      title: 'Optimize',
      subtitle: 'Eliminate waste & overlap',
      Icon: Sparkles,
      headline: 'Reclaim idle seats and cut redundant tools.',
      description:
        'Identify unused licenses and overlapping software stacks to take decisive cost-saving action without impacting team productivity.',
    },
  ];

  const currentStageData = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="py-24 bg-slate-50 border-b border-slate-200/80 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header — PRESERVED EXACTLY AS SPECIFIED */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 mb-3 text-xs font-semibold text-blue-700 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            The Subscription Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Every subscription has a story. Know yours.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            From the day you subscribe to the moment you renew, SaaSOptima helps you stay in control.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FOUR-STAGE HORIZONTAL LIFECYCLE STEPPER BAR
            ───────────────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            {stages.map((stage) => {
              const isActive = activeStage === stage.id;
              const Icon = stage.Icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider leading-none ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      Stage {stage.step}
                    </p>
                    <p
                      className={`text-xs font-bold leading-tight mt-0.5 truncate ${
                        isActive ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {stage.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ACTIVE STAGE INTERACTIVE VISUALIZATION CARD
            ───────────────────────────────────────────────────────────── */}
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] overflow-hidden">
            
            {/* Stage Summary Sub-Header */}
            <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-white border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Stage {currentStageData.step} · {currentStageData.title}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {currentStageData.headline}
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-sm sm:text-right leading-relaxed">
                {currentStageData.description}
              </p>
            </div>

            {/* Dynamic Stage Body Visual */}
            <div className="p-6 sm:p-8 lg:p-10 min-h-[360px] flex items-center justify-center bg-slate-50/30">
              
              {/* STAGE 1: DISCOVER — Ingest & Collection into Unified Workspace */}
              {activeStage === 'discover' && (
                <div className="w-full space-y-6 animate-fadeIn">
                  {/* Ingestion channels bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Google SSO &amp; OAuth</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">18 active tools detected</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Card &amp; Bank Feeds</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">14 recurring charges synced</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Invoice Parser</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">10 vendor contracts verified</p>
                      </div>
                    </div>
                  </div>

                  {/* Discovered Subscription Cards Stream */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 pb-1 border-b border-slate-100">
                      <span>Newly Discovered Software Roster</span>
                      <span className="text-[11px] text-blue-600 font-semibold">42 Total Connected Services</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      {[
                        { name: 'AWS Cloud Services', cat: 'Cloud Infrastructure', Icon: BrandIcons.AWS, via: 'Corporate Visa (..4812)', cost: '₹6.84L/mo' },
                        { name: 'ChatGPT Plus Team', cat: 'Generative AI', Icon: BrandIcons.ChatGPT, via: 'Google Workspace OAuth', cost: '₹1.64L/mo' },
                        { name: 'Figma Organization', cat: 'Design Suite', Icon: BrandIcons.Figma, via: 'Okta SSO Gateway', cost: '₹1.45L/mo' },
                        { name: 'GitHub Enterprise', cat: 'DevOps & Repos', Icon: BrandIcons.GitHub, via: 'Annual PO Contract', cost: '₹2.05L/mo' },
                        { name: 'Claude Pro Workspace', cat: 'AI Intelligence', Icon: BrandIcons.Claude, via: 'Direct Invoice Scan', cost: '₹95,000/mo' },
                        { name: 'Notion Team Docs', cat: 'Productivity', Icon: BrandIcons.Notion, via: 'Employee Card Auth', cost: '₹82,000/mo' },
                      ].map((item) => {
                        const Icon = item.Icon;
                        return (
                          <div
                            key={item.name}
                            className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between hover:bg-white hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 text-xs truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-400 truncate">{item.via}</p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 text-xs whitespace-nowrap pl-2">
                              {item.cost}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 2: ORGANIZE — Category & Department Architecture */}
              {activeStage === 'organize' && (
                <div className="w-full space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Category 1: AI Tools */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            AI Tools &amp; Intelligence
                          </h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700">
                          Cost Center: AI-001
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.ChatGPT className="w-3.5 h-3.5" /> ChatGPT Plus
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: AI Lead</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.Claude className="w-3.5 h-3.5" /> Claude Pro
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: Research</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.Gemini className="w-3.5 h-3.5" /> Gemini Suite
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: Product</span>
                        </div>
                      </div>
                    </div>

                    {/* Category 2: Engineering */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Engineering &amp; Cloud
                          </h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700">
                          Cost Center: ENG-001
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.AWS className="w-3.5 h-3.5" /> AWS Infrastructure
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: DevOps Lead</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.GitHub className="w-3.5 h-3.5" /> GitHub Enterprise
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: Eng Lead</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.Datadog className="w-3.5 h-3.5" /> Datadog APM
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: SRE Lead</span>
                        </div>
                      </div>
                    </div>

                    {/* Category 3: Design */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Design &amp; Creative
                          </h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-50 text-purple-700">
                          Cost Center: DES-001
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.Figma className="w-3.5 h-3.5" /> Figma Organization
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: Head of Design</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.Adobe className="w-3.5 h-3.5" /> Adobe Creative Cloud
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: Creative Dir</span>
                        </div>
                      </div>
                    </div>

                    {/* Category 4: Productivity */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Productivity &amp; Comms
                          </h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700">
                          Cost Center: IT-001
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.Slack className="w-3.5 h-3.5" /> Slack Enterprise Grid
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: IT Admin</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <BrandIcons.Notion className="w-3.5 h-3.5" /> Notion Workspace
                          </span>
                          <span className="text-slate-500 text-[11px]">Owner: Operations</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STAGE 3: MONITOR — Renewal Calendar & Timeline Reminders */}
              {activeStage === 'monitor' && (
                <div className="w-full space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    
                    {/* Left: Renewal Calendar Widget (7 cols) */}
                    <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <h4 className="text-xs font-bold text-slate-900">
                            Upcoming Renewal Calendar · November 2026
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-slate-800">₹5,80,800 Committed</span>
                      </div>

                      {/* Interactive Schedule Rows */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BrandIcons.Figma className="w-5 h-5 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">Figma Organization</p>
                              <p className="text-[11px] text-amber-700">Renews in 6 days (Nov 6) · Annual contract</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">₹1,45,800</p>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Action: Review Seats</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BrandIcons.Claude className="w-5 h-5 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">Claude Team Workspace</p>
                              <p className="text-[11px] text-slate-500">Renews in 14 days (Nov 14) · Monthly billing</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">₹95,000</p>
                            <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">Auto-renews</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BrandIcons.GitHub className="w-5 h-5 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">GitHub Enterprise</p>
                              <p className="text-[11px] text-slate-500">Renews in 22 days (Nov 22) · Quarterly cycle</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">₹2,05,000</p>
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Optimal (87% used)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Automated Alert Timeline (5 cols) */}
                    <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Proactive Reminder Triggers
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs pt-1">
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-200">30-Day Notice Milestone</p>
                            <p className="text-[11px] text-slate-400">Notifies subscription owner and flags price changes.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-200">14-Day Utilization Audit</p>
                            <p className="text-[11px] text-slate-400">Identifies inactive seats before renewal count locks in.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-200">7-Day Executive Clearance</p>
                            <p className="text-[11px] text-slate-400">Final budget approval workflow prevents accidental renewal.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STAGE 4: OPTIMIZE — License Reclamation & Overlap Elimination */}
              {activeStage === 'optimize' && (
                <div className="w-full space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Optimization Opportunity 1 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BrandIcons.Figma className="w-5 h-5 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Figma Organization</h4>
                            <p className="text-[11px] text-slate-400">38 Total Paid Licenses</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Save ₹1,42,000 / yr
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                        <p className="font-semibold text-slate-800">
                          14 Inactive Licenses Detected
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          14 design seats have recorded zero Figma logins or file edits in over 60 days. Deprovisioning before the Nov 6 renewal recovers ₹11,833/mo immediately.
                        </p>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Utilization: 63%</span>
                        <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]">
                          Ready to Reclaim
                        </span>
                      </div>
                    </div>

                    {/* Optimization Opportunity 2 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BrandIcons.Slack className="w-5 h-5 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Slack vs MS Teams</h4>
                            <p className="text-[11px] text-slate-400">Redundant Communication</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          78% User Overlap
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                        <p className="font-semibold text-slate-800">
                          Duplicate Messaging Footprint
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Slack Enterprise (₹2,26,800/mo) coexists with Microsoft Teams, which is already fully licensed in your Microsoft 365 agreement. Consolidating communication saves ₹27.2L annually.
                        </p>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Overlap Severity: High</span>
                        <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">
                          Consolidation Review
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Bottom Stepper Navigation Bar */}
            <div className="px-6 sm:px-8 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Interactive Subscription Lifecycle · Real-Time Governance</span>
              </span>
              <div className="flex items-center gap-2">
                {stages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeStage === stage.id ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    title={stage.title}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
