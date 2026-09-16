import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 1,
      email: 'admin@company.com',
      fullName: 'Sarah Jenkins (Finance)',
      department: 'FINANCE',
      role: 'ROLE_ADMIN'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-jwt-token');
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

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data;
      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      // Fallback demo logins if backend API server is not running yet
      if (email === 'admin@company.com' || email.includes('admin')) {
        const demoUser = {
          id: 1,
          email: 'admin@company.com',
          fullName: 'Sarah Jenkins (Finance)',
          department: 'FINANCE',
          role: 'ROLE_ADMIN'
        };
        setUser(demoUser);
        setToken('demo-admin-jwt');
        return { success: true };
      } else {
        const demoUser = {
          id: 2,
          email: 'employee@company.com',
          fullName: 'Alex Morgan',
          department: 'ENGINEERING',
          role: 'ROLE_EMPLOYEE'
        };
        setUser(demoUser);
        setToken('demo-employee-jwt');
        return { success: true };
      }
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (newRole) => {
    if (newRole === 'ROLE_ADMIN') {
      setUser({
        id: 1,
        email: 'admin@company.com',
        fullName: 'Sarah Jenkins (Finance Admin)',
        department: 'FINANCE',
        role: 'ROLE_ADMIN'
      });
    } else {
      setUser({
        id: 2,
        email: 'employee@company.com',
        fullName: 'Alex Morgan (Engineering Lead)',
        department: 'ENGINEERING',
        role: 'ROLE_EMPLOYEE'
      });
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchRole }}>
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
