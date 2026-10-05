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

// ---------------------------------------------------------------------------
// Fallback mock data — shown only when the backend is completely unreachable
// ---------------------------------------------------------------------------
const MOCK_SUBSCRIPTIONS = [
  {
    id: 1, vendorName: 'AWS Cloud Services', category: 'DEV', cost: 8450.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 8450.00,
    department: 'ENGINEERING',
    nextRenewalDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE', assignedSeats: 50, usedSeats: 48, utilizationRate: 96.0,
    notes: 'Core infrastructure & Kubernetes clusters',
    loggedByEmail: 'employee@company.com', loggedByName: 'Alex Morgan',
  },
  {
    id: 2, vendorName: 'GitHub Enterprise', category: 'DEV', cost: 2500.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 2500.00,
    department: 'ENGINEERING',
    nextRenewalDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE', assignedSeats: 100, usedSeats: 92, utilizationRate: 92.0,
    notes: 'CI/CD pipeline and code repositories',
    loggedByEmail: 'employee@company.com', loggedByName: 'Alex Morgan',
  },
  {
    id: 3, vendorName: 'Datadog Monitoring', category: 'DEV', cost: 4200.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 4200.00,
    department: 'ENGINEERING',
    nextRenewalDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE', assignedSeats: 30, usedSeats: 28, utilizationRate: 93.3,
    notes: 'APM and log aggregation',
    loggedByEmail: 'employee@company.com', loggedByName: 'Alex Morgan',
  },
  {
    id: 4, vendorName: 'Figma Enterprise', category: 'DESIGN', cost: 1800.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 1800.00,
    department: 'DESIGN',
    nextRenewalDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE', assignedSeats: 25, usedSeats: 23, utilizationRate: 92.0,
    notes: 'UI/UX design workspace',
    loggedByEmail: 'admin@company.com', loggedByName: 'Sarah Jenkins',
  },
  {
    id: 5, vendorName: 'Sketch Pro', category: 'DESIGN', cost: 990.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 990.00,
    department: 'DESIGN',
    nextRenewalDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    status: 'FLAGGED_DUPLICATE', assignedSeats: 15, usedSeats: 2, utilizationRate: 13.3,
    notes: 'Legacy design tool replaced by Figma',
    loggedByEmail: 'admin@company.com', loggedByName: 'Sarah Jenkins',
  },
  {
    id: 6, vendorName: 'Salesforce Enterprise CRM', category: 'SALES', cost: 14200.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 14200.00,
    department: 'SALES',
    nextRenewalDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE', assignedSeats: 80, usedSeats: 35, utilizationRate: 43.7,
    notes: 'Global pipeline & customer accounts',
    loggedByEmail: 'admin@company.com', loggedByName: 'Sarah Jenkins',
  },
  {
    id: 7, vendorName: 'HubSpot Marketing Hub', category: 'MARKETING', cost: 4800.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 4800.00,
    department: 'MARKETING',
    nextRenewalDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE', assignedSeats: 20, usedSeats: 18, utilizationRate: 90.0,
    notes: 'Inbound lead generation',
    loggedByEmail: 'admin@company.com', loggedByName: 'Sarah Jenkins',
  },
  {
    id: 8, vendorName: 'Zoom Enterprise', category: 'PRODUCTIVITY', cost: 2400.00,
    currency: 'USD', billingFrequency: 'MONTHLY', normalizedMonthlyCostUSD: 2400.00,
    department: 'PRODUCTIVITY',
    nextRenewalDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    status: 'FLAGGED_IDLE', assignedSeats: 150, usedSeats: 40, utilizationRate: 26.6,
    notes: 'Video conferencing licenses',
    loggedByEmail: 'employee@company.com', loggedByName: 'Alex Morgan',
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

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <AuthScreen
          onLoginSuccess={(loggedInUser) => {
            showSuccess(`Welcome back, ${loggedInUser.fullName}! (${loggedInUser.role === 'ROLE_ADMIN' ? 'Finance Admin' : 'Department Employee'})`);
            setActiveTab('dashboard');
          }}
        />
        <Toast toast={toast} onClose={closeToast} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onSearch={(term) => setSearchTerm(term)}
          subscriptions={filteredSubscriptions}
          onOpenDrawer={setDrawerSub}
          onRefreshData={async () => { await fetchSubscriptions(); await fetchSummary(); }}
          onNavigateTab={setActiveTab}
          showToast={showSuccess}
        />

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
          style={{ color: 'var(--text-primary)' }}
        >
          {/* My Profile Tab */}
          {activeTab === 'profile' && (
            <UserProfile showToast={showSuccess} />
          )}

          {/* Team Members Tab (Admin only) */}
          {activeTab === 'team' && (
            <TeamMembers showToast={showSuccess} />
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            user?.role === 'ROLE_ADMIN' ? (
              <AdminDashboard
                summary={summary}
                subscriptions={filteredSubscriptions}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
                onRefresh={fetchSubscriptions}
              />
            ) : (
              <EmployeeDashboard
                subscriptions={filteredSubscriptions}
                onRefresh={handleSubscriptionSuccess}
                onError={handleSubscriptionError}
              />
            )
          )}

          {/* Log Subscription Tab */}
          {activeTab === 'log-tool' && (
            <div className="max-w-2xl mx-auto py-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  Log Software Subscription
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Register new departmental software tools and seat allocations.
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  Financial Analytics & Spend Distribution
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Comprehensive cost reports and category breakdowns.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepartmentSpendChart data={summary?.departmentSpend} />
                <CategorySpendChart data={summary?.categorySpend} />
              </div>
            </div>
          )}

          {/* Audit Tab */}
          {activeTab === 'audit' && (
            <AuditSoftwareTable
              subscriptions={filteredSubscriptions}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onOpenDrawer={setDrawerSub}
            />
          )}

          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    Department Budgets & Thresholds
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Manage budget limits and automated warning alerts.
                  </p>
                </div>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-colors"
                  style={{ background: 'var(--accent)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  Adjust Budget Limit
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
        </main>
      </div>

      {/* Global drawer (opened from search or card click) */}
      {drawerSub && (
        <SubscriptionDrawer
          subscription={drawerSub}
          onClose={() => setDrawerSub(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}

      {/* Toast */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
