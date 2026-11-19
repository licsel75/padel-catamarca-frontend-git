import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor: Adjunta el token automáticamente si existe
api.interceptors.request.use((config) => {
  // Buscamos el token en el localStorage
  const token = localStorage.getItem('padel_token');
  
  if (token) {
    // Si hay token, lo agregamos al header Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;