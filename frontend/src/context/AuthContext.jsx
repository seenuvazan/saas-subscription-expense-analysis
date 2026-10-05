import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

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
      } catch (e) {
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

      // Map demo emails to backend seeded accounts if needed
      const backendEmail = 
        roleHint === 'ROLE_EMPLOYEE' || email.includes('alex') || email.includes('engineering') || email.includes('employee')
          ? 'employee@company.com'
          : 'admin@company.com';
      const backendPass = backendEmail === 'admin@company.com' ? 'admin123' : 'password123';

      try {
        // First try the actual email provided
        const response = await authAPI.login({ email, password });
        resData = response.data;
        resToken = response.data?.token;
      } catch (e1) {
        try {
          // If custom demo email, fall back to seeded backend credentials
          const response = await authAPI.login({ email: backendEmail, password: backendPass });
          resData = response.data;
          resToken = response.data?.token;
        } catch (e2) {
          // Purely offline or mock mode
        }
      }

      const isEmp =
        roleHint === 'ROLE_EMPLOYEE' ||
        email.includes('alex') ||
        email.includes('engineering') ||
        email.includes('employee');

      const fallbackUser = isEmp
        ? {
            id: resData?.id || 2,
            firstName: 'Alex',
            lastName: 'Morgan',
            fullName: resData?.fullName || 'Alex Morgan',
            email: email || 'alex.morgan@engineering.saasoptima.io',
            jobTitle: 'Engineering Lead',
            department: 'ENGINEERING',
            role: 'ROLE_EMPLOYEE',
            employeeId: 'EMP-1042',
            location: 'San Francisco, CA',
            bio: 'Leading core infrastructure, DevOps, and cloud architecture at SaaSoptima.',
            avatarUrl: null
          }
        : {
            id: resData?.id || 1,
            firstName: 'Sarah',
            lastName: 'Chen',
            fullName: resData?.fullName || 'Sarah Chen',
            email: email || 'sarah.chen@finance.saasoptima.io',
            jobTitle: 'Head of Corporate Finance',
            department: 'FINANCE',
            role: 'ROLE_ADMIN',
            employeeId: 'EMP-0018',
            location: 'New York, NY',
            bio: 'Directing global enterprise financial governance, cloud commitments, and SaaS audits.',
            avatarUrl: null
          };

      const finalUser = resData && resData.email === email ? resData : fallbackUser;
      const finalToken = resToken || (isEmp ? 'demo-employee-jwt' : 'demo-admin-jwt');

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
      const adminUser = {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Chen',
        fullName: 'Sarah Chen',
        email: 'sarah.chen@finance.saasoptima.io',
        jobTitle: 'Head of Corporate Finance',
        department: 'FINANCE',
        role: 'ROLE_ADMIN',
        employeeId: 'EMP-0018',
        location: 'New York, NY'
      };
      setUser(adminUser);
      localStorage.setItem('token', adminToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('saasoptima_logged_in', 'true');
    } else {
      const empToken = 'demo-employee-jwt';
      setToken(empToken);
      const empUser = {
        id: 2,
        firstName: 'Alex',
        lastName: 'Morgan',
        fullName: 'Alex Morgan',
        email: 'alex.morgan@engineering.saasoptima.io',
        jobTitle: 'Engineering Lead',
        department: 'ENGINEERING',
        role: 'ROLE_EMPLOYEE',
        employeeId: 'EMP-1042',
        location: 'San Francisco, CA'
      };
      setUser(empUser);
      localStorage.setItem('token', empToken);
      localStorage.setItem('user', JSON.stringify(empUser));
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
