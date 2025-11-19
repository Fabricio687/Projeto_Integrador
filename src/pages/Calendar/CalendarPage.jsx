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
    } else {
      setEvents([]);
    }
  }, [selectedCourse, currentMonth]);

  const fetchCourses = async () => {
    try {
      const res = await coursesService.getAll();
      console.log('Resposta de cursos:', res);
      
      // Tentar diferentes estruturas de resposta
      let coursesData = [];
      if (res?.data?.success && res?.data?.data) {
        coursesData = res.data.data;
      } else if (res?.data?.data) {
        coursesData = res.data.data;
      } else if (Array.isArray(res?.data)) {
        coursesData = res.data;
      } else if (res?.success && res?.data) {
        coursesData = res.data;
      } else if (Array.isArray(res)) {
        coursesData = res;
      }
      
      console.log('Cursos carregados:', coursesData);
      setCourses(coursesData);
      
      // Se não há curso selecionado e há cursos, selecionar o primeiro
      if (coursesData.length > 0 && !selectedCourse) {
        setSelectedCourse(coursesData[0]._id);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const fetchEvents = async () => {
    if (!selectedCourse) {
      // Se "Todos os cursos" está selecionado, buscar de todos os cursos
      if (courses.length > 0) {
        await fetchAllCoursesEvents();
      } else {
        setEvents([]);
      }
      return;
    }
    
    try {
      setLoading(true);
      console.log('Buscando eventos para curso:', selectedCourse);
      
      let allLessons = [];
      let allExams = [];
      
      // Buscar aulas
      try {
        const lessonsRes = await lessonsService.listByCourse(selectedCourse);
        console.log('Resposta de aulas:', lessonsRes);
        
        // Tentar diferentes estruturas
        if (lessonsRes?.data?.success && lessonsRes?.data?.data) {
          allLessons = Array.isArray(lessonsRes.data.data) ? lessonsRes.data.data : [];
        } else if (lessonsRes?.data?.data) {
          allLessons = Array.isArray(lessonsRes.data.data) ? lessonsRes.data.data : [];
        } else if (Array.isArray(lessonsRes?.data)) {
          allLessons = lessonsRes.data;
        } else if (lessonsRes?.success && lessonsRes?.data) {
          allLessons = Array.isArray(lessonsRes.data) ? lessonsRes.data : [];
        } else if (Array.isArray(lessonsRes)) {
          allLessons = lessonsRes;
        }
        
        console.log('Aulas encontradas:', allLessons);
      } catch (err) {
        console.error('Erro ao buscar aulas:', err);
      }
      
      // Buscar provas
      try {
        const examsRes = await examsService.listByCourse(selectedCourse);
        console.log('Resposta de provas:', examsRes);
        
        // Tentar diferentes estruturas
        if (examsRes?.data?.success && examsRes?.data?.data) {
          allExams = Array.isArray(examsRes.data.data) ? examsRes.data.data : [];
        } else if (examsRes?.data?.data) {
          allExams = Array.isArray(examsRes.data.data) ? examsRes.data.data : [];
        } else if (Array.isArray(examsRes?.data)) {
          allExams = examsRes.data;
        } else if (examsRes?.success && examsRes?.data) {
          allExams = Array.isArray(examsRes.data) ? examsRes.data : [];
        } else if (Array.isArray(examsRes)) {
          allExams = examsRes;
        }
        
        console.log('Provas encontradas:', allExams);
      } catch (err) {
        console.error('Erro ao buscar provas:', err);
      }
      
      // Combinar e formatar eventos
      const allEvents = [
        ...allLessons.map(lesson => ({
          id: lesson._id,
          title: lesson.title || 'Aula sem título',
          type: 'lesson',
          date: lesson.date ? new Date(lesson.date) : new Date(),
          description: lesson.description || '',
          course: lesson.course
        })),
        ...allExams.map(exam => ({
          id: exam._id,
          title: exam.title || 'Prova sem título',
          type: 'exam',
          date: exam.date ? new Date(exam.date) : new Date(),
          description: exam.description || '',
          course: exam.course,
          maxGrade: exam.maxGrade,
          weight: exam.weight
        }))
      ];
      
      // Filtrar eventos com datas válidas e ordenar
      const validEvents = allEvents.filter(event => {
        const date = new Date(event.date);
        return !isNaN(date.getTime());
      });
      
      validEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log('Eventos finais:', validEvents);
      setEvents(validEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCoursesEvents = async () => {
    try {
      setLoading(true);
      let allLessons = [];
      let allExams = [];
      
      // Buscar eventos de todos os cursos
      for (const course of courses) {
        try {
          // Buscar aulas do curso
          const lessonsRes = await lessonsService.listByCourse(course._id);
          if (lessonsRes?.data?.success && lessonsRes?.data?.data) {
            const lessons = Array.isArray(lessonsRes.data.data) ? lessonsRes.data.data : [];
            allLessons = [...allLessons, ...lessons];
          } else if (Array.isArray(lessonsRes?.data)) {
            allLessons = [...allLessons, ...lessonsRes.data];
          }
          
          // Buscar provas do curso
          const examsRes = await examsService.listByCourse(course._id);
          if (examsRes?.data?.success && examsRes?.data?.data) {
            const exams = Array.isArray(examsRes.data.data) ? examsRes.data.data : [];
            allExams = [...allExams, ...exams];
          } else if (Array.isArray(examsRes?.data)) {
            allExams = [...allExams, ...examsRes.data];
          }
        } catch (err) {
          console.error(`Erro ao buscar eventos do curso ${course.name}:`, err);
        }
      }
      
      // Combinar e formatar eventos
      const allEvents = [
        ...allLessons.map(lesson => ({
          id: lesson._id,
          title: lesson.title || 'Aula sem título',
          type: 'lesson',
          date: lesson.date ? new Date(lesson.date) : new Date(),
          description: lesson.description || '',
          course: lesson.course
        })),
        ...allExams.map(exam => ({
          id: exam._id,
          title: exam.title || 'Prova sem título',
          type: 'exam',
          date: exam.date ? new Date(exam.date) : new Date(),
          description: exam.description || '',
          course: exam.course,
          maxGrade: exam.maxGrade,
          weight: exam.weight
        }))
      ];
      
      // Filtrar eventos com datas válidas e ordenar
      const validEvents = allEvents.filter(event => {
        const date = new Date(event.date);
        return !isNaN(date.getTime());
      });
      
      validEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log('Todos os eventos:', validEvents);
      setEvents(validEvents);
    } catch (error) {
      console.error('Erro ao carregar todos os eventos:', error);
      setEvents([]);
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
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-[#E6EAF0] whitespace-nowrap">Calendário Acadêmico</h1>
            <p className="text-sm text-neutral-600 dark:text-[#9CA3AF] mt-1">
              Visualize aulas e provas por curso
            </p>
          </div>
          <select
            value={selectedCourse || ''}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCourse(value || null);
            }}
            className="w-full md:w-64 rounded-md border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] px-3 py-2 text-sm text-neutral-900 dark:text-[#E6EAF0] outline-none focus:border-blue-500 dark:focus:border-accent-blue focus:ring focus:ring-blue-100 dark:focus:ring-accent-blue/20"
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
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0]">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="px-3 py-1.5 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-700 dark:text-[#E6EAF0] rounded-md text-sm hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-700 dark:text-[#E6EAF0] rounded-md text-sm hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
              >
                Hoje
              </button>
              <button
                onClick={nextMonth}
                className="px-3 py-1.5 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-700 dark:text-[#E6EAF0] rounded-md text-sm hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
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
                  <div key={day} className="text-center text-xs font-semibold text-neutral-600 dark:text-[#9CA3AF] py-2 whitespace-nowrap">
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
                      className={`min-h-[80px] border rounded-md p-2 ${
                        isToday 
                          ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/30' 
                          : 'bg-white dark:bg-[rgba(30,38,54,0.6)] border-neutral-200 dark:border-[rgba(255,255,255,0.1)]'
                      }`}
                    >
                      {date && (
                        <>
                          <div className={`text-xs font-medium mb-1 ${
                            isToday ? 'text-blue-700 dark:text-blue-400' : 'text-neutral-900 dark:text-[#E6EAF0]'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                  event.type === 'exam'
                                    ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                    : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                                }`}
                                title={event.title}
                              >
                                {event.type === 'exam' ? '📝' : '📚'} {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-neutral-500 dark:text-[#9CA3AF]">
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
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-[#E6EAF0] mb-3">
                    Eventos de {monthNames[currentMonth.getMonth()]}
                  </h3>
                  <div className="space-y-2">
                    {monthEvents.map(event => (
                      <div
                        key={event.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          event.type === 'exam'
                            ? 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/20'
                            : 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/20'
                        }`}
                      >
                        <div className={`p-2 rounded ${
                          event.type === 'exam'
                            ? 'bg-red-100 dark:bg-red-500/30 text-red-600 dark:text-red-400'
                            : 'bg-blue-100 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400'
                        }`}>
                          {event.type === 'exam' ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-900 dark:text-[#E6EAF0]">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-neutral-600 dark:text-[#9CA3AF]">
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
                            <p className="text-xs text-neutral-600 dark:text-[#9CA3AF] mt-1 line-clamp-2">
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
                  <CalendarIcon className="w-12 h-12 text-neutral-300 dark:text-[#6B7280] mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 dark:text-[#9CA3AF]">
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
