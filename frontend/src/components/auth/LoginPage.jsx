import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import HeroProductStory from './HeroProductStory';
import BrandMarquee from './BrandMarquee';
import IntelligenceRadar from './IntelligenceRadar';
import AnalyticsShowcase from './AnalyticsShowcase';
import ClosingCta from './ClosingCta';
import EnterpriseFooter from './EnterpriseFooter';

// ── SaaSOptima wordmark emblem ────────────────────────────────────────────────
const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{ background: '#2563EB' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
        <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
        <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
      </svg>
    </div>
    <span className="text-2xl font-bold tracking-tight text-slate-900">
      SaaSOptima
    </span>
  </div>
);

export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!form.password) {
      setError('Please enter your password.');
      return;
    }

    try {
      const result = await login(form.email, form.password, form.remember);
      if (result.success) {
        onLoginSuccess?.(result.user);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Sign in failed. Please check your credentials.';
      setError(msg);
    }
  };

  const handleScrollToLogin = () => {
    const el = document.getElementById('hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const input = document.getElementById('login-email');
    if (input) {
      setTimeout(() => input.focus(), 400);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] font-sans antialiased overflow-x-hidden">
      
      {/* ───────────────────────────────────────────────────────────────────────
          SECTION ONE: Exact Reference Login Hero (62% Left / 38% Right Split)
          Left: 62% Marketing Area with warm off-white (#FAF9F6), bold black
                abstract ribbon, real photographic subject, confident typography,
                and bottom statistics.
          Right: 38% Pure White (#FFFFFF) functional authentication form.
          ─────────────────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="w-full min-h-screen lg:min-h-[860px] flex flex-col justify-center border-b border-slate-200/90 relative bg-[#FAF9F6]"
      >
        <div className="w-full flex flex-col lg:flex-row min-h-screen lg:min-h-[860px] items-stretch">
          
          {/* LEFT SECTION (62% desktop width) */}
          <div className="w-full lg:w-[62%] bg-[#FAF9F6] border-b lg:border-b-0 lg:border-r border-slate-200/80 relative flex flex-col">
            <HeroProductStory />
          </div>

          {/* RIGHT SECTION (38% desktop width) */}
          <div
            id="login-hero-form"
            className="w-full lg:w-[38%] flex flex-col justify-center px-6 sm:px-12 lg:px-10 xl:px-14 py-12 lg:py-16 bg-[#FFFFFF] z-20"
          >
            <div className="w-full max-w-sm sm:max-w-md mx-auto">
              
              {/* Logo */}
              <div className="mb-8">
                <Logo />
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Sign in to your workspace
                </h1>
                <p className="text-sm text-slate-500 mt-1.5">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate?.('register')}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Create one free
                  </button>
                </p>
              </div>

              {/* Validation Error Banner */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5 text-sm bg-rose-50 border border-rose-200 text-rose-700 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-150 border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-xs"
                    />
                  </div>
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate?.('forgot-password')}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your workspace password"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-3 rounded-xl text-sm transition-all duration-150 border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      tabIndex={-1}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={form.remember}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      Remember this device for 30 days
                    </span>
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all duration-200 mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in to workspace…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to SaaSOptima</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Continue with Google SSO */}
              <button
                type="button"
                disabled
                title="Google Enterprise SSO requires domain configuration in admin settings."
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-400 cursor-not-allowed shadow-xs"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-normal">
                  Enterprise SSO
                </span>
              </button>

              {/* Secure Trust Stamp */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>256-bit SSL encrypted · SOC-2 compliant practices</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION TWO: Continuous SaaS Brand Marquee
          ─────────────────────────────────────────────────────────────────────── */}
      <BrandMarquee />

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION THREE: Interactive Subscription Scanner (Intelligence Radar)
          ─────────────────────────────────────────────────────────────────────── */}
      <IntelligenceRadar />

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION FOUR: Product Capabilities & Analytics Preview
          ─────────────────────────────────────────────────────────────────────── */}
      <AnalyticsShowcase />

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION FIVE: Final Call-To-Action (Closing CTA)
          ─────────────────────────────────────────────────────────────────────── */}
      <ClosingCta
        onNavigate={onNavigate}
        onScrollToLogin={handleScrollToLogin}
      />

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION SIX: Professional Multi-Column Enterprise Footer
          ─────────────────────────────────────────────────────────────────────── */}
      <EnterpriseFooter />

    </div>
  );
}
