// src/pages/Auth/Register.jsx
import Card from '../../components/ui/Card';
import RegisterForm from '../../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <Card className="w-full max-w-md p-6">
      <div className="mb-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">PA</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Criar Conta</h1>
        <p className="mt-2 text-sm text-neutral-600">Cadastre-se no portal do aluno</p>
      </div>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-neutral-600">
        Já tem conta?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Fazer login
        </Link>
      </p>
    </Card>
  );
}

