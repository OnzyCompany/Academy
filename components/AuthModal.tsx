import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Create profile record (Note: Trigger usually handles this, but doing it manually as fallback)
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: 'student'
          });
          
          if (profileError) console.error("Profile creation warning:", profileError);
          
          alert('Conta criada! Verifique seu email ou faça login.');
          setMode('signin');
        }

      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl w-full max-w-md overflow-hidden border border-dark-700 shadow-2xl">
        <div className="p-6 border-b border-dark-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'signin' ? 'Acessar Conta' : 'Criar Conta'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="tel"
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="email"
                required
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="password"
                required
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Processando...' : (mode === 'signin' ? 'Entrar' : 'Começar Agora')}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-gray-400 hover:text-white"
            >
              {mode === 'signin' 
                ? 'Não tem conta? Crie agora' 
                : 'Já tem conta? Faça login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;