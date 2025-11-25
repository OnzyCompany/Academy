import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

type AuthMode = 'signin' | 'signup' | 'reset';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Erro Google Auth:", err);
      setError('Erro ao conectar com Google. Tente novamente ou use e-mail e senha.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validações básicas para cadastro
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'reset') {
        // Fluxo de Recuperação de Senha
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: window.location.origin + '/#/student',
        });
        if (resetError) throw resetError;
        setSuccessMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada (e spam).');
      } 
      else if (mode === 'signup') {
        // Fluxo de Cadastro
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone
            },
            emailRedirectTo: window.location.origin
          }
        });

        if (signUpError) throw signUpError;

        // Se user for nulo ou identidade não confirmada (dependendo da config do Supabase)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
             setError('Este e-mail já está cadastrado. Tente fazer login.');
             setLoading(false);
             return;
        }

        if (data.user && !data.session) {
            setSuccessMessage('Cadastro iniciado! Verifique seu e-mail para confirmar a conta antes de entrar.');
            // Usa UPSERT para garantir que, se o trigger do banco já criou, nós apenas atualizamos os dados
            await supabase.from('profiles').upsert({
                id: data.user.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: 'student'
            }).catch(err => console.log("Perfil será atualizado após login."));
        } 
        else if (data.user && data.session) {
          // Usa UPSERT aqui também para evitar o erro "duplicate key"
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: 'student'
          });
          
          if (profileError) console.error("Aviso criação perfil:", profileError);
          
          setMode('signin');
          setSuccessMessage('Conta criada com sucesso! Redirecionando...');
          setTimeout(onClose, 2000);
        }

      } else {
        // Fluxo de Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Failed to fetch') {
        setError('Erro de conexão. Verifique sua internet.');
      } else if (err.message === 'User already registered') {
        setError('Este e-mail já está cadastrado. Faça login ou recupere sua senha.');
      } else if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos.');
      } else if (err.message.includes('rate limit')) {
        setError('Muitas tentativas. Aguarde um momento.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Por favor, confirme seu e-mail antes de fazer login.');
      } else {
        setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl w-full max-w-md overflow-hidden border border-dark-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-dark-700 flex justify-between items-center sticky top-0 bg-dark-800 z-10">
          <div className="flex items-center gap-2">
            {mode === 'reset' && (
              <button onClick={() => switchMode('signin')} className="text-gray-400 hover:text-white mr-2">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-white">
              {mode === 'signin' ? 'Acessar Conta' : mode === 'signup' ? 'Criar Conta' : 'Recuperar Senha'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm break-words">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Social Login Section */}
          {mode !== 'reset' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white text-gray-800 hover:bg-gray-100 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Entrar com Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-800 text-gray-400">Ou continue com e-mail</span>
                </div>
              </div>
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
                    placeholder="Seu nome"
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
                    placeholder="(00) 00000-0000"
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
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-400">Senha</label>
                {mode === 'signin' && (
                  <button 
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-xs text-brand hover:text-brand-light transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-12 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="******"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-sm font-medium text-gray-400">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-12 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repita sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-brand/20"
          >
            {loading ? 'Processando...' : (
              mode === 'signin' ? 'Entrar' : 
              mode === 'signup' ? 'Começar Agora' : 
              'Enviar Link de Recuperação'
            )}
          </button>

          <div className="text-center pt-2">
            {mode === 'signin' ? (
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-sm text-gray-400 hover:text-white"
              >
                Não tem conta? <span className="text-brand">Crie agora</span>
              </button>
            ) : mode === 'signup' ? (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-sm text-gray-400 hover:text-white"
              >
                Já tem conta? <span className="text-brand">Faça login</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-sm text-gray-400 hover:text-white"
              >
                Voltar para o Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;