import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { Calendar, BookOpen, TrendingUp, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/student');
        // Backend retorna { success, data }
        const data = response.data?.data || response.data;
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Carregando seu dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <div className="text-red-800">
            <h3 className="font-semibold mb-2">Erro</h3>
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Card>
          <p className="text-neutral-600">Nenhum dado disponível no momento.</p>
        </Card>
      </div>
    );
  }

  const attendanceRate = parseFloat(dashboardData.attendanceStats?.attendanceRate || 0);
  const overallAverage = parseFloat(dashboardData.overallAverage || 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Meu Painel</h1>
        <p className="text-sm text-neutral-600">Bem-vindo de volta!</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Média Geral</p>
              <p className="text-3xl font-bold text-neutral-900">
                {overallAverage.toFixed(1)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              overallAverage >= 7 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                overallAverage >= 7 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <div className="mt-4 w-full bg-neutral-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                overallAverage >= 7 ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(overallAverage * 10, 100)}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Presença</p>
              <p className="text-3xl font-bold text-neutral-900">
                {attendanceRate.toFixed(0)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              attendanceRate >= 75 ? 'bg-blue-100' : 'bg-yellow-100'
            }`}>
              <Calendar className={`w-6 h-6 ${
                attendanceRate >= 75 ? 'text-blue-600' : 'text-yellow-600'
              }`} />
            </div>
          </div>
          <div className="mt-4 w-full bg-neutral-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                attendanceRate >= 75 ? 'bg-blue-600' : 'bg-yellow-600'
              }`}
              style={{ width: `${Math.min(attendanceRate, 100)}%` }}
            />
          </div>
        </Card>


        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Próximas Aulas</p>
              <p className="text-3xl font-bold text-neutral-900">
                {dashboardData.nextLessons?.length || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-100">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Próximas Aulas e Provas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Próximas Aulas</h2>
          {dashboardData.nextLessons && dashboardData.nextLessons.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.nextLessons.map((lesson, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">
                      {lesson.course?.name || lesson.title || 'Aula'}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {new Date(lesson.date).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(lesson.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Não há aulas agendadas para os próximos dias.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Próximas Avaliações</h2>
          {dashboardData.nextExams && dashboardData.nextExams.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.nextExams.map((exam, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <FileText className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{exam.title || 'Avaliação'}</p>
                    <p className="text-sm text-neutral-600">
                      {exam.course?.name || ''}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(exam.date).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(exam.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                    Importante
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Não há avaliações agendadas para os próximos dias.</p>
          )}
        </Card>
      </div>

      {/* Notas Recentes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notas Recentes</h2>
        {dashboardData.recentGrades && dashboardData.recentGrades.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">
                    {grade.exam?.title || grade.courseName || 'Avaliação'}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {grade.course?.name || grade.courseName || ''}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  parseFloat(grade.grade || grade.value || 0) >= 7
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {(grade.grade || grade.value || 0).toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Não há notas recentes para exibir.</p>
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
