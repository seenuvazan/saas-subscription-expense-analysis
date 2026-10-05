import React, { useState, useRef, useEffect } from 'react';
import { subscriptionAPI } from '../../services/api';
import { CATEGORIES, DEPARTMENTS, CURRENCIES, BILLING_FREQUENCIES } from '../../utils/constants';
import { searchVendors, lookupVendor } from '../../utils/vendors';
import VendorLogo from '../common/VendorLogo';
import { X, CheckCircle, ArrowRight, ArrowLeft, AlertCircle, Search } from 'lucide-react';

// ── Field error helper ───────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: 'var(--danger)' }}>
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {msg}
    </p>
  ) : null;

// ── Input style (theme-aware) ────────────────────────────────────────────────
const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl text-sm border transition-colors outline-none focus:ring-2`;
const inputStyle = (hasError) => ({
  background: 'var(--bg-elevated)',
  borderColor: hasError ? 'var(--danger)' : 'var(--border)',
  color: 'var(--text-primary)',
});

// ── Vendor autocomplete input ────────────────────────────────────────────────
const VendorAutocomplete = ({ value, onChange, onSelect, error }) => {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    setResults(searchVendors(value));
  }, [value]);

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleInput = (e) => {
    onChange(e.target.value);
    setOpen(true);
  };

  const handlePick = (v) => {
    onSelect(v);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          placeholder="e.g. Slack, GitHub, OpenAI…"
          className={inputClass(!!error) + ' pl-9'}
          style={inputStyle(!!error)}
          required
        />
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-50 overflow-hidden animate-scale-in"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {results.map(v => (
            <button
              type="button"
              key={v.key}
              onClick={() => handlePick(v)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <VendorLogo name={v.label} size="xs" />
              <div>
                <p className="font-semibold">{v.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.category}</p>
              </div>
            </button>
          ))}
          {/* allow typing custom vendor */}
          {value.trim() && !results.find(r => r.label.toLowerCase() === value.toLowerCase()) && (
            <button
              type="button"
              onClick={() => { onChange(value); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm border-t text-left transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Use "<strong>{value}</strong>" as custom vendor
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ── Validation ───────────────────────────────────────────────────────────────
function validate(step, formData) {
  const errors = {};
  if (step === 1 && !formData.vendorName.trim()) errors.vendorName = 'Vendor name is required.';
  if (step === 2) {
    const cost = parseFloat(formData.cost);
    if (!formData.cost || isNaN(cost) || cost <= 0) errors.cost = 'Cost must be > 0.';
  }
  if (step === 3) {
    if (!formData.nextRenewalDate) {
      errors.nextRenewalDate = 'Renewal date is required.';
    } else {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(formData.nextRenewalDate) < today) errors.nextRenewalDate = 'Date cannot be in the past.';
    }
    const a = parseInt(formData.assignedSeats, 10), u = parseInt(formData.usedSeats, 10);
    if (isNaN(a) || a < 1) errors.assignedSeats = 'Min 1 seat.';
    if (isNaN(u) || u < 0) errors.usedSeats = 'Cannot be negative.';
    if (!isNaN(a) && !isNaN(u) && u > a) errors.usedSeats = 'Used cannot exceed assigned.';
  }
  return errors;
}

// ── Main modal ───────────────────────────────────────────────────────────────
const LogSubscriptionModal = ({ isOpen, onClose, onSuccess, onError, initialDept = 'ENGINEERING' }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    vendorName: '',
    category: 'DEV',
    cost: '',
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    department: initialDept || 'ENGINEERING',
    nextRenewalDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    assignedSeats: 10,
    usedSeats: 8,
    notes: '',
  });

  if (!isOpen) return null;

  const handle = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleVendorChange = (rawName) => {
    setFormData(p => ({ ...p, vendorName: rawName }));
    if (fieldErrors.vendorName) setFieldErrors(p => ({ ...p, vendorName: undefined }));
  };

  const handleVendorSelect = (vendorEntry) => {
    setFormData(p => ({
      ...p,
      vendorName: vendorEntry.label,
      category: vendorEntry.category || p.category,
    }));
    setFieldErrors(p => ({ ...p, vendorName: undefined }));
  };

  const advance = (e) => {
    e.preventDefault();
    const errs = validate(step, formData);
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(3, formData);
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setSubmitting(true);
    try {
      await subscriptionAPI.create({
        vendorName: formData.vendorName.trim(),
        category: formData.category,
        cost: parseFloat(formData.cost),
        currency: formData.currency,
        billingFrequency: formData.billingFrequency,
        department: formData.department,
        nextRenewalDate: formData.nextRenewalDate,
        assignedSeats: parseInt(formData.assignedSeats, 10),
        usedSeats: parseInt(formData.usedSeats, 10),
        notes: formData.notes,
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.response?.data || 'Unexpected error. Is the backend running?';
      if (onError) onError(status >= 500 ? 'Server error — check backend.' : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1); setFieldErrors({});
    setFormData({
      vendorName: '', category: 'DEV', cost: '', currency: 'USD',
      billingFrequency: 'MONTHLY', department: initialDept || 'ENGINEERING',
      nextRenewalDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedSeats: 10, usedSeats: 8, notes: '',
    });
  };

  const close = () => { reset(); onClose(); };

  // Vendor from registry (for live preview)
  const vendorInfo = lookupVendor(formData.vendorName);

  const labelCls = "block text-xs font-semibold uppercase tracking-wider mb-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 sm:p-8 relative shadow-2xl animate-scale-in"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Close */}
        <button onClick={close} disabled={submitting}
          className="absolute top-5 right-5 p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Step {step} of 3
          </span>
          <h3 className="text-lg font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>
            {step === 1 && 'Software & Category'}
            {step === 2 && 'Pricing & Frequency'}
            {step === 3 && 'Department & Usage'}
          </h3>
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full mt-3 overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : advance} noValidate>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Live logo preview when vendor is known */}
              {formData.vendorName && (
                <div
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                >
                  <VendorLogo name={formData.vendorName} size="lg" />
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {vendorInfo?.label || formData.vendorName}
                    </p>
                    {vendorInfo?.website && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{vendorInfo.website}</p>
                    )}
                    {vendorInfo?.category && (
                      <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--accent)' }}>
                        Category: {vendorInfo.category}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>
                  Vendor / Tool Name *
                </label>
                <VendorAutocomplete
                  value={formData.vendorName}
                  onChange={handleVendorChange}
                  onSelect={handleVendorSelect}
                  error={fieldErrors.vendorName}
                />
                <FieldError msg={fieldErrors.vendorName} />
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Category *</label>
                <select name="category" value={formData.category} onChange={handle}
                  className="w-full px-4 py-3 rounded-xl text-sm border"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Notes</label>
                <textarea name="notes" rows="2" value={formData.notes} onChange={handle}
                  placeholder="Primary usage intent…"
                  className="w-full px-4 py-3 rounded-xl text-sm border resize-none"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Cost *</label>
                  <input type="number" name="cost" step="0.01" min="0.01" placeholder="0.00"
                    value={formData.cost} onChange={handle}
                    className={inputClass(!!fieldErrors.cost)}
                    style={inputStyle(!!fieldErrors.cost)} />
                  <FieldError msg={fieldErrors.cost} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Currency</label>
                  <select name="currency" value={formData.currency} onChange={handle}
                    className="w-full px-4 py-3 rounded-xl text-sm border"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Billing Frequency</label>
                <div className="grid grid-cols-2 gap-3">
                  {BILLING_FREQUENCIES.map(f => (
                    <button type="button" key={f.value}
                      onClick={() => setFormData(p => ({ ...p, billingFrequency: f.value }))}
                      className="p-3 rounded-xl border text-sm font-semibold transition-all"
                      style={{
                        background: formData.billingFrequency === f.value ? 'var(--accent-muted)' : 'var(--bg-elevated)',
                        borderColor: formData.billingFrequency === f.value ? 'var(--accent)' : 'var(--border)',
                        color: formData.billingFrequency === f.value ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                    >{f.label}</button>
                  ))}
                </div>
              </div>

              {formData.cost && parseFloat(formData.cost) > 0 && (
                <div
                  className="p-3 rounded-xl text-xs"
                  style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
                >
                  <strong>Preview: </strong>
                  {formData.currency} {parseFloat(formData.cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  {formData.billingFrequency === 'ANNUAL'
                    ? ` /year  (≈ ${(parseFloat(formData.cost) / 12).toLocaleString('en-US', { maximumFractionDigits: 2 })}/mo)`
                    : ' /month'}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Department *</label>
                <select name="department" value={formData.department} onChange={handle}
                  className="w-full px-4 py-3 rounded-xl text-sm border"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Next Renewal Date *</label>
                <input type="date" name="nextRenewalDate"
                  value={formData.nextRenewalDate} onChange={handle}
                  min={new Date().toISOString().split('T')[0]}
                  className={inputClass(!!fieldErrors.nextRenewalDate)}
                  style={inputStyle(!!fieldErrors.nextRenewalDate)} />
                <FieldError msg={fieldErrors.nextRenewalDate} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Assigned Seats</label>
                  <input type="number" name="assignedSeats" min="1"
                    value={formData.assignedSeats} onChange={handle}
                    className={inputClass(!!fieldErrors.assignedSeats)}
                    style={inputStyle(!!fieldErrors.assignedSeats)} />
                  <FieldError msg={fieldErrors.assignedSeats} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--text-secondary)' }}>Used Seats</label>
                  <input type="number" name="usedSeats" min="0" max={formData.assignedSeats}
                    value={formData.usedSeats} onChange={handle}
                    className={inputClass(!!fieldErrors.usedSeats)}
                    style={inputStyle(!!fieldErrors.usedSeats)} />
                  <FieldError msg={fieldErrors.usedSeats} />
                </div>
              </div>

              {(() => {
                const a = parseInt(formData.assignedSeats, 10), u = parseInt(formData.usedSeats, 10);
                if (!isNaN(a) && a > 0 && !isNaN(u) && u >= 0 && u <= a) {
                  const pct = Math.round((u / a) * 100);
                  return (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>Utilization preview</span>
                        <span className="font-semibold"
                          style={{ color: pct < 60 ? 'var(--warning)' : 'var(--success)' }}>
                          {pct}%{pct < 60 ? ' — will be flagged as idle' : ''}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: pct < 60 ? 'var(--warning)' : 'var(--success)' }} />
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* ── Footer actions ── */}
          <div className="mt-8 pt-4 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
            {step > 1 ? (
              <button type="button" disabled={submitting}
                onClick={() => { setFieldErrors({}); setStep(s => s - 1); }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-colors"
                style={{ background: 'var(--accent)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-colors min-w-[160px] justify-center"
                style={{ background: 'var(--success)' }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Log Subscription</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogSubscriptionModal;
