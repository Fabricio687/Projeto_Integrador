// src/pages/AttendancePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import attendanceService from '../services/attendance.service';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const statusConfig = {
  present: {
    label: 'Presente',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-500/20',
    borderColor: 'border-green-200 dark:border-green-500/30'
  },
  absent: {
    label: 'Falta',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-500/20',
    borderColor: 'border-red-200 dark:border-red-500/30'
  },
  late: {
    label: 'Atraso',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-500/20',
    borderColor: 'border-yellow-200 dark:border-yellow-500/30'
  },
  excused: {
    label: 'Justificado',
    icon: AlertCircle,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/20',
    borderColor: 'border-blue-200 dark:border-blue-500/30'
  }
};

export default function AttendancePage() {
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, present, absent, late, excused

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getMyAttendances();
      
      if (response.success && response.data) {
        setAttendances(response.data.attendances || []);
        setStats(response.data.stats || stats);
      }
    } catch (err) {
      setError('Erro ao carregar faltas. Tente novamente.');
      console.error('Erro ao buscar faltas:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendances = filter === 'all' 
    ? attendances 
    : attendances.filter(a => a.status === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-neutral-600">Carregando faltas...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchAttendances}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-[#E6EAF0]">Minhas Faltas</h1>
            <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mt-1">
              Acompanhe suas presenças e faltas nas aulas
            </p>
          </div>
          <button
            onClick={() => navigate('/attendance/calendar')}
            className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-[#4AB0E8] transition-all duration-250 shadow-soft-dark flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Ver Calendário
          </button>
        </div>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Taxa de Presença</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mt-1">
                {stats.attendanceRate.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${stats.attendanceRate >= 75 ? 'bg-green-100 dark:bg-green-500/20' : 'bg-yellow-100 dark:bg-yellow-500/20'}`}>
              <Calendar className={`w-6 h-6 ${stats.attendanceRate >= 75 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
            </div>
          </div>
          <div className="mt-4 bg-neutral-200 dark:bg-[rgba(255,255,255,0.1)] rounded-full h-2">
            <div
              className={`h-2 rounded-full ${stats.attendanceRate >= 75 ? 'bg-green-600 dark:bg-green-400' : 'bg-yellow-600 dark:bg-yellow-400'}`}
              style={{ width: `${Math.min(stats.attendanceRate, 100)}%` }}
            ></div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Total de Aulas</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 rounded-full bg-accent-blue/10 dark:bg-accent-blue/20">
              <Calendar className="w-6 h-6 text-accent-blue" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Presentes</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {stats.present}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Faltas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {stats.absent}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/20">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
              filter === 'all'
                ? 'bg-accent-blue text-white shadow-soft-dark'
                : 'bg-neutral-100 dark:bg-[rgba(255,255,255,0.05)] text-neutral-700 dark:text-[#9CA3AF] hover:bg-neutral-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('present')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
              filter === 'present'
                ? 'bg-green-600 dark:bg-green-500 text-white shadow-soft-dark'
                : 'bg-neutral-100 dark:bg-[rgba(255,255,255,0.05)] text-neutral-700 dark:text-[#9CA3AF] hover:bg-neutral-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            Presentes ({stats.present})
          </button>
          <button
            onClick={() => setFilter('absent')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
              filter === 'absent'
                ? 'bg-accent-red text-white shadow-soft-dark'
                : 'bg-neutral-100 dark:bg-[rgba(255,255,255,0.05)] text-neutral-700 dark:text-[#9CA3AF] hover:bg-neutral-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            Faltas ({stats.absent})
          </button>
          <button
            onClick={() => setFilter('late')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
              filter === 'late'
                ? 'bg-accent-yellow text-white shadow-soft-dark'
                : 'bg-neutral-100 dark:bg-[rgba(255,255,255,0.05)] text-neutral-700 dark:text-[#9CA3AF] hover:bg-neutral-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            Atrasos ({stats.late})
          </button>
          <button
            onClick={() => setFilter('excused')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
              filter === 'excused'
                ? 'bg-accent-blue text-white shadow-soft-dark'
                : 'bg-neutral-100 dark:bg-[rgba(255,255,255,0.05)] text-neutral-700 dark:text-[#9CA3AF] hover:bg-neutral-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            Justificados ({stats.excused})
          </button>
        </div>
      </Card>

      {/* Lista de Faltas */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-[#E6EAF0]">Registros de Presença</h2>
        
        {filteredAttendances.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-neutral-400 dark:text-[#6B7280] mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-[#9CA3AF]">
              {filter === 'all' 
                ? 'Nenhum registro de presença encontrado.'
                : `Nenhum registro com status "${statusConfig[filter]?.label}" encontrado.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-[rgba(255,255,255,0.1)]">
            {filteredAttendances.map((attendance) => {
              const status = statusConfig[attendance.status] || statusConfig.absent;
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={attendance._id}
                  className={`p-4 hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250 border-l-4 ${status.borderColor}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                        <span className={`font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        {attendance.course && (
                          <span className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
                            - {attendance.course.name || attendance.courseName}
                            {attendance.course.code && ` (${attendance.course.code})`}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-[#9CA3AF] ml-8 space-y-1">
                        <p>
                          <span className="font-medium">Data:</span>{' '}
                          {formatDate(attendance.date)}
                        </p>
                        {attendance.professor && (
                          <p>
                            <span className="font-medium">Professor:</span>{' '}
                            {attendance.professor}
                          </p>
                        )}
                        {attendance.justification && (
                          <p>
                            <span className="font-medium">Justificativa:</span>{' '}
                            {attendance.justification}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}




