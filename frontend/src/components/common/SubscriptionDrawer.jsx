import React from 'react';
import VendorLogo from './VendorLogo';
import Badge from './Badge';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/formatters';
import { X, Calendar, Users, DollarSign, RefreshCw, Tag, FileText, User } from 'lucide-react';

const Field = ({ label, children }) => (
  <div className="py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
    <div style={{ color: 'var(--text-primary)' }}>{children}</div>
  </div>
);

const SubscriptionDrawer = ({ subscription: sub, onClose, onUpdateStatus, onDelete }) => {
  if (!sub) return null;

  const utilization = sub.utilizationRate !== undefined
    ? sub.utilizationRate
    : (sub.assignedSeats > 0 ? (sub.usedSeats / sub.assignedSeats) * 100 : 100);

  const daysLeft = getDaysRemaining(sub.nextRenewalDate);
  const isUrgent = daysLeft <= 7;
  const isWarning = daysLeft <= 14;

  // Waste estimate when utilization < 60%
  const wastePerMonth = utilization < 60
    ? ((1 - utilization / 100) * Number(sub.normalizedMonthlyCostUSD || sub.cost || 0))
    : 0;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="drawer-panel">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <VendorLogo name={sub.vendorName} size="md" />
            <div>
              <h2 className="font-bold text-base leading-tight" style={{ color: 'var(--text-primary)' }}>
                {sub.vendorName}
              </h2>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {sub.department} · {sub.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-0">
          {/* Status chip */}
          <div className="flex items-center gap-2 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <Badge status={sub.status} daysLeft={daysLeft} />
            {isUrgent && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--danger-muted)', color: 'var(--danger)' }}>
                Renews in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
              </span>
            )}
            {isWarning && !isUrgent && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--warning-muted)', color: 'var(--warning)' }}>
                Renews in {daysLeft} days
              </span>
            )}
          </div>

          <Field label="Monthly Cost (USD)">
            <span className="text-2xl font-extrabold tabular-nums">
              {formatCurrency(sub.normalizedMonthlyCostUSD || sub.cost)}
            </span>
            <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
              / mo · {sub.billingFrequency}
            </span>
          </Field>

          <Field label="Next Renewal">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              {formatDate(sub.nextRenewalDate)}
              {daysLeft > 0 && (
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>({daysLeft} days)</span>
              )}
            </div>
          </Field>

          <Field label="Seat Utilization">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                  {sub.usedSeats} / {sub.assignedSeats} used
                </span>
                <span className="font-bold tabular-nums"
                  style={{ color: utilization < 60 ? 'var(--warning)' : 'var(--success)' }}>
                  {Math.round(utilization)}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(utilization, 100)}%`,
                    background: utilization < 60 ? 'var(--warning)' : 'var(--success)',
                  }}
                />
              </div>
              {wastePerMonth > 0 && (
                <p className="text-xs font-semibold" style={{ color: 'var(--warning)' }}>
                  ⚠ Wasting ~{formatCurrency(wastePerMonth)}/mo on unused seats
                </p>
              )}
            </div>
          </Field>

          <Field label="Department">
            <span className="text-sm font-medium">{sub.department}</span>
          </Field>

          <Field label="Category">
            <span className={`text-sm font-semibold cat-text-${sub.category}`}>{sub.category}</span>
          </Field>

          {sub.notes && (
            <Field label="Notes">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sub.notes}</p>
            </Field>
          )}

          {(sub.loggedByName || sub.loggedByEmail) && (
            <Field label="Logged By">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                <span>{sub.loggedByName || sub.loggedByEmail}</span>
              </div>
            </Field>
          )}
        </div>

        {/* Actions footer */}
        {(onUpdateStatus || onDelete) && (
          <div className="sticky bottom-0 px-6 py-4 border-t flex gap-3"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            {onUpdateStatus && sub.status !== 'CANCELLED' && (
              <button
                onClick={() => { onUpdateStatus(sub.id, 'CANCELLED'); onClose(); }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors"
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
                className="flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors"
                style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--success-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Reactivate
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => { if (window.confirm('Delete this subscription permanently?')) { onDelete(sub.id); onClose(); } }}
                className="px-4 py-2 text-sm font-semibold rounded-lg border transition-colors"
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
