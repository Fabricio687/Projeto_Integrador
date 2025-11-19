// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block rounded-md px-3 py-2 text-sm transition ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-neutral-700 hover:bg-neutral-100'
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-neutral-200 bg-white/60 p-3 md:block">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Navegação
      </div>
      <div className="space-y-1">
        <LinkItem to="/dashboard">Início</LinkItem>
        <LinkItem to="/lessons">Aulas</LinkItem>
        <LinkItem to="/exams">Provas</LinkItem>
        <LinkItem to="/grades">Notas</LinkItem>
        <LinkItem to="/attendance">Faltas</LinkItem>
        <LinkItem to="/spots">Vagas</LinkItem>
      </div>

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <>
          <div className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Gestão
          </div>
          <div className="space-y-1">
            <LinkItem to="/lessons">Gerir Aulas</LinkItem>
            <LinkItem to="/exams">Gerir Provas</LinkItem>
            <LinkItem to="/grades">Lançar Notas</LinkItem>
            <LinkItem to="/attendance/register">Registrar Presença</LinkItem>
          </div>
        </>
      )}
    </aside>
  );
}
