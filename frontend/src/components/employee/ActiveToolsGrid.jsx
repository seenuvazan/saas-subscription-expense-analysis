import React from 'react';
import Badge from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Users, Calendar, Tag, ExternalLink } from 'lucide-react';

const ActiveToolsGrid = ({ subscriptions = [], onEditStatus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((sub) => {
        const utilization = sub.utilizationRate !== undefined
          ? sub.utilizationRate
          : (sub.assignedSeats > 0 ? (sub.usedSeats / sub.assignedSeats * 100) : 100);

        return (
          <div
            key={sub.id}
            className="glass-card glass-card-hover p-5 rounded-2xl border border-gray-800 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-extrabold text-base text-white">{sub.vendorName}</h4>
                  <span className="text-xs text-indigo-400 font-medium">{sub.category}</span>
                </div>
                <Badge status={sub.status} />
              </div>

              {/* Cost & Billing */}
              <div className="my-3 py-3 border-y border-gray-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">
                    {formatCurrency(sub.normalizedMonthlyCostUSD || sub.cost)}
                  </span>
                  <span className="text-xs text-gray-400 font-medium"> / mo USD</span>
                </div>
                <span className="text-xs font-semibold uppercase px-2 py-0.5 bg-gray-800 text-gray-300 rounded">
                  {sub.billingFrequency}
                </span>
              </div>

              {/* Details & Seats */}
              <div className="space-y-2 text-xs text-gray-400 mb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" /> Seats</span>
                  <span className="font-semibold text-gray-200">{sub.usedSeats} / {sub.assignedSeats} ({Math.round(utilization)}%)</span>
                </div>

                {/* Utilization Progress Bar */}
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      utilization < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-500" /> Renewal</span>
                  <span className="font-medium text-gray-300">{formatDate(sub.nextRenewalDate)}</span>
                </div>
              </div>
            </div>

            {/* Card Action Footer */}
            {onEditStatus && (
              <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium">{sub.department} Dept</span>
                {sub.status !== 'CANCELLED' ? (
                  <button
                    onClick={() => onEditStatus(sub.id, 'CANCELLED')}
                    className="text-xs text-red-400 hover:text-red-300 hover:underline font-semibold"
                  >
                    Cancel Tool
                  </button>
                ) : (
                  <button
                    onClick={() => onEditStatus(sub.id, 'ACTIVE')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-semibold"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActiveToolsGrid;
