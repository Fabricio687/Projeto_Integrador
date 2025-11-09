import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { Users, BookOpen, FileText, TrendingUp, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/admin');
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
        <Loading text="Carregando dashboard administrativo..." />
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

  const usersStats = dashboardData?.usersStats || {};
  const totalUsers = usersStats.total || 0;
  const students = usersStats.students || 0;
  const teachers = usersStats.teachers || 0;
  const admins = usersStats.admins || 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Painel Administrativo</h1>
        <p className="text-sm text-neutral-600">Gerencie o sistema completo</p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total de Usuários</p>
              <p className="text-3xl font-bold text-neutral-900">{totalUsers}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total de Cursos</p>
              <p className="text-3xl font-bold text-neutral-900">
                {dashboardData?.coursesCount || 0}
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
              <p className="text-sm text-neutral-600 mb-1">Média Geral</p>
              <p className={`text-3xl font-bold ${
                parseFloat(dashboardData?.gradesAverage || 0) >= 7
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {parseFloat(dashboardData?.gradesAverage || 0).toFixed(1)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">/10</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-100">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Ações Rápidas</p>
              <div className="flex gap-2 mt-2">
                <Link to="/admin/users" className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Usuários
                </Link>
                <Link to="/admin/courses" className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  Cursos
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Distribuição de Usuários e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Distribuição de Usuários</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Alunos
                </span>
                <span className="text-sm font-bold text-neutral-900">{students}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${totalUsers > 0 ? (students / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  Professores
                </span>
                <span className="text-sm font-bold text-neutral-900">{teachers}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${totalUsers > 0 ? (teachers / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Administradores
                </span>
                <span className="text-sm font-bold text-neutral-900">{admins}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${totalUsers > 0 ? (admins / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Estatísticas de Presença</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Presentes</span>
              <span className="text-lg font-bold text-green-700">
                {dashboardData?.attendanceStats?.present || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-700">Ausentes</span>
              <span className="text-lg font-bold text-red-700">
                {dashboardData?.attendanceStats?.absent || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-700">Justificados</span>
              <span className="text-lg font-bold text-yellow-700">
                {dashboardData?.attendanceStats?.justified || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Cursos Mais Populares */}
      {dashboardData?.popularCourses && dashboardData.popularCourses.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cursos Mais Populares</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Curso</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Código</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Alunos</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.popularCourses.map((course, index) => (
                  <tr key={course._id || index} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 text-sm text-neutral-900">{course.name}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">{course.code}</td>
                    <td className="py-3 px-4 text-sm text-neutral-900 text-right">
                      {course.studentsCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Gerenciamento do Sistema */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Gerenciamento do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 rounded-lg">
            <h3 className="font-medium text-neutral-900 mb-3">Usuários</h3>
            <div className="space-y-2">
              <Link
                to="/admin/users"
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm text-center"
              >
                Gerenciar Usuários
              </Link>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-lg">
            <h3 className="font-medium text-neutral-900 mb-3">Cursos</h3>
            <div className="space-y-2">
              <Link
                to="/admin/courses"
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm text-center"
              >
                Gerenciar Cursos
              </Link>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-lg">
            <h3 className="font-medium text-neutral-900 mb-3">Documentos</h3>
            <div className="space-y-2">
              <a
                href="/certificates/pending"
                className="block w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm text-center"
              >
                Documentos Pendentes
              </a>
              <a
                href="/certificates"
                className="block w-full px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 text-sm text-center"
              >
                Gerenciar Documentos
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
