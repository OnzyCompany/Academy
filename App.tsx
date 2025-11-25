import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import Success from './pages/Success';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Carregando...</div>;
  
  if (!user) return <Navigate to="/" replace />;
  
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Basic role check
    return <Navigate to="/student" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  // Define routes where the main landing page Navbar should NOT appear
  const hideNavbarRoutes = ['/student', '/admin', '/personal'];
  const shouldShowNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="bg-dark-900 min-h-screen text-gray-100">
      {shouldShowNavbar && <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />}
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <Routes>
        <Route path="/" element={<Home onOpenAuth={() => setIsAuthModalOpen(true)} />} />
        
        <Route path="/success" element={<Success />} />

        <Route 
          path="/student" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/personal" 
          element={
            <ProtectedRoute>
              <PersonalDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      <WhatsAppFloat />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;