// src/services/api.js
import axios from 'axios';

// Configuração da URL da API
// FORÇAR localhost durante desenvolvimento para evitar CORS com Vercel
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
const isProduction = import.meta.env.PROD && !isLocalhost;

let API_BASE_URL;

// Se estiver rodando em localhost, SEMPRE use o backend local
// Ignora VITE_API_URL se estiver em localhost para evitar CORS
if (isLocalhost) {
  API_BASE_URL = 'http://localhost:3100/api';
} else if (import.meta.env.VITE_API_URL) {
  // Em produção (não localhost), use VITE_API_URL se definido
  API_BASE_URL = import.meta.env.VITE_API_URL;
} else if (isProduction) {
  // Fallback para Vercel apenas em produção real
  API_BASE_URL = 'https://portal-aluno-backend.vercel.app/api';
} else {
  // Default para desenvolvimento
  API_BASE_URL = 'http://localhost:3100/api';
}

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔍 Mode:', import.meta.env.MODE);
console.log('🔍 PROD:', import.meta.env.PROD);
console.log('🔍 isLocalhost:', isLocalhost);
console.log('🔍 hostname:', window.location.hostname);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portal_aluno_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Adicionar interceptor para logs de depuração
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

let isLoggingOut = false;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if ((status === 401 || status === 403) && !isLoggingOut) {
      isLoggingOut = true;
      localStorage.removeItem('portal_aluno_token');
      localStorage.removeItem('portal_aluno_user');
      const current = window.location.pathname + window.location.search;
      window.location.replace(`/login?from=${encodeURIComponent(current)}`);
    }
    return Promise.reject(err);
  }
);

export default api;
