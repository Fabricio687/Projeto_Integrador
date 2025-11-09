// src/components/layout/Navbar.jsx
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600" />
          <span className="text-sm font-semibold tracking-wide text-neutral-800">
            Portal do Aluno
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-neutral-600 md:block">
            {user?.name || 'Usuário'}
          </span>
          <button
            onClick={logout}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white shadow-sm transition hover:bg-neutral-800"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
