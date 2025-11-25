import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Dumbbell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (sectionId: string) => {
    setIsMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete and component to mount
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700 shadow-lg' : 'bg-transparent pt-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Dumbbell className="h-8 w-8 text-brand transform -rotate-45" />
              <span className="text-2xl font-bold text-white tracking-tight">
                Onzy<span className="text-brand">Academy</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Início
              </Link>
              <button onClick={() => handleNavigation('plans')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Planos</button>
              <button onClick={() => handleNavigation('about')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Sobre</button>
              <button onClick={() => handleNavigation('gallery')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Galeria</button>
              <button onClick={() => handleNavigation('contact')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Contato</button>
              
              {user ? (
                <>
                  <Link to="/student" className="text-gray-300 hover:text-white text-sm font-medium">Área do Aluno</Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-brand hover:text-brand-light text-sm font-medium">Admin</Link>
                  )}
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                    <span className="text-sm font-bold text-white">{profile?.name.split(' ')[0]}</span>
                    <button onClick={handleSignOut} className="text-gray-400 hover:text-brand transition-colors">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-md text-sm font-bold transition-all shadow-lg hover:shadow-brand/25"
                >
                  Matricule-se
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-900 border-t border-dark-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
            >
              Início
            </Link>
            <button onClick={() => handleNavigation('plans')} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Planos</button>
            <button onClick={() => handleNavigation('about')} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sobre</button>
            <button onClick={() => handleNavigation('gallery')} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Galeria</button>
            <button onClick={() => handleNavigation('contact')} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contato</button>
            
            {user ? (
              <>
                <Link to="/student" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Área do Aluno</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-brand block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                )}
                <button onClick={handleSignOut} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Sair
                </button>
              </>
            ) : (
              <button 
                onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                className="w-full text-left bg-brand text-white block px-3 py-2 rounded-md text-base font-bold mt-4"
              >
                Matricule-se
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;