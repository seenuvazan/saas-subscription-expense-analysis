import React, { useState } from 'react';
import AuditSoftwareTable from './AuditSoftwareTable';
import SubscriptionDrawer from '../common/SubscriptionDrawer';
import { DepartmentSpendChart, CategorySpendChart, MonthlyTrendChart } from './AnalyticsCharts';
import BudgetModal from './BudgetModal';
import { formatINRCompact, usdToINR, USD_TO_INR } from '../../utils/formatters';
import {
  TrendingUp, AlertTriangle, Calendar, Package,
  ArrowRight, ChevronRight, RefreshCw, Zap
} from 'lucide-react';

// ── Inline stat card ──────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, valueColor, trend }) => (
  <div className="card p-4 flex flex-col gap-1 hover:shadow-md transition-shadow">
    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    <p className="text-2xl font-bold text-currency leading-tight" style={{ color: valueColor || 'var(--text-primary)' }}>
      {value}
    </p>
    {sub && (
      <p className="text-xs" style={{ color: trend?.startsWith('+') ? 'var(--danger)' : trend?.startsWith('-') ? 'var(--success)' : 'var(--text-muted)' }}>
        {trend && <span className="font-semibold">{trend} </span>}
        {sub}
      </p>
    )}
  </div>
);

// ── Action item ───────────────────────────────────────────────────────────────
const ActionItem = ({ severity, vendor, desc, amount, cta, onClick }) => {
  const severityColor = severity === 'critical'
    ? { dot: 'var(--danger)', bg: 'var(--danger-muted)', text: 'var(--danger)' }
    : severity === 'warning'
    ? { dot: 'var(--warning)', bg: 'var(--warning-muted)', text: 'var(--warning)' }
    : { dot: 'var(--accent)', bg: 'var(--accent-muted)', text: 'var(--accent)' };

  return (
    <div className="action-card">
      <div
        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
        style={{ background: severityColor.dot }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{vendor}</span>
          {amount && (
            <span className="text-xs font-semibold text-currency" style={{ color: severityColor.text }}>
              {amount}
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-xs font-semibold flex-shrink-0 transition-colors"
        style={{ color: 'var(--accent)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent)'; }}
      >
        {cta} <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ── Budget progress row ───────────────────────────────────────────────────────
const BudgetRow = ({ dept, spent, budget }) => {
  const pct = Math.min((spent / budget) * 100, 100);
  const over = spent > budget;
  const color = over ? 'var(--danger)' : pct > 85 ? 'var(--warning)' : 'var(--success)';

  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border-light)' }}>
      <div className="w-28 flex-shrink-0">
        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{dept}</p>
      </div>
      <div className="flex-1">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
      <div className="w-28 text-right flex-shrink-0">
        <p className="text-xs font-semibold text-currency" style={{ color: over ? 'var(--danger)' : 'var(--text-primary)' }}>
          {formatINRCompact(spent)} / {formatINRCompact(budget)}
        </p>
        <p className="text-[10px]" style={{ color: over ? 'var(--danger)' : 'var(--text-muted)' }}>
          {over ? `${Math.round((spent / budget - 1) * 100)}% over` : `${Math.round(pct)}% used`}
        </p>
      </div>
    </div>
  );
};

// ── Main AdminDashboard ───────────────────────────────────────────────────────
const AdminDashboard = ({
  summary,
  subscriptions = [],
  onUpdateStatus,
  onDelete,
  onRefresh,
  onNavigateTab,
}) => {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [drawerSub, setDrawerSub]                 = useState(null);

  // Compute KPIs
  const activeSubs = subscriptions.filter(s => s.status !== 'CANCELLED');
  const totalMRR_USD = summary?.totalMonthlySpendUSD || activeSubs.reduce(
    (acc, s) => acc + Number(s.normalizedMonthlyCostUSD || s.cost || 0), 0
  );
  const totalMRR_INR = totalMRR_USD * USD_TO_INR;
  const totalARR_INR = totalMRR_INR * 12;

  const idleSubs = subscriptions.filter(s => s.status === 'FLAGGED_IDLE' || s.status === 'FLAGGED_DUPLICATE');
  const wastedINR = idleSubs.reduce((acc, s) => {
    const inr = s.currency === 'INR' ? s.cost : (s.normalizedMonthlyCostUSD || s.cost) * USD_TO_INR;
    return acc + inr;
  }, 0);

  const renewalsSoon = subscriptions.filter(s => {
    if (!s.nextRenewalDate || s.status === 'CANCELLED') return false;
    const days = Math.ceil((new Date(s.nextRenewalDate) - new Date()) / 86400000);
    return days >= 0 && days <= 30;
  }).length;

  const totalIdleSeats = subscriptions.reduce((acc, s) => {
    const idle = Math.max(0, (s.assignedSeats || 0) - (s.usedSeats || 0));
    if (s.status === 'FLAGGED_IDLE') return acc + idle;
    return acc;
  }, 0);

  // Budget data (INR)
  const budgetData = [
    { dept: 'Engineering', spent: 1330000, budget: 1520000 },
    { dept: 'Design',      spent: 253000,  budget: 340000 },
    { dept: 'Sales',       spent: 216000,  budget: 270000 },
    { dept: 'Marketing',   spent: 118000,  budget: 110000 },
    { dept: 'Product',     spent: 82000,   budget: 120000 },
  ];

  // Chart data
  const departmentData = summary?.departmentSpend || [
    { department: 'ENGINEERING', actualMonthlySpendUSD: 15150, budgetLimitUSD: 18000 },
    { department: 'DESIGN',      actualMonthlySpendUSD: 3000,  budgetLimitUSD: 4000 },
    { department: 'SALES',       actualMonthlySpendUSD: 2453,  budgetLimitUSD: 3200 },
    { department: 'MARKETING',   actualMonthlySpendUSD: 1400,  budgetLimitUSD: 1300 },
    { department: 'PRODUCT',     actualMonthlySpendUSD: 970,   budgetLimitUSD: 1420 },
  ];

  const categoryData = summary?.categorySpend || [
    { category: 'DEV',          monthlySpendUSD: 15150 },
    { category: 'PRODUCTIVITY', monthlySpendUSD: 7314 },
    { category: 'DESIGN',       monthlySpendUSD: 3000 },
    { category: 'SALES',        monthlySpendUSD: 2453 },
    { category: 'MARKETING',    monthlySpendUSD: 1400 },
  ];

  // Action items — ordered by severity
  const actions = [
    {
      severity: 'critical',
      vendor: 'AWS',
      desc: 'Renews in 4 days — review before auto-renewal window closes.',
      amount: `${formatINRCompact(8450 * USD_TO_INR)} annual commitment`,
      cta: 'Review Renewal',
    },
    {
      severity: 'critical',
      vendor: 'Sketch',
      desc: 'Renews in 6 days. Only 2 of 15 seats active. Duplicate of Figma.',
      amount: `${formatINRCompact(490 * USD_TO_INR * 12)}/yr — likely waste`,
      cta: 'Cancel Subscription',
    },
    {
      severity: 'warning',
      vendor: 'Figma',
      desc: '14 of 38 seats have had no activity in 60+ days.',
      amount: `${formatINRCompact(1800 * 0.37 * USD_TO_INR)}/mo potential saving`,
      cta: 'Review Licenses',
    },
    {
      severity: 'warning',
      vendor: 'Zoom',
      desc: '78 of 120 licenses unused since Microsoft Teams rollout.',
      amount: `${formatINRCompact(1600 * 0.65 * USD_TO_INR)}/mo potential saving`,
      cta: 'Compare Usage',
    },
    {
      severity: 'info',
      vendor: 'Marketing budget',
      desc: 'Freshworks Suite budget exceeded by 7% this month.',
      amount: undefined,
      cta: 'View Budget',
    },
  ];

  // Today's greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">

      {/* ── Greeting header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {greeting}, Priya
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Here's where your software spend stands today.
          </p>
        </div>
        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="btn-primary hidden sm:flex"
        >
          Configure Budgets
        </button>
      </div>

      {/* ── KPI strip ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <KPICard
          label="Monthly Spend"
          value={formatINRCompact(totalMRR_INR)}
          sub="vs last month"
          trend="+4.2%"
          valueColor="var(--text-primary)"
        />
        <KPICard
          label="Annual Commitment"
          value={formatINRCompact(totalARR_INR)}
          sub="projected FY spend"
          valueColor="var(--text-primary)"
        />
        <KPICard
          label="Potential Savings"
          value={formatINRCompact(wastedINR)}
          sub={`${idleSubs.length} tools flagged`}
          valueColor="var(--success)"
        />
        <KPICard
          label="Renewals in 30 days"
          value={renewalsSoon.toString()}
          sub="subscriptions due"
          valueColor={renewalsSoon > 5 ? 'var(--warning)' : 'var(--text-primary)'}
        />
        <KPICard
          label="Unused Licenses"
          value={totalIdleSeats.toString()}
          sub="across flagged tools"
          valueColor="var(--danger)"
        />
      </div>

      {/* ── Action center + Budget row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Action center — 2/3 width */}
        <div className="xl:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Needs your attention
                </h3>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'var(--danger-muted)', color: 'var(--danger)' }}
                >
                  {actions.filter(a => a.severity === 'critical').length} critical
                </span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('audit')}
                className="text-xs font-medium flex items-center gap-1 transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              {actions.map((action, i) => (
                <ActionItem key={i} {...action} onClick={() => {}} />
              ))}
            </div>
          </div>
        </div>

        {/* Budget overview — 1/3 width */}
        <div className="xl:col-span-1">
          <div className="card overflow-hidden h-full">
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Budget Usage
              </h3>
              <button
                onClick={() => onNavigateTab && onNavigateTab('budgets')}
                className="text-xs font-medium flex items-center gap-1 transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="px-5 py-3">
              {budgetData.map(b => (
                <BudgetRow key={b.dept} dept={b.dept} spent={b.spent} budget={b.budget} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepartmentSpendChart data={departmentData} />
        </div>
        <div className="lg:col-span-1">
          <CategorySpendChart data={categoryData} />
        </div>
      </div>

      {/* ── Monthly trend ───────────────────────────────────────────────────── */}
      <MonthlyTrendChart />

      {/* ── Full subscription table ─────────────────────────────────────────── */}
      <AuditSoftwareTable
        subscriptions={subscriptions}
        onUpdateStatus={onUpdateStatus}
        onDelete={onDelete}
        onOpenDrawer={setDrawerSub}
      />

      {/* Budget Modal */}
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
