import React from 'react';

const VARIANT_STYLES = {
  blue:    { iconBg: 'var(--accent-muted)',   iconColor: 'var(--accent)',   accent: 'var(--accent)' },
  purple:  { iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8B5CF6',         accent: '#8B5CF6' },
  emerald: { iconBg: 'var(--success-muted)',  iconColor: 'var(--success)',  accent: 'var(--success)' },
  amber:   { iconBg: 'var(--warning-muted)',  iconColor: 'var(--warning)',  accent: 'var(--warning)' },
  red:     { iconBg: 'var(--danger-muted)',   iconColor: 'var(--danger)',   accent: 'var(--danger)' },
};

const StatCard = ({ title, value, subtext, icon: Icon, trend, variant = 'blue' }) => {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.blue;

  return (
    <div
      className="glass-card glass-card-hover p-5 rounded-card"
      style={{ borderLeft: `3px solid ${v.accent}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </span>
        {Icon && (
          <div
            className="p-2.5 rounded-xl"
            style={{ background: v.iconBg }}
          >
            <Icon className="w-5 h-5" style={{ color: v.iconColor }} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3
          className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </h3>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend.startsWith('+') ? 'var(--success-muted)' : 'var(--danger-muted)',
              color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
          {subtext}
        </p>
      )}
    </div>
  );
};

export default StatCard;
