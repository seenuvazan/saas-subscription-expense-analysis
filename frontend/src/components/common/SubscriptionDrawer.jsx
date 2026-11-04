import React from 'react';
import VendorLogo from './VendorLogo';
import Badge from './Badge';
import {
  formatDate, getDaysRemaining, formatINRCompact, USD_TO_INR
} from '../../utils/formatters';
import {
  X, Calendar, Users, User, Tag, FileText,
  ExternalLink, AlertTriangle, TrendingDown
} from 'lucide-react';

const Field = ({ label, children, last = false }) => (
  <div className="py-3" style={{ borderBottom: last ? 'none' : '1px solid var(--border-light)' }}>
    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
      {label}
    </p>
    <div style={{ color: 'var(--text-primary)' }}>{children}</div>
  </div>
);

const SubscriptionDrawer = ({ subscription: sub, onClose, onUpdateStatus, onDelete }) => {
  if (!sub) return null;

  const utilization = sub.utilizationRate !== undefined
    ? sub.utilizationRate
    : (sub.assignedSeats > 0 ? (sub.usedSeats / sub.assignedSeats) * 100 : 100);

  const daysLeft  = getDaysRemaining(sub.nextRenewalDate);
  const isUrgent  = daysLeft <= 7;
  const isWarning = daysLeft <= 30;

  const inrMonthly = sub.currency === 'INR'
    ? sub.cost
    : (sub.normalizedMonthlyCostUSD || sub.cost || 0) * USD_TO_INR;
  const inrAnnual = sub.billingFrequency === 'ANNUAL' ? inrMonthly : inrMonthly * 12;

  const wasteINR = utilization < 60
    ? ((1 - utilization / 100) * inrMonthly)
    : 0;

  const utilColor = utilization < 50
    ? 'var(--danger)'
    : utilization < 80
    ? 'var(--warning)'
    : 'var(--success)';

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Panel */}
      <div className="drawer-panel">
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <VendorLogo vendorName={sub.vendorName} size="md" />
            <div className="min-w-0">
              <h2 className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                {sub.vendorName}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {sub.department} · {sub.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors flex-shrink-0 ml-2"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cost hero */}
        <div className="px-5 py-5 border-b" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Monthly Cost (INR)
              </p>
              <p className="text-2xl font-bold text-currency" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {formatINRCompact(inrMonthly)}
              </p>
              {sub.currency !== 'INR' && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {sub.currency} {Number(sub.cost || 0).toLocaleString('en-US')} · @₹{USD_TO_INR}/USD
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Annual Value
              </p>
              <p className="text-lg font-bold text-currency" style={{ color: 'var(--text-primary)' }}>
                {formatINRCompact(inrAnnual)}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {sub.billingFrequency || 'MONTHLY'}
              </p>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge status={sub.status} daysLeft={daysLeft} />
            {isUrgent && (
              <span className="badge badge-danger">
                <AlertTriangle className="w-3 h-3" />
                Renews in {daysLeft}d
              </span>
            )}
            {isWarning && !isUrgent && (
              <span className="badge badge-warning">Renews in {daysLeft} days</span>
            )}
            {wasteINR > 0 && (
              <span className="badge badge-warning">
                <TrendingDown className="w-3 h-3" />
                ~{formatINRCompact(wasteINR)}/mo waste
              </span>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="px-5 py-1">
          {/* Utilization */}
          <Field label="License Utilization">
            <div className="flex items-center justify-between text-sm mb-2">
              <span style={{ color: 'var(--text-secondary)' }}>
                {sub.usedSeats} of {sub.assignedSeats} seats used
              </span>
              <span className="font-semibold tabular-nums" style={{ color: utilColor }}>
                {Math.round(utilization)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(utilization, 100)}%`, background: utilColor }}
              />
            </div>
          </Field>

          {/* Renewal */}
          <Field label="Next Renewal">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
              <span className="font-medium">
                {sub.nextRenewalDate ? formatDate(sub.nextRenewalDate) : '—'}
              </span>
              {daysLeft > 0 && sub.nextRenewalDate && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({daysLeft} days)</span>
              )}
            </div>
          </Field>

          {/* Owner */}
          <Field label="Business Owner">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
              {sub.owner ? (
                <span className="font-medium">{sub.owner}</span>
              ) : (
                <span className="italic" style={{ color: 'var(--danger)' }}>No owner assigned</span>
              )}
            </div>
          </Field>

          {/* Cost center */}
          {sub.costCenter && (
            <Field label="Cost Center">
              <span className="text-sm font-medium">{sub.costCenter}</span>
            </Field>
          )}

          {/* Notes */}
          {sub.notes && (
            <Field label="Notes">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {sub.notes}
              </p>
            </Field>
          )}

          {/* Logged by */}
          {(sub.loggedByName || sub.loggedByEmail) && (
            <Field label="Added by" last>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {sub.loggedByName || sub.loggedByEmail}
              </p>
            </Field>
          )}
        </div>

        {/* Footer actions */}
        {(onUpdateStatus || onDelete) && (
          <div
            className="sticky bottom-0 px-5 py-4 border-t flex gap-2.5"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            {onUpdateStatus && sub.status !== 'CANCELLED' && (
              <button
                onClick={() => { onUpdateStatus(sub.id, 'CANCELLED'); onClose(); }}
                className="flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors"
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Cancel Subscription
              </button>
            )}
            {onUpdateStatus && sub.status === 'CANCELLED' && (
              <button
                onClick={() => { onUpdateStatus(sub.id, 'ACTIVE'); onClose(); }}
                className="flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors"
                style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--success-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Reactivate
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`Remove ${sub.vendorName} from subscription inventory?`)) {
                    onDelete(sub.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SubscriptionDrawer;
