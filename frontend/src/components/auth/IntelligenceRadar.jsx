import React, { useState, useEffect, useRef } from 'react';
import { Calendar, PieChart, AlertTriangle, Sparkles } from 'lucide-react';
import { BrandIcons } from './BrandIcons';

export default function IntelligenceRadar() {
  const [selectedCard, setSelectedCard] = useState('renewals'); // 'renewals' | 'budget' | 'duplicates'

  const beamRef = useRef(null);
  const blipRefs = useRef([]);

  // Angular positioning of SaaS tools around the 360° minimal radar instrument:
  // 0 deg is Top (12 o'clock), 90 deg is Right (3 o'clock), 180 deg is Bottom (6 o'clock), 270 deg is Left (9 o'clock)
  const radarBlips = [
    // 1. ChatGPT at 35°
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      category: 'AI Assistant',
      Icon: BrandIcons.ChatGPT,
      angle: 35,
      radius: 37,
      top: 19.7,
      left: 71.2,
      cost: '₹1.64L/mo',
    },
    // 2. Claude at 75°
    {
      id: 'claude',
      name: 'Claude',
      category: 'Anthropic AI',
      Icon: BrandIcons.Claude,
      angle: 75,
      radius: 28,
      top: 42.8,
      left: 77.0,
      cost: '₹95,000/mo',
    },
    // 3. Gemini at 120°
    {
      id: 'gemini',
      name: 'Gemini',
      category: 'Multimodal',
      Icon: BrandIcons.Gemini,
      angle: 120,
      radius: 37,
      top: 68.5,
      left: 82.0,
      cost: '₹1.10L/mo',
    },
    // 4. GitHub at 165°
    {
      id: 'github',
      name: 'GitHub',
      category: 'DevOps & CI',
      Icon: BrandIcons.GitHub,
      angle: 165,
      radius: 29,
      top: 78.0,
      left: 57.5,
      cost: '₹2.05L/mo',
    },
    // 5. Figma at 210°
    {
      id: 'figma',
      name: 'Figma',
      category: 'Design System',
      Icon: BrandIcons.Figma,
      angle: 210,
      radius: 37,
      top: 82.0,
      left: 31.5,
      cost: '₹1.45L/mo',
    },
    // 6. Notion at 255°
    {
      id: 'notion',
      name: 'Notion',
      category: 'Knowledge Base',
      Icon: BrandIcons.Notion,
      angle: 255,
      radius: 28,
      top: 57.2,
      left: 22.9,
      cost: '₹82,000/mo',
    },
    // 7. Slack at 300°
    {
      id: 'slack',
      name: 'Slack',
      category: 'Team Chat',
      Icon: BrandIcons.Slack,
      angle: 300,
      radius: 37,
      top: 31.5,
      left: 18.0,
      cost: '₹2.26L/mo',
    },
    // 8. Zoom at 340°
    {
      id: 'zoom',
      name: 'Zoom',
      category: 'Conferencing',
      Icon: BrandIcons.Zoom,
      angle: 340,
      radius: 28,
      top: 23.7,
      left: 40.4,
      cost: '₹1.32L/mo',
    },
  ];

  // Silky-smooth rAF animation loop:
  // - Rotates triangular sweep through 360 degrees
  // - Icons appear smoothly ONLY while inside the active 45-degree triangular sector
  // - Disappear completely once the beam sector moves away (no permanent trail)
  // - Zero React state re-renders (direct DOM ref style updates)
  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    let currentAngle = 0;
    const speed = 45; // 45 degrees per second => 8 seconds per full 360° sweep
    const SECTOR_WIDTH = 45; // Triangular scanning sector span

    // Check reduced-motion preferences
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      blipRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = '0.9';
          el.style.transform = 'translate(-50%, -50%) scale(1)';
          el.style.pointerEvents = 'auto';
        }
      });
      return;
    }

    const loop = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      currentAngle = (currentAngle + speed * delta) % 360;

      // Rotate triangular sector directly
      if (beamRef.current) {
        beamRef.current.style.transform = `rotate(${currentAngle.toFixed(2)}deg)`;
      }

      // Check each application against active illuminated sector
      radarBlips.forEach((blip, index) => {
        const el = blipRefs.current[index];
        if (!el) return;

        // Angular distance from the beam's leading sweep edge to the blip
        // Handles 359° -> 0° boundary wraparound seamlessly
        const diff = (currentAngle - blip.angle + 360) % 360;

        if (diff >= 0 && diff <= SECTOR_WIDTH) {
          // Inside the active triangular sector:
          // Fade in smoothly at leading edge, stay illuminated, fade out at trailing edge
          let opacity = 1;
          if (diff < 7) {
            opacity = Math.max(0.15, diff / 7);
          } else if (diff > 35) {
            opacity = Math.max(0, (SECTOR_WIDTH - diff) / 10);
          }

          el.style.opacity = opacity.toFixed(3);
          const scale = 0.88 + 0.14 * opacity;
          el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
          el.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
        } else {
          // Outside the scanning beam sector: completely hidden (no lingering trail)
          el.style.opacity = '0';
          el.style.transform = 'translate(-50%, -50%) scale(0.85)';
          el.style.pointerEvents = 'none';
        }
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="radar" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading — PRESERVED EXACTLY */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-3 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            SaaSOptima Intelligence Radar
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See what your subscriptions are costing you.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Turn scattered software expenses into clear, actionable insights. Pinpoint upcoming renewal dates, department budget distribution, and unused licenses in one view.
          </p>
        </div>

        {/* 2-Column Grid: Radar Visualizer (Left) + Interactive Insights (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Minimal Radar with Triangular Scanning Sweep (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center select-none">
            <div className="relative w-full max-w-[420px] aspect-square rounded-full bg-white border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.06)] overflow-hidden flex items-center justify-center">
              
              {/* Very Thin Light-Gray Concentric Circular Guidelines */}
              <div className="absolute inset-8 rounded-full border border-slate-200/80 pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-slate-200/70 pointer-events-none" />
              <div className="absolute inset-32 rounded-full border border-slate-200/60 pointer-events-none" />
              <div className="absolute inset-44 rounded-full border border-slate-200/50 pointer-events-none" />

              {/* Subtle Gray Radial Guidelines & Crosshairs */}
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-200/80 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-200/80 pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-slate-100 rotate-45 pointer-events-none" />

              {/* ─────────────────────────────────────────────────────────────
                  CHANGE 2: PROPER TRIANGULAR RADAR SWEEP
                  Starts at exact center (50%, 50%), extends to outermost ring,
                  covers ~45 degrees, translucent blue-gray fill with visible
                  leading sweep edge, fading toward trailing edge, clipped inside
                  circular boundary.
                  ───────────────────────────────────────────────────────────── */}
              <div
                ref={beamRef}
                className="absolute inset-0 rounded-full pointer-events-none will-change-transform"
                style={{
                  transformOrigin: '50% 50%',
                }}
              >
                {/* Vector SVG Triangular Sector (45° wedge from center to outer radius) */}
                <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="triangularSectorGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.32" />
                      <stop offset="85%" stopColor="#6366F1" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.04" />
                    </radialGradient>
                  </defs>

                  {/* 45-degree filled triangular sector: Center (200,200) -> Top (200,8) -> Arc 45° CCW to (66,66) -> Close */}
                  <path
                    d="M 200 200 L 200 8 A 192 192 0 0 0 64.3 64.3 Z"
                    fill="url(#triangularSectorGrad)"
                  />

                  {/* Sharp, visible leading sweep radial line at 0° */}
                  <line
                    x1="200"
                    y1="200"
                    x2="200"
                    y2="8"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeOpacity="0.85"
                  />
                </svg>
              </div>

              {/* Center SaaSOptima Emblem — Minimal Instrument Hub */}
              <div className="relative z-20 w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200/90 flex flex-col items-center justify-center">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
                    <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
                    <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
                    <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
                  </svg>
                </div>
                <span className="text-[8px] font-bold text-slate-700 tracking-wider uppercase mt-1">
                  RADAR
                </span>
              </div>

              {/* Software Application Icons — Visible ONLY inside the triangular beam */}
              {radarBlips.map((blip, index) => {
                const Icon = blip.Icon;

                return (
                  <div
                    key={blip.id}
                    ref={(el) => (blipRefs.current[index] = el)}
                    className="absolute z-10 will-change-transform transition-all"
                    style={{
                      top: `${blip.top}%`,
                      left: `${blip.left}%`,
                      opacity: 0,
                      transform: 'translate(-50%, -50%) scale(0.85)',
                      pointerEvents: 'none',
                    }}
                  >
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm transition-shadow duration-150 hover:shadow-md">
                      <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="hidden sm:block text-left pr-1">
                        <p className="text-[10px] font-bold text-slate-800 leading-none">
                          {blip.name}
                        </p>
                        <p className="text-[9px] text-slate-500 leading-none mt-0.5">
                          {blip.cost}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Minimal Bottom Status Indicator Bar */}
              <div className="absolute bottom-4 inset-x-8 z-20 flex items-center justify-between text-[11px] text-slate-500 font-mono bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-xs">
                <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  TRIANGULAR SWEEP: 360°
                </span>
                <span className="text-slate-600 font-semibold">Active Sector</span>
              </div>
            </div>

            {/* Radar Caption */}
            <p className="text-xs text-slate-500 mt-3 text-center">
              Triangular scanning beam discovers and models active software subscriptions in real time.
            </p>
          </div>

          {/* RIGHT: Product Insights Cards (7 Cols) — PRESERVED 100% UNCHANGED */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Card 1: Renewals */}
            <div
              onClick={() => setSelectedCard('renewals')}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                selectedCard === 'renewals'
                  ? 'bg-blue-50/50 border-blue-400 shadow-sm ring-1 ring-blue-400'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedCard === 'renewals'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Which subscriptions renew this month?
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Never get caught off guard by unmonitored annual auto-renewals.
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    selectedCard === 'renewals'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  4 Renewing Soon
                </span>
              </div>

              {/* Detail visualization revealed when active */}
              {selectedCard === 'renewals' && (
                <div className="mt-4 pt-4 border-t border-blue-100/80 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Upcoming Auto-Renewals (Next 30 Days)</span>
                    <span className="text-blue-700 font-bold">Total: ₹5,80,800</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BrandIcons.Figma className="w-4 h-4" />
                        <div>
                          <p className="font-semibold text-slate-800">Figma Pro</p>
                          <p className="text-[10px] text-amber-600 font-medium">Renews in 6 days</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹1,45,800</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BrandIcons.Adobe className="w-4 h-4" />
                        <div>
                          <p className="font-semibold text-slate-800">Adobe Creative</p>
                          <p className="text-[10px] text-slate-500">Renews in 15 days</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹98,000</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BrandIcons.GitHub className="w-4 h-4" />
                        <div>
                          <p className="font-semibold text-slate-800">GitHub Enterprise</p>
                          <p className="text-[10px] text-slate-500">Renews in 22 days</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹2,05,000</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BrandIcons.Zoom className="w-4 h-4" />
                        <div>
                          <p className="font-semibold text-slate-800">Zoom Pro</p>
                          <p className="text-[10px] text-rose-600 font-medium">Renews in 29 days</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹1,32,000</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Budget */}
            <div
              onClick={() => setSelectedCard('budget')}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                selectedCard === 'budget'
                  ? 'bg-blue-50/50 border-blue-400 shadow-sm ring-1 ring-blue-400'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedCard === 'budget'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Where is my software budget going?
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Categorize cloud infrastructure, developer seats, and collaboration tools.
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    selectedCard === 'budget'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  ₹18.45L Monthly
                </span>
              </div>

              {/* Detail visualization revealed when active */}
              {selectedCard === 'budget' && (
                <div className="mt-4 pt-4 border-t border-blue-100/80 space-y-3 animate-fadeIn">
                  <div className="space-y-2">
                    {[
                      { cat: 'Cloud & Infrastructure', share: 42, amt: '₹7,75,000', color: 'bg-blue-600' },
                      { cat: 'Productivity & Office', share: 24, amt: '₹4,42,800', color: 'bg-indigo-600' },
                      { cat: 'Design & Creative', share: 18, amt: '₹3,32,100', color: 'bg-violet-600' },
                      { cat: 'Sales & Customer Ops', share: 16, amt: '₹2,95,300', color: 'bg-sky-600' },
                    ].map((item) => (
                      <div key={item.cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700">{item.cat}</span>
                          <span className="text-slate-900 font-bold">{item.amt} ({item.share}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card 3: Unnecessary Subscriptions */}
            <div
              onClick={() => setSelectedCard('duplicates')}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                selectedCard === 'duplicates'
                  ? 'bg-blue-50/50 border-blue-400 shadow-sm ring-1 ring-blue-400'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedCard === 'duplicates'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Which subscriptions might be unnecessary?
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Identify overlapping tools and unassigned seats without disrupting team workflows.
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    selectedCard === 'duplicates'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  ₹3.68L Recoverable
                </span>
              </div>

              {/* Detail visualization revealed when active */}
              {selectedCard === 'duplicates' && (
                <div className="mt-4 pt-4 border-t border-blue-100/80 space-y-2.5 animate-fadeIn">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">1. Redundant Messaging Stack</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Overlap: 78%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Slack Enterprise (₹2,26,800/mo) coexists with Microsoft Teams already licensed under Microsoft 365.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">2. Ghost Seat Reclamation</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Save: ₹1,42,000/yr
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Figma has 14 of 38 paid seats inactive for &gt;60 days. De-provisioning these before renewal recovers ₹11,800/mo.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Demonstration Notice */}
            <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-400">
              <span>* Sample intelligence simulation for preview demonstration.</span>
              <span className="font-medium text-slate-500">Deterministic Analytics Engine</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
