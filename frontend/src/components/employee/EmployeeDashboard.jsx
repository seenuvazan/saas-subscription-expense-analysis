import React, { useState } from 'react';
import StatCard from '../common/StatCard';
import RenewalTimeline from './RenewalTimeline';
import ActiveToolsGrid from './ActiveToolsGrid';
import LogSubscriptionModal from './LogSubscriptionModal';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { PlusCircle, Layers, DollarSign, Calendar, Sparkles } from 'lucide-react';

const EmployeeDashboard = ({ subscriptions = [], onRefresh, onLogClick }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deptSubs = subscriptions.filter(s =>
    user?.role === 'ROLE_ADMIN' || s.department === user?.department
  );

  const totalSpend = deptSubs
    .filter(s => s.status !== 'CANCELLED')
    .reduce((acc, s) => acc + Number(s.normalizedMonthlyCostUSD || s.cost || 0), 0);

  const activeCount = deptSubs.filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Banner & Log CTA */}
      <div className="glass-card p-6 rounded-3xl border border-gray-800 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-gray-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Departmental Portal
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.fullName}!
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
            Track active tools, log new software subscriptions, and monitor upcoming renewal timelines for the <strong className="text-gray-200">{user?.department}</strong> department.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all glow-purple"
        >
          <PlusCircle className="w-4 h-4" /> Log New Subscription
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Software Tools"
          value={activeCount}
          subtext={`Assigned to ${user?.department}`}
          icon={Layers}
          variant="purple"
        />
        <StatCard
          title="Monthly Dept Spend"
          value={formatCurrency(totalSpend)}
          subtext="Normalized USD baseline"
          icon={DollarSign}
          variant="emerald"
        />
        <StatCard
          title="Next Renewal Due"
          value={deptSubs.length > 0 ? '4 Days' : 'None'}
          subtext="AWS Cloud Services"
          icon={Calendar}
          variant="amber"
        />
      </div>

      {/* Main Grid: Timeline + Active Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RenewalTimeline subscriptions={deptSubs} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Department Subscriptions</h3>
            <span className="text-xs text-gray-400 font-medium">{deptSubs.length} Tools Logged</span>
          </div>
          <ActiveToolsGrid subscriptions={deptSubs} />
        </div>
      </div>

      {/* Log Subscription Modal */}
      <LogSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
        initialDept={user?.department}
      />
    </div>
  );
};

export default EmployeeDashboard;
