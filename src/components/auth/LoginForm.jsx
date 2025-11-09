// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/auth.service';

export default function LoginForm() {
  const { login, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = (e) => {
    setError(null);
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(form.email.trim(), form.password);
      if (response.data && response.data.token) {
        // O AuthContext já faz o redirecionamento baseado no role
        await login(response.data.user, response.data.token);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="E-mail"
        name="email"
        type="email"
        placeholder="seuemail@exemplo.com"
        value={form.email}
        onChange={onChange}
        required
      />
      <Input
        label="Senha"
        name="password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={onChange}
        required
      />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button disabled={loading} className="w-full">
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
