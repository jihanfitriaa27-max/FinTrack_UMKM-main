import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor untuk handle error
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// Auth Services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Transaction Services
export const transactionService = {
  getAll: (filters) => api.get('/transactions', { params: filters }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: (date_range) => api.get('/transactions/summary', { params: { date_range } }),
};

// Product Services
export const productService = {
  getAll: (filters) => api.get('/products', { params: filters }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  checkStock: (id) => api.get(`/products/${id}/stock`),
};

// Analytics Services
export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenue: (period) => api.get('/analytics/revenue', { params: { period } }),
  getExpenses: (period) => api.get('/analytics/expenses', { params: { period } }),
  getProfitMargin: () => api.get('/analytics/profit-margin'),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown'),
};

// AI Services
export const aiService = {
  analyzeTransaction: (data) => api.post('/ai/analyze-transaction', data),
  predictSales: (period) => api.get('/ai/predict-sales', { params: { period } }),
  getInsights: () => api.get('/ai/insights'),
  categorizeProduct: (data) => api.post('/ai/categorize-product', data),
};

// Settings Services
export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  getProfile: () => api.get('/settings/profile'),
  updateProfile: (data) => api.put('/settings/profile', data),
};

export default api;
