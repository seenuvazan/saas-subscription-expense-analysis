import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Pass current active user details for seamless demo/session alignment
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.role) config.headers['X-User-Role'] = user.role;
      if (user.department) config.headers['X-User-Department'] = user.department;
      if (user.email) config.headers['X-User-Email'] = user.email;
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
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
};

export const alertAPI = {
  getAll: (department) => api.get('/notifications', { params: department ? { department } : {} }),
  getUnread: (department) => api.get('/notifications', { params: department ? { department } : {} }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: (department) => api.patch('/notifications/read-all', {}, { params: department ? { department } : {} }),
  triggerScan: (department) => api.post('/cron/run-check', {}, { params: department ? { department } : {} }),
};

export const cronAPI = {
  runCheck: (department) => api.post('/cron/run-check', {}, { params: department ? { department } : {} }),
  getHistory: () => api.get('/cron/history'),
};

export const notificationAPI = {
  getAll: (department) => api.get('/notifications', { params: department ? { department } : {} }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: (department) => api.patch('/notifications/read-all', {}, { params: department ? { department } : {} }),
};

export const profileAPI = {
  getMe: () => api.get('/profile/me'),
  updateMe: (data) => api.put('/profile/me', data),
  uploadAvatar: (formData) => api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
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

export default api;
