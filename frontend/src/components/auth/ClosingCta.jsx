import React from 'react';
import { ArrowRight, ArrowUp, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

export default function ClosingCta({ onNavigate, onScrollToLogin }) {
  return (
    <section className="relative py-24 bg-[#0B1220] text-white overflow-hidden">
      {/* Restrained Indigo & Blue Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[250px] bg-indigo-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Take Control of Your Software Stack
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Make every subscription count.
        </h2>

        {/* Supporting Text */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Understand your spending, stay ahead of renewals, and keep your software budget under control.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate?.('register')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-200 flex items-center justify-center gap-2 border border-blue-400/30"
          >
            <span>Get started free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onScrollToLogin}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Sign in to workspace</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Reliability Highlights */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Enterprise Security</p>
              <p className="text-[11px] text-slate-400 mt-0.5">256-bit encryption with role-based access governance.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Instant Workspace Setup</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Log tools manually or import vendor invoice rosters in seconds.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">No Credit Card Needed</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Get immediate clarity without initial commitment barriers.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
