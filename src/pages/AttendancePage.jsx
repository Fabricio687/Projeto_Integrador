// src/pages/AttendancePage.jsx
import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import attendanceService from '../services/attendance.service';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const statusConfig = {
  present: {
    label: 'Presente',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  absent: {
    label: 'Falta',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  late: {
    label: 'Atraso',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  excused: {
    label: 'Justificado',
    icon: AlertCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
};

export default function AttendancePage() {
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
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Minhas Faltas</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Acompanhe suas presenças e faltas nas aulas
          </p>
        </div>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Taxa de Presença</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {stats.attendanceRate.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${stats.attendanceRate >= 75 ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Calendar className={`w-6 h-6 ${stats.attendanceRate >= 75 ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
          </div>
          <div className="mt-4 bg-neutral-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${stats.attendanceRate >= 75 ? 'bg-green-600' : 'bg-yellow-600'}`}
              style={{ width: `${Math.min(stats.attendanceRate, 100)}%` }}
            ></div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total de Aulas</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Presentes</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.present}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Faltas</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats.absent}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('present')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'present'
                ? 'bg-green-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Presentes ({stats.present})
          </button>
          <button
            onClick={() => setFilter('absent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'absent'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Faltas ({stats.absent})
          </button>
          <button
            onClick={() => setFilter('late')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'late'
                ? 'bg-yellow-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Atrasos ({stats.late})
          </button>
          <button
            onClick={() => setFilter('excused')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'excused'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Justificados ({stats.excused})
          </button>
        </div>
      </Card>

      {/* Lista de Faltas */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Registros de Presença</h2>
        
        {filteredAttendances.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500">
              {filter === 'all' 
                ? 'Nenhum registro de presença encontrado.'
                : `Nenhum registro com status "${statusConfig[filter]?.label}" encontrado.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredAttendances.map((attendance) => {
              const status = statusConfig[attendance.status] || statusConfig.absent;
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={attendance._id}
                  className={`p-4 hover:bg-neutral-50 transition-colors border-l-4 ${status.borderColor}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                        <span className={`font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        {attendance.course && (
                          <span className="text-sm text-neutral-600">
                            - {attendance.course.name || attendance.courseName}
                            {attendance.course.code && ` (${attendance.course.code})`}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-600 ml-8 space-y-1">
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




