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
        setError(null);
        const response = await api.get('/dashboard/student');
        
        // Verificar se a resposta tem sucesso
        if (response.data?.success === false) {
          throw new Error(response.data?.message || 'Erro ao carregar dados');
        }
        
        // Backend retorna { success, data }
        const data = response.data?.data || response.data;
        
        // Se não houver dados, criar estrutura vazia ao invés de erro
        if (!data) {
          setDashboardData({
            attendanceStats: { totalClasses: 0, presentClasses: 0, attendanceRate: 0 },
            nextLessons: [],
            nextExams: [],
            recentGrades: [],
            overallAverage: 0
          });
          return;
        }
        
        // Garantir que todos os campos existam
        setDashboardData({
          attendanceStats: data.attendanceStats || { totalClasses: 0, presentClasses: 0, attendanceRate: 0 },
          nextLessons: data.nextLessons || [],
          nextExams: data.nextExams || [],
          recentGrades: data.recentGrades || [],
          overallAverage: data.overallAverage || 0
        });
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.';
        setError(errorMessage);
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
        <Card className="border-accent-red dark:border-accent-red/30 bg-accent-red/10 dark:bg-accent-red/20">
          <div className="text-accent-red dark:text-accent-red">
            <h3 className="font-semibold mb-2">Erro</h3>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-[#4AB0E8] transition-all duration-250 shadow-soft-dark"
            >
              Tentar Novamente
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Card>
          <p className="text-neutral-600 dark:text-[#9CA3AF]">Nenhum dado disponível no momento.</p>
        </Card>
      </div>
    );
  }

  const attendanceRate = parseFloat(dashboardData.attendanceStats?.attendanceRate || 0);
  const overallAverage = parseFloat(dashboardData.overallAverage || 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mb-2">Meu Painel</h1>
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Bem-vindo de volta!</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mb-1">Média Geral</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-[#E6EAF0]">
                {overallAverage.toFixed(1)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              overallAverage >= 7 ? 'bg-green-100 dark:bg-green-500/20' : 'bg-accent-red/10 dark:bg-accent-red/20'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                overallAverage >= 7 ? 'text-green-600 dark:text-green-400' : 'text-accent-red dark:text-accent-red'
              }`} />
            </div>
          </div>
          <div className="mt-4 w-full bg-neutral-200 dark:bg-[rgba(255,255,255,0.1)] rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                overallAverage >= 7 ? 'bg-green-600 dark:bg-green-400' : 'bg-accent-red dark:bg-accent-red'
              }`}
              style={{ width: `${Math.min(overallAverage * 10, 100)}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mb-1">Presença</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-[#E6EAF0]">
                {attendanceRate.toFixed(0)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              attendanceRate >= 75 ? 'bg-accent-blue/10 dark:bg-accent-blue/20' : 'bg-accent-yellow/10 dark:bg-accent-yellow/20'
            }`}>
              <Calendar className={`w-6 h-6 ${
                attendanceRate >= 75 ? 'text-accent-blue' : 'text-accent-yellow'
              }`} />
            </div>
          </div>
          <div className="mt-4 w-full bg-neutral-200 dark:bg-[rgba(255,255,255,0.1)] rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                attendanceRate >= 75 ? 'bg-accent-blue' : 'bg-accent-yellow'
              }`}
              style={{ width: `${Math.min(attendanceRate, 100)}%` }}
            />
          </div>
        </Card>


        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mb-1">Próximas Aulas</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-[#E6EAF0]">
                {dashboardData.nextLessons?.length || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-accent-purple/10 dark:bg-accent-purple/20">
              <BookOpen className="w-6 h-6 text-accent-purple" />
            </div>
          </div>
        </Card>
      </div>

      {/* Próximas Aulas e Provas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0] mb-4">Próximas Aulas</h2>
          {dashboardData.nextLessons && dashboardData.nextLessons.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.nextLessons.map((lesson, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all duration-250 hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.1)]">
                  <Calendar className="w-5 h-5 text-accent-blue mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 dark:text-[#E6EAF0]">
                      {lesson.course?.name || lesson.title || 'Aula'}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
                      {new Date(lesson.date).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(lesson.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-[#9CA3AF]">Não há aulas agendadas para os próximos dias.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0] mb-4">Próximas Avaliações</h2>
          {dashboardData.nextExams && dashboardData.nextExams.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.nextExams.map((exam, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-accent-red/10 dark:bg-accent-red/20 rounded-lg border border-accent-red/20 dark:border-accent-red/30 transition-all duration-250 hover:bg-accent-red/20 dark:hover:bg-accent-red/30">
                  <FileText className="w-5 h-5 text-accent-red mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 dark:text-[#E6EAF0]">{exam.title || 'Avaliação'}</p>
                    <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
                      {exam.course?.name || ''}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-[#9CA3AF] mt-1">
                      {new Date(exam.date).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(exam.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-accent-red/20 dark:bg-accent-red/30 text-accent-red dark:text-accent-red rounded">
                    Importante
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-[#9CA3AF]">Não há avaliações agendadas para os próximos dias.</p>
          )}
        </Card>
      </div>

      {/* Notas Recentes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0] mb-4">Notas Recentes</h2>
        {dashboardData.recentGrades && dashboardData.recentGrades.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all duration-250 hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.1)]">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-[#E6EAF0]">
                    {grade.exam?.title || grade.courseName || 'Avaliação'}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
                    {grade.course?.name || grade.courseName || ''}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  parseFloat(grade.grade || grade.value || 0) >= 7
                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                    : 'bg-accent-red/10 dark:bg-accent-red/20 text-accent-red dark:text-accent-red'
                }`}>
                  {(grade.grade || grade.value || 0).toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-[#9CA3AF]">Não há notas recentes para exibir.</p>
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
