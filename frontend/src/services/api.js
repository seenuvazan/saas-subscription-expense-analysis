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
  getAll: () => api.get('/alerts'),
  getUnread: () => api.get('/alerts/unread'),
  markAsRead: (id) => api.patch(`/alerts/${id}/read`),
  triggerScan: () => api.post('/alerts/trigger-scan'),
};

export const budgetAPI = {
  getAll: () => api.get('/budgets'),
  update: (data) => api.post('/budgets', data),
};

export default api;
