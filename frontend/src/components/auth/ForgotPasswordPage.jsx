import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Lock, KeyRound, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { authAPI } from '../../services/api';

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#2563EB' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
        <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
        <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
      </svg>
    </div>
    <span className="text-xl font-bold" style={{ color: '#111827', letterSpacing: '-0.03em' }}>SaaSOptima</span>
  </div>
);

export default function ForgotPasswordPage({ onNavigate }) {
  // Steps: 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS'
  const [step, setStep] = useState('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputs = useRef([]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // STEP 1: Request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid work email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.requestPasswordReset(cleanEmail);
      if (res?.data && res.data.delivered === false) {
        setError(res.data.message || 'Email delivery failed. The verification code could not be sent.');
        return;
      }
      setStep('OTP');
      setResendCooldown(res?.data?.cooldownSeconds || 60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Could not send verification code. Please check your email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.requestPasswordReset(email.trim().toLowerCase());
      if (res?.data && res.data.delivered === false) {
        setError(res.data.message || 'Email delivery failed. The verification code could not be resent.');
        return;
      }
      setResendCooldown(res?.data?.cooldownSeconds || 60);
      setOtp(['', '', '', '', '', '']);
      if (otpInputs.current[0]) otpInputs.current[0].focus();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Could not resend code. Please wait.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // OTP box input handling
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    if (error) setError('');

    // Auto-advance to next box if digit entered
    if (digit && index < 5 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputs.current[index - 1]) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const updated = [...otp];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasteData[i] || '';
    }
    setOtp(updated);
    const focusIndex = Math.min(pasteData.length, 5);
    if (otpInputs.current[focusIndex]) otpInputs.current[focusIndex].focus();
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.verifyOtp(email.trim().toLowerCase(), fullOtp);
      setStep('PASSWORD');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Invalid or expired verification code.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fullOtp = otp.join('');
      await authAPI.resetPassword(email.trim().toLowerCase(), fullOtp, newPassword);
      setStep('SUCCESS');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update password. Please retry.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="w-full max-w-md">
        <div className="mb-8"><Logo /></div>

        <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(16,24,40,0.06)' }}>
          
          {/* ── STEP 1: Enter Email ── */}
          {step === 'EMAIL' && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold mb-1.5" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
                  Reset your password
                </h1>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Enter your registered account email. We'll send a secure 6-digit verification code.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-lg mb-5 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequestOtp} noValidate>
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Work Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                      style={{ border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#111827', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                <button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
                  style={{ background: loading ? '#93C5FD' : '#2563EB', color: '#FFFFFF', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending code…</> : 'Send verification code'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: Enter 6-digit OTP ── */}
          {step === 'OTP' && (
            <>
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold mb-1.5" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
                  Enter verification code
                </h1>
                <p className="text-sm text-slate-500">
                  We sent a 6-digit code to <strong className="text-slate-900 font-semibold">{email}</strong>. Valid for 5 minutes.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-lg mb-5 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} noValidate>
                <div className="flex items-center justify-between gap-2 sm:gap-3 mb-6" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpInputs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-xs"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all mb-4"
                  style={{
                    background: loading || otp.join('').length !== 6 ? '#93C5FD' : '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: loading || otp.join('').length !== 6 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying code…</> : 'Verify code'}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className="font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── STEP 3: Create New Password ── */}
          {step === 'PASSWORD' && (
            <>
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold mb-1.5" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
                  Create new password
                </h1>
                <p className="text-sm text-slate-500">
                  Your identity has been verified. Enter a secure new password for your account.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-lg mb-5 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => { setNewPassword(e.target.value); setError(''); }}
                      placeholder="At least 6 characters"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
                  style={{ background: loading ? '#93C5FD' : '#2563EB', color: '#FFFFFF', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Updating password…</> : 'Update password'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Reset Success ── */}
          {step === 'SUCCESS' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Password reset complete</h1>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Your password has been updated in your permanent account record. You can now sign in with your new credentials.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.('login')}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                Sign in to your account
              </button>
            </div>
          )}

          {/* Back to sign in link */}
          {step !== 'SUCCESS' && (
            <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={() => onNavigate?.('login')}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <ArrowLeft className="w-4 h-4" />Back to sign in
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
