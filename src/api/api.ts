// En tu archivo API (api.ts)
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para agregar el token automáticamente
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;