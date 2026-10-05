import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { DEPARTMENTS } from '../../utils/constants';
import UserProfile from '../profile/UserProfile';
import { Search, Users, Edit3, Shield, Mail, Briefcase, Filter } from 'lucide-react';

const TeamMembers = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll();
      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch {
      // Fallback demo mock users
      setUsers([
        {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Jenkins',
          fullName: 'Sarah Jenkins',
          email: 'admin@company.com',
          jobTitle: 'VP of Finance',
          department: 'FINANCE',
          role: 'ROLE_ADMIN',
          employeeId: 'EMP-1001',
          location: 'New York, NY',
        },
        {
          id: 2,
          firstName: 'Alex',
          lastName: 'Morgan',
          fullName: 'Alex Morgan',
          email: 'employee@company.com',
          jobTitle: 'Engineering Lead',
          department: 'ENGINEERING',
          role: 'ROLE_EMPLOYEE',
          employeeId: 'EMP-1042',
          location: 'San Francisco, CA',
        },
        {
          id: 3,
          firstName: 'David',
          lastName: 'Kim',
          fullName: 'David Kim',
          email: 'david.kim@company.com',
          jobTitle: 'Staff Product Designer',
          department: 'DESIGN',
          role: 'ROLE_EMPLOYEE',
          employeeId: 'EMP-1055',
          location: 'Austin, TX',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (editingUserId) {
    return (
      <UserProfile
        targetUserId={editingUserId}
        onBack={() => { setEditingUserId(null); fetchUsers(); }}
        showToast={showToast}
      />
    );
  }

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      u.fullName?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.jobTitle?.toLowerCase().includes(q) ||
      u.employeeId?.toLowerCase().includes(q);

    const matchesDept = selectedDept === 'ALL' || u.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h1 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Team Members & Employee Directory
            </h1>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Manage employee access, departmental alignments, and profile information.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          <span className="px-3 py-1.5 rounded-xl border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            Total Employees: <strong style={{ color: 'var(--text-primary)' }}>{users.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, email, job title, or ID…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none transition-colors"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border focus:outline-none"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List / Table */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            No team members found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b uppercase text-[10px] tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
                  <th className="py-3 px-5 font-bold">Team Member</th>
                  <th className="py-3 px-5 font-bold">Job Title</th>
                  <th className="py-3 px-5 font-bold">Department</th>
                  <th className="py-3 px-5 font-bold">Role</th>
                  <th className="py-3 px-5 font-bold">Employee ID</th>
                  <th className="py-3 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filteredUsers.map(u => {
                  const initials = (u.firstName?.[0] || u.fullName?.[0] || 'U').toUpperCase();
                  const isAdmin = u.role === 'ROLE_ADMIN';

                  return (
                    <tr key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName}
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
                          <div>
                            <p className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                              {u.fullName || `${u.firstName} ${u.lastName}`}
                            </p>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5" style={{ color: 'var(--text-secondary)' }}>
                        {u.jobTitle || 'Team Member'}
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                          style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
                        >
                          {u.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{
                            background: isAdmin ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: isAdmin ? '#fff' : 'var(--text-secondary)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          {isAdmin ? 'Finance Admin' : 'Employee'}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {u.employeeId || 'EMP-1042'}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingUserId(u.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--accent)' }}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
