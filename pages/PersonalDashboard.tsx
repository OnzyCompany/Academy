
import React, { useState, useEffect } from 'react';
import { Upload, Film, Save, User, Users, CreditCard, CheckCircle, LayoutDashboard, Video, Plus, Trash2, Dumbbell, X, Link as LinkIcon, Copy, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Profile, PersonalTrainer, Workout } from '../types';

const PersonalDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'students' | 'workouts'>('profile');
  const [personal, setPersonal] = useState<PersonalTrainer | null>(null);
  const [students, setStudents] = useState<Profile[]>([]);
  const [myWorkouts, setMyWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Modal States
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  
  // Forms
  const [profileForm, setProfileForm] = useState({
    specialty: '',
    bio: '',
    phone: '',
    payment_info: '',
    plans_info: ''
  });

  const [workoutForm, setWorkoutForm] = useState<Omit<Workout, 'id' | 'created_at'>>({
    title: '', category: 'Musculação', difficulty: 'Iniciante', description: '',
    exercises: [{ name: '', video_url: '', sets: '3', reps: '12' }]
  });

  useEffect(() => {
    if (user) fetchPersonalData();
  }, [user]);

  const fetchPersonalData = async () => {
    try {
        if (!user?.email) return;

        // Tenta encontrar o personal pelo email do usuário logado
        let { data, error } = await supabase
            .from('personal_trainers')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
        
        // Fallback para demo: se não encontrar pelo email, pega o primeiro (apenas para teste, remover em produção real se desejar estrita segurança)
        if (!data) {
             const { data: demoData } = await supabase.from('personal_trainers').select('*').limit(1).maybeSingle();
             if (demoData) {
                 console.log("Modo Demo: Visualizando perfil do primeiro personal encontrado.");
                 data = demoData;
             }
        }

        if (data) {
            setPersonal(data);
            setProfileForm({
                specialty: data.specialty || '',
                bio: data.bio || '',
                phone: data.phone || '',
                payment_info: data.payment_info || '',
                plans_info: data.plans_info || ''
            });

            const { data: studentsData } = await supabase.from('profiles').select('*').eq('personal_id', data.id);
            if (studentsData) setStudents(studentsData);

            const { data: workoutsData } = await supabase.from('workouts').select('*').eq('personal_id', data.id);
            if (workoutsData) setMyWorkouts(workoutsData);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!personal) return;
      setSaving(true);
      try {
          const { error } = await supabase.from('personal_trainers').update({
              specialty: profileForm.specialty,
              bio: profileForm.bio,
              phone: profileForm.phone,
              payment_info: profileForm.payment_info,
              plans_info: profileForm.plans_info
          }).eq('id', personal.id);

          if (error) throw error;
          alert('Perfil atualizado com sucesso!');
          // Atualiza o estado local para refletir na UI imediatamente
          setPersonal({ ...personal, ...profileForm });
      } catch (err: any) {
          alert('Erro ao atualizar: ' + err.message);
      } finally {
          setSaving(false);
      }
  };

  const handleCreateWorkout = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!personal) return;
      try {
          const payload = {
              title: workoutForm.title,
              category: workoutForm.category,
              difficulty: workoutForm.difficulty,
              description: workoutForm.description,
              exercises: workoutForm.exercises, 
              personal_id: personal.id // Link ao personal logado
          };

          const { data, error } = await supabase.from('workouts').insert([payload]).select();
          if (error) throw error;
          
          if(data) setMyWorkouts([...myWorkouts, data[0]]);
          setShowWorkoutModal(false);
          setWorkoutForm({
            title: '', category: 'Musculação', difficulty: 'Iniciante', description: '',
            exercises: [{ name: '', video_url: '', sets: '3', reps: '12' }]
          });
          alert('Treino criado e enviado para seus alunos!');
      } catch (err: any) {
          alert('Erro ao criar treino: ' + err.message);
      }
  };

  const addExerciseToForm = () => {
    setWorkoutForm(prev => ({ ...prev, exercises: [...prev.exercises, { name: '', video_url: '', sets: '3', reps: '12' }] }));
  };

  const removeExerciseFromForm = (index: number) => {
    setWorkoutForm(prev => ({ ...prev, exercises: prev.exercises.filter((_, i) => i !== index) }));
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...workoutForm.exercises];
    // @ts-ignore
    newExercises[index][field] = value;
    setWorkoutForm(prev => ({ ...prev, exercises: newExercises }));
  };

  const copyAccessCode = () => {
      if (personal?.access_code) {
          navigator.clipboard.writeText(personal.access_code);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
      }
  };

  if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Carregando...</div>;

  if (!personal) return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <div className="bg-dark-800 p-8 rounded-xl border border-dark-700 max-w-md text-center">
              <User size={48} className="mx-auto text-gray-600 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Perfil de Personal não encontrado</h2>
              <p className="text-gray-400 text-sm mb-6">Seu usuário não está cadastrado como Personal Trainer no sistema. Entre em contato com a administração.</p>
              <button onClick={() => window.location.href = '/'} className="text-brand hover:underline">Voltar ao Início</button>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col sm:flex-row">
      
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-dark-900 border-r border-dark-800 fixed h-screen overflow-y-auto hidden sm:flex flex-col">
        <div className="p-6 border-b border-dark-800 mb-2">
            <span className="text-xl font-bold text-white tracking-tight hidden md:block">Painel<span className="text-brand">Personal</span></span>
        </div>
        <div className="p-4 space-y-2">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-brand text-white' : 'text-gray-400 hover:bg-dark-800'}`}>
                <User size={20} /> <span className="hidden md:inline">Meu Perfil</span>
            </button>
            <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'students' ? 'bg-brand text-white' : 'text-gray-400 hover:bg-dark-800'}`}>
                <Users size={20} /> <span className="hidden md:inline">Meus Alunos</span>
            </button>
            <button onClick={() => setActiveTab('workouts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'workouts' ? 'bg-brand text-white' : 'text-gray-400 hover:bg-dark-800'}`}>
                <Dumbbell size={20} /> <span className="hidden md:inline">Meus Treinos</span>
            </button>
        </div>
        <div className="mt-auto p-4 border-t border-dark-800">
            <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-2 text-gray-500 hover:text-white text-sm px-4 py-2">
                <X size={16} /> Sair do Painel
            </button>
        </div>
      </aside>

      <main className="flex-1 sm:ml-20 md:ml-64 p-8 overflow-y-auto min-h-screen bg-dark-900">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
                {activeTab === 'profile' && 'Gerenciar Perfil'}
                {activeTab === 'students' && 'Meus Alunos'}
                {activeTab === 'workouts' && 'Meus Treinos'}
            </h1>

            {activeTab === 'profile' && (
                <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
                    <div className="mb-8 p-4 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-brand font-bold uppercase mb-1">Seu Código de Vínculo</p>
                            <p className="text-xl font-mono font-bold text-white tracking-wider">{personal.access_code}</p>
                        </div>
                        <button onClick={copyAccessCode} className="bg-dark-900 p-2 rounded hover:text-white text-gray-400 transition-colors">
                            {copySuccess ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Nome (Visualização)</label>
                                <input type="text" disabled value={personal?.name} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Email Cadastrado</label>
                                <input type="text" disabled value={personal?.email} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Especialidade</label>
                            <input type="text" value={profileForm.specialty} onChange={e => setProfileForm({...profileForm, specialty: e.target.value})}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:border-brand outline-none" />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Biografia</label>
                            <textarea rows={4} value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:border-brand outline-none" 
                                placeholder="Conte um pouco sobre sua experiência..." />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Informações de Pagamento (PIX/Links)</label>
                            <textarea rows={3} value={profileForm.payment_info} onChange={e => setProfileForm({...profileForm, payment_info: e.target.value})}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:border-brand outline-none"
                                placeholder="Ex: Chave PIX: 000.000.000-00 ou Link do Mercado Pago..." />
                        </div>

                        <button type="submit" disabled={saving} className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                            {saving && <Loader2 className="animate-spin" size={18} />}
                            Salvar Alterações
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-dark-900 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">Aluno</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Telefone</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {students.length > 0 ? students.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{student.email}</td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{student.phone}</td>
                                    <td className="px-6 py-4"><span className="text-green-500 text-xs border border-green-500/30 bg-green-500/10 px-2 py-1 rounded">Ativo</span></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhum aluno vinculado ainda.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'workouts' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-300">Meus Treinos Criados</h2>
                        <button onClick={() => setShowWorkoutModal(true)} className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <Plus size={16} /> Novo Treino
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myWorkouts.map(workout => (
                            <div key={workout.id} className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex justify-between items-center">
                                <div>
                                    <h4 className="text-white font-bold">{workout.title}</h4>
                                    <p className="text-gray-500 text-xs">{workout.difficulty} • {workout.exercises?.length || 0} exercícios</p>
                                </div>
                                <div className="bg-brand/10 text-brand px-3 py-1 rounded text-xs font-bold">Ativo</div>
                            </div>
                        ))}
                        {myWorkouts.length === 0 && (
                            <p className="col-span-2 text-center text-gray-500 py-8">Você ainda não criou nenhum treino.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* MODAL NOVO TREINO (PERSONAL) */}
      {showWorkoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-800 rounded-lg w-full max-w-4xl overflow-hidden border border-dark-700 shadow-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center sticky top-0 bg-dark-800 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-white">Criar Treino para Alunos</h2>
                        <p className="text-xs text-gray-400">Este treino ficará visível apenas para seus alunos vinculados.</p>
                    </div>
                    <button onClick={() => setShowWorkoutModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="overflow-y-auto p-6 flex-1">
                    <form onSubmit={handleCreateWorkout} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Nome da Rotina</label>
                                <input type="text" required className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                    value={workoutForm.title} onChange={e => setWorkoutForm({...workoutForm, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Categoria</label>
                                <select className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                    value={workoutForm.category} onChange={e => setWorkoutForm({...workoutForm, category: e.target.value})}>
                                    <option>Musculação</option><option>Cardio</option><option>Funcional</option><option>Crossfit</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Dificuldade</label>
                                <select className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                    // @ts-ignore
                                    value={workoutForm.difficulty} onChange={e => setWorkoutForm({...workoutForm, difficulty: e.target.value})}>
                                    <option>Iniciante</option><option>Intermediário</option><option>Avançado</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end border-b border-dark-700 pb-2">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Lista de Exercícios</h3>
                                <button type="button" onClick={addExerciseToForm} className="text-brand text-xs font-bold hover:text-white flex items-center gap-1">
                                    <Plus size={14} /> Adicionar Exercício
                                </button>
                            </div>
                            {workoutForm.exercises.map((ex, idx) => (
                                <div key={idx} className="bg-dark-900 p-3 rounded border border-dark-700 flex gap-3 items-center">
                                    <span className="w-6 h-6 bg-dark-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">{idx + 1}</span>
                                    <input type="text" placeholder="Nome do Exercício" className="flex-1 bg-dark-800 border border-dark-600 rounded p-2 text-xs text-white focus:border-brand outline-none"
                                        value={ex.name} onChange={e => updateExercise(idx, 'name', e.target.value)} />
                                    <input type="text" placeholder="Link Vídeo" className="flex-1 bg-dark-800 border border-dark-600 rounded p-2 text-xs text-white focus:border-brand outline-none"
                                        value={ex.video_url} onChange={e => updateExercise(idx, 'video_url', e.target.value)} />
                                    <input type="text" placeholder="Séries" className="w-16 bg-dark-800 border border-dark-600 rounded p-2 text-xs text-white text-center focus:border-brand outline-none"
                                        value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} />
                                    <input type="text" placeholder="Reps" className="w-16 bg-dark-800 border border-dark-600 rounded p-2 text-xs text-white text-center focus:border-brand outline-none"
                                        value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} />
                                    <button type="button" onClick={() => removeExerciseFromForm(idx)} className="text-red-500 hover:bg-red-500/10 p-2 rounded"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowWorkoutModal(false)} className="bg-dark-700 hover:bg-dark-600 text-white font-bold py-2 px-4 rounded text-sm">Cancelar</button>
                            <button type="submit" className="bg-brand hover:bg-brand-dark text-white font-bold py-2 px-6 rounded text-sm flex items-center gap-2"><Save size={16} /> Salvar Treino</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDashboard;
