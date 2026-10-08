import React, { useState, useRef, useEffect } from 'react';
import VendorLogo from '../common/VendorLogo';
import Badge from '../common/Badge';
import { formatCurrency, formatDate, getDaysRemaining, formatINRCompact, USD_TO_INR } from '../../utils/formatters';
import { Users, Calendar, MoreVertical, Eye, X, RefreshCw } from 'lucide-react';

// ── Quick-action menu (three-dot) ───────────────────────────────────────────
const QuickMenu = ({ sub, onView, onCancel, onActivate, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handle = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const item = (label, icon, color, action) => (
    <button
      key={label}
      onClick={() => { action(); onClose(); }}
      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left"
      style={{ color: color || 'var(--text-primary)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      ref={menuRef}
      className="absolute top-10 right-2 w-44 rounded-xl border shadow-lg z-30 overflow-hidden animate-scale-in"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {item('View Details', <Eye className="w-4 h-4" />, null, onView)}
      {sub.status !== 'CANCELLED'
        ? item('Cancel', <X className="w-4 h-4" />, 'var(--danger)', onCancel)
        : item('Reactivate', <RefreshCw className="w-4 h-4" />, 'var(--success)', onActivate)
      }
    </div>
  );
};

// ── Main grid ───────────────────────────────────────────────────────────────
const ActiveToolsGrid = ({ subscriptions = [], onEditStatus, onOpenDrawer }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (subscriptions.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed flex flex-col items-center justify-center py-16 text-center"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        <div className="text-4xl mb-3">📋</div>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>No subscriptions yet</p>
        <p className="text-xs mt-1">Log your first subscription using the button above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map(sub => {
        const utilization = sub.utilizationRate !== undefined
          ? sub.utilizationRate
          : (sub.assignedSeats > 0 ? (sub.usedSeats / sub.assignedSeats) * 100 : 100);

        const daysLeft = getDaysRemaining(sub.nextRenewalDate);
        const isUrgent = daysLeft <= 7;
        const isWarning = daysLeft <= 14 && !isUrgent;

        const wastePerMonth = utilization < 60
          ? ((1 - utilization / 100) * Number(sub.normalizedMonthlyCostUSD || sub.cost || 0))
          : 0;

        return (
          <div
            key={sub.id}
            className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col cursor-pointer"
            onClick={() => { if (onOpenDrawer) onOpenDrawer(sub); }}
          >
            {/* Category colour strip */}
            <div className={`h-1.5 w-full cat-strip-${sub.category || 'OTHER'}`} />

            <div className="p-4 flex flex-col gap-3 flex-1">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <VendorLogo name={sub.vendorName} size="sm" />
                  <div className="min-w-0">
                    <h4
                      className="font-bold text-sm leading-tight truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {sub.vendorName}
                    </h4>
                    <span className={`text-xs font-medium cat-text-${sub.category || 'OTHER'}`}>
                      {sub.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge status={sub.status} daysLeft={daysLeft} />

                  {/* Three-dot quick-actions */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === sub.id ? null : sub.id)}
                      className="p-1 rounded-lg transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === sub.id && (
                      <QuickMenu
                        sub={sub}
                        onView={() => { if (onOpenDrawer) onOpenDrawer(sub); }}
                        onCancel={() => { if (onEditStatus) onEditStatus(sub.id, 'CANCELLED'); }}
                        onActivate={() => { if (onEditStatus) onEditStatus(sub.id, 'ACTIVE'); }}
                        onClose={() => setOpenMenuId(null)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div
                className="py-2.5 border-y flex items-baseline justify-between"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <span
                    className="text-xl font-extrabold tabular-nums"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {formatINRCompact((sub.normalizedMonthlyCostUSD || sub.cost) * USD_TO_INR)}
                  </span>
                  <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>/mo</span>
                  <span className="text-[11px] block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    ${Math.round(sub.normalizedMonthlyCostUSD || sub.cost).toLocaleString()} USD
                  </span>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                >
                  {sub.billingFrequency}
                </span>
              </div>

              {/* Seat utilization */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <Users className="w-3 h-3" /> {sub.usedSeats}/{sub.assignedSeats} seats
                  </span>
                  <span
                    className="font-semibold tabular-nums"
                    style={{ color: utilization < 60 ? 'var(--warning)' : 'var(--success)' }}
                  >
                    {Math.round(utilization)}%
                  </span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--bg-elevated)' }}
                  title={wastePerMonth > 0 ? `Wasting ~${formatINRCompact(wastePerMonth * USD_TO_INR)}/month on unused seats` : undefined}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(utilization, 100)}%`,
                      background: utilization < 60 ? 'var(--warning)' : 'var(--success)',
                    }}
                  />
                </div>
                {wastePerMonth > 0 && (
                  <p className="text-[11px] font-medium" style={{ color: 'var(--warning)' }}>
                    ⚠ ~{formatINRCompact(wastePerMonth * USD_TO_INR)}/mo wasted
                  </p>
                )}
              </div>

              {/* Renewal countdown */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <Calendar className="w-3 h-3" /> Renewal
                </span>
                <span
                  className="font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: isUrgent ? 'var(--danger-muted)'
                      : isWarning ? 'var(--warning-muted)'
                      : 'var(--bg-elevated)',
                    color: isUrgent ? 'var(--danger)'
                      : isWarning ? 'var(--warning)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {daysLeft <= 0 ? 'Today' : `${daysLeft}d (${formatDate(sub.nextRenewalDate)})`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActiveToolsGrid;
