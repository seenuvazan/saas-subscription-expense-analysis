import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage — only trust what came from a real backend response
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('saasoptima_token');
      const savedUser = localStorage.getItem('saasoptima_user');
      return token && savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('saasoptima_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Persist token
  useEffect(() => {
    if (token) {
      localStorage.setItem('saasoptima_token', token);
    } else {
      localStorage.removeItem('saasoptima_token');
    }
  }, [token]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem('saasoptima_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('saasoptima_user');
    }
  }, [user]);

  /**
   * Sync profile from backend after login / on app reload.
   * Updates stored user with latest data from the server.
   */
  const syncProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await profileAPI.getMe();
      if (res.data) {
        setUser(prev => {
          const updated = { ...prev, ...res.data };
          localStorage.setItem('saasoptima_user', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      // If 401/403 — token is invalid, log out
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
      }
      // Otherwise silently ignore (backend may be starting up)
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // On mount, if we have a token, verify it's still valid by fetching profile
  useEffect(() => {
    if (token && user) {
      syncProfile();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Login with real credentials. No fallback to demo users.
   * Returns { success: true } or throws an error with a message.
   */
  const login = async (email, password, remember = false) => {
    setLoading(true);
    try {
      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
        rememberMe: Boolean(remember),
      });
      const data = response.data;

      if (!data?.token) {
        throw new Error('Invalid server response — no token received');
      }

      const userObj = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        jobTitle: data.jobTitle || null,
        phone: data.phone || null,
        avatarUrl: data.avatarUrl || null,
        department: data.department,
        role: data.role,
      };

      setToken(data.token);
      setUser(userObj);

      // Immediately fetch fresh profile to ensure we have latest server data
      try {
        const profileRes = await profileAPI.getMe();
        if (profileRes.data) {
          const enriched = { ...userObj, ...profileRes.data };
          setUser(enriched);
          localStorage.setItem('saasoptima_user', JSON.stringify(enriched));
        }
      } catch {
        // Non-fatal — use login response data
      }

      return { success: true, user: userObj };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new account. Returns { success: true } or throws.
   */
  const register = async ({ firstName, lastName, email, password, department }) => {
    setLoading(true);
    try {
      const response = await authAPI.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        department: department || undefined,
      });
      const data = response.data;

      if (!data?.token) {
        throw new Error('Registration failed — no token received');
      }

      const userObj = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName || `${data.firstName} ${data.lastName}`,
        jobTitle: data.jobTitle || null,
        phone: data.phone || null,
        avatarUrl: data.avatarUrl || null,
        department: data.department,
        role: data.role,
      };

      setToken(data.token);
      setUser(userObj);
      return { success: true, user: userObj };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update stored user data (e.g. after profile edit).
   */
  const updateUser = useCallback((newUserData) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...newUserData };
      // Recompute fullName if names changed
      if (updated.firstName && updated.lastName) {
        updated.fullName = `${updated.firstName} ${updated.lastName}`.trim();
      }
      localStorage.setItem('saasoptima_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  /**
   * Logout: clear all session data.
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('saasoptima_token');
    localStorage.removeItem('saasoptima_user');
    // Clear old key names too
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('saasoptima_logged_in');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      syncProfile,
    }}>
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
