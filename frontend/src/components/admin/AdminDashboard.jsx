import React, { useState } from 'react';
import StatCard from '../common/StatCard';
import AuditSoftwareTable from './AuditSoftwareTable';
import { DepartmentSpendChart, CategorySpendChart, MonthlyTrendChart } from './AnalyticsCharts';
import BudgetModal from './BudgetModal';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, TrendingUp, AlertTriangle, ShieldCheck, CreditCard, Sparkles, Layers } from 'lucide-react';

const AdminDashboard = ({ summary, subscriptions = [], onUpdateStatus, onDelete, onRefresh }) => {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const totalMRR = summary?.totalMonthlySpendUSD || subscriptions
    .filter(s => s.status !== 'CANCELLED')
    .reduce((acc, s) => acc + Number(s.normalizedMonthlyCostUSD || s.cost || 0), 0);

  const totalARR = summary?.projectedAnnualSpendUSD || (totalMRR * 12);

  const activeCount = summary?.activeSubscriptionsCount || subscriptions
    .filter(s => s.status === 'ACTIVE').length;

  const idleCount = summary?.idleCount || subscriptions
    .filter(s => s.status === 'FLAGGED_IDLE').length;

  const duplicateCount = summary?.duplicateCount || subscriptions
    .filter(s => s.status === 'FLAGGED_DUPLICATE').length;

  const wastedSpend = summary?.wastedMonthlySpendUSD || subscriptions
    .filter(s => s.status === 'FLAGGED_IDLE' || s.status === 'FLAGGED_DUPLICATE')
    .reduce((acc, s) => acc + Number(s.normalizedMonthlyCostUSD || s.cost || 0), 0);

  const departmentData = summary?.departmentSpend || [
    { department: 'ENGINEERING', actualMonthlySpendUSD: 15150, budgetLimitUSD: 18000 },
    { department: 'DESIGN', actualMonthlySpendUSD: 2790, budgetLimitUSD: 4000 },
    { department: 'SALES', actualMonthlySpendUSD: 14200, budgetLimitUSD: 12000 },
    { department: 'MARKETING', actualMonthlySpendUSD: 4800, budgetLimitUSD: 8000 },
    { department: 'HR', actualMonthlySpendUSD: 1200, budgetLimitUSD: 3500 },
    { department: 'PRODUCTIVITY', actualMonthlySpendUSD: 2400, budgetLimitUSD: 5000 },
  ];

  const categoryData = summary?.categorySpend || [
    { category: 'DEV', monthlySpendUSD: 15150 },
    { category: 'SALES', monthlySpendUSD: 14200 },
    { category: 'MARKETING', monthlySpendUSD: 4800 },
    { category: 'DESIGN', monthlySpendUSD: 2790 },
    { category: 'PRODUCTIVITY', monthlySpendUSD: 2400 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-gray-800 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-gray-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Finance Administrator Portal
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Executive SaaS Spend & Waste Analytics
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Organization-wide oversight of software recurring spend, projected ARR, redundant tooling flags, and departmental budget threshold limits.
          </p>
        </div>

        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all glow-purple"
        >
          <CreditCard className="w-4 h-4" /> Configure Dept Budgets
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Spend (MRR)"
          value={formatCurrency(totalMRR)}
          subtext="Normalized USD total"
          icon={DollarSign}
          trend="+4.2%"
          variant="purple"
        />
        <StatCard
          title="Projected Annual (ARR)"
          value={formatCurrency(totalARR)}
          subtext="MRR × 12 months"
          icon={TrendingUp}
          variant="emerald"
        />
        <StatCard
          title="Active Licenses"
          value={activeCount}
          subtext={`Across ${departmentData.length} departments`}
          icon={Layers}
          variant="emerald"
        />
        <StatCard
          title="Monthly Idle/Duplicate Waste"
          value={formatCurrency(wastedSpend)}
          subtext={`${idleCount + duplicateCount} tools flagged for review`}
          icon={AlertTriangle}
          variant="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepartmentSpendChart data={departmentData} />
        </div>
        <div className="lg:col-span-1">
          <CategorySpendChart data={categoryData} />
        </div>
      </div>

      {/* Trend Line Chart */}
      <MonthlyTrendChart />

      {/* Organizational SaaS Audit Table */}
      <AuditSoftwareTable
        subscriptions={subscriptions}
        onUpdateStatus={onUpdateStatus}
        onDelete={onDelete}
      />

      {/* Budget Configuration Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
