import React from 'react';
import { formatDate, getDaysRemaining, formatCurrency } from '../../utils/formatters';
import { Calendar, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

const RenewalTimeline = ({ subscriptions = [] }) => {
  const upcoming = [...subscriptions]
    .filter(s => s.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate))
    .slice(0, 5);

  return (
    <div className="glass-card p-6 rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" /> Upcoming Renewals Timeline
        </h3>
        <span className="text-xs text-gray-400">Next 30 Days</span>
      </div>

      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">No renewals scheduled soon.</p>
        ) : (
          upcoming.map((sub) => {
            const daysLeft = getDaysRemaining(sub.nextRenewalDate);
            const isUrgent = daysLeft <= 7;
            const isWarning = daysLeft <= 14 && daysLeft > 7;

            return (
              <div
                key={sub.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isUrgent
                    ? 'bg-red-500/10 border-red-500/30'
                    : isWarning
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">{sub.vendorName}</h4>
                    <p className="text-xs text-gray-400">
                      {sub.department} • {sub.category}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-white block">
                    {formatCurrency(sub.normalizedMonthlyCostUSD || sub.cost)}/mo
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                    isUrgent
                      ? 'bg-red-500/20 text-red-300'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-gray-400'
                  }`}>
                    {daysLeft <= 0 ? 'Renews Today' : `In ${daysLeft} days (${formatDate(sub.nextRenewalDate)})`}
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
