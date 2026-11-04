import React from 'react';

// Minimal 8-point black asterisk/starburst icon matching approved Canva reference
const Starburst = ({ size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="#111111"
    strokeWidth="3.2"
    strokeLinecap="round"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
  </svg>
);

export default function HeroProductStory() {
  return (
    <div className="relative w-full h-full min-h-[720px] lg:min-h-[860px] flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 bg-[#FAF9F6] overflow-hidden select-none">
      
      {/* ─────────────────────────────────────────────────────────────────────
          1. ELEGANT BLACK ABSTRACT RIBBON (SVG) — Behind the Person (z-10)
          One continuous, flowing S-shaped curve with smooth cubic Bézier arcs.
          No sharp turns, no diagonal straight cuts, no overlapping strokes.
          Positioned behind the seated professional, completely clear of text.
          ───────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 760 760"
          className="w-full h-full"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
        >
          <path
            d="M 575 -25
               C 555 35, 505 65, 505 110
               C 505 160, 625 180, 725 160
               C 765 155, 745 220, 720 270
               C 685 340, 560 380, 480 430
               C 445 450, 440 475, 440 500
               C 440 580, 550 645, 670 675
               C 750 695, 755 770, 715 860"
            stroke="#111111"
            strokeWidth="56"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          2. DECORATIVE STARBURSTS — Inspired by approved Canva reference (z-20)
          Starburst 1: In open space below description, center-left (~26px)
          Starburst 2: Lower and farther left, above statistics (~18px)
          ───────────────────────────────────────────────────────────────────── */}
      <div className="absolute left-[20%] sm:left-[22%] top-[48%] sm:top-[49%] z-20 pointer-events-none">
        <Starburst size={26} />
      </div>
      <div className="absolute left-[7%] sm:left-[8%] top-[64%] sm:top-[65%] z-20 pointer-events-none">
        <Starburst size={18} />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          3. REAL CUTOUT PHOTOGRAPH — Seated Professional (z-20)
          Positioned toward the lower-right in front of the black ribbon.
          Natural human proportions, cropped naturally at the bottom.
          ───────────────────────────────────────────────────────────────────── */}
      <div className="absolute right-0 bottom-0 z-20 w-[52%] sm:w-[46%] lg:w-[42%] xl:w-[40%] max-w-[420px] pointer-events-none flex items-end justify-end">
        <img
          src="/assets/professional_man_seated.png"
          alt="Professional working on laptop"
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_45px_rgba(0,0,0,0.20)]"
          loading="eager"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          4. FOREGROUND MARKETING CONTENT (z-30)
          Badge + 2-Line Headline + Description
          Moved downward together by ~32-38px to balance vertical negative space
          ───────────────────────────────────────────────────────────────────── */}
      <div className="relative z-30 max-w-lg lg:max-w-md xl:max-w-lg pt-12 sm:pt-14 lg:pt-16">
        
        {/* Small Introductory Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 mb-6 text-[11px] font-bold text-blue-700 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          YOUR SOFTWARE SPENDING, DECODED
        </div>

        {/* Headline — Exactly TWO Lines on Desktop, Left-Aligned */}
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-black tracking-tight leading-[1.12] mb-5 text-left">
          <span className="block text-[#111111] sm:whitespace-nowrap">
            Less subscription chaos.
          </span>
          <span className="block text-[#2563EB] sm:whitespace-nowrap">
            More financial clarity.
          </span>
        </h1>

        {/* Description — Completely readable dark-gray text with generous spacing */}
        <p className="text-slate-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-sm sm:max-w-md font-normal">
          One intelligent workspace to understand your software expenses, track renewals, and uncover opportunities to save.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          5. BOTTOM STATISTICS ROW (z-30)
          Compact 3-column statistics near the lower-left corner
          Completely unobstructed by the ribbon or photograph
          ───────────────────────────────────────────────────────────────────── */}
      <div className="relative z-30 pt-10 sm:pt-14">
        <div className="flex items-center gap-5 sm:gap-7 max-w-sm sm:max-w-md">
          {/* Col 1 */}
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              500+
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Companies
            </p>
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-slate-300/80" />

          {/* Col 2 */}
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              10K+
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Subscriptions
            </p>
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-slate-300/80" />

          {/* Col 3 */}
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#2563EB] tracking-tight">
              30%
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Average Savings
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
