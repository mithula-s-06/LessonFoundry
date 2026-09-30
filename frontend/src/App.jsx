import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { AIChatbotDrawer } from './components/chat/AIChatbotDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { SourceWorkspace } from './pages/SourceWorkspace';
import { SourceDetailPage } from './pages/SourceDetailPage';
import { PackGeneratorPage } from './pages/PackGeneratorPage';
import { LearningPackDetail } from './pages/LearningPackDetail';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentPackView } from './pages/StudentPackView';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminAudit } from './pages/AdminAudit';
import { ProfilePage } from './pages/ProfilePage';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative">
            <Navbar />
            <AIChatbotDrawer />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<LoginPage />} />

              {/* Teacher Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute requiredRole="TEACHER">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/sources"
                element={
                  <ProtectedRoute requiredRole="TEACHER">
                    <SourceWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/sources/:id"
                element={
                  <ProtectedRoute requiredRole="TEACHER">
                    <SourceDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/generate"
                element={
                  <ProtectedRoute requiredRole="TEACHER">
                    <PackGeneratorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/packs"
                element={
                  <ProtectedRoute requiredRole="TEACHER">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/packs/:id"
                element={
                  <ProtectedRoute requiredRole="TEACHER">
                    <LearningPackDetail />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/packs/:id"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentPackView />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminAudit />
                  </ProtectedRoute>
                }
              />

              {/* Shared Profile Route (Accessible by Admin, Teacher, Student) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  </AuthProvider>
</ThemeProvider>
);
};

export default App;
