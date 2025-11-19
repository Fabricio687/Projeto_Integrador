import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import attendanceService from '../../services/attendance.service';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

const statusConfig = {
  present: {
    label: 'Presente',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-500/20',
    borderColor: 'border-green-200 dark:border-green-500/30',
  },
  absent: {
    label: 'Falta',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-500/20',
    borderColor: 'border-red-200 dark:border-red-500/30',
  },
  late: {
    label: 'Atraso',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-500/20',
    borderColor: 'border-yellow-200 dark:border-yellow-500/30',
  },
  excused: {
    label: 'Justificado',
    icon: AlertCircle,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/20',
    borderColor: 'border-blue-200 dark:border-blue-500/30',
  },
};

export default function AttendanceCalendarPage() {
  const [attendances, setAttendances] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      }
    } catch (err) {
      setError('Erro ao carregar faltas. Tente novamente.');
      console.error('Erro ao buscar faltas:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendancesForDate = (date) => {
    return attendances.filter(att => {
      const attDate = parseISO(att.date);
      return isSameDay(attDate, date);
    });
  };

  const getStatusForDate = (date) => {
    const dayAttendances = getAttendancesForDate(date);
    if (dayAttendances.length === 0) return null;
    
    // Retornar o status mais recente do dia
    const latest = dayAttendances.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )[0];
    return latest.status;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    const dayAttendances = getAttendancesForDate(date);
    if (dayAttendances.length > 0) {
      setSelectedDate({ date, attendances: dayAttendances });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Carregando calendário de faltas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-12">
            <p className="text-accent-red mb-4">{error}</p>
            <button
              onClick={fetchAttendances}
              className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-[#4AB0E8] transition-all duration-250"
            >
              Tentar Novamente
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mb-2">
            Calendário de Faltas
          </h1>
          <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
            Visualize suas presenças e faltas em formato de calendário
          </p>
        </div>
        <button
          onClick={() => navigate('/attendance')}
          className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-[#4AB0E8] transition-all duration-250 shadow-soft-dark"
        >
          Ver Lista
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = attendances.filter(a => a.status === status).length;
          const Icon = config.icon;
          return (
            <Card key={status} hover className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mb-1">{config.label}</p>
                  <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
                </div>
                <div className={`p-3 rounded-lg ${config.bgColor}`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Calendário */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-[#9CA3AF]" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-[#E6EAF0]">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-[#9CA3AF]" />
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-neutral-600 dark:text-[#9CA3AF] py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-2">
          {/* Espaços vazios antes do primeiro dia */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Dias do mês */}
          {daysInMonth.map((day) => {
            const status = getStatusForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate.date);
            const config = status ? statusConfig[status] : null;
            const Icon = config?.icon;

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square
                  rounded-lg
                  border-2
                  transition-all
                  duration-250
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-sm
                  font-medium
                  relative
                  ${
                    isSelected
                      ? 'border-accent-blue ring-2 ring-accent-blue ring-offset-2'
                      : config
                      ? `${config.borderColor} ${config.bgColor}`
                      : 'border-neutral-200 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.4)]'
                  }
                  ${isToday ? 'ring-2 ring-accent-purple' : ''}
                  hover:scale-105
                  hover:shadow-soft-dark
                `}
              >
                <span
                  className={
                    isToday
                      ? 'text-accent-purple dark:text-accent-purple font-bold'
                      : 'text-neutral-900 dark:text-[#E6EAF0]'
                  }
                >
                  {format(day, 'd')}
                </span>
                {Icon && (
                  <Icon
                    className={`w-4 h-4 mt-1 ${config.color}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Detalhes do dia selecionado */}
      {selectedDate && (
        <Card className="p-6 slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0]">
              {format(selectedDate.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-neutral-500 dark:text-[#9CA3AF] hover:text-neutral-900 dark:hover:text-[#E6EAF0]"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {selectedDate.attendances.map((attendance) => {
              const config = statusConfig[attendance.status];
              const Icon = config.icon;
              return (
                <div
                  key={attendance._id}
                  className={`p-4 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${config.color}`}>
                          {config.label}
                        </span>
                        {attendance.course && (
                          <span className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
                            - {attendance.course.name || attendance.courseName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
                        {format(parseISO(attendance.date), "HH:mm")}
                      </p>
                      {attendance.justification && (
                        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mt-1">
                          <span className="font-medium">Justificativa:</span> {attendance.justification}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Legenda */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-[#E6EAF0] mb-3">Legenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <div key={status} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm text-neutral-600 dark:text-[#9CA3AF]">{config.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

