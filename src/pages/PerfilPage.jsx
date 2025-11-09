// src/pages/PerfilPage.jsx
// Redirect para ProfilePage
import { Navigate } from 'react-router-dom';

export default function PerfilPage() {
  return <Navigate to="/profile" replace />;
}

