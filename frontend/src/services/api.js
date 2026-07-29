import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://pasteleria-dulzura.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir Token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dulzura_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
