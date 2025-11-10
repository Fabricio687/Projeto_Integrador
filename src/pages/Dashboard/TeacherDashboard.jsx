import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { Calendar, Users, BookOpen, FileText, MessageSquare, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/teacher');
        const data = response.data?.data || response.data;
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Carregando dashboard..." />
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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Painel do Professor</h1>
        <p className="text-sm text-neutral-600">Gerencie suas aulas, provas e alunos</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total de Cursos</p>
              <p className="text-3xl font-bold text-neutral-900">
                {dashboardData?.totalCourses || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Próximas Aulas</p>
              <p className="text-3xl font-bold text-neutral-900">
                {dashboardData?.nextLessons?.length || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Próximas Provas</p>
              <p className="text-3xl font-bold text-neutral-900">
                {dashboardData?.nextExams?.length || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Ações Rápidas</p>
              <div className="flex gap-2 mt-2">
                <Link to="/messages" className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Mensagens
                </Link>
                <Link to="/calendar" className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  Calendário
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Próximas Aulas e Provas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Próximas Aulas</h2>
          {dashboardData?.nextLessons && dashboardData.nextLessons.length > 0 ? (
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
            <p className="text-sm text-neutral-500">Não há aulas agendadas.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Próximas Avaliações</h2>
          {dashboardData?.nextExams && dashboardData.nextExams.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.nextExams.map((exam, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <FileText className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{exam.title || 'Avaliação'}</p>
                    <p className="text-sm text-neutral-600">{exam.course?.name || ''}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(exam.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Não há avaliações agendadas.</p>
          )}
        </Card>
      </div>

      {/* Estatísticas por Curso */}
      {dashboardData?.courseStats && dashboardData.courseStats.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Estatísticas por Curso</h2>
          <div className="space-y-4">
            {dashboardData.courseStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">{stat.course?.name || 'Curso'}</p>
                  <p className="text-sm text-neutral-600">Código: {stat.course?.code || '-'}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <Users className="w-4 h-4" />
                      <span>Alunos</span>
                    </div>
                    <p className="text-lg font-bold text-neutral-900">{stat.studentsCount || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-600">Média</p>
                    <p className={`text-lg font-bold ${
                      parseFloat(stat.gradesAverage || 0) >= 7 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(stat.gradesAverage || 0).toFixed(1)}/10
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/attendance/register"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors bg-purple-50 border-purple-200"
          >
            <ClipboardCheck className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-medium text-neutral-900">Registrar Presença</p>
            <p className="text-xs text-neutral-600 mt-1">Registrar faltas dos alunos</p>
          </Link>

          <Link
            to="/lessons"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Calendar className="w-5 h-5 text-blue-600 mb-2" />
            <p className="font-medium text-neutral-900">Agendar Nova Aula</p>
            <p className="text-xs text-neutral-600 mt-1">Ver todas as aulas</p>
          </Link>

          <Link
            to="/exams"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
          >
            <FileText className="w-5 h-5 text-orange-600 mb-2" />
            <p className="font-medium text-neutral-900">Criar Nova Avaliação</p>
            <p className="text-xs text-neutral-600 mt-1">Ver todas as avaliações</p>
          </Link>

          <Link
            to="/messages"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-green-600 mb-2" />
            <p className="font-medium text-neutral-900">Enviar Mensagem</p>
            <p className="text-xs text-neutral-600 mt-1">Comunicar com alunos</p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
