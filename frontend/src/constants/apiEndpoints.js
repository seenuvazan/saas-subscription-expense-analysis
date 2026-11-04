export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  SUBSCRIPTIONS: {
    BASE: '/api/subscriptions',
    BY_ID: id => `/api/subscriptions/${id}`,
    RENEWALS: '/api/subscriptions/upcoming-renewals',
  },
  ANALYTICS: {
    SUMMARY: '/api/analytics/summary',
    BY_CATEGORY: '/api/analytics/category',
    BY_DEPARTMENT: '/api/analytics/department',
  },
  BUDGET: {
    BASE: '/api/budgets',
  },
  USERS: {
    BASE: '/api/users',
  },
};
