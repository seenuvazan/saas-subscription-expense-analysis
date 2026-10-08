import React from 'react';
import VendorLogo from '../common/VendorLogo';
import { formatDate, getDaysRemaining, formatCurrency, formatINRCompact, USD_TO_INR } from '../../utils/formatters';
import { Calendar } from 'lucide-react';

const RenewalTimeline = ({ subscriptions = [] }) => {
  const upcoming = [...subscriptions]
    .filter(s => s.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate))
    .slice(0, 6);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Calendar className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          Upcoming Renewals
        </h3>
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Next 30 days</span>
      </div>

      {/* List */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center px-6">
            <span className="text-3xl mb-2">🎉</span>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>All clear!</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>No renewals in the next 30 days.</p>
          </div>
        ) : (
          upcoming.map(sub => {
            const daysLeft = getDaysRemaining(sub.nextRenewalDate);
            const isUrgent  = daysLeft <= 7;
            const isWarning = daysLeft <= 14 && !isUrgent;

            return (
              <div
                key={sub.id}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors"
                style={{
                  background: isUrgent
                    ? 'rgba(239,68,68,0.04)'
                    : isWarning
                    ? 'rgba(245,158,11,0.04)'
                    : 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isUrgent ? 'rgba(239,68,68,0.04)' : isWarning ? 'rgba(245,158,11,0.04)' : 'transparent'; }}
              >
                <VendorLogo name={sub.vendorName} size="xs" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {sub.vendorName}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {sub.department}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    {formatINRCompact((sub.normalizedMonthlyCostUSD || sub.cost) * USD_TO_INR)}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    ${Math.round(sub.normalizedMonthlyCostUSD || sub.cost).toLocaleString()}
                  </p>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isUrgent ? 'var(--danger-muted)'
                        : isWarning ? 'var(--warning-muted)'
                        : 'var(--bg-elevated)',
                      color: isUrgent ? 'var(--danger)'
                        : isWarning ? 'var(--warning)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {daysLeft <= 0 ? 'Today' : `${daysLeft}d`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RenewalTimeline;
