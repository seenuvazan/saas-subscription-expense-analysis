import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Activity,
  TrendingUp,
  Building2,
  Server,
  Zap,
  RefreshCw,
  Check,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthScreen({ onLoginSuccess }) {
  const { login } = useAuth();

  // Persona state: 'employee' | 'admin'
  const [roleMode, setRoleMode] = useState('employee'); // 'employee' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState(''); // e.g., 'Verifying cryptographic credentials...', 'Launching Portal...'
  const [detectedDept, setDetectedDept] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [quickFillFlash, setQuickFillFlash] = useState(null);

  // Biometric / Passkey modal simulation state
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);
  const [passkeyProgress, setPasskeyProgress] = useState('idle'); // 'scanning' | 'verifying' | 'success'

  // Ref for inputs
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Department detection based on typing
  useEffect(() => {
    const lower = email.toLowerCase();
    if (lower.includes('@engineering') || lower.includes('.engineering')) {
      setDetectedDept({ name: 'ENGINEERING', label: '🛠 Engineering Hub', color: '#00D2FF' });
    } else if (lower.includes('@finance') || lower.includes('.finance')) {
      setDetectedDept({ name: 'FINANCE', label: '💼 Corporate Finance', color: '#10B981' });
    } else if (lower.includes('@sales') || lower.includes('.sales')) {
      setDetectedDept({ name: 'SALES', label: '📈 Enterprise Sales', color: '#F59E0B' });
    } else if (lower.includes('@marketing') || lower.includes('.marketing')) {
      setDetectedDept({ name: 'MARKETING', label: '📣 Marketing Ops', color: '#EC4899' });
    } else if (lower.includes('@design') || lower.includes('.design')) {
      setDetectedDept({ name: 'DESIGN', label: '🎨 Product Design', color: '#8B5CF6' });
    } else {
      setDetectedDept(null);
    }
  }, [email]);

  // Handle switching persona toggle
  const handleRoleToggle = (targetRole) => {
    setRoleMode(targetRole);
    setLoginError(null);
    if (targetRole === 'admin') {
      if (!twoFactorCode) setTwoFactorCode('849201'); // Pre-fill sample hardware OTP for convenience
    }
  };

  // Demo Quick-Fill handler
  const handleQuickFill = (type, autoSubmit = false) => {
    setLoginError(null);
    setQuickFillFlash(type);
    setTimeout(() => setQuickFillFlash(null), 1200);

    if (type === 'employee') {
      setRoleMode('employee');
      setEmail('alex.morgan@engineering.saasoptima.io');
      setPassword('••••••••••••');
      setTwoFactorCode('');
      if (autoSubmit) {
        performLogin('alex.morgan@engineering.saasoptima.io', 'password123', 'ROLE_EMPLOYEE');
      }
    } else {
      setRoleMode('admin');
      setEmail('sarah.chen@finance.saasoptima.io');
      setPassword('••••••••••••');
      setTwoFactorCode('849201');
      if (autoSubmit) {
        performLogin('sarah.chen@finance.saasoptima.io', 'admin123', 'ROLE_ADMIN');
      }
    }
  };

  // Perform full login handshake
  const performLogin = async (targetEmail, targetPassword, targetRole) => {
    setIsAuthenticating(true);
    setLoginError(null);

    // Multi-stage realistic enterprise authentication sequence
    setAuthStage('Encrypting TLS 1.3 handshake & verifying domain...');
    await new Promise((r) => setTimeout(r, 450));

    if (targetRole === 'ROLE_ADMIN' || roleMode === 'admin') {
      setAuthStage('Validating SOC-2 Type II session & hardware token attestation...');
      await new Promise((r) => setTimeout(r, 450));
    }

    setAuthStage('Decrypting organization telemetry & launching portal...');
    await new Promise((r) => setTimeout(r, 400));

    try {
      const res = await login(
        targetEmail || email,
        targetPassword === '••••••••••••' ? (roleMode === 'admin' ? 'admin123' : 'password123') : (targetPassword || password),
        targetRole || (roleMode === 'admin' ? 'ROLE_ADMIN' : 'ROLE_EMPLOYEE')
      );

      if (res?.success) {
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication rejected. Check credentials.');
      setIsAuthenticating(false);
      setAuthStage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setLoginError('Corporate email address is required');
      emailInputRef.current?.focus();
      return;
    }
    const finalRole = roleMode === 'admin' ? 'ROLE_ADMIN' : 'ROLE_EMPLOYEE';
    performLogin(email, password, finalRole);
  };

  // Trigger Passkey / Touch ID Simulation
  const handleStartPasskey = () => {
    setIsPasskeyModalOpen(true);
    setPasskeyProgress('scanning');

    setTimeout(() => {
      setPasskeyProgress('verifying');
      setTimeout(() => {
        setPasskeyProgress('success');
        setTimeout(() => {
          setIsPasskeyModalOpen(false);
          // Auto login as current persona
          const isAdm = roleMode === 'admin';
          performLogin(
            isAdm ? 'sarah.chen@finance.saasoptima.io' : 'alex.morgan@engineering.saasoptima.io',
            isAdm ? 'admin123' : 'password123',
            isAdm ? 'ROLE_ADMIN' : 'ROLE_EMPLOYEE'
          );
        }, 800);
      }, 900);
    }, 1100);
  };

  // SSO Provider simulation
  const handleSSOLogin = (providerName) => {
    setIsAuthenticating(true);
    setAuthStage(`Initiating SAML 2.0 redirect via ${providerName}...`);
    setTimeout(() => {
      setAuthStage(`Validating ${providerName} IdP assertions & tokens...`);
      setTimeout(() => {
        const isAdm = roleMode === 'admin';
        performLogin(
          isAdm ? 'sarah.chen@finance.saasoptima.io' : 'alex.morgan@engineering.saasoptima.io',
          isAdm ? 'admin123' : 'password123',
          isAdm ? 'ROLE_ADMIN' : 'ROLE_EMPLOYEE'
        );
      }, 700);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B101B] text-slate-100 flex flex-col justify-center items-center overflow-x-hidden selection:bg-[#00D2FF]/30 selection:text-white">
      {/* ── Ambient Radial Lighting & Cyber Grid Background ───────────────── */}
      <div className="fixed inset-0 pointer-events-none cyber-grid-pattern opacity-40 z-0" />
      <div
        className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none opacity-25 blur-[140px] z-0"
        style={{ background: 'radial-gradient(circle, #00D2FF 0%, transparent 70%)' }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-[650px] h-[650px] rounded-full pointer-events-none opacity-20 blur-[150px] z-0"
        style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }}
      />
      <div
        className="fixed top-1/2 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10 blur-[160px] z-0 transform -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
      />

      {/* ── Top Bar Status Strip ───────────────────────────────────────────── */}
      <header className="relative z-10 w-full max-w-7xl px-6 py-4 flex items-center justify-between border-b border-blue-500/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#3B82F6] shadow-[0_0_20px_rgba(0,210,255,0.4)]">
            <Layers className="w-5 h-5 text-[#0B101B] stroke-[2.5]" />
            <div className="absolute inset-0 rounded-xl border border-white/40" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SaaS<span className="text-[#00D2FF]">optima</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30 uppercase">
                Enterprise
              </span>
            </div>
            <p className="text-[10.5px] font-medium text-slate-400 tracking-wide uppercase">
              Subscription & Expense Analytics
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131B2E]/80 border border-slate-700/60 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 -ml-3.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-300">Cluster 01-US-WEST</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131B2E]/80 border border-slate-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="text-[11px] font-semibold text-slate-300">SOC-2 Type II Certified</span>
          </div>
        </div>
      </header>

      {/* ── Main Split-Screen Container ────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ═════════════════════════════════════════════════════════════════
              LEFT COLUMN: Interactive Glassmorphic Auth Card
              ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto">
            <div
              className={`relative rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-[#131B2E]/90 border transition-all duration-500 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ${
                roleMode === 'admin'
                  ? 'border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)]'
                  : 'border-[#00D2FF]/25 shadow-[0_0_40px_rgba(0,210,255,0.12)]'
              }`}
            >
              {/* Subtle animated laser scan top border */}
              <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent opacity-80" />

              {/* Card Header & Dynamic Persona Pill Toggle */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex p-1.5 rounded-lg bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF]">
                      {roleMode === 'admin' ? <ShieldAlert className="w-4 h-4 text-indigo-400" /> : <Cpu className="w-4 h-4" />}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Zero-Trust Access Portal
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    FIDO2 / SAML
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
                  {roleMode === 'admin' ? (
                    <span>
                      Finance <span className="text-indigo-400">Admin Console</span>
                    </span>
                  ) : (
                    <span>
                      Employee <span className="text-[#00D2FF]">Workspace</span>
                    </span>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {roleMode === 'admin'
                    ? 'Global organization expense governance, audit logs, and automated compliance.'
                    : 'Access departmental software licenses, budget allocation, and renewal schedules.'}
                </p>

                {/* ── Pill Toggle: [ Department Employee ] vs [ Finance Admin ] ── */}
                <div className="mt-5 p-1 rounded-2xl bg-[#0B101B]/80 border border-slate-800 flex items-center relative">
                  <button
                    type="button"
                    onClick={() => handleRoleToggle('employee')}
                    className={`relative z-10 flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      roleMode === 'employee'
                        ? 'text-white shadow-[0_0_20px_rgba(0,210,255,0.3)] bg-gradient-to-r from-[#00D2FF]/20 to-[#3B82F6]/30 border border-[#00D2FF]/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">👨‍💻</span>
                    <span>Department Employee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleToggle('admin')}
                    className={`relative z-10 flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      roleMode === 'admin'
                        ? 'text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] bg-gradient-to-r from-indigo-500/25 to-blue-600/30 border border-indigo-400/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">💼</span>
                    <span>Finance Admin</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Elevated Security Notification for Finance Admin */}
              {roleMode === 'admin' && (
                <div className="mb-5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 animate-fade-in">
                  <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-indigo-200">
                      SOC-2 Type II Certified Session Enforced
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Executive ledger access requires cryptographic token verification or 2FA OTP.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {loginError && (
                <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* ── Main Authentication Form ───────────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field with Department Autocomplete */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#00D2FF]" />
                      Corporate Email
                    </label>

                    {detectedDept && (
                      <span
                        className="text-[10.5px] font-bold px-2 py-0.5 rounded-full border animate-fade-in"
                        style={{
                          background: `${detectedDept.color}15`,
                          color: detectedDept.color,
                          borderColor: `${detectedDept.color}40`,
                        }}
                      >
                        {detectedDept.label}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        roleMode === 'admin'
                          ? 'sarah.chen@finance.saasoptima.io'
                          : 'alex.morgan@engineering.saasoptima.io'
                      }
                      disabled={isAuthenticating}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B101B]/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00D2FF] focus:ring-2 focus:ring-[#00D2FF]/20 transition-all shadow-inner"
                    />
                  </div>

                  {/* Quick Domain Completion Pills */}
                  {!email.includes('@') && email.length > 2 && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400 overflow-x-auto pb-0.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Autocomplete:</span>
                      <button
                        type="button"
                        onClick={() => setEmail((prev) => `${prev}@engineering.saasoptima.io`)}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[#00D2FF] border border-slate-700 transition-colors"
                      >
                        @engineering...
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmail((prev) => `${prev}@finance.saasoptima.io`)}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                      >
                        @finance...
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmail((prev) => `${prev}@company.com`)}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      >
                        @company.com
                      </button>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#00D2FF]" />
                      Password / Master Key
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password recovery link dispatched via Enterprise Identity Manager (Okta / SAML).');
                      }}
                      className="text-slate-400 hover:text-[#00D2FF] text-[11px] transition-colors"
                    >
                      Reset Key?
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={isAuthenticating}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B101B]/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00D2FF] focus:ring-2 focus:ring-[#00D2FF]/20 transition-all shadow-inner pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Hardware Security Key / 2FA OTP Prompt (for Finance Admin mode) */}
                {roleMode === 'admin' && (
                  <div className="space-y-1.5 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-indigo-300 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                        Hardware Token / 2FA OTP
                      </label>
                      <span className="text-[10px] text-slate-400">YubiKey / Authenticator</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        placeholder="849201"
                        className="w-full px-4 py-3 rounded-xl bg-[#0B101B]/80 border border-indigo-500/40 text-indigo-200 tracking-widest font-mono text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all shadow-inner"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">READY</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Device Trust & Remember Option */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-[#00D2FF] focus:ring-[#00D2FF]/30 w-3.5 h-3.5"
                    />
                    <span>Trust this secure corporate workstation</span>
                  </label>
                  <span className="text-[10.5px] text-slate-500 font-mono">TLS 1.3 / E2EE</span>
                </div>

                {/* Primary Action Button: "Authenticate & Launch Portal" */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full relative group overflow-hidden py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.25)] hover:shadow-[0_0_35px_rgba(0,210,255,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
                  style={{
                    background:
                      roleMode === 'admin'
                        ? 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 50%, #00D2FF 100%)'
                        : 'linear-gradient(135deg, #00D2FF 0%, #3B82F6 60%, #1D4ED8 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>{authStage || 'Authenticating Session...'}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-white fill-white/20" />
                        <span>Authenticate & Launch Portal</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </button>

                {/* Biometric / Passkey Simulation Button */}
                <button
                  type="button"
                  onClick={handleStartPasskey}
                  disabled={isAuthenticating}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 bg-[#0B101B]/50 hover:bg-[#0B101B] hover:border-[#00D2FF]/50 text-slate-300 hover:text-white transition-all duration-200 text-xs font-semibold flex items-center justify-center gap-2.5 group"
                >
                  <div className="relative flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-[#00D2FF] group-hover:scale-110 transition-transform" />
                    <span className="absolute -inset-1 rounded-full bg-[#00D2FF]/20 animate-ping opacity-75" />
                  </div>
                  <span>Sign in with Touch ID / YubiKey Passkey</span>
                </button>
              </form>

              {/* ── Enterprise SSO Row ─────────────────────────────────────── */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="h-[1px] w-12 bg-slate-800" />
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Enterprise Single Sign-On (SAML)
                  </span>
                  <span className="h-[1px] w-12 bg-slate-800" />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Okta */}
                  <button
                    type="button"
                    onClick={() => handleSSOLogin('Okta')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-500 transition-all text-xs font-semibold text-slate-300 hover:text-white group"
                  >
                    <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
                    </svg>
                    <span>Okta</span>
                  </button>

                  {/* Google Workspace */}
                  <button
                    type="button"
                    onClick={() => handleSSOLogin('Google Workspace')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-500 transition-all text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Azure AD / Entra */}
                  <button
                    type="button"
                    onClick={() => handleSSOLogin('Azure AD')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-500 transition-all text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                      <path d="M0 0h11v11H0zM13 0h11v11H13zM0 13h11v11H0zM13 13h11v11H13z" />
                    </svg>
                    <span>Azure AD</span>
                  </button>
                </div>
              </div>

              {/* ── Pre-Configured Demo Credentials (One-Click Quick Fill Chips) ── */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">
                      One-Click Demo Credentials
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Instant Sandbox</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Employee Demo Card */}
                  <div
                    onClick={() => handleQuickFill('employee', false)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer group text-left relative ${
                      quickFillFlash === 'employee' || (roleMode === 'employee' && email.includes('alex'))
                        ? 'bg-[#00D2FF]/10 border-[#00D2FF]/60 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                        : 'bg-[#0B101B]/70 border-slate-800 hover:border-slate-700 hover:bg-[#0B101B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
                        Alex Morgan
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickFill('employee', true);
                        }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00D2FF]/20 hover:bg-[#00D2FF]/30 text-[#00D2FF] border border-[#00D2FF]/30"
                      >
                        Auto-Launch →
                      </button>
                    </div>
                    <p className="text-[10.5px] font-mono text-slate-400 truncate mt-1">
                      alex.morgan@engineering.saasoptima.io
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                      <span>Engineering Lead</span>
                      <span className="text-[#00D2FF] font-medium">Department Portal</span>
                    </div>
                  </div>

                  {/* Finance Admin Demo Card */}
                  <div
                    onClick={() => handleQuickFill('admin', false)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer group text-left relative ${
                      quickFillFlash === 'admin' || (roleMode === 'admin' && email.includes('sarah'))
                        ? 'bg-indigo-500/10 border-indigo-400/60 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'bg-[#0B101B]/70 border-slate-800 hover:border-slate-700 hover:bg-[#0B101B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        Sarah Chen
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickFill('admin', true);
                        }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30"
                      >
                        Auto-Launch →
                      </button>
                    </div>
                    <p className="text-[10.5px] font-mono text-slate-400 truncate mt-1">
                      sarah.chen@finance.saasoptima.io
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                      <span>Head of Corporate Finance</span>
                      <span className="text-indigo-400 font-medium">Global Audit View</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT COLUMN: Dynamic Visual Showcase & 3D Financial Stack
              ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center items-center relative">
            
            {/* Visual Frame Container */}
            <div className="relative w-full max-w-lg">
              
              {/* Glowing Background Radial Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00D2FF]/20 via-[#3B82F6]/20 to-indigo-500/10 rounded-3xl blur-2xl transform scale-95" />

              {/* Central 3D Asset Display */}
              <div className="relative rounded-3xl overflow-hidden border border-[#00D2FF]/30 bg-[#131B2E]/80 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl group">
                
                {/* 3D Render Image */}
                <div className="relative aspect-square max-h-[380px] w-full overflow-hidden bg-[#0B101B]">
                  <img
                    src="/assets/auth_hero_3d.jpg"
                    alt="SaaSoptima 3D Financial Stack"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  {/* Subtle Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#131B2E]/60 via-transparent to-[#131B2E]/60" />
                </div>

                {/* ── Floating Interactive Glass Metric: Live Spend Indicator ── */}
                <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-64 p-3.5 rounded-2xl bg-[#0E1526]/85 backdrop-blur-md border border-[#00D2FF]/40 shadow-xl animate-float-slow">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#00D2FF]" />
                      Normalized Monthly Spend
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      +4.2% Headroom
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tight text-white font-mono">
                      $15,150.00
                    </span>
                    <span className="text-xs text-slate-400 font-medium">USD / mo</span>
                  </div>

                  {/* Mini Sparkline SVG */}
                  <div className="mt-2 h-7 w-full flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,20 Q15,8 30,16 T60,6 T85,14 T100,4 L100,25 L0,25 Z"
                        fill="url(#spendGrad)"
                      />
                      <path
                        d="M0,20 Q15,8 30,16 T60,6 T85,14 T100,4"
                        fill="none"
                        stroke="#00D2FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* ── Floating Vendor Badge: AWS Cloud ── */}
                <div className="absolute bottom-16 left-4 p-2.5 rounded-xl bg-[#0E1526]/90 backdrop-blur-md border border-slate-700/80 shadow-lg flex items-center gap-3 animate-float-reverse">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xs">
                    AWS
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-white leading-tight">AWS Cloud Services</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      $8,450/mo · <span className="text-emerald-400 font-bold">96% utilized</span>
                    </p>
                  </div>
                </div>

                {/* ── Floating Vendor Badge: GitHub Enterprise ── */}
                <div className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-[#0E1526]/90 backdrop-blur-md border border-slate-700/80 shadow-lg flex items-center gap-3 animate-float-slow">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xs">
                    GH
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-white leading-tight">GitHub Enterprise</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      $2,500/mo · <span className="text-emerald-400 font-bold">92% utilized</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* ── High-Tech Enterprise Micro-Metric Badges ───────────────── */}
              <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                <div className="p-3 rounded-2xl bg-[#131B2E]/70 border border-slate-800 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#00D2FF]/10 text-[#00D2FF]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-200">Real-time SaaS Audit</p>
                    <p className="text-[10px] font-mono text-[#00D2FF] font-semibold">99.8% Optimized</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#131B2E]/70 border border-slate-800 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-200">Automated Cron Compliance</p>
                    <p className="text-[10px] font-mono text-emerald-400 font-semibold">Status: Active</p>
                  </div>
                </div>
              </div>

              {/* Live Telemetry Ticker at Bottom */}
              <div className="mt-3 px-4 py-2 rounded-xl bg-[#0B101B]/80 border border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>NETWORK: ZERO-TRUST HEALTHY</span>
                </div>
                <div>AUDIT SYNC: 14ms LATENCY</div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-7xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/60 text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span>&copy; {new Date().getFullYear()} SaaSoptima Inc. All rights reserved.</span>
          <span className="hidden sm:inline">&middot;</span>
          <span className="hidden sm:inline">Enterprise Expense Intelligence</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          <span>&middot;</span>
          <span className="hover:text-slate-400 cursor-pointer">SOC-2 Type II</span>
          <span>&middot;</span>
          <span className="hover:text-slate-400 cursor-pointer">Privacy & DPA</span>
        </div>
      </footer>

      {/* ═════════════════════════════════════════════════════════════════════
          BIOMETRIC / PASSKEY SCANNING MODAL SIMULATION
          ═════════════════════════════════════════════════════════════════════ */}
      {isPasskeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#131B2E] border border-[#00D2FF]/40 shadow-[0_0_50px_rgba(0,210,255,0.3)] text-center overflow-hidden">
            
            {/* Modal Laser Scan Animation */}
            <div className="animate-laser-scan top-0" />

            <div className="my-4 flex flex-col items-center justify-center">
              {/* Biometric Icon with Concentric Pulse Rings */}
              <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-full border border-[#00D2FF]/20 animate-ping opacity-60" />
                <div className="absolute inset-2 rounded-full border-2 border-[#00D2FF]/40 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D2FF]/20 to-[#3B82F6]/30 border border-[#00D2FF]/60 flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.4)]">
                  {passkeyProgress === 'success' ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-scale-in" />
                  ) : (
                    <Fingerprint className="w-10 h-10 text-[#00D2FF] animate-pulse" />
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                {passkeyProgress === 'scanning' && 'Touch Security Key or Sensor'}
                {passkeyProgress === 'verifying' && 'Verifying WebAuthn Credentials...'}
                {passkeyProgress === 'success' && 'Passkey Identity Confirmed!'}
              </h3>
              
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                {passkeyProgress === 'scanning' &&
                  'Touch the sensor on your YubiKey hardware token or verify with macOS Touch ID / Windows Hello.'}
                {passkeyProgress === 'verifying' &&
                  'Exchanging FIDO2 / WebAuthn cryptographic assertions with SaaSoptima Identity Provider...'}
                {passkeyProgress === 'success' &&
                  'Zero-Trust attestation validated. Transitioning to enterprise portal...'}
              </p>

              <div className="mt-5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00D2FF] to-blue-500 h-full transition-all duration-700"
                  style={{
                    width:
                      passkeyProgress === 'scanning'
                        ? '35%'
                        : passkeyProgress === 'verifying'
                        ? '75%'
                        : '100%',
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPasskeyModalOpen(false)}
              className="mt-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel & return to password login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
