import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

// ── Indian demo users ────────────────────────────────────────────────────────
const DEMO_EMPLOYEE = {
  id: 2,
  firstName: 'Arjun',
  lastName: 'Mehta',
  fullName: 'Arjun Mehta',
  email: 'arjun.mehta@techvance.in',
  jobTitle: 'Senior Software Engineer',
  department: 'ENGINEERING',
  role: 'ROLE_EMPLOYEE',
  employeeId: 'EMP-1042',
  location: 'Bengaluru, Karnataka',
  bio: 'Leading core platform engineering and DevOps at Techvance Solutions.',
  phone: '+91 98765 43210',
  avatarUrl: null,
};

const DEMO_ADMIN = {
  id: 1,
  firstName: 'Priya',
  lastName: 'Sharma',
  fullName: 'Priya Sharma',
  email: 'priya.sharma@techvance.in',
  jobTitle: 'Head of Finance & Operations',
  department: 'FINANCE',
  role: 'ROLE_ADMIN',
  employeeId: 'EMP-0018',
  location: 'Gurugram, Haryana',
  bio: 'Managing enterprise SaaS governance, budgets and procurement at Techvance Solutions.',
  phone: '+91 87654 32109',
  avatarUrl: null,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const isLoggedIn = localStorage.getItem('saasoptima_logged_in') === 'true';
      const savedUser = localStorage.getItem('user');
      return isLoggedIn && savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const isLoggedIn = localStorage.getItem('saasoptima_logged_in') === 'true';
    return isLoggedIn ? localStorage.getItem('token') : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Synchronize profile with backend if available
  useEffect(() => {
    const syncProfile = async () => {
      try {
        const res = await profileAPI.getMe();
        if (res.data) {
          setUser(prev => ({ ...prev, ...res.data }));
        }
      } catch {
        // Fallback silently if offline or initial load
      }
    };
    if (token && user) {
      syncProfile();
    }
  }, [token]);

  const updateUser = (newUserData) => {
    setUser(prev => {
      const updated = { ...prev, ...newUserData };
      if (updated.firstName && updated.lastName) {
        updated.fullName = `${updated.firstName} ${updated.lastName}`;
      }
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (email, password, roleHint = null) => {
    try {
      setLoading(true);
      let resData = null;
      let resToken = null;

      const isAdmin =
        roleHint === 'ROLE_ADMIN' ||
        email.includes('priya') ||
        email.includes('finance') ||
        email.includes('admin');

      const backendEmail = isAdmin ? 'admin@company.com' : 'employee@company.com';
      const backendPass  = isAdmin ? 'admin123' : 'password123';

      try {
        const response = await authAPI.login({ email, password });
        resData = response.data;
        resToken = response.data?.token;
      } catch {
        try {
          const response = await authAPI.login({ email: backendEmail, password: backendPass });
          resData = response.data;
          resToken = response.data?.token;
        } catch {
          // Purely offline / mock mode
        }
      }

      const fallbackUser = isAdmin ? DEMO_ADMIN : DEMO_EMPLOYEE;
      const finalUser  = (resData && resData.email === email) ? resData : fallbackUser;
      const finalToken = resToken || (isAdmin ? 'demo-admin-jwt' : 'demo-employee-jwt');

      setToken(finalToken);
      setUser(finalUser);
      localStorage.setItem('user', JSON.stringify(finalUser));
      localStorage.setItem('token', finalToken);
      localStorage.setItem('saasoptima_logged_in', 'true');
      return { success: true, user: finalUser };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (newRole) => {
    if (newRole === 'ROLE_ADMIN') {
      const adminToken = 'demo-admin-jwt';
      setToken(adminToken);
      setUser(DEMO_ADMIN);
      localStorage.setItem('token', adminToken);
      localStorage.setItem('user', JSON.stringify(DEMO_ADMIN));
      localStorage.setItem('saasoptima_logged_in', 'true');
    } else {
      const empToken = 'demo-employee-jwt';
      setToken(empToken);
      setUser(DEMO_EMPLOYEE);
      localStorage.setItem('token', empToken);
      localStorage.setItem('user', JSON.stringify(DEMO_EMPLOYEE));
      localStorage.setItem('saasoptima_logged_in', 'true');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('saasoptima_logged_in');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
