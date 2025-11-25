import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand p-2 rounded-lg transform group-hover:rotate-12 transition-transform">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter italic">
                MONSTER<span className="text-brand">HOUSE</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Home</Link>
              <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Sobre</button>
              <button onClick={() => scrollToSection('gallery')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Galeria</button>
              <button onClick={() => scrollToSection('plans')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Planos</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Contato</button>
              
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
                  className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-brand/25"
                >
                  Área do Aluno
                </button>
              )}
            </div>
          </div>
          
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

      {isMenuOpen && (
        <div className="md:hidden bg-dark-900 border-t border-dark-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <button onClick={() => scrollToSection('about')} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sobre</button>
            <button onClick={() => scrollToSection('gallery')} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Galeria</button>
            <button onClick={() => scrollToSection('plans')} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Planos</button>
            
            {user ? (
              <>
                <Link to="/student" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Área do Aluno</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-brand block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                )}
                <button onClick={handleSignOut} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Sair
                </button>
              </>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="w-full text-left text-brand hover:text-white block px-3 py-2 rounded-md text-base font-medium font-bold"
              >
                Entrar / Matricule-se
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;