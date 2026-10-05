import React, { useState } from 'react';
import StatCard from '../common/StatCard';
import AuditSoftwareTable from './AuditSoftwareTable';
import SubscriptionDrawer from '../common/SubscriptionDrawer';
import { DepartmentSpendChart, CategorySpendChart, MonthlyTrendChart } from './AnalyticsCharts';
import BudgetModal from './BudgetModal';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, TrendingUp, AlertTriangle, ShieldCheck, CreditCard, Layers } from 'lucide-react';

const AdminDashboard = ({ summary, subscriptions = [], onUpdateStatus, onDelete, onRefresh }) => {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [drawerSub, setDrawerSub] = useState(null);

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
      <div
        className="rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, var(--bg-surface) 60%)',
          borderColor: 'var(--border)',
        }}
      >
        <div>
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 border"
            style={{ background: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            <ShieldCheck className="w-3 h-3" /> Finance Admin
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            SaaS Spend &amp; Waste Analytics
          </h2>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Organization-wide spend, ARR projection, utilization flags, and budget limits.
          </p>
        </div>
        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-colors flex-shrink-0"
          style={{ background: 'var(--accent)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
        >
          <CreditCard className="w-4 h-4" /> Configure Budgets
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
        onOpenDrawer={setDrawerSub}
      />

      {/* Budget Configuration Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={() => { if (onRefresh) onRefresh(); }}
      />

      {/* Subscription Drawer */}
      {drawerSub && (
        <SubscriptionDrawer
          subscription={drawerSub}
          onClose={() => setDrawerSub(null)}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
