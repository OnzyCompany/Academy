import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
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

// Error Boundary Component to catch crashes
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Ops! Algo deu errado.</h1>
          <p className="text-gray-400 mb-6">Ocorreu um erro inesperado na aplicação.</p>
          <div className="bg-dark-800 p-4 rounded-lg border border-red-500/30 mb-6 max-w-2xl w-full overflow-auto text-left">
            <code className="text-xs text-red-300 font-mono whitespace-pre-wrap">
              {this.state.error?.toString()}
            </code>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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

  // Define routes where the main landing page Navbar AND WhatsApp button should NOT appear
  const hidePublicComponentsRoutes = ['/student', '/admin', '/personal'];
  const shouldShowPublicComponents = !hidePublicComponentsRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="bg-dark-900 min-h-screen text-gray-100">
      {shouldShowPublicComponents && <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />}
      
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
      
      {shouldShowPublicComponents && <WhatsAppFloat />}
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;