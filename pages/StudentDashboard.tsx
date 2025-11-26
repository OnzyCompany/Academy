
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Award, Flame, LayoutDashboard, Dumbbell, UserCheck, Search, Lock, Unlock, ChevronRight, Trophy, Target, Home, Shield, AlertTriangle, QrCode, CheckCircle, X, Clock, Check, Star, CreditCard, ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { VideoLesson, UserStats, Achievement, PersonalTrainer, Workout } from '../types';

const StudentDashboard = () => {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'personal' | 'achievements'>('overview');
  
  const [stats, setStats] = useState<UserStats>({ level: 1, total_points: 0, workouts_completed: 0, videos_completed: 0, current_streak: 0 });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [achievements, setAchievements] = useState<(Achievement & { unlocked: boolean, progress: number })[]>([]);
  const [personalCode, setPersonalCode] = useState('');
  const [linkedPersonal, setLinkedPersonal] = useState<PersonalTrainer | null>(null);
  const [loading, setLoading] = useState(true);

  // Workout Execution Modal State
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  useEffect(() => {
    if (profile) {
        loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: statsData } = await supabase.from('user_stats').select('*').eq('user_id', profile?.id).single();
      if(statsData) setStats(statsData);
      
      // Carregar Treinos (Academia + Personal)
      let query = supabase.from('workouts').select('*');
      
      // Lógica: Mostra treinos SEM personal (academia geral) OU treinos do personal vinculado
      if (profile?.personal_id) {
          query = query.or(`personal_id.is.null,personal_id.eq.${profile.personal_id}`);
      } else {
          query = query.is('personal_id', null);
      }
      
      const { data: workoutData } = await query;
      if (workoutData) setWorkouts(workoutData);

      // Carregar Personal Vinculado
      // Verifica se o profile já tem a info carregada ou busca novamente para garantir
      const { data: freshProfile } = await supabase.from('profiles').select('personal_id').eq('id', profile?.id).single();
      
      if (freshProfile?.personal_id) {
          const { data: personalData } = await supabase.from('personal_trainers').select('*').eq('id', freshProfile.personal_id).single();
          if (personalData) setLinkedPersonal(personalData);
      } else {
          setLinkedPersonal(null);
      }

      // Carregar Conquistas
      const { data: allAchievements } = await supabase.from('achievements').select('*').eq('active', true);
      const { data: userAchievements } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', profile?.id);
      
      if (allAchievements) {
          const unlockedIds = userAchievements?.map(ua => ua.achievement_id) || [];
          const processedAchievements = allAchievements.map(ach => {
              let progress = 0;
              // Calculate progress based on criteria
              if (ach.criteria_type === 'points') progress = Math.min(100, (stats.total_points / ach.criteria_value) * 100);
              else if (ach.criteria_type === 'workouts') progress = Math.min(100, (stats.workouts_completed / ach.criteria_value) * 100);
              else if (ach.criteria_type === 'streak') progress = Math.min(100, (stats.current_streak / ach.criteria_value) * 100);
              else if (ach.criteria_type === 'video') progress = Math.min(100, (stats.videos_completed / ach.criteria_value) * 100);
              
              return {
                  ...ach,
                  unlocked: unlockedIds.includes(ach.id),
                  progress: unlockedIds.includes(ach.id) ? 100 : progress
              };
          });
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
    setLoading(true);
    try {
        if (!personalCode) return;

        // 1. Buscar Personal pelo Código
        const { data: personal, error } = await supabase
            .from('personal_trainers')
            .select('*')
            .eq('access_code', personalCode.trim().toUpperCase())
            .maybeSingle();

        if (error) throw error;

        if (!personal) {
            alert('Código inválido. Verifique e tente novamente.');
            setLoading(false);
            return;
        }

        // 2. Atualizar Perfil do Usuário
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ personal_id: personal.id })
            .eq('id', profile?.id);

        if (updateError) throw updateError;

        setLinkedPersonal(personal);
        setPersonalCode('');
        alert(`Sucesso! Você agora está vinculado ao personal ${personal.name}.`);
        
        // 3. Recarregar dados para pegar os treinos novos
        await loadData();
        
    } catch (err: any) {
        console.error("Erro ao vincular:", err);
        alert('Erro ao vincular: ' + (err.message || 'Erro desconhecido'));
    } finally {
        setLoading(false);
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

  const handleStartWorkout = (workout: Workout) => {
      setActiveWorkout(workout);
      setCompletedExercises([]);
      setShowWorkoutModal(true);
  };

  const toggleExerciseCompletion = (index: number) => {
      if (completedExercises.includes(index)) {
          setCompletedExercises(completedExercises.filter(i => i !== index));
      } else {
          setCompletedExercises([...completedExercises, index]);
      }
  };

  const getEmbedUrl = (url: string) => {
      if (!url) return '';
      try {
        // Extrai ID do Youtube para criar embed
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        // Usa youtube-nocookie para tentar evitar alguns bloqueios de sandbox e parametros de player limpo
        return (match && match[2].length === 11) 
            ? `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&modestbranding=1&playsinline=1&origin=${window.location.origin}` 
            : url;
      } catch (e) {
          return url;
      }
  };

  const handleFinishWorkout = async () => {
      if (!profile) return;
      try {
          // 1. Update Stats
          const newWorkouts = stats.workouts_completed + 1;
          const pointsEarned = 20 + (completedExercises.length * 5); // Base + Bônus por exercício
          const newPoints = stats.total_points + pointsEarned; 
          
          // CRITICAL FIX: Added onConflict: 'user_id' to prevent duplicate key violations
          const { error } = await supabase.from('user_stats').upsert({
              user_id: profile.id,
              workouts_completed: newWorkouts,
              total_points: newPoints,
              last_activity: new Date().toISOString()
          }, { onConflict: 'user_id' });

          if (error) throw error;

          // 2. Check for new achievements (Simplified frontend check)
          const newUnlocks = achievements.filter(a => !a.unlocked && (
              (a.criteria_type === 'workouts' && newWorkouts >= a.criteria_value) ||
              (a.criteria_type === 'points' && newPoints >= a.criteria_value)
          ));

          for (const unlock of newUnlocks) {
              await supabase.from('user_achievements').insert({
                  user_id: profile.id,
                  achievement_id: unlock.id
              });
              alert(`🏆 Nova Conquista Desbloqueada: ${unlock.title}!`);
          }

          alert(`Treino concluído! +${pointsEarned} XP`);
          setShowWorkoutModal(false);
          loadData(); // Refresh UI
      } catch (err: any) {
          alert('Erro ao salvar progresso: ' + err.message);
      }
  };

  const handleBackToHome = () => navigate('/');
  const handleLogout = async () => { navigate('/'); };
  
  const levelProgress = (stats.total_points % 100);

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
                      </ul>
                  </div>
                  <button onClick={handleBackToHome} className="w-full bg-dark-700 hover:bg-white hover:text-dark-900 text-white font-bold py-3 rounded-lg transition-all">
                      Voltar para Início
                  </button>
              </div>
          </div>
      );
  }

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
                        {/* Stats Cards */}
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
                            <div key={workout.id} className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand/50 transition-all group cursor-pointer shadow-lg flex flex-col h-full">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-brand uppercase">{workout.category}</span>
                                        <span className={`text-[10px] px-2 py-1 rounded border ${workout.difficulty === 'Iniciante' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                                            {workout.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-2 truncate">{workout.title}</h4>
                                    <p className="text-gray-400 text-xs line-clamp-2 mb-4">{workout.description || 'Sem descrição'}</p>
                                    {workout.personal_id && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Personalizado</span>}
                                </div>
                                <div className="p-4 bg-dark-900/50 border-t border-dark-700">
                                    <button 
                                        onClick={() => handleStartWorkout(workout)}
                                        className="w-full bg-dark-700 hover:bg-brand hover:text-white text-gray-300 py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Play size={16} /> Iniciar Treino
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ACHIEVEMENTS TAB */}
            {activeTab === 'achievements' && (
                <>
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Sala de Troféus</h1>
                        <p className="text-gray-400">Desbloqueie medalhas conforme você evolui.</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map(ach => (
                            <div key={ach.id} className={`p-6 rounded-xl border relative overflow-hidden transition-all ${ach.unlocked ? 'bg-dark-800 border-brand/50 shadow-lg shadow-brand/10' : 'bg-dark-800 border-dark-700 opacity-80'}`}>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${ach.unlocked ? `bg-${ach.color}-500/20 text-${ach.color}-500` : 'bg-dark-700 text-gray-600'}`}>
                                        {ach.unlocked ? <Trophy size={28} /> : <Lock size={28} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-lg ${ach.unlocked ? 'text-white' : 'text-gray-400'}`}>{ach.title}</h4>
                                        {ach.unlocked && <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Desbloqueado</span>}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-4 relative z-10 h-8">{ach.description}</p>
                                
                                {/* Progress Bar */}
                                <div className="relative z-10">
                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1 uppercase font-bold">
                                        <span>Progresso</span>
                                        <span>{Math.round(ach.progress)}%</span>
                                    </div>
                                    <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${ach.unlocked ? 'bg-brand' : 'bg-gray-600'}`} 
                                            style={{ width: `${ach.progress}%` }}
                                        ></div>
                                    </div>
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
                        <div className="space-y-8">
                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center animate-fade-in">
                                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-brand shadow-2xl">
                                    <img src={linkedPersonal.photo_url || 'https://via.placeholder.com/150'} alt={linkedPersonal.name} className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{linkedPersonal.name}</h2>
                                <p className="text-brand font-medium mb-4">{linkedPersonal.specialty}</p>
                                
                                {linkedPersonal.bio ? (
                                    <div className="bg-dark-900/50 p-4 rounded-lg max-w-2xl mx-auto mb-6 text-left">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Sobre o Treinador</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{linkedPersonal.bio}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-xs mb-6">O treinador ainda não adicionou uma biografia.</p>
                                )}

                                {linkedPersonal.payment_info && (
                                    <div className="bg-dark-900/50 p-4 rounded-lg max-w-2xl mx-auto mb-6 flex items-center justify-between border border-dark-700">
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Informações de Pagamento</h3>
                                            <p className="text-white text-sm font-mono">{linkedPersonal.payment_info}</p>
                                        </div>
                                        <CreditCard className="text-brand" />
                                    </div>
                                )}

                                <button onClick={handleUnlinkPersonal} className="text-red-500 text-sm hover:underline">Desvincular Personal</button>
                            </div>

                            {/* EXCLUSIVE WORKOUTS SECTION */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Star className="text-yellow-500" size={20} fill="currentColor" /> Treinos Exclusivos
                                </h3>
                                {workouts.filter(w => w.personal_id === linkedPersonal.id).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {workouts.filter(w => w.personal_id === linkedPersonal.id).map(workout => (
                                            <div key={workout.id} className="bg-dark-800 rounded-xl p-5 border border-blue-500/30 hover:border-blue-500 transition-colors cursor-pointer shadow-lg shadow-blue-900/10" onClick={() => handleStartWorkout(workout)}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">EXCLUSIVO</span>
                                                    <span className="text-xs text-gray-400">{workout.difficulty}</span>
                                                </div>
                                                <h4 className="text-white font-bold text-lg mb-1">{workout.title}</h4>
                                                <p className="text-gray-400 text-xs mb-4">{workout.exercises?.length || 0} exercícios</p>
                                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-sm font-bold">Começar</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700 border-dashed">
                                        <Dumbbell className="mx-auto text-gray-600 mb-2" size={32} />
                                        <p className="text-gray-500">Este personal ainda não criou treinos exclusivos para você.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Vincular Conta</h3>
                            <p className="text-gray-400 text-sm mb-6">Insira o código (ex: SILVA-9X2Y) fornecido pelo seu Personal.</p>
                            <form onSubmit={handleLinkPersonal} className="space-y-4">
                                <input type="text" placeholder="Código de Acesso" className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-center text-white tracking-widest font-mono uppercase focus:ring-2 focus:ring-brand outline-none"
                                    value={personalCode} onChange={e => setPersonalCode(e.target.value.toUpperCase())} />
                                <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50">
                                    {loading ? 'Verificando...' : 'Liberar Acesso'}
                                </button>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
      </main>

      {/* MOBILE NAV */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-dark-800 border-t border-dark-700 z-50 flex justify-around p-2">
        <button onClick={() => setActiveTab('overview')} className={`p-2 flex flex-col items-center ${activeTab === 'overview' ? 'text-brand' : 'text-gray-500'}`}><LayoutDashboard size={20} /></button>
        <button onClick={() => setActiveTab('workouts')} className={`p-2 flex flex-col items-center ${activeTab === 'workouts' ? 'text-brand' : 'text-gray-500'}`}><Play size={20} /></button>
        <button onClick={() => setActiveTab('achievements')} className={`p-2 flex flex-col items-center ${activeTab === 'achievements' ? 'text-brand' : 'text-gray-500'}`}><Trophy size={20} /></button>
      </div>

      {/* WORKOUT EXECUTION MODAL */}
      {showWorkoutModal && activeWorkout && (
          <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col animate-fade-in">
              <div className="p-4 border-b border-dark-800 flex justify-between items-center bg-dark-900">
                  <div>
                      <h2 className="text-white font-bold text-lg">{activeWorkout.title}</h2>
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                          <Clock size={12} /> Duração Estimada: 45min
                      </p>
                  </div>
                  <button onClick={() => setShowWorkoutModal(false)} className="p-2 bg-dark-800 rounded-full text-gray-400 hover:text-white"><X size={24}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
                  {/* Progress Bar */}
                  <div className="mb-6 bg-dark-800 rounded-full h-2 overflow-hidden">
                      <div 
                          className="bg-green-500 h-full transition-all duration-500" 
                          style={{ width: `${(completedExercises.length / (activeWorkout.exercises?.length || 1)) * 100}%` }}
                      />
                  </div>

                  <div className="space-y-4">
                      {activeWorkout.exercises?.map((ex, i) => {
                          const isCompleted = completedExercises.includes(i);
                          const embedUrl = getEmbedUrl(ex.video_url);

                          return (
                              <div key={i} className={`bg-dark-800 rounded-xl border transition-all duration-300 overflow-hidden ${isCompleted ? 'border-green-500/50 opacity-60' : 'border-dark-700'}`}>
                                  <div className="p-4">
                                      <div className="flex justify-between items-start mb-4">
                                          <div className="flex items-center gap-3">
                                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-brand'}`}>
                                                  {isCompleted ? <Check size={16} /> : i + 1}
                                              </div>
                                              <h4 className="text-white font-bold text-lg">{ex.name}</h4>
                                          </div>
                                          <div className="flex gap-3 text-xs">
                                              <span className="bg-dark-900 px-2 py-1 rounded text-gray-300 border border-dark-700">
                                                  <strong className="text-white">{ex.sets}</strong> Séries
                                              </span>
                                              <span className="bg-dark-900 px-2 py-1 rounded text-gray-300 border border-dark-700">
                                                  <strong className="text-white">{ex.reps}</strong> Reps
                                              </span>
                                          </div>
                                      </div>

                                      {embedUrl && (
                                          <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-4 border border-dark-700">
                                              <iframe 
                                                  src={`${embedUrl}?rel=0&modestbranding=1&playsinline=1`}
                                                  title={ex.name}
                                                  className="w-full h-full" 
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                  allowFullScreen
                                                  referrerPolicy="strict-origin-when-cross-origin"
                                                  frameBorder="0"
                                              ></iframe>
                                          </div>
                                      )}
                                      {/* Fallback button for YouTube Error 153 */}
                                      <div className="mt-2 text-center">
                                          <a 
                                              href={ex.video_url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-brand transition-colors"
                                          >
                                              <ExternalLink size={12} />
                                              Caso o vídeo não carregue, clique aqui para assistir no YouTube
                                          </a>
                                      </div>

                                      <button 
                                          onClick={() => toggleExerciseCompletion(i)}
                                          className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4 ${
                                              isCompleted 
                                              ? 'bg-dark-700 text-gray-400 hover:bg-dark-600' 
                                              : 'bg-brand hover:bg-brand-dark text-white'
                                          }`}
                                      >
                                          {isCompleted ? 'Desmarcar Etapa' : 'Concluir Etapa'}
                                      </button>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              <div className="p-4 border-t border-dark-800 bg-dark-900">
                  <div className="max-w-2xl mx-auto">
                      <button 
                          onClick={handleFinishWorkout} 
                          disabled={completedExercises.length === 0}
                          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                      >
                          <CheckCircle size={24} /> CONCLUIR TREINO
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default StudentDashboard;