import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, PlusCircle, BarChart3, AlertOctagon,
  CreditCard, User, Users, LogOut, Layers, ChevronRight,
  RefreshCw, FileText, Bell, Settings, Activity, ShieldCheck
} from 'lucide-react';

// Navigation groups per spec
const NAV_GROUPS = [
  {
    label: null, // no section label for top-level
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, role: 'ALL' },
    ],
  },
  {
    label: 'Spend',
    items: [
      { id: 'audit',     label: 'Subscriptions', icon: Layers,       role: 'ALL' },
      { id: 'analytics', label: 'Analytics',     icon: BarChart3,    role: 'ROLE_ADMIN' },
      { id: 'budgets',   label: 'Budgets',       icon: CreditCard,   role: 'ROLE_ADMIN' },
      { id: 'savings',   label: 'Savings',       icon: RefreshCw,    role: 'ROLE_ADMIN', badge: 'new' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'log-tool',  label: 'Log Request',   icon: PlusCircle,   role: 'ALL' },
      { id: 'renewals',  label: 'Renewals',      icon: Bell,         role: 'ROLE_ADMIN', badge: '7' },
      { id: 'invoices',  label: 'Invoices',      icon: FileText,     role: 'ROLE_ADMIN' },
    ],
  },
  {
    label: 'Governance',
    items: [
      { id: 'idle-audit', label: 'License Audit', icon: AlertOctagon, role: 'ROLE_ADMIN', badge: '!' },
      { id: 'team',       label: 'Team',           icon: Users,        role: 'ROLE_ADMIN' },
      { id: 'activity',   label: 'Activity Log',   icon: Activity,     role: 'ROLE_ADMIN' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile', label: 'My Profile', icon: User, role: 'ALL' },
    ],
  },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : (user?.fullName?.split(' (')[0] || 'User');
  const initials = (user?.firstName?.[0] || user?.fullName?.[0] || 'U').toUpperCase() +
    (user?.lastName?.[0] || '').toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col w-56 min-h-screen flex-shrink-0 overflow-y-auto"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Brand */}
      <div
        className="px-4 py-5 flex items-center gap-2.5"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#3157D5' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="white"/>
            <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.6"/>
            <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.6"/>
            <rect x="13" y="13" width="8" height="8" rx="2" fill="white"/>
          </svg>
        </div>
        <div>
          <h1
            className="font-bold text-sm leading-tight"
            style={{ color: '#F9FAFB', letterSpacing: '-0.02em' }}
          >
            SaaSOptima
          </h1>
          <p className="text-xs" style={{ color: 'var(--sidebar-muted)' }}>
            Techvance Solutions
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(
            item => item.role === 'ALL' || (item.role === 'ROLE_ADMIN' && isAdmin)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label || 'main'} className="mb-4">
              {group.label && (
                <p
                  className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--sidebar-muted)' }}
                >
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      id={`sidebar-nav-${item.id}`}
                      aria-current={isActive ? 'page' : undefined}
                      className="sidebar-link"
                      style={{
                        background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                        color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'var(--sidebar-hover-bg)';
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--sidebar-text)';
                        }
                      }}
                    >
                      <Icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ opacity: isActive ? 1 : 0.7 }}
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                          style={{
                            background: item.badge === '!'
                              ? 'rgba(217,119,6,0.25)'
                              : item.badge === 'new'
                              ? 'rgba(22,134,92,0.25)'
                              : 'rgba(49,87,213,0.3)',
                            color: item.badge === '!'
                              ? '#FBBF24'
                              : item.badge === 'new'
                              ? '#6EE7B7'
                              : 'white',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="px-2 pb-3 pt-2"
        style={{ borderTop: '1px solid var(--sidebar-border)' }}
      >
        <button
          onClick={() => setActiveTab('profile')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left mb-0.5"
          style={{
            background: activeTab === 'profile' ? 'var(--sidebar-active-bg)' : 'transparent',
          }}
          onMouseEnter={e => {
            if (activeTab !== 'profile') e.currentTarget.style.background = 'var(--sidebar-hover-bg)';
          }}
          onMouseLeave={e => {
            if (activeTab !== 'profile') e.currentTarget.style.background = 'transparent';
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: '#3157D5', fontSize: '10px' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-semibold truncate leading-tight"
              style={{ color: '#F9FAFB' }}
            >
              {displayName}
            </p>
            <p className="text-[10px] truncate leading-tight" style={{ color: 'var(--sidebar-muted)' }}>
              {isAdmin ? 'Finance Admin' : (user?.jobTitle || 'Employee')}
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--sidebar-muted)', opacity: 0.6 }} />
        </button>

        <button
          onClick={() => logout()}
          title="Sign Out"
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all"
          style={{ color: 'var(--sidebar-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--sidebar-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
