import React from 'react';

const BADGE_CONFIG = {
  ACTIVE: {
    label: 'Active',
    bg: 'var(--success-muted)',
    color: 'var(--success)',
    dot: 'var(--success)',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'var(--bg-elevated)',
    color: 'var(--text-muted)',
    dot: 'var(--text-muted)',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'var(--accent-muted)',
    color: 'var(--accent)',
    dot: 'var(--accent)',
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    bg: 'var(--accent-muted)',
    color: 'var(--accent)',
    dot: 'var(--accent)',
  },
  FLAGGED_IDLE: {
    label: 'Underused',
    bg: 'var(--warning-muted)',
    color: 'var(--warning)',
    dot: 'var(--warning)',
  },
  FLAGGED_DUPLICATE: {
    label: 'Duplicate',
    bg: 'var(--danger-muted)',
    color: 'var(--danger)',
    dot: 'var(--danger)',
  },
  EXPIRING_SOON: {
    label: 'Expiring Soon',
    bg: 'var(--danger-muted)',
    color: 'var(--danger)',
    dot: 'var(--danger)',
    pulse: true,
  },
};

const Badge = ({ status, daysLeft }) => {
  // Derive expiring-soon from daysLeft if status is still ACTIVE
  const effectiveStatus =
    status === 'ACTIVE' && daysLeft !== undefined && daysLeft <= 7
      ? 'EXPIRING_SOON'
      : status;

  const cfg = BADGE_CONFIG[effectiveStatus] || {
    label: effectiveStatus || 'Unknown',
    bg: 'var(--bg-elevated)',
    color: 'var(--text-secondary)',
    dot: 'var(--text-secondary)',
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={{
        background: cfg.bg,
        color: cfg.color,
        borderColor: cfg.color + '33', // 20% opacity border
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.pulse ? 'animate-pulse' : ''}`}
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
};

export default Badge;
