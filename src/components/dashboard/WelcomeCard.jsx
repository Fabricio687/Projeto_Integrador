// src/components/dashboard/WelcomeCard.jsx
import Card from '../ui/Card';
import useAuth from '../../hooks/useAuth';

export default function WelcomeCard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{greet}, {user?.name?.split(' ')[0] || 'aluno'}!</h2>
          <p className="mt-1 text-sm text-blue-100">
            Bem-vindo ao Portal do Aluno. Aqui você acompanha aulas, provas e notas.
          </p>
        </div>
        <div className="hidden h-12 w-12 rounded-lg bg-white/20 md:block" />
      </div>
    </Card>
  );
}
