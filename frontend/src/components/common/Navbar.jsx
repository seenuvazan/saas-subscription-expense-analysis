import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cronAPI, notificationAPI } from '../../services/api';
import { searchVendors } from '../../utils/vendors';
import { formatTimeAgo, usdToINR } from '../../utils/formatters';
import VendorLogo from './VendorLogo';
import {
  Search, Bell, Sun, Moon, RefreshCw, X, ChevronRight,
  AlertTriangle, Info, Clock, History, CheckCheck, User,
  Users, LogOut, Settings, ChevronDown, Plus
} from 'lucide-react';

// ── Search Dropdown ───────────────────────────────────────────────────────────
const SearchDropdown = ({ query, subscriptions, onSelect }) => {
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
        className="absolute left-0 right-0 top-full mt-1.5 py-3 text-center text-xs rounded-xl border shadow-lg z-50 animate-scale-in"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        No results for "{query}"
      </div>
    );
  }

  return (
    <div
      className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border shadow-xl z-50 animate-scale-in overflow-hidden"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {subMatches.length > 0 && (
        <div>
          <div
            className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}
          >
            Active Subscriptions
          </div>
          {subMatches.map(sub => (
            <button
              key={sub.id}
              onClick={() => onSelect(sub)}
              className="w-full flex items-center justify-between px-3 py-2.5 transition-colors text-left"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <VendorLogo vendorName={sub.vendorName} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {sub.vendorName}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {sub.department} · {usdToINR(sub.cost || 0, true)}/mo
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
          <div
            className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
          >
            Catalog
          </div>
          {registryMatches.map(v => (
            <div
              key={v.name}
              className="flex items-center gap-2.5 px-3 py-2 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              <VendorLogo vendorName={v.label} size="sm" />
              <span>{v.label}</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded ml-auto"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
              >
                {v.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Notification Item ─────────────────────────────────────────────────────────
const NotifItem = ({ n, onMarkRead }) => {
  const isUnread   = !n.isRead && !n.read;
  const isCritical = n.severity === 'CRITICAL';
  const isWarning  = n.severity === 'WARNING';

  return (
    <div
      onClick={() => onMarkRead(n.id)}
      className="px-4 py-3 cursor-pointer transition-colors flex items-start gap-3"
      style={{ background: isUnread ? 'var(--accent-muted)' : 'transparent', borderBottom: '1px solid var(--border-light)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = isUnread ? 'var(--accent-muted)' : 'transparent'; }}
    >
      <div className="mt-0.5 flex-shrink-0">
        {n.vendorName ? (
          <VendorLogo vendorName={n.vendorName} size="sm" />
        ) : (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: isCritical ? 'var(--danger-muted)' : isWarning ? 'var(--warning-muted)' : 'var(--info-muted)',
              color: isCritical ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--info)',
            }}
          >
            {isCritical ? <AlertTriangle className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {n.title}
          </p>
          <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatTimeAgo(n.createdAt)}
          </span>
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {n.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: isCritical ? 'var(--danger-muted)' : isWarning ? 'var(--warning-muted)' : 'var(--info-muted)',
              color: isCritical ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--info)',
            }}
          >
            {n.severity || 'INFO'}
          </span>
          {isUnread && (
            <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: 'var(--accent)' }} />
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = ({
  onSearch,
  subscriptions = [],
  onOpenDrawer,
  onRefreshData,
  onNavigateTab,
  showToast,
}) => {
  const { user, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [searchTerm,        setSearchTerm]        = useState('');
  const [showSearch,        setShowSearch]        = useState(false);
  const [notifications,     setNotifications]     = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRunningCron,     setIsRunningCron]     = useState(false);
  const [lastRunTime,       setLastRunTime]       = useState(null);
  const [showHistory,       setShowHistory]       = useState(false);
  const [historyLogs,       setHistoryLogs]       = useState([]);
  const [showProfileMenu,   setShowProfileMenu]   = useState(false);

  const searchRef     = useRef(null);
  const notifRef      = useRef(null);
  const historyRef    = useRef(null);
  const profileRef    = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const dept = user?.role === 'ROLE_EMPLOYEE' ? user?.department : null;
      const res = await notificationAPI.getAll(dept);
      if (res.data && Array.isArray(res.data)) setNotifications(res.data);
    } catch { /* graceful fallback */ }
  }, [user]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await cronAPI.getHistory();
      if (res.data && Array.isArray(res.data)) {
        setHistoryLogs(res.data);
        if (res.data.length > 0 && !lastRunTime) setLastRunTime(res.data[0].ranAt);
      }
    } catch { /* graceful fallback */ }
  }, [lastRunTime]);

  useEffect(() => {
    fetchNotifications();
    fetchHistory();
  }, [fetchNotifications, fetchHistory]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (historyRef.current && !historyRef.current.contains(e.target)) setShowHistory(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  const handleRunCron = async () => {
    if (isRunningCron) return;
    setIsRunningCron(true);
    try {
      const dept = user?.role === 'ROLE_EMPLOYEE' ? user?.department : null;
      const res = await cronAPI.runCheck(dept);
      const summary = res.data;
      const newAlerts = summary.notificationsCreated || 0;
      const checked   = summary.checkedCount || 0;
      if (showToast) showToast(`Checked ${checked} subscriptions — ${newAlerts} new alert${newAlerts === 1 ? '' : 's'}`);
      setLastRunTime(new Date().toISOString());
      await fetchNotifications();
      await fetchHistory();
      if (onRefreshData) await onRefreshData();
    } catch {
      if (showToast) showToast('Renewal check completed');
    } finally {
      setIsRunningCron(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
    } catch { /* silent */ }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    try {
      const dept = user?.role === 'ROLE_EMPLOYEE' ? user?.department : null;
      await notificationAPI.markAllAsRead(dept);
    } catch { /* silent */ }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;
  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'User';
  const initials = (
    (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')
  ).toUpperCase() || 'U';

  return (
    <header
      className="sticky top-0 z-40 flex-shrink-0"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-14">

        {/* Search */}
        <div className="relative flex-1 max-w-xs" ref={searchRef}>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search subscriptions…"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-8 pr-8 py-1.5 rounded-lg text-sm transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.8125rem',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.background = 'var(--bg-surface)';
              if (searchTerm.length >= 2) setShowSearch(true);
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.background = 'var(--bg-elevated)';
            }}
          />
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setShowSearch(false); if (onSearch) onSearch(''); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
          {showSearch && (
            <SearchDropdown
              query={searchTerm}
              subscriptions={subscriptions}
              onSelect={handleSearchSelect}
            />
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">

          {/* Add Subscription button (visible on wider screens) */}
          {user?.role === 'ROLE_ADMIN' && (
            <button
              onClick={() => onNavigateTab && onNavigateTab('log-tool')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
              style={{ background: 'var(--accent)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Add Subscription</span>
            </button>
          )}

          {/* Cron check (compact) */}
          <div className="relative hidden lg:flex items-center gap-1" ref={historyRef}>
            <button
              onClick={handleRunCron}
              disabled={isRunningCron}
              title="Run renewal & threshold check"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border"
              style={{
                background: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <RefreshCw
                className={`w-3 h-3 ${isRunningCron ? 'animate-spin' : ''}`}
                style={{ color: 'var(--accent)' }}
              />
              <span className="hidden xl:inline">{isRunningCron ? 'Checking…' : 'Run Check'}</span>
            </button>
            <button
              onClick={() => { setShowHistory(v => !v); fetchHistory(); }}
              title="View check history"
              className="p-1.5 rounded-lg border transition-colors"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <History className="w-3.5 h-3.5" />
            </button>

            {showHistory && (
              <div
                className="absolute right-0 top-full mt-1.5 w-72 rounded-xl border shadow-xl z-50 animate-scale-in overflow-hidden"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Check History</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                    Last 10
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {historyLogs.length === 0 ? (
                    <div className="py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                      No scan history yet.
                    </div>
                  ) : historyLogs.map(log => (
                    <div key={log.id} className="p-3 text-xs border-b" style={{ borderColor: 'var(--border-light)' }}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {log.triggeredBy === 'scheduled' ? 'Scheduled (9:00 AM)' : 'Manual Check'}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>{formatTimeAgo(log.ranAt)}</span>
                      </div>
                      <p className="mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {log.summary || `Checked ${log.checkedCount} subscriptions`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border transition-colors"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(v => !v)}
              id="notification-bell-btn"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              className="relative p-2 rounded-lg border transition-colors"
              style={{
                background: showNotifications ? 'var(--bg-elevated)' : 'var(--bg-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 text-[9px] font-bold rounded-full flex items-center justify-center text-white"
                  style={{ background: 'var(--danger)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 top-full mt-1.5 rounded-xl border shadow-xl z-50 animate-scale-in overflow-hidden"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', width: 340 }}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Notifications {unreadCount > 0 && <span style={{ color: 'var(--accent)' }}>({unreadCount})</span>}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {user?.role === 'ROLE_ADMIN' ? 'All departments' : `${user?.department}`}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-1 text-[11px] font-medium transition-colors"
                      style={{ color: 'var(--accent)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent)'; }}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <NotifItem key={n.id} n={n} onMarkRead={handleMarkAsRead} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(v => !v)}
              id="user-profile-menu-btn"
              className="flex items-center gap-2 p-1.5 rounded-lg transition-colors"
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--accent)', fontSize: '10px' }}
              >
                {initials}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold leading-tight max-w-[90px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {firstName}
                </p>
                <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                  {user?.role === 'ROLE_ADMIN' ? 'Finance Admin' : (user?.jobTitle || 'Employee')}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 hidden lg:block" style={{ color: 'var(--text-muted)' }} />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border shadow-xl z-50 animate-scale-in overflow-hidden"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                  </p>
                  <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {user?.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
                    >
                      {user?.role === 'ROLE_ADMIN' ? 'Finance Admin' : 'Employee'}
                    </span>
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                      {user?.department}
                    </span>
                  </div>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => { setShowProfileMenu(false); if (onNavigateTab) onNavigateTab('profile'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <User className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    My Profile
                  </button>

                  {user?.role === 'ROLE_ADMIN' && (
                    <button
                      onClick={() => { setShowProfileMenu(false); if (onNavigateTab) onNavigateTab('team'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Users className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                      Team Members
                    </button>
                  )}

                  {/* Switch role (demo convenience) */}
                  <div className="my-1 mx-1" style={{ height: '1px', background: 'var(--border)' }} />
                  <div className="px-3 py-1.5">
                    <p className="text-[10px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Switch demo role</p>
                    <div
                      className="flex rounded-lg overflow-hidden border"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {['ROLE_EMPLOYEE', 'ROLE_ADMIN'].map(role => (
                        <button
                          key={role}
                          onClick={() => { switchRole(role); setShowProfileMenu(false); }}
                          className="flex-1 py-1 text-[10px] font-medium transition-colors"
                          style={{
                            background: user?.role === role ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: user?.role === role ? '#fff' : 'var(--text-secondary)',
                          }}
                        >
                          {role === 'ROLE_EMPLOYEE' ? 'Employee' : 'Admin'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="my-1 mx-1" style={{ height: '1px', background: 'var(--border)' }} />
                  <button
                    onClick={() => { setShowProfileMenu(false); logout(); if (showToast) showToast('Signed out successfully'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left"
                    style={{ color: '#C2413B' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-muted)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
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
