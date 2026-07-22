import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('drivehub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Unpack Standardized Envelope { success, status_code, message, data }
api.interceptors.response.use(
  (response) => {
    // If response comes wrapped in standard API envelope, return data field with message attached
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return {
        ...response,
        data: response.data.data,
        message: response.data.message,
        rawEnvelope: response.data
      };
    }
    return response;
  },
  (error) => {
    // Handle error envelope from backend
    if (error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      error.response.data.detail = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const vehiclesAPI = {
  getAll: () => api.get('/vehicles'),
  search: (params) => api.get('/vehicles/search', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

export const inventoryAPI = {
  purchase: (id) => api.post(`/vehicles/${id}/purchase`),
  restock: (id, quantity) => api.post(`/vehicles/${id}/restock`, { quantity }),
};

export default api;
