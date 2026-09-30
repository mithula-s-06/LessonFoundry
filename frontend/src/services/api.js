import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lf_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('lf_token');
        localStorage.removeItem('lf_user');
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// API Modules
export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

export const sourceApi = {
  getAll: () => apiClient.get('/sources'),
  getById: (id) => apiClient.get(`/sources/${id}`),
  upload: (formData) => apiClient.post('/sources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => apiClient.delete(`/sources/${id}`),
};

export const packApi = {
  getAll: () => apiClient.get('/packs'),
  getById: (id) => apiClient.get(`/packs/${id}`),
  create: (data) => apiClient.post('/packs', data),
  generate: (id) => apiClient.post(`/packs/${id}/generate`),
  publish: (id) => apiClient.post(`/packs/${id}/publish`),
  getPublishedForStudents: () => apiClient.get('/packs/student/published'),
};

export const assetApi = {
  getById: (id) => apiClient.get(`/assets/${id}`),
  regenerate: (id, data) => apiClient.post(`/assets/${id}/regenerate`, data),
  approve: (id) => apiClient.post(`/assets/${id}/approve`),
  requestRevision: (id, reason) => apiClient.post(`/assets/${id}/request-revision`, { reason }),
  getVersions: (id) => apiClient.get(`/assets/${id}/versions`),
  getProvenance: (id) => apiClient.get(`/assets/${id}/provenance`),
};

export const validationApi = {
  getValidation: (packId) => apiClient.get(`/validation/pack/${packId}`),
  getAlignment: (packId) => apiClient.get(`/validation/alignment/${packId}`),
};

export const userApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  updateRole: (id, role) => apiClient.patch(`/users/${id}/role`, { role }),
  updateStatus: (id, enabled) => apiClient.patch(`/users/${id}/status`, { enabled }),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  getStats: () => apiClient.get('/users/stats'),
};

export const interactionApi = {
  submitQuiz: (packId, data) => apiClient.post(`/packs/${packId}/submissions`, data),
  getPackSubmissions: (packId) => apiClient.get(`/packs/${packId}/submissions`),
  getMySubmissions: () => apiClient.get('/student/my-submissions'),
  getDiscussions: (packId) => apiClient.get(`/packs/${packId}/discussions`),
  postDiscussion: (packId, data) => apiClient.post(`/packs/${packId}/discussions`, data),
};

export const aiApi = {
  chat: (payload) => apiClient.post('/ai/chat', payload),
};

export const auditApi = {
  getLogs: () => apiClient.get('/audit'),
};

export default apiClient;

