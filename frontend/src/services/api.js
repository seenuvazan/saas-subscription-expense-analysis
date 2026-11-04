import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('saasoptima_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally — clear stale auth data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid — clear storage (AuthContext will handle UI state)
      localStorage.removeItem('saasoptima_token');
      localStorage.removeItem('saasoptima_user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword }),
};

export const subscriptionAPI = {
  getAll: (params) => api.get('/subscriptions', { params }),
  getById: (id) => api.get(`/subscriptions/${id}`),
  create: (data) => api.post('/subscriptions', data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data),
  updateStatus: (id, status) => api.patch(`/subscriptions/${id}/status`, { status }),
  delete: (id) => api.delete(`/subscriptions/${id}`),
};

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getDepartments: () => api.get('/analytics/departments'),
  getCategories: () => api.get('/analytics/categories'),
  getForecast: () => api.get('/analytics/forecast'),
  getLicenseUtilization: () => api.get('/analytics/license-utilization'),
};

export const alertAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnread: () => api.get('/notifications', { params: { unread: true } }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  triggerScan: () => api.post('/cron/run-check'),
};

export const cronAPI = {
  runCheck: () => api.post('/cron/run-check'),
  getHistory: () => api.get('/cron/history'),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const profileAPI = {
  getMe: () => api.get('/profile/me'),
  updateMe: (data) => api.put('/profile/me', data),
  uploadAvatar: (formData) => api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.put('/profile/password', data),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
};

export const budgetAPI = {
  getAll: () => api.get('/budgets'),
  update: (data) => api.post('/budgets', data),
};

export const invoiceAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getSummary: () => api.get('/invoices/summary'),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data, file) => {
    if (file) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('file', file);
      return api.post('/invoices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/invoices', data);
  },
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  recordPayment: (id, paymentData) => api.post(`/invoices/${id}/payments`, paymentData),
  uploadOriginalPdf: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/invoices/${id}/upload-original`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadPdf: async (id, invoiceNumber) => {
    const response = await api.get(`/invoices/${id}/download-pdf`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeNumber = (invoiceNumber || `INV-${id}`).replace(/[^a-zA-Z0-9.-]/g, '_');
    link.setAttribute('download', `Invoice_${safeNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  downloadOriginalPdf: async (id, filename) => {
    const response = await api.get(`/invoices/${id}/download-original`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `Vendor_Invoice_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  downloadMonthlyReport: async (month, year) => {
    const response = await api.get('/invoices/report/download-pdf', {
      params: { month, year },
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SaaSOptima_Expense_Report_${month}_${year}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default api;

