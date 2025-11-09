// src/components/dashboard/Dashboard.jsx
import Card from '../ui/Card';
import StatsCard from './Statscard';
import WelcomeCard from './WelcomeCard';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/formatters';

// Esses dados serão conectados aos services nas próximas etapas
export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    nextLessons: 0,
    nextExams: 0,
    lastGrades: 0,
    avgGrade: null,
    upcoming: [],
  });

  useEffect(() => {
    // Placeholder: depois conectaremos com lessons/exams/grades services
    setLoading(true);
    const timer = setTimeout(() => {
      setStats({
        nextLessons: 2,
        nextExams: 1,
        lastGrades: 3,
        avgGrade: 8.4,
        upcoming: [
          { type: 'Aula', title: 'Estruturas de Dados', date: new Date().toISOString() },
          { type: 'Prova', title: 'Algoritmos I - P1', date: new Date(Date.now() + 86400000).toISOString() },
        ],
      });
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <WelcomeCard />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="Próximas aulas" value={loading ? '...' : stats.nextLessons} hint="Próximas 24h" accent="blue" />
        <StatsCard title="Próximas provas" value={loading ? '...' : stats.nextExams} hint="Esta semana" accent="orange" />
        <StatsCard title="Atividades corrigidas" value={loading ? '...' : stats.lastGrades} hint="Últimos 7 dias" accent="green" />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900">Próximos eventos</h3>
          <div className="text-sm text-neutral-500">
            Média atual: <span className="font-medium text-neutral-800">{stats.avgGrade ?? '-'}</span>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {loading ? (
            <div className="py-6 text-sm text-neutral-600">Carregando...</div>
          ) : stats.upcoming.length === 0 ? (
            <div className="py-6 text-sm text-neutral-600">Sem eventos próximos.</div>
          ) : (
            stats.upcoming.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-neutral-900">{it.type}: {it.title}</div>
                  <div className="text-xs text-neutral-500">{formatDate(it.date)}</div>
                </div>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
                  {it.type === 'Aula' ? 'Aula' : 'Prova'}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
