import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Award, 
  Flame, 
  LayoutDashboard, 
  Dumbbell, 
  UserCheck, 
  Search, 
  Lock, 
  Unlock,
  ChevronRight,
  Trophy,
  Target,
  Home,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { VideoLesson, UserStats, Achievement } from '../types';

// Mock Data para Conquistas
const MOCK_ACHIEVEMENTS: (Achievement & { unlocked: boolean, progress: number, target: number })[] = [
  { id: '1', title: 'Primeiros Passos', description: 'Complete seu primeiro treino', icon: 'flag', points: 10, active: true, unlocked: true, progress: 1, target: 1, color: 'yellow', criteria_type: 'workouts', criteria_value: 1 },
  { id: '2', title: 'Consistência', description: 'Treine 3 dias seguidos', icon: 'flame', points: 30, active: true, unlocked: true, progress: 3, target: 3, color: 'orange', criteria_type: 'streak', criteria_value: 3 },
  { id: '3', title: 'Maratonista', description: 'Assista 10 videoaulas', icon: 'video', points: 50, active: true, unlocked: false, progress: 4, target: 10, color: 'blue', criteria_type: 'video', criteria_value: 10 },
  { id: '4', title: 'Lenda da Academia', description: 'Alcance o nível 10', icon: 'crown', points: 100, active: true, unlocked: false, progress: 1, target: 10, color: 'purple', criteria_type: 'points', criteria_value: 10 },
  { id: '5', title: 'Focado', description: 'Complete 50 treinos', icon: 'target', points: 100, active: true, unlocked: false, progress: 12, target: 50, color: 'red', criteria_type: 'workouts', criteria_value: 50 },
];

const StudentDashboard = () => {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'personal' | 'achievements'>('overview');
  
  // States
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    total_points: 0,
    workouts_completed: 0,
    videos_completed: 0,
    current_streak: 0
  });
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [personalCode, setPersonalCode] = useState('');
  const [linkedPersonal, setLinkedPersonal] = useState<any>(null); // Mock personal data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Aqui simulamos chamadas ao banco. Em produção, substitua pelos selects reais.
      
      // 1. Fetch Stats
      const { data: statsData } = await supabase.from('user_stats').select('*').eq('user_id', profile?.id).single();
      if(statsData) setStats(statsData);
      else setStats({ level: 1, total_points: 150, workouts_completed: 5, videos_completed: 2, current_streak: 3 });

      // 2. Fetch Videos
      const { data: videoData } = await supabase.from('video_lessons').select('*').eq('is_active', true);
      if (videoData && videoData.length > 0) {
        setVideos(videoData);
      } else {
        // Mock Videos
        setVideos([
           {
              id: '1', title: 'Fundamentos da Musculação', description: 'Aprenda a postura correta para evitar lesões.', 
              video_url: '', thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80', 
              duration: '12:00', difficulty: 'beginner', category: 'Musculação', personal_id: null, is_free: true, views_count: 120
          },
          {
              id: '2', title: 'HIIT Queima Total', description: '20 minutos para acelerar o metabolismo.', 
              video_url: '', thumbnail_url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80', 
              duration: '20:00', difficulty: 'advanced', category: 'Cardio', personal_id: null, is_free: true, views_count: 85
          },
          {
              id: '3', title: 'Treino de Pernas (Personal)', description: 'Série exclusiva para hipertrofia.', 
              video_url: '', thumbnail_url: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=800&q=80', 
              duration: '45:00', difficulty: 'intermediate', category: 'Pernas', personal_id: 'mock_id', is_free: false, views_count: 0
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPersonal = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de vínculo
    if (personalCode === 'PERSONAL123') {
        setLinkedPersonal({
            name: 'Carlos Trainer',
            specialty: 'Hipertrofia e Força',
            photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80'
        });
        alert('Personal vinculado com sucesso!');
    } else {
        alert('Código inválido. Tente novamente.');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const levelProgress = (stats.total_points % 100);

  // Components Render Helpers
  const renderSidebarItem = (id: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-brand text-white shadow-lg shadow-brand/20 font-bold' 
          : 'text-gray-400 hover:bg-dark-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col sm:flex-row">
      
      {/* Mobile Header (Brand Only) */}
      <div className="sm:hidden bg-dark-900 border-b border-dark-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-brand transform -rotate-45" />
            <span className="text-xl font-bold text-white tracking-tight">
                Onzy<span className="text-brand">Academy</span>
            </span>
        </div>
        <button onClick={handleBackToHome} className="text-gray-400 hover:text-white" title="Voltar ao Site">
            <Home size={20} />
        </button>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-20 md:w-64 bg-dark-900 border-r border-dark-800 fixed h-screen overflow-y-auto hidden sm:flex flex-col">
        <div className="p-6 border-b border-dark-800 mb-2">
            <div className="flex items-center gap-2">
                <Dumbbell className="h-7 w-7 text-brand transform -rotate-45" />
                <span className="text-xl font-bold text-white tracking-tight hidden md:block">
                    Onzy<span className="text-brand">Academy</span>
                </span>
            </div>
        </div>

        <div className="p-4 space-y-2 flex-1">
            <div className="mb-4 px-4 hidden md:block">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Menu Principal</p>
            </div>
            {renderSidebarItem('overview', <LayoutDashboard size={20} />, 'Visão Geral')}
            {renderSidebarItem('videos', <Play size={20} />, 'Sala de Treino')}
            {renderSidebarItem('achievements', <Trophy size={20} />, 'Sala de Troféus')}
            {renderSidebarItem('personal', <UserCheck size={20} />, 'Meu Personal')}

            {/* BOTÃO EXCLUSIVO DE ADMIN */}
            {(profile?.role === 'admin' || isAdmin) && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand hover:bg-brand/10 transition-all duration-200 mt-6 border border-brand/20"
              >
                <Shield size={20} />
                <span className="hidden md:inline font-bold">Painel Admin</span>
              </button>
            )}
        </div>
        
        <div className="p-4 border-t border-dark-800">
            <div className="bg-dark-800 rounded-lg p-3 flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold shrink-0">
                    {profile?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden hidden md:block">
                    <p className="text-sm font-bold text-white truncate">{profile?.name || 'Usuário'}</p>
                    <p className="text-xs text-brand">Nível {stats.level}</p>
                </div>
            </div>
            <button 
                onClick={handleBackToHome}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors text-sm font-medium"
            >
                <Home size={18} />
                <span className="hidden md:inline">Voltar ao Site</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 sm:ml-20 md:ml-64 p-4 sm:p-8 pb-24 sm:pb-8 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto animate-fade-in">
            
            {/* --- TAB: OVERVIEW --- */}
            {activeTab === 'overview' && (
                <>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Olá, {profile?.name?.split(' ')[0]}! 👋</h1>
                        <p className="text-gray-400">Aqui está o resumo do seu progresso hoje.</p>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-brand to-brand-dark p-1 rounded-2xl shadow-lg shadow-brand/10">
                            <div className="bg-dark-900/40 h-full rounded-xl p-5 backdrop-blur-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-white/80 font-medium text-sm">Nível Atual</span>
                                    <Award className="text-white w-6 h-6" />
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-2">{stats.level}</h2>
                                <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white h-full rounded-full" style={{ width: `${levelProgress}%` }}></div>
                                </div>
                                <p className="text-xs text-white/70 mt-2">{100 - levelProgress}xp para o próximo nível</p>
                            </div>
                        </div>

                        {[
                            { label: 'Sequência', value: `${stats.current_streak} Dias`, icon: <Flame className="text-orange-500" />, color: 'orange' },
                            { label: 'Total Pontos', value: stats.total_points, icon: <Target className="text-blue-500" />, color: 'blue' },
                            { label: 'Treinos', value: stats.workouts_completed, icon: <Dumbbell className="text-green-500" />, color: 'green' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-dark-800 border border-dark-700 p-5 rounded-2xl flex flex-col justify-between">
                                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center mb-4`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Access / Recommended */}
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Play size={20} className="text-brand" /> Continuar de onde parou
                    </h3>
                    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-brand/30 transition-all cursor-pointer">
                        <div className="relative w-full md:w-48 h-28 rounded-lg overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Thumbnail" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                    <Play size={16} fill="white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-brand uppercase tracking-wider mb-1 block">Musculação</span>
                            <h4 className="text-lg font-bold text-white mb-2">Treino de Superiores Completo</h4>
                            <p className="text-gray-400 text-sm line-clamp-2">Continue sua evolução com este treino focado em peito e tríceps. Duração de 45 minutos.</p>
                        </div>
                        <div className="ml-auto">
                            <ChevronRight className="text-gray-600 group-hover:text-brand transition-colors" />
                        </div>
                    </div>
                </>
            )}

            {/* --- TAB: VIDEOS --- */}
            {activeTab === 'videos' && (
                <>
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Sala de Treino</h1>
                            <p className="text-gray-400">Biblioteca completa de aulas gratuitas e exclusivas.</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar aula..." 
                                className="bg-dark-800 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none w-full md:w-64"
                            />
                        </div>
                    </header>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-white font-bold mb-4 pl-2 border-l-4 border-brand">Aulas Gratuitas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.filter(v => v.is_free).map(video => (
                                    <div key={video.id} className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand/50 transition-all group cursor-pointer shadow-lg">
                                        <div className="relative aspect-video">
                                            <img src={video.thumbnail_url || ''} alt={video.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
                                                {video.duration}
                                            </div>
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                <button className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-all shadow-lg shadow-brand/20">
                                                    <Play className="w-5 h-5 ml-1" fill="white" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-brand uppercase">{video.category}</span>
                                                <span className="text-xs text-gray-500 bg-dark-700 px-2 py-0.5 rounded capitalize">{video.difficulty}</span>
                                            </div>
                                            <h4 className="text-white font-bold mb-1 truncate">{video.title}</h4>
                                            <p className="text-gray-400 text-xs line-clamp-2">{video.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-4 pl-2 border-l-4 border-yellow-500 flex items-center gap-2">
                                <Lock size={18} className="text-yellow-500" />
                                Conteúdo Exclusivo Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.filter(v => !v.is_free).map(video => (
                                    <div key={video.id} className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 relative group opacity-75 hover:opacity-100 transition-opacity">
                                        <div className="relative aspect-video grayscale group-hover:grayscale-0 transition-all">
                                            <img src={video.thumbnail_url || ''} alt={video.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-dark-900/60 flex flex-col items-center justify-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-gray-400">
                                                    <Lock size={20} />
                                                </div>
                                                <span className="text-white font-bold text-sm">Exclusivo para Alunos</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                             <h4 className="text-gray-300 font-bold mb-1 truncate">{video.title}</h4>
                                             <p className="text-gray-500 text-xs">Vincule um personal para liberar</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* --- TAB: ACHIEVEMENTS --- */}
            {activeTab === 'achievements' && (
                <>
                     <header className="mb-8 text-center">
                        <div className="inline-block p-4 rounded-full bg-yellow-500/10 mb-4">
                            <Trophy size={48} className="text-yellow-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Sala de Troféus</h1>
                        <p className="text-gray-400">Conquiste medalhas completando desafios na academia.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MOCK_ACHIEVEMENTS.map(ach => (
                            <div key={ach.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                                ach.unlocked 
                                ? 'bg-gradient-to-r from-dark-800 to-dark-800 border-yellow-500/30' 
                                : 'bg-dark-800/50 border-dark-700 opacity-60'
                            }`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                                    ach.unlocked ? 'bg-yellow-500 text-dark-900 shadow-lg shadow-yellow-500/20' : 'bg-dark-700 text-gray-500'
                                }`}>
                                    {ach.unlocked ? <Trophy size={24} /> : <Lock size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold ${ach.unlocked ? 'text-white' : 'text-gray-400'}`}>{ach.title}</h4>
                                        {ach.unlocked && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded font-bold">+{ach.points} XP</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{ach.description}</p>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${ach.unlocked ? 'bg-yellow-500' : 'bg-gray-600'}`} 
                                            style={{ width: `${Math.min((ach.progress / ach.target) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-right text-gray-500 mt-1">
                                        {ach.progress} / {ach.target}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* --- TAB: PERSONAL --- */}
            {activeTab === 'personal' && (
                <>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Meu Personal</h1>
                        <p className="text-gray-400">Conecte-se ao seu treinador para receber conteúdos personalizados.</p>
                    </header>

                    {linkedPersonal ? (
                        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center animate-fade-in">
                            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-brand shadow-2xl">
                                <img src={linkedPersonal.photo} alt={linkedPersonal.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{linkedPersonal.name}</h2>
                            <p className="text-brand font-medium mb-6">{linkedPersonal.specialty}</p>
                            
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                                <button className="bg-dark-900 p-4 rounded-xl hover:bg-dark-700 transition-colors">
                                    <Play className="mx-auto text-brand mb-2" />
                                    <span className="text-sm text-gray-300">Ver Treinos</span>
                                </button>
                                <button className="bg-dark-900 p-4 rounded-xl hover:bg-dark-700 transition-colors">
                                    <Target className="mx-auto text-blue-500 mb-2" />
                                    <span className="text-sm text-gray-300">Minha Dieta</span>
                                </button>
                            </div>

                            <button onClick={() => setLinkedPersonal(null)} className="text-red-500 text-sm hover:underline">
                                Desvincular Personal
                            </button>
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto">
                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center shadow-xl">
                                <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <UserCheck size={32} className="text-brand" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Vincular Conta</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    Insira o código fornecido pelo seu Personal Trainer para liberar acesso aos treinos exclusivos.
                                </p>
                                
                                <form onSubmit={handleLinkPersonal} className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder="Código de Acesso (ex: PERSONAL123)"
                                        className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-center text-white tracking-widest font-mono uppercase focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                                        value={personalCode}
                                        onChange={e => setPersonalCode(e.target.value.toUpperCase())}
                                    />
                                    <button 
                                        type="submit"
                                        className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-brand/20 flex items-center justify-center gap-2"
                                    >
                                        <Unlock size={18} />
                                        Liberar Acesso
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
      </main>

      {/* Mobile Nav (Bottom) */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-dark-800 border-t border-dark-700 z-50 flex justify-around p-2">
        <button onClick={() => setActiveTab('overview')} className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'overview' ? 'text-brand' : 'text-gray-500'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-1">Início</span>
        </button>
        <button onClick={() => setActiveTab('videos')} className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'videos' ? 'text-brand' : 'text-gray-500'}`}>
            <Play size={20} />
            <span className="text-[10px] mt-1">Aulas</span>
        </button>
        <button onClick={() => setActiveTab('achievements')} className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'achievements' ? 'text-brand' : 'text-gray-500'}`}>
            <Trophy size={20} />
            <span className="text-[10px] mt-1">Troféus</span>
        </button>
        {(profile?.role === 'admin' || isAdmin) && (
            <button onClick={() => navigate('/admin')} className="p-2 rounded-lg flex flex-col items-center text-brand">
                <Shield size={20} />
                <span className="text-[10px] mt-1">Admin</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;