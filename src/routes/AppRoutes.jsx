import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Páginas públicas
import Login from '../pages/Auth/Login';
import VerifyDocument from '../pages/Public/VerifyDocument';

// Páginas de dashboard por perfil
import StudentDashboard from '../pages/Dashboard/StudentDashboard';
import TeacherDashboard from '../pages/Dashboard/TeacherDashboard';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';

// Páginas de funcionalidades
import CalendarPage from '../pages/Calendar/CalendarPage';
import MessagesPage from '../pages/MessagesPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import GradesPage from '../pages/GradesPage';
import AttendancePage from '../pages/AttendancePage';
import AttendanceCalendarPage from '../pages/Attendance/AttendanceCalendarPage';
import RegisterAttendancePage from '../pages/Attendance/RegisterAttendancePage';
import LessonsPage from '../pages/LessonsPage';
import ExamsPage from '../pages/ExamsPage';
import LessonFormPage from '../pages/Lessons/LessonFormPage';
import ExamFormPage from '../pages/Exams/ExamFormPage';
import GradeFormPage from '../pages/Grades/GradeFormPage';
import CoursesManagementPage from '../pages/Admin/CoursesManagementPage';
import UsersManagementPage from '../pages/Admin/UsersManagementPage';

// Componente para rotas protegidas
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Se ainda está carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirecionar para o dashboard apropriado com base no papel do usuário
    if (user.role === 'student') {
      return <Navigate to="/dashboard/student" />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/dashboard/teacher" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/dashboard/admin" />;
    }
    return <Navigate to="/" />;
  }
  
  return children;
};

// Componente para redirecionar com base no papel do usuário
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  
  // Se ainda está carregando, não redirecionar ainda
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se não tem usuário, redirecionar para login
  if (!user || !user.role) {
    return <Navigate to="/login" />;
  }
  
  // Redirecionar baseado no role
  if (user.role === 'student') {
    return <Navigate to="/dashboard/student" />;
  } else if (user.role === 'teacher') {
    return <Navigate to="/dashboard/teacher" />;
  } else if (user.role === 'admin') {
    return <Navigate to="/dashboard/admin" />;
  }
  
  return <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-document" element={<VerifyDocument />} />
      </Route>
      
      {/* Rotas protegidas */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/dashboard" element={<RoleBasedRedirect />} />
        
        {/* Dashboards específicos por papel */}
        <Route 
          path="/dashboard/student" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/teacher" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Funcionalidades comuns */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Notas, Aulas e Provas */}
        <Route 
          path="/grades" 
          element={
            <ProtectedRoute>
              <GradesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/grades/new" 
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <GradeFormPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/lessons" 
          element={
            <ProtectedRoute>
              <LessonsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/exams" 
          element={
            <ProtectedRoute>
              <ExamsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/attendance/calendar" 
          element={
            <ProtectedRoute>
              <AttendanceCalendarPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/attendance/register" 
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <RegisterAttendancePage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/lessons/new" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <LessonFormPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/exams/new" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <ExamFormPage />
            </ProtectedRoute>
          } 
        />

        {/* Rotas de Administração */}
        <Route 
          path="/admin/courses" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <CoursesManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersManagementPage />
            </ProtectedRoute>
          } 
        />

        {/* Rotas de Documentos */}
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute>
              <MyDocumentsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/documents/upload" 
          element={
            <ProtectedRoute>
              <UploadDocumentPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/documents" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <StudentDocumentsPage />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Rota para página não encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;