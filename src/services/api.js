// src/services/api.js
import axios from 'axios';

// Configuração da URL da API
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

// URL do backend em produção (fallback)
const PRODUCTION_API_URL = 'https://portal-aluno-backend-two.vercel.app/api';

// Prioridade:
// 1. Variável de ambiente VITE_API_URL (definida no .env ou Vercel)
// 2. Se estiver em localhost, usar backend local
// 3. Fallback para URL do backend em produção

let API_BASE_URL;

if (import.meta.env.VITE_API_URL) {
  // Usar variável de ambiente se definida (prioridade máxima)
  API_BASE_URL = import.meta.env.VITE_API_URL;
} else if (isLocalhost) {
  // Em desenvolvimento local, usar proxy do Vite (relativo)
  // O Vite proxy redireciona /api para http://localhost:3100/api
  API_BASE_URL = '/api';
} else {
  // Em produção no Vercel, usar URL do backend
  API_BASE_URL = PRODUCTION_API_URL;
}

// Log da URL sendo usada
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('📍 Ambiente:', isLocalhost ? 'Desenvolvimento Local' : 'Produção');

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portal_aluno_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação e logs
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => {
    // Log apenas em desenvolvimento
    if (!import.meta.env.PROD) {
      console.log('API Response:', response);
    }
    return response;
  },
  (error) => {
    // Log de erros
    if (!import.meta.env.PROD) {
      console.error('API Error:', error);
    }
    
    // Tratar erros de autenticação
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && !isLoggingOut) {
      isLoggingOut = true;
      localStorage.removeItem('portal_aluno_token');
      localStorage.removeItem('portal_aluno_user');
      const current = window.location.pathname + window.location.search;
      window.location.replace(`/login?from=${encodeURIComponent(current)}`);
    }
    return Promise.reject(error);
  }
);

export default api;
