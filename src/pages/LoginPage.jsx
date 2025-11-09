// src/pages/LoginPage.jsx
import Card from '../components/ui/Card';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-neutral-50 px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-1 text-lg font-semibold text-neutral-900">Entrar</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Acesse o portal com seu e-mail e senha.
        </p>
        <LoginForm />
      </Card>
    </div>
  );
}
