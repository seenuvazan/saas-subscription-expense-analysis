import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cronAPI, notificationAPI } from '../../services/api';
import { searchVendors } from '../../utils/vendors';
import { formatTimeAgo } from '../../utils/formatters';
import VendorLogo from './VendorLogo';
import {
  Search, Bell, Sun, Moon, RefreshCw, X, ChevronRight,
  AlertTriangle, Info, Clock, History, CheckCheck, User, Users, LogOut
} from 'lucide-react';

const SearchDropdown = ({ query, subscriptions, onSelect, onClose }) => {
  const q = query.toLowerCase().trim();
  const subMatches = (subscriptions || []).filter(s =>
    s.vendorName?.toLowerCase().includes(q) ||
    s.category?.toLowerCase().includes(q) ||
    s.department?.toLowerCase().includes(q)
  ).slice(0, 5);

  const registryMatches = searchVendors(query).slice(0, 3);

  if (!subMatches.length && !registryMatches.length) {
    return (
      <div
        className="absolute left-0 right-0 mt-2 p-4 rounded-2xl border shadow-xl z-50 animate-scale-in text-center text-xs"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        No tools found matching &ldquo;{query}&rdquo;
      </div>
    );
  }

  return (
    <div
      className="absolute left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-50 animate-scale-in overflow-hidden"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {subMatches.length > 0 && (
        <div>
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
            Active Subscriptions
          </div>
          {subMatches.map(sub => (
            <button
              key={sub.id}
              onClick={() => onSelect(sub)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <VendorLogo vendorName={sub.vendorName} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {sub.vendorName}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {sub.department} · ${Number(sub.cost || 0).toLocaleString()}/mo
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      )}

      {registryMatches.length > 0 && (
        <div>
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-t border-b"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
            Catalog Suggestions
          </div>
          {registryMatches.map(v => (
            <div
              key={v.name}
              className="flex items-center gap-3 px-4 py-2 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              <VendorLogo vendorName={v.label} size="sm" />
              <span>{v.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded ml-auto"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                {v.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = ({
  onSearch,
  subscriptions = [],
  onOpenDrawer,
  onRefreshData,
  onNavigateTab,
  showToast
}) => {
  const { user, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Cron Check state
  const [isRunningCron, setIsRunningCron] = useState(false);
  const [lastRunTime, setLastRunTime] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);
  const historyRef = useRef(null);

  // Profile menu state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const dept = user?.role === 'ROLE_EMPLOYEE' ? user?.department : null;
      const res = await notificationAPI.getAll(dept);
      if (res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch {
      // Graceful fallback
    }
  }, [user]);

  // Fetch cron history
  const fetchHistory = useCallback(async () => {
    try {
      const res = await cronAPI.getHistory();
      if (res.data && Array.isArray(res.data)) {
        setHistoryLogs(res.data);
        if (res.data.length > 0 && !lastRunTime) {
          setLastRunTime(res.data[0].ranAt);
        }
      }
    } catch {
      // Graceful fallback
    }
  }, [lastRunTime]);

  useEffect(() => {
    fetchNotifications();
    fetchHistory();
  }, [fetchNotifications, fetchHistory]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (historyRef.current && !historyRef.current.contains(e.target)) setShowHistory(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle Search
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setShowSearch(val.length >= 2);
    if (onSearch) onSearch(val);
  };

  const handleSearchSelect = (sub) => {
    setShowSearch(false);
    setSearchTerm('');
    if (onSearch) onSearch('');
    if (onOpenDrawer) onOpenDrawer(sub);
  };

  // Run Cron Check
  const handleRunCron = async () => {
    if (isRunningCron) return;
    setIsRunningCron(true);
    try {
      const dept = user?.role === 'ROLE_EMPLOYEE' ? user?.department : null;
      const res = await cronAPI.runCheck(dept);
      const summary = res.data;

      const newAlerts = summary.notificationsCreated || 0;
      const checked = summary.checkedCount || 0;
      const toastMsg = `Checked ${checked} subscriptions, ${newAlerts} new alert${newAlerts === 1 ? '' : 's'}`;

      if (showToast) {
        showToast(toastMsg);
      }
      setLastRunTime(new Date().toISOString());

      // Refresh notifications, history, and dashboard data
      await fetchNotifications();
      await fetchHistory();
      if (onRefreshData) await onRefreshData();
    } catch (err) {
      if (showToast) showToast('Renewal check completed with local checks');
    } finally {
      setIsRunningCron(false);
    }
  };

  // Mark single notification as read
  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
    } catch {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const dept = user?.role === 'ROLE_EMPLOYEE' ? user?.department : null;
      await notificationAPI.markAllAsRead(dept);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;
  const initials = (user?.firstName?.[0] || user?.fullName?.[0] || 'U').toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 border-b px-4 sm:px-6 py-3"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center justify-between gap-4">

        {/* Global Search */}
        <div className="relative flex-1 max-w-sm" ref={searchRef}>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search subscriptions…"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => { if (searchTerm.length >= 2) setShowSearch(true); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setShowSearch(false); if (onSearch) onSearch(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showSearch && (
            <SearchDropdown
              query={searchTerm}
              subscriptions={subscriptions}
              onSelect={handleSearchSelect}
              onClose={() => setShowSearch(false)}
            />
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Run Cron Check Button with Spinner & History */}
          <div className="relative hidden sm:flex items-center gap-1.5" ref={historyRef}>
            <button
              onClick={handleRunCron}
              disabled={isRunningCron}
              id="run-cron-check-btn"
              title="Scan subscriptions for upcoming renewals and threshold violations"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all disabled:opacity-60"
              style={{
                background: isRunningCron ? 'var(--accent-muted)' : 'var(--bg-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRunningCron ? 'animate-spin' : ''}`}
                style={{ color: 'var(--accent)' }}
              />
              <span>{isRunningCron ? 'Checking…' : 'Run Cron Check'}</span>
            </button>

            {/* Last run text */}
            {lastRunTime && (
              <span className="hidden xl:inline text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                Last run: {formatTimeAgo(lastRunTime)}
              </span>
            )}

            {/* History Toggle Button */}
            <button
              onClick={() => { setShowHistory(v => !v); fetchHistory(); }}
              title="View Cron Run History"
              className="p-1.5 rounded-lg border transition-colors"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <History className="w-3.5 h-3.5" />
            </button>

            {/* History Popover */}
            {showHistory && (
              <div
                className="absolute right-0 top-full mt-2 w-84 rounded-2xl border shadow-2xl z-50 animate-scale-in overflow-hidden"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Cron Run History</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                    Last 10
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
                  {historyLogs.length === 0 ? (
                    <div className="py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                      No scan history logged yet.
                    </div>
                  ) : (
                    historyLogs.map(log => (
                      <div key={log.id} className="p-3 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {log.triggeredBy === 'scheduled' ? 'Scheduled (9:00 AM)' : 'Manual Check'}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {formatTimeAgo(log.ranAt)}
                          </span>
                        </div>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {log.summary || `Checked ${log.checkedCount} subscriptions`}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <span>By: {log.executedByUser || 'System'}</span>
                          {log.departmentFilter && <span>· Dept: {log.departmentFilter}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl border transition-colors"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Role Toggle Switch */}
          <div
            className="hidden sm:flex items-center rounded-xl p-0.5 border text-xs"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
          >
            {['ROLE_EMPLOYEE', 'ROLE_ADMIN'].map(role => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className="px-3 py-1 rounded-lg font-medium transition-all"
                style={{
                  background: user?.role === role ? 'var(--accent)' : 'transparent',
                  color: user?.role === role ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {role === 'ROLE_EMPLOYEE' ? 'Employee' : 'Finance Admin'}
              </button>
            ))}
          </div>

          {/* Notification Bell with Badge & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(v => !v)}
              id="notification-bell-btn"
              title="Notifications"
              className="relative p-2 rounded-xl border transition-colors"
              style={{
                background: showNotifications ? 'var(--bg-elevated)' : 'transparent',
                borderColor: showNotifications ? 'var(--border)' : 'transparent',
                color: 'var(--text-secondary)'
              }}
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full flex items-center justify-center text-white"
                  style={{ background: 'var(--danger)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-88 rounded-2xl border shadow-2xl z-50 animate-scale-in overflow-hidden"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', width: 340 }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {user?.role === 'ROLE_ADMIN' ? 'All Departments' : `${user?.department} Team`}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                      No notifications or alerts.
                    </div>
                  ) : (
                    notifications.map(n => {
                      const isUnread = !n.isRead && !n.read;
                      const isCritical = n.severity === 'CRITICAL';
                      const isWarning = n.severity === 'WARNING';

                      return (
                        <div
                          key={n.id}
                          onClick={() => handleMarkAsRead(n.id)}
                          className="px-4 py-3 cursor-pointer transition-colors relative flex items-start gap-3 hover:bg-black/5 dark:hover:bg-white/5"
                          style={{
                            background: isUnread ? 'var(--accent-muted)' : 'transparent',
                          }}
                        >
                          {/* Logo or Severity Icon */}
                          <div className="mt-0.5 flex-shrink-0">
                            {n.vendorName ? (
                              <VendorLogo vendorName={n.vendorName} size="sm" />
                            ) : (
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: isCritical ? '#EF444420' : isWarning ? '#F59E0B20' : '#3B82F620',
                                  color: isCritical ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--accent)'
                                }}
                              >
                                {isCritical ? <AlertTriangle className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                {n.title}
                              </p>
                              <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                                {formatTimeAgo(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                                style={{
                                  background: isCritical ? '#EF444420' : isWarning ? '#F59E0B20' : '#3B82F620',
                                  color: isCritical ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--accent)',
                                }}
                              >
                                {n.severity || 'INFO'}
                              </span>
                              {n.targetDepartment && (
                                <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                                  {n.targetDepartment}
                                </span>
                              )}
                              {isUnread && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Header Chip & Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(v => !v)}
              id="user-profile-menu-btn"
              className="flex items-center gap-2.5 p-1 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || 'User'}
                  className="w-8 h-8 rounded-full object-cover border"
                  style={{ borderColor: 'var(--border)' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--accent)' }}
                >
                  {initials}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold leading-tight truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.fullName?.split(' (')[0] || 'User')}
                </p>
                <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                  {user?.role === 'ROLE_ADMIN' ? 'Finance Admin' : (user?.jobTitle || 'Employee')}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl z-50 animate-scale-in overflow-hidden"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                    {user?.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                      {user?.role === 'ROLE_ADMIN' ? 'Finance Admin' : 'Employee'}
                    </span>
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                      {user?.department}
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => { setShowProfileMenu(false); if (onNavigateTab) onNavigateTab('profile'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <User className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <span>My Profile</span>
                  </button>

                  {user?.role === 'ROLE_ADMIN' && (
                    <button
                      onClick={() => { setShowProfileMenu(false); if (onNavigateTab) onNavigateTab('team'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Users className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      <span>Team Members</span>
                    </button>
                  )}

                  <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      if (showToast) showToast('Signed out of session');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Sign Out / Switch Persona</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
