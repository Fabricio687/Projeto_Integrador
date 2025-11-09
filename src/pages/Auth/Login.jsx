// src/pages/Auth/Login.jsx
import Card from '../../components/ui/Card';
import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
  return (
    <Card className="w-full max-w-md p-6">
      <div className="mb-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">PA</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Portal do Aluno</h1>
        <p className="mt-2 text-sm text-neutral-600">Entre com suas credenciais</p>
      </div>
      <LoginForm />
    </Card>
  );
}

