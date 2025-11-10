// src/components/layout/MainLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Calendar, User, Search, LogOut, FileText, MessageSquare, ClipboardList, Users, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import searchService from '../../services/search.service';

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
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-200">
          {/* Logo temporário usando div colorida */}
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">PA</span>
          </div>
          <span className="ml-3 font-semibold text-lg text-neutral-900">Portal do Aluno</span>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Início</span>
          </NavLink>

          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <BookOpen className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Disciplinas</span>
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Calendário</span>
          </NavLink>

          <NavLink
            to="/grades"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <ClipboardList className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Notas</span>
          </NavLink>

          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <BookOpen className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Aulas</span>
          </NavLink>

          <NavLink
            to="/exams"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Provas</span>
          </NavLink>

          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Mensagens</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Perfil</span>
          </NavLink>

          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="px-4 text-xs font-semibold text-neutral-500 uppercase mb-2">Administração</p>
              </div>
              
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`
                }
              >
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Gerenciar Cursos</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Botão Sair */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8">
          {/* Busca */}
          <div className="flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar disciplinas, eventos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Buscar disciplinas, eventos..."
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {/* Resultados da busca */}
              {showResults && searchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-neutral-500">
                      Buscando...
                    </div>
                  ) : searchResults.total === 0 ? (
                    <div className="p-4 text-center text-sm text-neutral-500">
                      Nenhum resultado encontrado
                    </div>
                  ) : (
                    <div className="py-2">
                      {/* Cursos */}
                      {searchResults.courses && searchResults.courses.length > 0 && (
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Cursos</h3>
                          {searchResults.courses.map((course) => (
                            <button
                              key={course._id}
                              onClick={() => handleResultClick('course', course._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded text-sm"
                            >
                              <div className="font-medium text-neutral-900">{course.name}</div>
                              <div className="text-xs text-neutral-500">{course.code}</div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Aulas */}
                      {searchResults.lessons && searchResults.lessons.length > 0 && (
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Aulas</h3>
                          {searchResults.lessons.map((lesson) => (
                            <button
                              key={lesson._id}
                              onClick={() => handleResultClick('lesson', lesson._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded text-sm"
                            >
                              <div className="font-medium text-neutral-900">{lesson.title || 'Aula'}</div>
                              <div className="text-xs text-neutral-500">
                                {lesson.course?.name || ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Provas */}
                      {searchResults.exams && searchResults.exams.length > 0 && (
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Provas</h3>
                          {searchResults.exams.map((exam) => (
                            <button
                              key={exam._id}
                              onClick={() => handleResultClick('exam', exam._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded text-sm"
                            >
                              <div className="font-medium text-neutral-900">{exam.title || 'Prova'}</div>
                              <div className="text-xs text-neutral-500">
                                {exam.course?.name || ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Eventos */}
                      {searchResults.events && searchResults.events.length > 0 && (
                        <div className="px-4 py-2">
                          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Eventos</h3>
                          {searchResults.events.map((event) => (
                            <button
                              key={event._id}
                              onClick={() => handleResultClick('event', event._id)}
                              className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded text-sm"
                            >
                              <div className="font-medium text-neutral-900">{event.title || 'Evento'}</div>
                              <div className="text-xs text-neutral-500">
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

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-neutral-500">{user?.course || user?.email || 'Curso'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
