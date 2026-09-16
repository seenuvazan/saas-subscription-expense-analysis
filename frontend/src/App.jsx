import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LogSubscriptionModal from './components/employee/LogSubscriptionModal';
import AuditSoftwareTable from './components/admin/AuditSoftwareTable';
import BudgetModal from './components/admin/BudgetModal';
import { DepartmentSpendChart, CategorySpendChart } from './components/admin/AnalyticsCharts';
import { subscriptionAPI, analyticsAPI } from './services/api';

const initialMockSubscriptions = [
  {
    id: 1,
    vendorName: 'AWS Cloud Services',
    category: 'DEV',
    cost: 8450.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 8450.00,
    department: 'ENGINEERING',
    nextRenewalDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    assignedSeats: 50,
    usedSeats: 48,
    utilizationRate: 96.0,
    notes: 'Core infrastructure & Kubernetes clusters',
    loggedByEmail: 'employee@company.com',
    loggedByName: 'Alex Morgan'
  },
  {
    id: 2,
    vendorName: 'GitHub Enterprise',
    category: 'DEV',
    cost: 2500.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 2500.00,
    department: 'ENGINEERING',
    nextRenewalDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    assignedSeats: 100,
    usedSeats: 92,
    utilizationRate: 92.0,
    notes: 'CI/CD pipeline and code repositories',
    loggedByEmail: 'employee@company.com',
    loggedByName: 'Alex Morgan'
  },
  {
    id: 3,
    vendorName: 'Datadog Monitoring',
    category: 'DEV',
    cost: 4200.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 4200.00,
    department: 'ENGINEERING',
    nextRenewalDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    assignedSeats: 30,
    usedSeats: 28,
    utilizationRate: 93.3,
    notes: 'APM and log aggregation',
    loggedByEmail: 'employee@company.com',
    loggedByName: 'Alex Morgan'
  },
  {
    id: 4,
    vendorName: 'Figma Enterprise',
    category: 'DESIGN',
    cost: 1800.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 1800.00,
    department: 'DESIGN',
    nextRenewalDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    assignedSeats: 25,
    usedSeats: 23,
    utilizationRate: 92.0,
    notes: 'UI/UX design workspace',
    loggedByEmail: 'admin@company.com',
    loggedByName: 'Sarah Jenkins'
  },
  {
    id: 5,
    vendorName: 'Sketch Pro',
    category: 'DESIGN',
    cost: 990.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 990.00,
    department: 'DESIGN',
    nextRenewalDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    status: 'FLAGGED_DUPLICATE',
    assignedSeats: 15,
    usedSeats: 2,
    utilizationRate: 13.3,
    notes: 'Legacy design tool replaced by Figma',
    loggedByEmail: 'admin@company.com',
    loggedByName: 'Sarah Jenkins'
  },
  {
    id: 6,
    vendorName: 'Salesforce Enterprise CRM',
    category: 'SALES',
    cost: 14200.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 14200.00,
    department: 'SALES',
    nextRenewalDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    assignedSeats: 80,
    usedSeats: 35,
    utilizationRate: 43.7,
    notes: 'Global pipeline & customer accounts',
    loggedByEmail: 'admin@company.com',
    loggedByName: 'Sarah Jenkins'
  },
  {
    id: 7,
    vendorName: 'HubSpot Marketing Hub',
    category: 'MARKETING',
    cost: 4800.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 4800.00,
    department: 'MARKETING',
    nextRenewalDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    assignedSeats: 20,
    usedSeats: 18,
    utilizationRate: 90.0,
    notes: 'Inbound lead generation',
    loggedByEmail: 'admin@company.com',
    loggedByName: 'Sarah Jenkins'
  },
  {
    id: 8,
    vendorName: 'Zoom Enterprise',
    category: 'PRODUCTIVITY',
    cost: 2400.00,
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    normalizedMonthlyCostUSD: 2400.00,
    department: 'PRODUCTIVITY',
    nextRenewalDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    status: 'FLAGGED_IDLE',
    assignedSeats: 150,
    usedSeats: 40,
    utilizationRate: 26.6,
    notes: 'Video conferencing licenses',
    loggedByEmail: 'employee@company.com',
    loggedByName: 'Alex Morgan'
  }
];

const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscriptions, setSubscriptions] = useState(initialMockSubscriptions);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionAPI.getAll();
      if (res.data && res.data.length > 0) {
        setSubscriptions(res.data);
      }
    } catch (err) {
      console.log('Using initial mock data for subscriptions');
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await analyticsAPI.getSummary();
      setSummary(res.data);
    } catch (err) {
      console.log('Using calculated summary from mock data');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchSummary();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await subscriptionAPI.updateStatus(id, newStatus);
      fetchSubscriptions();
      fetchSummary();
    } catch (err) {
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    }
  };

  const handleDelete = async (id) => {
    try {
      await subscriptionAPI.delete(id);
      fetchSubscriptions();
      fetchSummary();
    } catch (err) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredSubscriptions = subscriptions.filter(s =>
    !searchTerm || s.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onSearch={(term) => setSearchTerm(term)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
                onRefresh={fetchSubscriptions}
                onLogClick={() => setIsLogModalOpen(true)}
              />
            )
          )}

          {/* Log Subscription Tab */}
          {activeTab === 'log-tool' && (
            <div className="max-w-2xl mx-auto py-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-white">Log Software Subscription</h2>
                <p className="text-xs text-gray-400 mt-1">Register new departmental software tools and seat allocations.</p>
              </div>
              <LogSubscriptionModal
                isOpen={true}
                onClose={() => setActiveTab('dashboard')}
                onSuccess={() => {
                  fetchSubscriptions();
                  setActiveTab('dashboard');
                }}
                initialDept={user?.department}
              />
            </div>
          )}

          {/* Financial Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Financial Analytics & Spend Distribution</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Comprehensive cost reports and category breakdowns.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepartmentSpendChart data={summary?.departmentSpend} />
                <CategorySpendChart data={summary?.categorySpend} />
              </div>
            </div>
          )}

          {/* Audit Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <AuditSoftwareTable
                subscriptions={filteredSubscriptions}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Department Budgets & Thresholds</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage budget limits and automated warning alerts.</p>
                </div>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Adjust Budget Limit
                </button>
              </div>

              <DepartmentSpendChart data={summary?.departmentSpend} />

              <BudgetModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                onSuccess={() => {
                  fetchSummary();
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
