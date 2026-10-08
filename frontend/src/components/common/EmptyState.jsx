import React from 'react';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-xl">
      {Icon && <Icon className="w-12 h-12 text-slate-500 mb-3" />}
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      {description && <p className="text-sm text-slate-400 max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
