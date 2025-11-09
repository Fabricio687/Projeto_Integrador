// src/components/layout/MainLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Calendar, User, Search, LogOut, FileText, MessageSquare, ClipboardList, Users } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const MainLayout = () => {
  const { user, logout } = useAuth();

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
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar disciplinas, eventos..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Buscar disciplinas, eventos..."
              />
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
