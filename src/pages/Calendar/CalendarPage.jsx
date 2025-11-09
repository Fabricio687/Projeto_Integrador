// src/pages/Calendar/CalendarPage.jsx
import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import lessonsService from '../../services/lessons.service';
import examsService from '../../services/exams.service';
import coursesService from '../../services/courses.service';
import { Calendar as CalendarIcon, Clock, BookOpen, FileText } from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]._id);
    }
  }, [courses]);

  useEffect(() => {
    if (selectedCourse) {
      fetchEvents();
    }
  }, [selectedCourse, currentMonth]);

  const fetchCourses = async () => {
    try {
      const res = await coursesService.getAll();
      setCourses(res.data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Buscar aulas
      const lessonsRes = await lessonsService.listByCourse(selectedCourse);
      const lessons = lessonsRes.data?.data || [];
      
      // Buscar provas
      const examsRes = await examsService.listByCourse(selectedCourse);
      const exams = examsRes.data?.data || [];
      
      // Combinar e formatar eventos
      const allEvents = [
        ...lessons.map(lesson => ({
          id: lesson._id,
          title: lesson.title,
          type: 'lesson',
          date: new Date(lesson.date),
          description: lesson.description,
          course: lesson.course
        })),
        ...exams.map(exam => ({
          id: exam._id,
          title: exam.title,
          type: 'exam',
          date: new Date(exam.date),
          description: exam.description,
          course: exam.course,
          maxGrade: exam.maxGrade,
          weight: exam.weight
        }))
      ];
      
      // Ordenar por data
      allEvents.sort((a, b) => a.date - b.date);
      setEvents(allEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // getDay() retorna 0 (domingo) a 6 (sábado)
    // Ajustamos para que segunda-feira seja 0: (getDay() + 6) % 7
    // Assim: domingo (0) vira 6, segunda (1) vira 0, etc.
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const days = [];
    
    // Dias vazios no início (para alinhar segunda-feira na primeira coluna)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDay = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Calendário começa na segunda-feira (1) ao invés de domingo (0)
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  
  // Filtrar eventos do mês atual
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth.getMonth() &&
           eventDate.getFullYear() === currentMonth.getFullYear();
  });

  return (
    <div className="space-y-6 p-6">
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Calendário Acadêmico</h1>
            <p className="text-sm text-neutral-600 mt-1">
              Visualize aulas e provas por curso
            </p>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-64 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
          >
            <option value="">Todos os cursos</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="px-3 py-1.5 border border-neutral-300 rounded-md text-sm hover:bg-neutral-50"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 border border-neutral-300 rounded-md text-sm hover:bg-neutral-50"
              >
                Hoje
              </button>
              <button
                onClick={nextMonth}
                className="px-3 py-1.5 border border-neutral-300 rounded-md text-sm hover:bg-neutral-50"
              >
                Próximo →
              </button>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <>
              {/* Calendário */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-neutral-600 py-2 whitespace-nowrap">
                    {day}
                  </div>
                ))}
                {days.map((date, index) => {
                  const dayEvents = getEventsForDay(date);
                  const isToday = date && 
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] border border-neutral-200 rounded-md p-2 ${
                        isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                      }`}
                    >
                      {date && (
                        <>
                          <div className={`text-xs font-medium mb-1 ${
                            isToday ? 'text-blue-700' : 'text-neutral-900'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                  event.type === 'exam'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                                title={event.title}
                              >
                                {event.type === 'exam' ? '📝' : '📚'} {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-neutral-500">
                                +{dayEvents.length - 2} mais
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Lista de Eventos do Mês */}
              {monthEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                    Eventos de {monthNames[currentMonth.getMonth()]}
                  </h3>
                  <div className="space-y-2">
                    {monthEvents.map(event => (
                      <div
                        key={event.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          event.type === 'exam'
                            ? 'border-red-200 bg-red-50'
                            : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className={`p-2 rounded ${
                          event.type === 'exam'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {event.type === 'exam' ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-900">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-neutral-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {event.date.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.date.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {event.type === 'exam' && event.maxGrade && (
                              <span className="text-xs">
                                Nota máx: {event.maxGrade} | Peso: {event.weight}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {monthEvents.length === 0 && !loading && (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">
                    Nenhum evento agendado para este mês
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
