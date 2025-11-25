
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Award, Flame, LayoutDashboard, Dumbbell, UserCheck, Search, Lock, Unlock, ChevronRight, Trophy, Target, Home, Shield, AlertTriangle, QrCode, CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { VideoLesson, UserStats, Achievement, PersonalTrainer, Workout } from '../types';

const StudentDashboard = () => {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'personal' | 'achievements'>('overview');
  
  // --- DATA STATES ---
  const [stats, setStats] = useState<UserStats>({ level: 1, total_points: 0, workouts_completed: 0, videos_completed: 0, current_streak: 0 });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [achievements, setAchievements] = useState<(Achievement & { unlocked: boolean, progress: number })[]>([]);
  const [personalCode, setPersonalCode] = useState('');
  const [linkedPersonal, setLinkedPersonal] = useState<PersonalTrainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
        loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Stats (If not exists, create default)
      const { data: statsData } = await supabase.from('user_stats').select('*').eq('user_id', profile?.id).single();
      if(statsData) setStats(statsData);
      
      // 2. Fetch Workouts (Gratuitos da Academia + Do Personal)
      let query = supabase.from('workouts').select('*');
      if (profile?.personal_id) {
          // Se tiver personal, busca treinos da academia OU do personal
          query = query.or(`personal_id.is.null,personal_id.eq.${profile.personal_id}`);
      } else {
          // Apenas treinos da academia
          query = query.is('personal_id', null);
      }
      const { data: workoutData } = await query;
      if (workoutData) setWorkouts(workoutData);

      // 3. Fetch Linked Personal Info
      if (profile?.personal_id) {
          const { data: personalData } = await supabase.from('personal_trainers').select('*').eq('id', profile.personal_id).single();
          if (personalData) setLinkedPersonal(personalData);
      }

      // 4. Fetch Achievements & Progress
      const { data: allAchievements } = await supabase.from('achievements').select('*').eq('active', true);
      const { data: userAchievements } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', profile?.id);
      
      if (allAchievements) {
          const unlockedIds = userAchievements?.map(ua => ua.achievement_id) || [];
          const processedAchievements = allAchievements.map(ach => ({
              ...ach,
              unlocked: unlockedIds.includes(ach.id),
              // Lógica simples de progresso baseada no tipo
              progress: ach.criteria_type === 'points' ? stats.total_points : 
                        ach.criteria_type === 'workouts' ? stats.workouts_completed : 0
          }));
          setAchievements(processedAchievements);
      }

    } catch (err) {
        console.error("Erro carregando dados:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleLinkPersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Busca personal pelo código
        const { data: personal, error } = await supabase
            .from('personal_trainers')
            .select('*')
            .eq('access_code', personalCode.trim().toUpperCase())
            .single();

        if (error || !personal) {
            alert('Código inválido. Verifique e tente novamente.');
            return;
        }

        // Atualiza perfil do usuário com o ID do personal
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ personal_id: personal.id })
            .eq('id', profile?.id);

        if (updateError) throw updateError;

        setLinkedPersonal(personal);
        alert(`Sucesso! Você agora está vinculado ao personal ${personal.name}.`);
        loadData(); // Recarrega treinos
    } catch (err: any) {
        alert('Erro ao vincular: ' + err.message);
    }
  };

  const handleUnlinkPersonal = async () => {
      if(window.confirm("Tem certeza que deseja desvincular? Você perderá acesso aos treinos exclusivos.")){
          await supabase.from('profiles').update({ personal_id: null }).eq('id', profile?.id);
          setLinkedPersonal(null);
          setPersonalCode('');
          loadData();
      }
  };

  const handleBackToHome = () => navigate('/');
  const handleLogout = async () => {
      navigate('/');
  };
  
  const levelProgress = (stats.total_points % 100);

  // LÓGICA DE BLOQUEIO DE ACESSO
  // Se status não for 'active' E não for admin, mostra tela de bloqueio.
  if (profile?.status !== 'active' && !isAdmin) {
      return (
          <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
              <div className="bg-dark-800 p-8 rounded-xl border border-red-500/30 max-w-md text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="text-red-500 w-10 h-10" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                      Sua conta foi criada, mas a assinatura ainda não está ativa.
                  </p>
                  
                  <div className="bg-dark-900 p-4 rounded-lg mb-6 border border-dark-700 text-left">
                      <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                          <CheckCircle size={16} className="text-brand" /> Próximos Passos:
                      </h3>
                      <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                          <li>Realize o pagamento na recepção da academia.</li>
                          <li>Ou assine um plano online na página inicial.</li>
                          <li>Após o pagamento, seu acesso será liberado automaticamente.</li>
                      </ul>
                  </div>

                  <button onClick={handleBackToHome} className="w-full bg-dark-700 hover:bg-white hover:text-dark-900 text-white font-bold py-3 rounded-lg transition-all">
                      Voltar para Início
                  </button>
              </div>
          </div>
      );
  }

  // Helper render
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
      {/* Mobile Header */}
      <div className="sm:hidden bg-dark-900 border-b border-dark-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-brand transform -rotate-45" />
            <span className="text-xl font-bold text-white tracking-tight">Onzy<span className="text-brand">Academy</span></span>
        </div>
        <button onClick={handleBackToHome} className="text-gray-400 hover:text-white"><Home size={20} /></button>
      </div>

      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-dark-900 border-r border-dark-800 fixed h-screen overflow-y-auto hidden sm:flex flex-col">
        <div className="p-6 border-b border-dark-800 mb-2">
            <div className="flex items-center gap-2">
                <Dumbbell className="h-7 w-7 text-brand transform -rotate-45" />
                <span className="text-xl font-bold text-white tracking-tight hidden md:block">Onzy<span className="text-brand">Academy</span></span>
            </div>
        </div>
        <div className="p-4 space-y-2 flex-1">
            <div className="mb-4 px-4 hidden md:block">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Menu Principal</p>
            </div>
            {renderSidebarItem('overview', <LayoutDashboard size={20} />, 'Visão Geral')}
            {renderSidebarItem('workouts', <Play size={20} />, 'Sala de Treino')}
            {renderSidebarItem('achievements', <Trophy size={20} />, 'Sala de Troféus')}
            {renderSidebarItem('personal', <UserCheck size={20} />, 'Meu Personal')}
            
            {(profile?.role === 'admin' || isAdmin) && (
              <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand hover:bg-brand/10 transition-all duration-200 mt-6 border border-brand/20">
                <Shield size={20} />
                <span className="hidden md:inline font-bold">Painel Admin</span>
              </button>
            )}
        </div>
        <div className="p-4 border-t border-dark-800">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors text-sm font-medium">
                <Home size={18} /> <span className="hidden md:inline">Voltar ao Site</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:ml-20 md:ml-64 p-4 sm:p-8 pb-24 sm:pb-8 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto animate-fade-in">
            
            {activeTab === 'overview' && (
                <>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Olá, {profile?.name?.split(' ')[0]}! 👋</h1>
                        <p className="text-gray-400">Continue focado nos seus objetivos.</p>
                    </header>
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
                </>
            )}

            {activeTab === 'workouts' && (
                <>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Sala de Treino</h1>
                        <p className="text-gray-400">Seus treinos e rotinas disponíveis.</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workouts.map(workout => (
                            <div key={workout.id} className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand/50 transition-all group cursor-pointer shadow-lg">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-brand uppercase">{workout.category}</span>
                                        <span className={`text-[10px] px-2 py-1 rounded border ${workout.difficulty === 'Iniciante' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                                            {workout.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-2 truncate">{workout.title}</h4>
                                    <p className="text-gray-400 text-xs line-clamp-2 mb-4">{workout.description || 'Sem descrição'}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                                        <span className="text-xs text-gray-500">{workout.exercises?.length || 0} Exercícios</span>
                                        {workout.personal_id ? (
                                            <span className="flex items-center gap-1 text-xs text-yellow-500 font-bold"><Lock size={12}/> Exclusivo</span>
                                        ) : (
                                            <span className="text-xs text-gray-500">Gratuito</span>
                                        )}
                                    </div>
                                    <button className="w-full mt-4 bg-dark-700 hover:bg-brand hover:text-white text-gray-300 py-2 rounded text-sm font-bold transition-colors">
                                        Iniciar Treino
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'personal' && (
                <>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Meu Personal</h1>
                        <p className="text-gray-400">Conecte-se ao seu treinador.</p>
                    </header>
                    {linkedPersonal ? (
                        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center animate-fade-in">
                            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-brand shadow-2xl">
                                <img src={linkedPersonal.photo_url || 'https://via.placeholder.com/150'} alt={linkedPersonal.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{linkedPersonal.name}</h2>
                            <p className="text-brand font-medium mb-4">{linkedPersonal.specialty}</p>
                            
                            {linkedPersonal.bio && <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6 italic">"{linkedPersonal.bio}"</p>}

                            {linkedPersonal.payment_info && (
                                <div className="bg-dark-900 p-4 rounded-lg border border-dark-600 max-w-md mx-auto mb-6 text-left">
                                    <h4 className="text-white font-bold text-sm mb-2">Informações de Pagamento</h4>
                                    <p className="text-gray-400 text-xs whitespace-pre-wrap">{linkedPersonal.payment_info}</p>
                                </div>
                            )}

                            <button onClick={handleUnlinkPersonal} className="text-red-500 text-sm hover:underline">Desvincular Personal</button>
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Vincular Conta</h3>
                            <p className="text-gray-400 text-sm mb-6">Insira o código (ex: SILVA-9X2Y) fornecido pelo seu Personal.</p>
                            <form onSubmit={handleLinkPersonal} className="space-y-4">
                                <input type="text" placeholder="Código de Acesso" className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-center text-white tracking-widest font-mono uppercase focus:ring-2 focus:ring-brand outline-none"
                                    value={personalCode} onChange={e => setPersonalCode(e.target.value.toUpperCase())} />
                                <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg transition-all">Liberar Acesso</button>
                            </form>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'achievements' && (
                <>
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Sala de Troféus</h1>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map(ach => (
                            <div key={ach.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${ach.unlocked ? 'bg-gradient-to-r from-dark-800 to-dark-800 border-yellow-500/30' : 'bg-dark-800/50 border-dark-700 opacity-60'}`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${ach.unlocked ? 'bg-yellow-500 text-dark-900' : 'bg-dark-700 text-gray-500'}`}>
                                    {ach.unlocked ? <Trophy size={24} /> : <Lock size={24} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold ${ach.unlocked ? 'text-white' : 'text-gray-400'}`}>{ach.title}</h4>
                                    <p className="text-xs text-gray-500">{ach.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-dark-800 border-t border-dark-700 z-50 flex justify-around p-2">
        <button onClick={() => setActiveTab('overview')} className={`p-2 flex flex-col items-center ${activeTab === 'overview' ? 'text-brand' : 'text-gray-500'}`}><LayoutDashboard size={20} /></button>
        <button onClick={() => setActiveTab('workouts')} className={`p-2 flex flex-col items-center ${activeTab === 'workouts' ? 'text-brand' : 'text-gray-500'}`}><Play size={20} /></button>
        <button onClick={() => setActiveTab('achievements')} className={`p-2 flex flex-col items-center ${activeTab === 'achievements' ? 'text-brand' : 'text-gray-500'}`}><Trophy size={20} /></button>
      </div>
    </div>
  );
};

export default StudentDashboard;
