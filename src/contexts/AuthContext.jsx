// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('portal_aluno_token');
    localStorage.removeItem('portal_aluno_user');
    setUser(null);
    navigate('/login');
  };

  // Verificar token ao carregar
  const checkAuth = async () => {
    const token = localStorage.getItem('portal_aluno_token');
    if (token) {
      try {
        const response = await authService.me();
        // Backend retorna { success, user } ou user diretamente
        const userData = response.data?.user || response.data;
        if (userData) {
          setUser(userData);
          localStorage.setItem('portal_aluno_user', JSON.stringify(userData));
        } else {
          // Token inválido, limpar sem redirecionar ainda
          localStorage.removeItem('portal_aluno_token');
          localStorage.removeItem('portal_aluno_user');
          setUser(null);
        }
      } catch (error) {
        // Token inválido ou expirado, limpar sem redirecionar ainda
        localStorage.removeItem('portal_aluno_token');
        localStorage.removeItem('portal_aluno_user');
        setUser(null);
      }
    } else {
      const userData = localStorage.getItem('portal_aluno_user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          localStorage.removeItem('portal_aluno_user');
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem('portal_aluno_token', token);
    localStorage.setItem('portal_aluno_user', JSON.stringify(userData));
    setUser(userData);
    
    // Redirecionar baseado no role
    if (userData.role === 'student') {
      navigate('/dashboard/student');
    } else if (userData.role === 'teacher') {
      navigate('/dashboard/teacher');
    } else if (userData.role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/student');
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(payload);
      return { ok: true, data: res.data };
    } catch (e) {
      const errorMessage = e?.response?.data?.message || 'Erro ao registrar usuário';
      const errorDetails = e?.response?.data?.details;
      const fullMessage = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
      setError(fullMessage);
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, setError, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
// Não exportamos um hook aqui; o hook fica em src/hooks/useAuth.js
