import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Logo = () => (
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
    <span className="text-xl font-bold" style={{ color: '#111827', letterSpacing: '-0.03em' }}>
      SaaSOptima
    </span>
  </div>
);

// ── Password strength meter ────────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#DC2626' };
  if (score <= 2) return { score, label: 'Fair', color: '#D97706' };
  if (score <= 3) return { score, label: 'Good', color: '#2563EB' };
  return { score, label: 'Strong', color: '#15803D' };
}

const PasswordStrengthBar = ({ password }) => {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{
              background: i <= Math.ceil(score * 4 / 5) ? color : '#E5E7EB',
            }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color }}>{label} password</p>
    </div>
  );
};

const DEPARTMENTS = [
  { value: '', label: 'Select department (optional)' },
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'SALES', label: 'Sales' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'PRODUCTIVITY', label: 'Operations / Other' },
];

export default function RegisterPage({ onRegisterSuccess, onNavigate }) {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    department: '', agreeTerms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2) errs.firstName = 'First name must be at least 2 characters';
    if (!form.lastName.trim() || form.lastName.trim().length < 2) errs.lastName = 'Last name must be at least 2 characters';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) errs.agreeTerms = 'You must accept the terms to continue';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const result = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department || undefined,
      });
      if (result.success) {
        onRegisterSuccess?.(result.user);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setApiError(msg);
    }
  };

  const inputClass = "w-full py-2.5 rounded-lg text-sm transition-all";
  const inputStyle = (hasErr) => ({
    border: `1px solid ${hasErr ? '#DC2626' : '#E5E7EB'}`,
    background: '#FFFFFF',
    color: '#111827',
    outline: 'none',
    padding: '0.625rem 0.875rem',
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(16,24,40,0.06)' }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-1" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
              Create your account
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Already have an account?{' '}
              <button onClick={() => onNavigate?.('login')} className="font-semibold hover:underline" style={{ color: '#2563EB' }}>
                Sign in
              </button>
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg mb-5 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>First name</label>
                <input
                  id="reg-first-name"
                  type="text" name="firstName" value={form.firstName} onChange={handleChange}
                  placeholder="Rahul" autoComplete="given-name"
                  className={inputClass} style={inputStyle(errors.firstName)}
                  onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.firstName ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
                {errors.firstName && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Last name</label>
                <input
                  id="reg-last-name"
                  type="text" name="lastName" value={form.lastName} onChange={handleChange}
                  placeholder="Kumar" autoComplete="family-name"
                  className={inputClass} style={inputStyle(errors.lastName)}
                  onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.lastName ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
                {errors.lastName && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Email address</label>
              <input
                id="reg-email"
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" autoComplete="email"
                className={inputClass} style={{ ...inputStyle(errors.email), paddingLeft: '0.875rem' }}
                onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Department <span style={{ color: '#9CA3AF' }}>(optional)</span></label>
              <select
                id="reg-department"
                name="department" value={form.department} onChange={handleChange}
                className={inputClass}
                style={{ ...inputStyle(false), paddingRight: '2rem', appearance: 'auto' }}
              >
                {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Minimum 8 characters" autoComplete="new-password"
                  className={inputClass}
                  style={{ ...inputStyle(errors.password), paddingRight: '2.5rem' }}
                  onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} tabIndex={-1}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthBar password={form.password} />
              {errors.password && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Confirm password</label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat your password" autoComplete="new-password"
                  className={inputClass}
                  style={{ ...inputStyle(errors.confirmPassword), paddingRight: '2.5rem' }}
                  onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.confirmPassword ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} tabIndex={-1}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && form.password === form.confirmPassword && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#15803D' }} />
                  <span className="text-xs" style={{ color: '#15803D' }}>Passwords match</span>
                </div>
              )}
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  id="reg-terms"
                  type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange}
                  className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                  style={{ accentColor: '#2563EB' }}
                />
                <span className="text-sm" style={{ color: '#374151' }}>
                  I agree to the{' '}
                  <a href="#" className="font-medium hover:underline" style={{ color: '#2563EB' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="font-medium hover:underline" style={{ color: '#2563EB' }}>Privacy Policy</a>
                </span>
              </label>
              {errors.agreeTerms && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.agreeTerms}</p>}
            </div>

            {/* Submit */}
            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all mt-2"
              style={{
                background: loading ? '#93C5FD' : '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
              ) : (
                <>Create account<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#94A3B8' }}>
          New accounts are created as standard employees. Contact your admin to change your role.
        </p>
      </div>
    </div>
  );
}
