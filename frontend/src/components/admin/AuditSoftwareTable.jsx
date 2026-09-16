import React, { useState } from 'react';
import Badge from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { DEPARTMENTS } from '../../utils/constants';
import { AlertOctagon, Search, Filter, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

const AuditSoftwareTable = ({ subscriptions = [], onUpdateStatus, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubs = subscriptions.filter(sub => {
    const matchesStatus = filterStatus === 'ALL' || sub.status === filterStatus;
    const matchesDept = filterDept === 'ALL' || sub.department === filterDept;
    const matchesSearch = !searchTerm || sub.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDept && matchesSearch;
  });

  return (
    <div className="glass-card rounded-2xl border border-gray-800 overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-gray-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" /> Organization SaaS Audit & Optimization
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Identify underutilized, idle, or redundant software licenses across departments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="FLAGGED_IDLE">Idle Waste</option>
            <option value="FLAGGED_DUPLICATE">Duplicates</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Department Filter */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Quick Search */}
          <input
            type="text"
            placeholder="Filter vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 focus:outline-none w-36"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-900/60 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-3.5 px-5">Vendor Tool</th>
              <th className="py-3.5 px-5">Department</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Monthly Spend (USD)</th>
              <th className="py-3.5 px-5">Seat Utilization</th>
              <th className="py-3.5 px-5">Status Flag</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No matching software tools found.
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => {
                const utilRatio = sub.utilizationRate !== undefined
                  ? sub.utilizationRate
                  : (sub.assignedSeats > 0 ? (sub.usedSeats / sub.assignedSeats * 100) : 100);

                return (
                  <tr key={sub.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                      {sub.vendorName}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-gray-300">{sub.department}</td>
                    <td className="py-3.5 px-5 text-indigo-400 font-medium">{sub.category}</td>
                    <td className="py-3.5 px-5 font-extrabold text-white">
                      {formatCurrency(sub.normalizedMonthlyCostUSD || sub.cost)}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-200">
                          {sub.usedSeats}/{sub.assignedSeats} ({Math.round(utilRatio)}%)
                        </span>
                        {utilRatio < 50 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                            Low Usage
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge status={sub.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      {sub.status !== 'CANCELLED' ? (
                        <button
                          onClick={() => onUpdateStatus(sub.id, 'CANCELLED')}
                          className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold transition-all"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(sub.id, 'ACTIVE')}
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-semibold transition-all"
                        >
                          Activate
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(sub.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete tool record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditSoftwareTable;
