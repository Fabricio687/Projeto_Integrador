// src/pages/RegisterPage.jsx
import Card from '../components/ui/Card';
import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-neutral-50 dark:from-[#1E2636] dark:to-[#0F1419] px-4">
      <Card className="w-full max-w-2xl p-6">
        <h1 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0]">Criar conta</h1>
        <p className="mb-6 text-sm text-neutral-600 dark:text-[#9CA3AF]">
          Preencha os dados para acessar o portal.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-[#9CA3AF]">
          Já possui conta?{' '}
          <Link to="/login" className="text-blue-700 dark:text-accent-blue hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
