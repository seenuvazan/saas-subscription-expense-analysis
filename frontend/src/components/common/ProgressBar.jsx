import React from 'react';

export function ProgressBar({ value = 0, max = 100, label, color = 'indigo' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors[color] || colors.indigo}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
