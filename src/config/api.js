import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://149.28.198.126:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Asegurarse de que la URL no incluya /api duplicado
  if (config.url.startsWith('/api/')) {
    config.url = config.url.replace('/api/', '/');
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/ingreso';
    }
    return Promise.reject(error);
  }
);

export default api; 