import React, { useState } from 'react';
import StatCard from '../common/StatCard';
import RenewalTimeline from './RenewalTimeline';
import ActiveToolsGrid from './ActiveToolsGrid';
import LogSubscriptionModal from './LogSubscriptionModal';
import SubscriptionDrawer from '../common/SubscriptionDrawer';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, getDaysRemaining, formatINRCompact, USD_TO_INR } from '../../utils/formatters';
import { PlusCircle, Layers, IndianRupee, Calendar } from 'lucide-react';

// ── Abstract SVG hero pattern ────────────────────────────────────────────────
const HeroPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hero-grid)" />
    <circle cx="80%" cy="50%" r="120" fill="currentColor" opacity="0.08" />
    <circle cx="20%" cy="80%" r="80" fill="currentColor" opacity="0.06" />
  </svg>
);

// ── Main component ───────────────────────────────────────────────────────────
const EmployeeDashboard = ({ subscriptions = [], onRefresh, onError }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drawerSub, setDrawerSub] = useState(null);

  const deptSubs = subscriptions.filter(s =>
    user?.role === 'ROLE_ADMIN' || s.department === user?.department
  );

  const totalSpend = deptSubs
    .filter(s => s.status !== 'CANCELLED')
    .reduce((acc, s) => acc + Number(s.normalizedMonthlyCostUSD || s.cost || 0), 0);

  const activeCount = deptSubs.filter(s => s.status === 'ACTIVE').length;

  // Next renewal
  const nextRenewal = [...deptSubs]
    .filter(s => s.status !== 'CANCELLED' && getDaysRemaining(s.nextRenewalDate) >= 0)
    .sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate))[0];
  const nextDays = nextRenewal ? getDaysRemaining(nextRenewal.nextRenewalDate) : null;

  return (
    <div className="space-y-6">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 border"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, var(--bg-surface) 60%)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        <HeroPattern />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 border"
              style={{ background: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <Layers className="w-3 h-3" /> Departmental Portal
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Welcome back, {user?.firstName || user?.fullName?.split(' (')[0]?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-sm mt-1 max-w-md" style={{ color: 'var(--text-secondary)' }}>
              Track active tools and monitor renewal timelines for the{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{user?.department}</strong> department.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-colors flex-shrink-0"
            style={{ background: 'var(--accent)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
          >
            <PlusCircle className="w-4 h-4" /> Log New Subscription
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Tools"
          value={activeCount}
          subtext={`In ${user?.department} dept`}
          icon={Layers}
          variant="blue"
        />
        <StatCard
          title="Monthly Dept Spend"
          value={formatINRCompact(totalSpend * USD_TO_INR)}
          subtext={`≈ $${Math.round(totalSpend).toLocaleString()} USD/mo`}
          icon={IndianRupee}
          variant="emerald"
        />
        <StatCard
          title="Next Renewal"
          value={nextDays !== null ? `${nextDays}d` : '—'}
          subtext={nextRenewal ? nextRenewal.vendorName : 'No upcoming renewals'}
          icon={Calendar}
          variant={nextDays !== null && nextDays <= 7 ? 'red' : nextDays !== null && nextDays <= 14 ? 'amber' : 'blue'}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RenewalTimeline subscriptions={deptSubs} />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Department Subscriptions
            </h3>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {deptSubs.length} tools
            </span>
          </div>
          <ActiveToolsGrid
            subscriptions={deptSubs}
            onOpenDrawer={setDrawerSub}
          />
        </div>
      </div>

      {/* Log Subscription Modal */}
      <LogSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          if (onRefresh) onRefresh();
        }}
        onError={(msg) => { if (onError) onError(msg); }}
        initialDept={user?.department}
      />

      {/* Subscription Details Drawer */}
      {drawerSub && (
        <SubscriptionDrawer
          subscription={drawerSub}
          onClose={() => setDrawerSub(null)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
