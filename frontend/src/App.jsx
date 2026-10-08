import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LogSubscriptionModal from './components/employee/LogSubscriptionModal';
import AuditSoftwareTable from './components/admin/AuditSoftwareTable';
import BudgetModal from './components/admin/BudgetModal';
import Toast from './components/common/Toast';
import SubscriptionDrawer from './components/common/SubscriptionDrawer';
import { DepartmentSpendChart, CategorySpendChart } from './components/admin/AnalyticsCharts';
import UserProfile from './components/profile/UserProfile';
import TeamMembers from './components/admin/TeamMembers';
import AuthScreen from './components/auth/AuthScreen';
import { subscriptionAPI, analyticsAPI } from './services/api';
import { USD_TO_INR, formatINRCompact } from './utils/formatters';

// ---------------------------------------------------------------------------
// Indian company demo data — Techvance Solutions, Bengaluru
// All USD costs × 84.5 = INR equivalent. Numbers are internally consistent.
// ---------------------------------------------------------------------------
const today = new Date();
const daysOut = (n) => new Date(today.getTime() + n * 86400000).toISOString().split('T')[0];

const MOCK_SUBSCRIPTIONS = [
  {
    id: 1, vendorName: 'AWS', category: 'DEV', cost: 8450.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 8450.00,
    department: 'ENGINEERING',
    nextRenewalDate: daysOut(4),
    status: 'ACTIVE', assignedSeats: 50, usedSeats: 48, utilizationRate: 96.0,
    notes: 'Core infrastructure — EC2, RDS, S3 clusters (Mumbai region)',
    loggedByEmail: 'arjun.mehta@techvance.in', loggedByName: 'Arjun Mehta',
    owner: 'Arjun Mehta', costCenter: 'ENG-001',
  },
  {
    id: 2, vendorName: 'GitHub Enterprise', category: 'DEV', cost: 2500.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 2500.00,
    department: 'ENGINEERING',
    nextRenewalDate: daysOut(22),
    status: 'ACTIVE', assignedSeats: 100, usedSeats: 87, utilizationRate: 87.0,
    notes: 'CI/CD pipeline and source control',
    loggedByEmail: 'arjun.mehta@techvance.in', loggedByName: 'Arjun Mehta',
    owner: 'Arjun Mehta', costCenter: 'ENG-001',
  },
  {
    id: 3, vendorName: 'Datadog', category: 'DEV', cost: 3800.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 3800.00,
    department: 'ENGINEERING',
    nextRenewalDate: daysOut(48),
    status: 'ACTIVE', assignedSeats: 30, usedSeats: 27, utilizationRate: 90.0,
    notes: 'APM, log aggregation, dashboards',
    loggedByEmail: 'arjun.mehta@techvance.in', loggedByName: 'Arjun Mehta',
    owner: 'Karan Singh', costCenter: 'ENG-001',
  },
  {
    id: 4, vendorName: 'Figma', category: 'DESIGN', cost: 1800.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 1800.00,
    department: 'DESIGN',
    nextRenewalDate: daysOut(9),
    status: 'FLAGGED_IDLE', assignedSeats: 38, usedSeats: 24, utilizationRate: 63.1,
    notes: 'Product design workspace — 14 inactive seats detected',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Sneha Iyer', costCenter: 'DES-001',
  },
  {
    id: 5, vendorName: 'Adobe Creative Cloud', category: 'DESIGN', cost: 1200.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 1200.00,
    department: 'DESIGN',
    nextRenewalDate: daysOut(15),
    status: 'ACTIVE', assignedSeats: 20, usedSeats: 17, utilizationRate: 85.0,
    notes: 'Illustration, video and print production',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Sneha Iyer', costCenter: 'DES-001',
  },
  {
    id: 6, vendorName: 'Slack', category: 'PRODUCTIVITY', cost: 2800.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 2800.00,
    department: 'ENGINEERING',
    nextRenewalDate: daysOut(35),
    status: 'FLAGGED_DUPLICATE', assignedSeats: 200, usedSeats: 155, utilizationRate: 77.5,
    notes: 'Messaging — potential overlap with Microsoft Teams',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Rohit Verma', costCenter: 'IT-001',
  },
  {
    id: 7, vendorName: 'Microsoft 365', category: 'PRODUCTIVITY', cost: 248500.00,
    currency: 'INR', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 2940.00,
    department: 'ENGINEERING',
    nextRenewalDate: daysOut(62),
    status: 'ACTIVE', assignedSeats: 250, usedSeats: 230, utilizationRate: 92.0,
    notes: 'Microsoft Teams, Outlook, OneDrive',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Rohit Verma', costCenter: 'IT-001',
  },
  {
    id: 8, vendorName: 'Zoom', category: 'PRODUCTIVITY', cost: 1600.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 1600.00,
    department: 'SALES',
    nextRenewalDate: daysOut(18),
    status: 'FLAGGED_IDLE', assignedSeats: 120, usedSeats: 42, utilizationRate: 35.0,
    notes: 'Video meetings — low usage since MS Teams adoption',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Amit Patel', costCenter: 'SAL-001',
  },
  {
    id: 9, vendorName: 'Notion', category: 'PRODUCTIVITY', cost: 970.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 970.00,
    department: 'PRODUCT',
    nextRenewalDate: daysOut(28),
    status: 'ACTIVE', assignedSeats: 60, usedSeats: 54, utilizationRate: 90.0,
    notes: 'Product wiki, roadmaps, documentation',
    loggedByEmail: 'arjun.mehta@techvance.in', loggedByName: 'Arjun Mehta',
    owner: 'Meera Nair', costCenter: 'PRD-001',
  },
  {
    id: 10, vendorName: 'Atlassian (Jira + Confluence)', category: 'DEV', cost: 3200.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 3200.00,
    department: 'ENGINEERING',
    nextRenewalDate: daysOut(55),
    status: 'ACTIVE', assignedSeats: 120, usedSeats: 110, utilizationRate: 91.6,
    notes: 'Project tracking and documentation',
    loggedByEmail: 'arjun.mehta@techvance.in', loggedByName: 'Arjun Mehta',
    owner: 'Karan Singh', costCenter: 'ENG-001',
  },
  {
    id: 11, vendorName: 'Zoho CRM', category: 'SALES', cost: 89000.00,
    currency: 'INR', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 1053.00,
    department: 'SALES',
    nextRenewalDate: daysOut(42),
    status: 'ACTIVE', assignedSeats: 40, usedSeats: 36, utilizationRate: 90.0,
    notes: 'Sales pipeline and customer accounts',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Amit Patel', costCenter: 'SAL-001',
  },
  {
    id: 12, vendorName: 'Freshworks Suite', category: 'SALES', cost: 1400.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 1400.00,
    department: 'MARKETING',
    nextRenewalDate: daysOut(75),
    status: 'ACTIVE', assignedSeats: 25, usedSeats: 22, utilizationRate: 88.0,
    notes: 'CRM, support desk and marketing automation',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Divya Krishnan', costCenter: 'MKT-001',
  },
  {
    id: 13, vendorName: 'Google Workspace', category: 'PRODUCTIVITY', cost: 215000.00,
    currency: 'INR', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 2544.00,
    department: 'ENGINEERING',
    nextRenewalDate: daysOut(88),
    status: 'ACTIVE', assignedSeats: 250, usedSeats: 240, utilizationRate: 96.0,
    notes: 'Gmail, Drive, Meet, Docs for all employees',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: 'Rohit Verma', costCenter: 'IT-001',
  },
  {
    id: 14, vendorName: 'Sketch', category: 'DESIGN', cost: 490.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 490.00,
    department: 'DESIGN',
    nextRenewalDate: daysOut(6),
    status: 'FLAGGED_DUPLICATE', assignedSeats: 15, usedSeats: 2, utilizationRate: 13.3,
    notes: 'Legacy design tool — mostly replaced by Figma',
    loggedByEmail: 'priya.sharma@techvance.in', loggedByName: 'Priya Sharma',
    owner: null, costCenter: 'DES-001',
  },
];

let _backendAvailable = true;

// ---------------------------------------------------------------------------
// Main app shell
// ---------------------------------------------------------------------------
const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [drawerSub, setDrawerSub] = useState(null);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const showSuccess = useCallback((msg) => setToast({ type: 'success', message: msg }), []);
  const showError   = useCallback((msg) => setToast({ type: 'error',   message: msg }), []);
  const closeToast  = useCallback(() => setToast(null), []);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await subscriptionAPI.getAll();
      if (res.data && Array.isArray(res.data)) {
        setSubscriptions(res.data);
        _backendAvailable = true;
      }
    } catch {
      if (_backendAvailable) {
        console.info('Backend unavailable — showing mock data.');
        _backendAvailable = false;
      }
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await analyticsAPI.getSummary();
      setSummary(res.data);
    } catch { /* optional */ }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    fetchSummary();
  }, [fetchSubscriptions, fetchSummary]);

  // ── Callbacks ──────────────────────────────────────────────────────────────
  const handleSubscriptionSuccess = useCallback(async () => {
    await fetchSubscriptions();
    await fetchSummary();
    showSuccess('Subscription logged successfully!');
  }, [fetchSubscriptions, fetchSummary, showSuccess]);

  const handleSubscriptionError = useCallback((msg) => showError(msg), [showError]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await subscriptionAPI.updateStatus(id, newStatus);
      await fetchSubscriptions();
      await fetchSummary();
    } catch {
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    }
  };

  const handleDelete = async (id) => {
    try {
      await subscriptionAPI.delete(id);
      await fetchSubscriptions();
      await fetchSummary();
    } catch {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredSubscriptions = subscriptions.filter(s =>
    !searchTerm ||
    s.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Handle new sidebar routes ───────────────────────────────────────────────
  const handleSetActiveTab = (tab) => {
    // Map new sidebar routes to existing or placeholder views
    setActiveTab(tab);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <AuthScreen
          onLoginSuccess={(loggedInUser) => {
            const name = loggedInUser.firstName || loggedInUser.fullName?.split(' ')[0] || 'there';
            showSuccess(`Welcome back, ${name}!`);
            setActiveTab('dashboard');
          }}
        />
        <Toast toast={toast} onClose={closeToast} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onSearch={(term) => setSearchTerm(term)}
          subscriptions={filteredSubscriptions}
          onOpenDrawer={setDrawerSub}
          onRefreshData={async () => { await fetchSubscriptions(); await fetchSummary(); }}
          onNavigateTab={handleSetActiveTab}
          showToast={showSuccess}
        />

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto"
          style={{ color: 'var(--text-primary)' }}
        >
          {/* My Profile */}
          {activeTab === 'profile' && (
            <UserProfile showToast={showSuccess} />
          )}

          {/* Team Members */}
          {activeTab === 'team' && (
            <TeamMembers showToast={showSuccess} />
          )}

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            user?.role === 'ROLE_ADMIN' ? (
              <AdminDashboard
                summary={summary}
                subscriptions={filteredSubscriptions}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
                onRefresh={fetchSubscriptions}
                onNavigateTab={handleSetActiveTab}
              />
            ) : (
              <EmployeeDashboard
                subscriptions={filteredSubscriptions}
                onRefresh={handleSubscriptionSuccess}
                onError={handleSubscriptionError}
              />
            )
          )}

          {/* Log/Request Subscription */}
          {activeTab === 'log-tool' && (
            <div className="max-w-2xl mx-auto py-4">
              <div className="mb-6">
                <h2 className="page-title">Request Software</h2>
                <p className="page-subtitle">
                  Submit a new software subscription request. Existing tools will be checked before approval.
                </p>
              </div>
              <LogSubscriptionModal
                isOpen={true}
                onClose={() => setActiveTab('dashboard')}
                onSuccess={() => { handleSubscriptionSuccess(); setActiveTab('dashboard'); }}
                onError={handleSubscriptionError}
                initialDept={user?.department}
              />
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="page-header">
                <h2 className="page-title">Analytics & Spend Distribution</h2>
                <p className="page-subtitle">
                  Department breakdowns, category distribution and monthly trends.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepartmentSpendChart data={summary?.departmentSpend} />
                <CategorySpendChart data={summary?.categorySpend} />
              </div>
            </div>
          )}

          {/* Subscriptions / Audit table */}
          {activeTab === 'audit' && (
            <AuditSoftwareTable
              subscriptions={filteredSubscriptions}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onOpenDrawer={setDrawerSub}
            />
          )}

          {/* Budgets */}
          {activeTab === 'budgets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between page-header">
                <div>
                  <h2 className="page-title">Department Budgets</h2>
                  <p className="page-subtitle">
                    Manage department spend limits and automated alerts.
                  </p>
                </div>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="btn-primary"
                >
                  Adjust Budget
                </button>
              </div>
              <DepartmentSpendChart data={summary?.departmentSpend} />
              <BudgetModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                onSuccess={fetchSummary}
              />
            </div>
          )}

          {/* License Audit (replaces old idle-audit) */}
          {activeTab === 'idle-audit' && (
            <AuditSoftwareTable
              subscriptions={filteredSubscriptions.filter(s =>
                s.status === 'FLAGGED_IDLE' || s.status === 'FLAGGED_DUPLICATE'
              )}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onOpenDrawer={setDrawerSub}
            />
          )}

          {/* Savings (new) */}
          {activeTab === 'savings' && (
            <SavingsPage subscriptions={filteredSubscriptions} />
          )}

          {/* Renewals (new) */}
          {activeTab === 'renewals' && (
            <RenewalsPage subscriptions={filteredSubscriptions} />
          )}

          {/* Invoices placeholder */}
          {activeTab === 'invoices' && (
            <PlaceholderPage
              title="Invoices & Payments"
              description="Track vendor invoices, GST details, payment status and overdue bills."
              icon="📄"
            />
          )}

          {/* Activity Log placeholder */}
          {activeTab === 'activity' && (
            <ActivityLogPage />
          )}
        </main>
      </div>

      {/* Global drawer */}
      {drawerSub && (
        <SubscriptionDrawer
          subscription={drawerSub}
          onClose={() => setDrawerSub(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

// ── Savings Page ─────────────────────────────────────────────────────────────
const SavingsPage = ({ subscriptions }) => {
  const idleSubs = subscriptions.filter(s =>
    s.status === 'FLAGGED_IDLE' || s.status === 'FLAGGED_DUPLICATE'
  );

  const totalSavings = idleSubs.reduce((acc, s) => {
    const inr = (s.currency === 'INR') ? s.cost : (s.normalizedMonthlyCostUSD || s.cost) * USD_TO_INR;
    return acc + inr;
  }, 0);

  const opportunities = [
    {
      title: 'Reclaim unused Figma seats',
      type: 'Unused Licenses',
      vendor: 'Figma',
      currentCost: '₹1,52,100/mo',
      saving: '₹41,300/mo',
      reason: '14 of 38 seats have had no activity in 60+ days.',
      confidence: 'High',
      action: 'Review Licenses',
    },
    {
      title: 'Cancel Sketch (legacy tool)',
      type: 'Duplicate Tool',
      vendor: 'Sketch',
      currentCost: '₹41,405/mo',
      saving: '₹41,405/mo',
      reason: 'Only 2 of 15 seats active. Figma now covers all use-cases.',
      confidence: 'High',
      action: 'Mark for Cancellation',
    },
    {
      title: 'Evaluate Zoom vs Microsoft Teams',
      type: 'Duplicate Tool',
      vendor: 'Zoom',
      currentCost: '₹1,35,200/mo',
      saving: '₹1,35,200/mo',
      reason: 'Zoom usage dropped 65% after Teams rollout. Only 42 of 120 seats active.',
      confidence: 'Medium',
      action: 'Compare Usage',
    },
    {
      title: 'Move Notion to annual billing',
      type: 'Annual Billing Opportunity',
      vendor: 'Notion',
      currentCost: '₹81,965/mo',
      saving: '₹98,400/yr',
      reason: 'Stable team usage for 8 months. Annual plan saves ~10%.',
      confidence: 'High',
      action: 'Review Plan',
    },
    {
      title: 'Right-size Slack plan',
      type: 'Plan Downgrade',
      vendor: 'Slack',
      currentCost: '₹2,36,600/mo',
      saving: '₹35,490/mo',
      reason: '45 inactive users on Business+ plan. Standard plan may suffice.',
      confidence: 'Medium',
      action: 'Review Users',
    },
  ];

  const typeBadgeStyle = (type) => {
    if (type.includes('Unused') || type.includes('Duplicate')) return { background: 'var(--danger-muted)', color: 'var(--danger)' };
    if (type.includes('Annual')) return { background: 'var(--success-muted)', color: 'var(--success)' };
    return { background: 'var(--warning-muted)', color: 'var(--warning)' };
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h2 className="page-title">Savings Opportunities</h2>
        <p className="page-subtitle">
          Identified cost reduction opportunities based on usage data, duplicate tools and billing analysis.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Potential Monthly Saving', value: formatINRCompact(totalSavings), color: 'var(--success)' },
          { label: 'Opportunities Identified', value: opportunities.length.toString(), color: 'var(--accent)' },
          { label: 'High Confidence', value: opportunities.filter(o => o.confidence === 'High').length.toString(), color: 'var(--success)' },
        ].map(item => (
          <div key={item.label} className="card p-4">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
            <p className="text-2xl font-bold text-currency" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Opportunities list */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            All Opportunities
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
          {opportunities.map((opp, i) => (
            <div key={i} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-[var(--bg-elevated)] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {opp.title}
                  </span>
                  <span className="badge text-[10px]" style={typeBadgeStyle(opp.type)}>{opp.type}</span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{
                      background: opp.confidence === 'High' ? 'var(--success-muted)' : 'var(--warning-muted)',
                      color: opp.confidence === 'High' ? 'var(--success)' : 'var(--warning)',
                    }}
                  >
                    {opp.confidence} confidence
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{opp.reason}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Current: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{opp.currentCost}</span></span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>Save: {opp.saving}</span>
                </div>
              </div>
              <button
                className="btn-secondary text-xs flex-shrink-0 whitespace-nowrap"
                onClick={() => {}}
              >
                {opp.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Renewals Page ─────────────────────────────────────────────────────────────
const RenewalsPage = ({ subscriptions }) => {
  const [filter, setFilter] = useState('30');

  const renewals = subscriptions
    .filter(s => s.nextRenewalDate && s.status !== 'CANCELLED')
    .map(s => {
      const today = new Date();
      const renewal = new Date(s.nextRenewalDate);
      const daysLeft = Math.ceil((renewal - today) / 86400000);
      const inrMonthly = s.currency === 'INR' ? s.cost : (s.normalizedMonthlyCostUSD || s.cost) * USD_TO_INR;
      const inrAnnual = s.billingFrequency === 'ANNUAL' ? inrMonthly : inrMonthly * 12;
      return { ...s, daysLeft, inrMonthly, inrAnnual };
    })
    .filter(s => {
      if (filter === '30') return s.daysLeft <= 30 && s.daysLeft >= 0;
      if (filter === '60') return s.daysLeft <= 60 && s.daysLeft >= 0;
      if (filter === '90') return s.daysLeft <= 90 && s.daysLeft >= 0;
      return s.daysLeft >= 0;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const urgencyStyle = (daysLeft) => {
    if (daysLeft <= 7)  return { background: 'var(--danger-muted)',  color: 'var(--danger)' };
    if (daysLeft <= 30) return { background: 'var(--warning-muted)', color: 'var(--warning)' };
    return { background: 'var(--success-muted)', color: 'var(--success)' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between page-header">
        <div>
          <h2 className="page-title">Renewals</h2>
          <p className="page-subtitle">
            Upcoming subscription renewals and contract end dates. Act before cancellation windows close.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg p-1 border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
          {['30', '60', '90', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all"
              style={{
                background: filter === f ? 'var(--bg-surface)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                boxShadow: filter === f ? 'var(--shadow-xs)' : 'none',
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f === 'all' ? 'All' : `${f} days`}
            </button>
          ))}
        </div>
      </div>

      {renewals.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">✓</p>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No upcoming renewals</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No subscriptions renewing in the next {filter === 'all' ? 'period' : `${filter} days`}.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Department</th>
                <th>Days Left</th>
                <th>Annual Value</th>
                <th>Owner</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {renewals.map(sub => (
                <tr key={sub.id}>
                  <td>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{sub.vendorName}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{sub.department}</td>
                  <td>
                    <span
                      className="badge text-xs font-bold"
                      style={urgencyStyle(sub.daysLeft)}
                    >
                      {sub.daysLeft <= 0 ? 'Today' : `${sub.daysLeft}d`}
                    </span>
                  </td>
                  <td className="font-semibold text-currency" style={{ color: 'var(--text-primary)' }}>
                    {formatINRCompact(sub.inrAnnual)}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{sub.owner || '—'}</td>
                  <td>
                    <span className="badge badge-neutral">{sub.status === 'ACTIVE' ? 'Active' : sub.status}</span>
                  </td>
                  <td className="text-right">
                    <button className="btn-ghost text-xs">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Activity Log Page ─────────────────────────────────────────────────────────
const ActivityLogPage = () => {
  const activities = [
    { id: 1, user: 'Priya Sharma', action: 'changed AWS annual budget from ₹8L to ₹9L', timestamp: '2026-10-05T08:30:00', type: 'budget' },
    { id: 2, user: 'Arjun Mehta', action: 'reclaimed 6 Figma licenses from inactive seats', timestamp: '2026-10-04T16:15:00', type: 'license' },
    { id: 3, user: 'Priya Sharma', action: 'approved the Notion annual renewal (₹98,400 saving identified)', timestamp: '2026-10-04T11:00:00', type: 'approval' },
    { id: 4, user: 'Rohit Verma', action: 'assigned Amit Patel as Zoom subscription owner', timestamp: '2026-10-03T14:45:00', type: 'ownership' },
    { id: 5, user: 'Sneha Iyer', action: 'flagged Sketch as duplicate tool (replaced by Figma)', timestamp: '2026-10-02T10:30:00', type: 'audit' },
    { id: 6, user: 'System', action: 'scheduled renewal check detected 7 upcoming renewals in 30 days', timestamp: '2026-10-02T09:00:00', type: 'system' },
    { id: 7, user: 'Karan Singh', action: 'added Datadog APM subscription (Engineering, ₹3.21L/mo)', timestamp: '2026-10-01T15:20:00', type: 'add' },
    { id: 8, user: 'Priya Sharma', action: 'exported Q2 FY2026 spend report for Finance review', timestamp: '2026-09-30T12:00:00', type: 'export' },
  ];

  const typeStyle = (type) => {
    const map = {
      budget: { bg: 'var(--accent-muted)', color: 'var(--accent)' },
      license: { bg: 'var(--warning-muted)', color: 'var(--warning)' },
      approval: { bg: 'var(--success-muted)', color: 'var(--success)' },
      ownership: { bg: 'var(--info-muted)', color: 'var(--info)' },
      audit: { bg: 'var(--danger-muted)', color: 'var(--danger)' },
      system: { bg: 'var(--bg-elevated)', color: 'var(--text-muted)' },
      add: { bg: 'var(--success-muted)', color: 'var(--success)' },
      export: { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)' },
    };
    return map[type] || map.system;
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h2 className="page-title">Activity Log</h2>
        <p className="page-subtitle">
          Immutable audit trail of all actions taken across subscriptions, budgets and approvals.
        </p>
      </div>
      <div className="card overflow-hidden">
        <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
          {activities.map(activity => {
            const style = typeStyle(activity.type);
            return (
              <div key={activity.id} className="px-5 py-4 flex items-start gap-4 hover:bg-[var(--bg-elevated)] transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: style.bg, color: style.color }}
                >
                  {activity.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-semibold">{activity.user}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(activity.timestamp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="badge text-[10px] flex-shrink-0 capitalize" style={{ background: style.bg, color: style.color }}>
                  {activity.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Placeholder page (for routes not yet fully built) ─────────────────────────
const PlaceholderPage = ({ title, description, icon }) => (
  <div className="space-y-6">
    <div className="page-header">
      <h2 className="page-title">{title}</h2>
      <p className="page-subtitle">{description}</p>
    </div>
    <div className="card p-12 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Coming soon</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        This section is being built. Check back in a future release.
      </p>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
