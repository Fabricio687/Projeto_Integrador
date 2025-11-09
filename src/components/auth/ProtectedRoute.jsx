// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ roles }) {
  const { token, role } = useAuth();
  if (!token) {
    const current = window.location.pathname + window.location.search;
    return <Navigate to={`/login?from=${encodeURIComponent(current)}`} replace />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
