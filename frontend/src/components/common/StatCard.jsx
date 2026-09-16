import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, trend, variant = 'purple' }) => {
  const glowClasses = {
    purple: 'hover:border-purple-500/40 hover:shadow-purple-500/10',
    emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    amber: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    red: 'hover:border-red-500/40 hover:shadow-red-500/10',
  };

  const iconBgClasses = {
    purple: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className={`glass-card glass-card-hover p-5 rounded-2xl border transition-all duration-300 ${glowClasses[variant] || ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${iconBgClasses[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-gray-400 mt-2 font-medium">{subtext}</p>}
    </div>
  );
};

export default StatCard;
