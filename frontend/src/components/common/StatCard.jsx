import React from 'react';

const VARIANT_STYLES = {
  blue:    { iconBg: 'var(--accent-muted)',   iconColor: 'var(--accent)',   accent: 'var(--accent)' },
  purple:  { iconBg: 'rgba(124,58,237,0.10)', iconColor: '#7C3AED',        accent: '#7C3AED' },
  emerald: { iconBg: 'var(--success-muted)',  iconColor: 'var(--success)', accent: 'var(--success)' },
  amber:   { iconBg: 'var(--warning-muted)',  iconColor: 'var(--warning)', accent: 'var(--warning)' },
  red:     { iconBg: 'var(--danger-muted)',   iconColor: 'var(--danger)',  accent: 'var(--danger)' },
};

const StatCard = ({ title, value, subtext, icon: Icon, trend, variant = 'blue' }) => {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.blue;
  const trendPositive = trend && (trend.startsWith('+') || trend.startsWith('↑'));
  const trendNegative = trend && (trend.startsWith('-') || trend.startsWith('↓'));

  return (
    <div
      className="card p-5 hover:shadow-md transition-shadow"
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
            className="p-2 rounded-lg flex-shrink-0"
            style={{ background: v.iconBg }}
          >
            <Icon className="w-4 h-4" style={{ color: v.iconColor }} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3
          className="text-2xl font-bold tracking-tight text-currency"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
        >
          {value}
        </h3>
        {trend && (
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: trendPositive ? 'var(--success-muted)' : trendNegative ? 'var(--danger-muted)' : 'var(--bg-elevated)',
              color: trendPositive ? 'var(--success)' : trendNegative ? 'var(--danger)' : 'var(--text-secondary)',
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
          {subtext}
        </p>
      )}
    </div>
  );
};

export default StatCard;
