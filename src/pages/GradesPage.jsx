// src/pages/GradesPage.jsx
import Card from '../components/ui/Card';
import GradesList from '../components/grades/GradesList';
import GradesChart from '../components/grades/GradesChart';
import useAuth from '../hooks/useAuth';

export default function GradesPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'teacher' || user?.role === 'admin';
  // Professores e admins veem todas as notas, alunos veem apenas as suas
  const mode = canManage ? 'all' : 'mine';

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-base font-semibold text-neutral-900 dark:text-[#E6EAF0]">Notas</h1>
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
          {canManage 
            ? 'Gerencie as notas dos alunos. Clique em "Nova Nota" para lançar uma avaliação.'
            : 'Acompanhe seu histórico de notas e média ponderada.'
          }
        </p>
      </Card>

      <GradesList mode={mode} canManage={canManage} />

      {/* Exemplo: gráfico rápido das últimas notas. Em produção, passe as notas carregadas. */}
      {/* <GradesChart grades={notas} /> */}
    </div>
  );
}
