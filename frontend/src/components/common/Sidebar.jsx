import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, PlusCircle, BarChart3,
  AlertOctagon, CreditCard, Layers, User, Users, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',         icon: LayoutDashboard, role: 'ALL' },
  { id: 'log-tool',   label: 'Log Subscription',  icon: PlusCircle,      role: 'ALL' },
  { id: 'profile',    label: 'My Profile',        icon: User,            role: 'ALL' },
  { id: 'analytics',  label: 'Analytics',         icon: BarChart3,       role: 'ROLE_ADMIN' },
  { id: 'audit',      label: 'Idle & Waste Audit', icon: AlertOctagon,    role: 'ROLE_ADMIN', badge: '!' },
  { id: 'budgets',    label: 'Budgets',            icon: CreditCard,      role: 'ROLE_ADMIN' },
  { id: 'team',       label: 'Team Members',      icon: Users,           role: 'ROLE_ADMIN' },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.fullName?.split(' (')[0] || 'User');
  const initials = (user?.firstName?.[0] || user?.fullName?.[0] || 'U').toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col w-60 min-h-screen border-r flex-shrink-0"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ background: 'var(--accent)' }}
        >
          <Layers className="text-white" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
            SaaS<span style={{ color: 'var(--accent)' }}>Optima</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Expense Analytics
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Main Menu
        </p>
        {NAV_ITEMS
          .filter(item => item.role === 'ALL' || (item.role === 'ROLE_ADMIN' && isAdmin))
          .map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`sidebar-nav-${item.id}`}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group text-left"
                style={{
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className="w-4 h-4 text-[9px] font-black rounded-full flex items-center justify-center"
                    style={{ background: 'var(--warning)', color: '#000' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      {/* User card with profile link & Sign Out */}
      <div className="px-3 pb-4 border-t pt-4 flex items-center gap-1.5" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setActiveTab('profile')}
          title="Click to view and edit your profile"
          className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left group hover:opacity-90 min-w-0"
          style={{
            background: activeTab === 'profile' ? 'var(--accent-muted)' : 'var(--bg-elevated)',
            border: activeTab === 'profile' ? '1px solid var(--accent)' : '1px solid transparent'
          }}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover border flex-shrink-0"
              style={{ borderColor: 'var(--border)' }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate group-hover:underline" style={{ color: 'var(--text-primary)' }}>
              {displayName}
            </p>
            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
              {isAdmin ? 'Finance Admin' : (user?.jobTitle || 'Employee')} · {user?.department}
            </p>
          </div>
        </button>

        <button
          onClick={() => logout()}
          title="Sign Out / Switch Persona"
          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
