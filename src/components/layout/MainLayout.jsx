// src/components/layout/MainLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Calendar, User, Search, LogOut, FileText, MessageSquare, ClipboardList, Users, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import searchService from '../../services/search.service';
import ThemeToggle from '../ui/ThemeToggle';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchRef = useRef(null);

  // Buscar quando o usuário digitar
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }

    if (searchQuery.trim().length < 2) {
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await searchService.search(searchQuery);
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Erro ao buscar:', error);
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [searchQuery]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowResults(false);
  };

  const handleResultClick = (type, id) => {
    setShowResults(false);
    setSearchQuery('');
    
    switch (type) {
      case 'course':
        navigate(`/lessons?course=${id}`);
        break;
      case 'lesson':
        navigate(`/lessons`);
        break;
      case 'exam':
        navigate(`/exams`);
        break;
      case 'event':
        navigate(`/calendar`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-[#121826] transition-colors duration-250">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-[rgba(30,38,54,0.8)] border-r border-neutral-200 dark:border-[rgba(255,255,255,0.1)] flex flex-col backdrop-blur-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-[rgba(255,255,255,0.1)]">
          {/* Logo temporário usando div colorida */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-soft-dark">
            <span className="text-white font-bold text-lg">PA</span>
          </div>
          <span className="ml-3 font-semibold text-lg text-neutral-900 dark:text-[#E6EAF0]">Portal do Aluno</span>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Início</span>
          </NavLink>

          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <BookOpen className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Disciplinas</span>
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Calendário</span>
          </NavLink>

          <NavLink
            to="/grades"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <ClipboardList className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Notas</span>
          </NavLink>

          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <BookOpen className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Aulas</span>
          </NavLink>

          <NavLink
            to="/exams"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Provas</span>
          </NavLink>

          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Mensagens</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Perfil</span>
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive
                  ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                  : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
              }`
            }
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Documentos</span>
          </NavLink>

          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-[rgba(255,255,255,0.1)]">
                <p className="px-4 text-xs font-semibold text-neutral-500 dark:text-[#9CA3AF] uppercase mb-2">Administração</p>
              </div>
              
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                      isActive
                        ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                        : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
                    }`
                  }
                >
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Gerenciar Usuários</span>
                </NavLink>
              )}
              
              <NavLink
                to="/admin/courses"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                    isActive
                      ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                      : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
                  }`
                }
              >
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Gerenciar Cursos</span>
              </NavLink>
              
              <NavLink
                to="/admin/documents"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                    isActive
                      ? 'bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-accent-blue border-l-4 border-accent-blue pl-3'
                      : 'text-neutral-600 dark:text-[#9CA3AF] hover:bg-neutral-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-neutral-900 dark:hover:text-[#E6EAF0]'
                  }`
                }
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Documentos dos Alunos</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Botão Sair */}
        <div className="p-4 border-t border-neutral-200 dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-red/10 dark:bg-accent-red/20 text-accent-red dark:text-accent-red rounded-lg hover:bg-accent-red/20 dark:hover:bg-accent-red/30 transition-all duration-250 font-medium text-sm shadow-soft dark:shadow-soft-dark"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-[rgba(30,38,54,0.8)] border-b border-neutral-200 dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between px-8 backdrop-blur-sm">
          {/* Busca */}
          <div className="flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar disciplinas, eventos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] placeholder-neutral-400 dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250"
                title="Buscar disciplinas, eventos..."
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#9CA3AF] hover:text-neutral-600 dark:hover:text-[#E6EAF0] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {/* Resultados da busca */}
              {showResults && searchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[rgba(30,38,54,0.95)] border border-neutral-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg shadow-soft dark:shadow-soft-dark z-50 max-h-96 overflow-y-auto backdrop-blur-md">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-neutral-500 dark:text-[#9CA3AF]">
                      Buscando...
                    </div>
                  ) : searchResults.total === 0 ? (
                    <div className="p-4 text-center text-sm text-neutral-500 dark:text-[#9CA3AF]">
                      Nenhum resultado encontrado
                    </div>
                  ) : (
                    <div className="py-2">
                      {/* Cursos */}
                      {searchResults.courses && searchResults.courses.length > 0 && (
                        <div className="px-4 py-2 border-b border-neutral-100 dark:border-[rgba(255,255,255,0.1)]">
                          <h3 className="text-xs font-semibold text-neutral-500 dark:text-[#9CA3AF] uppercase mb-2">Cursos</h3>
                          {searchResults.courses.map((course) => (
                            <button
                              key={course._id}
                              onClick={() => handleResultClick('course', course._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] rounded text-sm transition-colors"
                            >
                              <div className="font-medium text-neutral-900 dark:text-[#E6EAF0]">{course.name}</div>
                              <div className="text-xs text-neutral-500 dark:text-[#9CA3AF]">{course.code}</div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Aulas */}
                      {searchResults.lessons && searchResults.lessons.length > 0 && (
                        <div className="px-4 py-2 border-b border-neutral-100 dark:border-[rgba(255,255,255,0.1)]">
                          <h3 className="text-xs font-semibold text-neutral-500 dark:text-[#9CA3AF] uppercase mb-2">Aulas</h3>
                          {searchResults.lessons.map((lesson) => (
                            <button
                              key={lesson._id}
                              onClick={() => handleResultClick('lesson', lesson._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] rounded text-sm transition-colors"
                            >
                              <div className="font-medium text-neutral-900 dark:text-[#E6EAF0]">{lesson.title || 'Aula'}</div>
                              <div className="text-xs text-neutral-500 dark:text-[#9CA3AF]">
                                {lesson.course?.name || ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Provas */}
                      {searchResults.exams && searchResults.exams.length > 0 && (
                        <div className="px-4 py-2 border-b border-neutral-100 dark:border-[rgba(255,255,255,0.1)]">
                          <h3 className="text-xs font-semibold text-neutral-500 dark:text-[#9CA3AF] uppercase mb-2">Provas</h3>
                          {searchResults.exams.map((exam) => (
                            <button
                              key={exam._id}
                              onClick={() => handleResultClick('exam', exam._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] rounded text-sm transition-colors"
                            >
                              <div className="font-medium text-neutral-900 dark:text-[#E6EAF0]">{exam.title || 'Prova'}</div>
                              <div className="text-xs text-neutral-500 dark:text-[#9CA3AF]">
                                {exam.course?.name || ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Eventos */}
                      {searchResults.events && searchResults.events.length > 0 && (
                        <div className="px-4 py-2">
                          <h3 className="text-xs font-semibold text-neutral-500 dark:text-[#9CA3AF] uppercase mb-2">Eventos</h3>
                          {searchResults.events.map((event) => (
                            <button
                              key={event._id}
                              onClick={() => handleResultClick('event', event._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] rounded text-sm transition-colors"
                            >
                              <div className="font-medium text-neutral-900 dark:text-[#E6EAF0]">{event.title || 'Evento'}</div>
                              <div className="text-xs text-neutral-500 dark:text-[#9CA3AF]">
                                {event.course?.name || ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Info e Theme Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900 dark:text-[#E6EAF0]">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-neutral-500 dark:text-[#9CA3AF]">{user?.course || user?.email || 'Curso'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-semibold shadow-soft-dark">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-neutral-50 dark:bg-[#121826] transition-colors duration-250">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
