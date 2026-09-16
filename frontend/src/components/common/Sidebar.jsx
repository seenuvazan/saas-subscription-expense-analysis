import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  AlertOctagon,
  CreditCard,
  ShieldCheck,
  Layers,
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, role: 'ALL' },
    { id: 'log-tool', label: 'Log Subscription', icon: PlusCircle, role: 'ALL' },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3, role: 'ROLE_ADMIN' },
    { id: 'audit', label: 'Idle & Waste Audit', icon: AlertOctagon, role: 'ROLE_ADMIN', badge: 'Alerts' },
    { id: 'budgets', label: 'Department Budgets', icon: CreditCard, role: 'ROLE_ADMIN' },
  ];

  return (
    <aside className="w-64 bg-[#0b0f19] border-r border-gray-800 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center text-white shadow-lg glow-purple">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
              SaaS<span className="text-indigo-400">Optima</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Expense Analytics</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems
            .filter(item => item.role === 'ALL' || (item.role === 'ROLE_ADMIN' && isAdmin))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md glow-purple'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Role Footer Info Card */}
      <div className="p-4 border-t border-gray-800/80">
        <div className="glass-card p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-gray-200">{isAdmin ? 'Admin Clearance' : 'Employee Access'}</p>
            <p className="text-gray-400 text-[11px]">{user?.department} Dept</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
