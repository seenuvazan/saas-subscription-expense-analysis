import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { alertAPI } from '../../services/api';
import { Bell, Shield, User, Search, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  const { user, switchRole, logout } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAlerts = async () => {
    try {
      const res = await alertAPI.getUnread();
      setAlerts(res.data);
    } catch (err) {
      // Fallback alerts if backend is starting
      setAlerts([
        {
          id: 1,
          type: 'RENEWAL_UPCOMING',
          severity: 'CRITICAL',
          title: 'Urgent Renewal Warning: AWS Cloud Services',
          message: 'Tool AWS Cloud Services renews in 4 days. Cost: $8,450.00/mo.',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          type: 'UNDERUTILIZATION',
          severity: 'WARNING',
          title: 'Software Waste Alert: Salesforce Enterprise CRM',
          message: 'Only 35 of 80 assigned seats are used (43% utilization).',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  const handleTriggerScan = async () => {
    try {
      await alertAPI.triggerScan();
      fetchAlerts();
    } catch (e) {
      console.log('Scan triggered demo mode');
    }
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/80 backdrop-blur-md border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions, vendors, or categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 bg-gray-900/80 border border-gray-700/60 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Scanner Trigger */}
          <button
            onClick={handleTriggerScan}
            title="Trigger Scheduled Renewal & Budget Scan"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-xs font-medium text-gray-300 rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Run Cron Check</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-gray-900 border border-gray-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => switchRole('ROLE_EMPLOYEE')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                user?.role === 'ROLE_EMPLOYEE'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Employee View
            </button>
            <button
              onClick={() => switchRole('ROLE_ADMIN')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                user?.role === 'ROLE_ADMIN'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Finance Admin
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="relative p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/60 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {showAlertsMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl p-4 shadow-2xl z-50 border border-gray-800">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" /> System Alerts ({unreadCount})
                  </h4>
                  <button
                    onClick={() => setAlerts(alerts.map(a => ({ ...a, isRead: true })))}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto py-2 space-y-2.5">
                  {alerts.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No active warnings.</p>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-xl border text-xs ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-500/10 border-red-500/20 text-red-300'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold mb-1">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {alert.title}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shadow-md">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p className="font-semibold text-gray-200 leading-tight">{user?.fullName}</p>
              <p className="text-gray-400">{user?.role === 'ROLE_ADMIN' ? 'Finance Admin' : 'Employee'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
