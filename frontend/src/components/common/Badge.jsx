import React from 'react';

const Badge = ({ status }) => {
  const styles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    CANCELLED: 'bg-gray-800 text-gray-400 border-gray-700',
    UNDER_REVIEW: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    FLAGGED_IDLE: 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse',
    FLAGGED_DUPLICATE: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  const labels = {
    ACTIVE: 'Active',
    CANCELLED: 'Cancelled',
    UNDER_REVIEW: 'Under Review',
    FLAGGED_IDLE: 'Idle Waste',
    FLAGGED_DUPLICATE: 'Duplicate',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border inline-flex items-center gap-1.5 ${styles[status] || styles.ACTIVE}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status] || status}
    </span>
  );
};

export default Badge;
