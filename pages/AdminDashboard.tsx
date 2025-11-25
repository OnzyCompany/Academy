
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, DollarSign, CheckCircle, AlertCircle, Dumbbell, Home, UserCheck, LayoutDashboard,
    MessageSquare, BarChart2, Plus, Search, Edit, Trash2, Send, Mail, X, RefreshCw,
    Trophy, Save, UserPlus, Loader2, TrendingUp, Lock, Unlock, Medal, Award, Target, Flame, Star, Crown, Zap, Heart, CheckSquare, Gift, Sparkles, Rocket, Mountain
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Workout, PersonalTrainer, Achievement, Profile } from '../types';

// Ícones disponíveis para conquistas
const AVAILABLE_ICONS = [
    'Trophy', 'Medal', 'Award', 'Target', 'Flame',
    'Star', 'Crown', 'Zap', 'Heart', 'TrendingUp',
    'CheckSquare', 'Gift', 'Sparkles', 'Rocket', 'Mountain'
];

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'personals' | 'workouts' | 'achievements' | 'communication' | 'reports'>('overview');
  const [loading, setLoading] = useState(true);
  
  // --- DATA STATES (Real Data) ---
  const [students, setStudents] = useState<Profile[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [personals, setPersonals] = useState<PersonalTrainer[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // --- MODALS STATE ---
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  
  // --- EDITING STATE ---
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Profile | null>(null);

  // --- SEARCH ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- FORMS STATE ---
  const [personalForm, setPersonalForm] = useState({
    name: '', email: '', phone: '', photo_url: '', specialty: '', bio: '', access_code: ''
  });

  const [workoutForm, setWorkoutForm] = useState<Omit<Workout, 'id' | 'created_at'>>({
    title: '', category: 'Musculação', difficulty: 'Iniciante', description: '',
    exercises: [{ name: '', video_url: '', sets: '3', reps: '12' }]
  });

  const [achievementForm, setAchievementForm] = useState({
    title: '', description: '', icon: 'Trophy', color: 'yellow',
    points: 100, criteria_type: 'points', criteria_value: 100, badge_url: '', active: true
  });

  const [studentForm, setStudentForm] = useState({
    email: '', plan: 'Mensal'
  });

  const [editStudentForm, setEditStudentForm] = useState({
      name: '', phone: '', cpf: '', plan: '', status: ''
  });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
        const { data: studentsData } = await supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false });
        if (studentsData) setStudents(studentsData);

        const { data: personalsData } = await supabase.from('personal_trainers').select('*').order('created_at', { ascending: false });
        if (personalsData) setPersonals(personalsData);

        const { data: workoutsData } = await supabase.from('workouts').select('*').is('personal_id', null).order('created_at', { ascending: false });
        if (workoutsData) setWorkouts(workoutsData);

        const { data: achievementsData } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
        if (achievementsData) setAchievements(achievementsData);

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- HELPERS ---
  const generateAccessCode = (name: string) => {
    if (!name) return '';
    const prefix = name.split(' ')[0].toUpperCase().substring(0, 5).replace(/[^A-Z]/g, '');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${randomPart}`;
  };

  const renderIconByName = (iconName: string, size: number = 20) => {
      switch(iconName) {
          case 'Medal': return <Medal size={size} />;
          case 'Award': return <Award size={size} />;
          case 'Target': return <Target size={size} />;
          case 'Flame': return <Flame size={size} />;
          case 'Star': return <Star size={size} />;
          case 'Crown': return <Crown size={size} />;
          case 'Zap': return <Zap size={size} />;
          case 'Heart': return <Heart size={size} />;
          case 'TrendingUp': return <TrendingUp size={size} />;
          case 'CheckSquare': return <CheckSquare size={size} />;
          case 'Gift': return <Gift size={size} />;
          case 'Sparkles': return <Sparkles size={size} />;
          case 'Rocket': return <Rocket size={size} />;
          case 'Mountain': return <Mountain size={size} />;
          default: return <Trophy size={size} />;
      }
  };

  const handleBackToHome = () => navigate('/');
  const handleBackToStudent = () => navigate('/student');

  // --- ACTION HANDLERS ---

  // 1. Salvar Personal
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Não enviar students_count pois é um campo computado ou default
        const payload = {
            name: personalForm.name,
            email: personalForm.email,
            phone: personalForm.phone,
            photo_url: personalForm.photo_url,
            specialty: personalForm.specialty,
            bio: personalForm.bio,
            access_code: personalForm.access_code,
            is_active: true
        };

        const { data, error } = await supabase.from('personal_trainers').insert([payload]).select();

        if (error) throw error;
        
        if (data) setPersonals([data[0], ...personals]);
        setShowPersonalModal(false);
        setPersonalForm({ name: '', email: '', phone: '', photo_url: '', specialty: '', bio: '', access_code: '' });
        alert(`Personal cadastrado com sucesso! Código: ${data[0].access_code}`);
    } catch (err: any) {
        alert('Erro ao salvar personal: ' + JSON.stringify(err));
    }
  };

  // 2. Salvar Treino
  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload = { ...workoutForm, personal_id: null };
        
        if (editingWorkoutId) {
            const { error } = await supabase.from('workouts').update(payload).eq('id', editingWorkoutId);
            if (error) throw error;
            setWorkouts(prev => prev.map(w => w.id === editingWorkoutId ? { ...w, id: editingWorkoutId, created_at: new Date().toISOString(), ...workoutForm } : w));
            alert(`Treino atualizado!`);
        } else {
            const { data, error } = await supabase.from('workouts').insert([payload]).select();
            if (error) throw error;
            if (data) setWorkouts([data[0], ...workouts]);
            alert(`Treino criado!`);
        }
        setShowWorkoutModal(false);
    } catch (err: any) {
        alert('Erro ao salvar treino: ' + JSON.stringify(err));
    }
  };

  // 3. Salvar Conquista
  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload = { ...achievementForm };
        // Remover badge_url se estiver vazio para evitar erro de constraint se houver
        if (!payload.badge_url) delete (payload as any).badge_url;

        const { data, error } = await supabase.from('achievements').insert([payload]).select();
        if (error) throw error;
        if (data) setAchievements([data[0], ...achievements]);
        setShowAchievementModal(false);
        alert('Conquista criada com sucesso!');
    } catch (err: any) {
        alert('Erro ao criar conquista: ' + JSON.stringify(err));
    }
  };

  // 4. ATIVAR ALUNO MANUALMENTE
  const handleActivateStudent = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const { data: existing, error } = await supabase.from('profiles').select('id, name').eq('email', studentForm.email).single();
          
          if (existing) {
              const { error: updateError } = await supabase.from('profiles').update({
                  status: 'active',
                  plan: studentForm.plan,
                  due_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
              }).eq('id', existing.id);

              if (updateError) throw updateError;
              alert(`Sucesso! O aluno ${existing.name} foi ativado.`);
              setShowStudentModal(false);
              fetchAllData();
          } else {
              alert(`E-mail não encontrado. O aluno precisa criar a conta no site primeiro.`);
          }
      } catch (err: any) {
          alert('Erro: ' + JSON.stringify(err));
      }
  };

  // 5. EDITAR ALUNO (CPF)
  const handleEditStudent = (student: Profile) => {
      setEditingStudent(student);
      setEditStudentForm({
          name: student.name,
          phone: student.phone || '',
          cpf: student.cpf || '',
          plan: student.plan || 'Mensal',
          status: student.status
      });
      setShowEditStudentModal(true);
  };

  const handleSaveStudentEdit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingStudent) return;
      try {
          const { error } = await supabase.from('profiles').update({
              name: editStudentForm.name,
              phone: editStudentForm.phone,
              cpf: editStudentForm.cpf,
              plan: editStudentForm.plan,
              status: editStudentForm.status
          }).eq('id', editingStudent.id);

          if (error) throw error;
          
          setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...editStudentForm } : s));
          setShowEditStudentModal(false);
          alert('Dados do aluno atualizados!');
      } catch (err: any) {
          alert('Erro ao atualizar: ' + JSON.stringify(err));
      }
  };

  // CRUD Helpers
  const handleOpenWorkoutModal = (workout?: Workout) => {
      if (workout) {
          setEditingWorkoutId(workout.id);
          setWorkoutForm({
              title: workout.title,
              category: workout.category,
              difficulty: workout.difficulty,
              description: workout.description,
              exercises: workout.exercises || []
          });
      } else {
          setEditingWorkoutId(null);
          setWorkoutForm({
            title: '', category: 'Musculação', difficulty: 'Iniciante', description: '',
            exercises: [{ name: '', video_url: '', sets: '3', reps: '12' }]
          });
      }
      setShowWorkoutModal(true);
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

  const renderSidebarItem = (id: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
        activeTab === id 
          ? 'bg-brand text-white shadow-md shadow-brand/10' 
          : 'text-gray-400 hover:bg-dark-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const stats = {
    users: students.length,
    activeSubs: students.filter(s => s.status === 'active').length,
    revenue: students.filter(s => s.status === 'active').length * 100, 
    late: students.filter(s => s.status === 'late' || s.status === 'inactive').length
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col sm:flex-row font-sans text-gray-100">
      <aside className="w-20 md:w-64 bg-dark-900 border-r border-dark-800 fixed h-screen overflow-y-auto hidden sm:flex flex-col z-50">
        <div className="p-6 border-b border-dark-800 mb-2">
            <div className="flex items-center gap-2">
                <Dumbbell className="h-7 w-7 text-brand transform -rotate-45" />
                <span className="text-xl font-bold text-white tracking-tight hidden md:block">
                    Painel<span className="text-brand">Admin</span>
                </span>
            </div>
        </div>

        <div className="p-4 space-y-1 flex-1">
            <div className="mb-2 px-4 hidden md:block">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Gestão</p>
            </div>
            {renderSidebarItem('overview', <LayoutDashboard size={18} />, 'Visão Geral')}
            {renderSidebarItem('users', <Users size={18} />, 'Alunos')}
            {renderSidebarItem('personals', <UserCheck size={18} />, 'Personais')}
            {renderSidebarItem('achievements', <Trophy size={18} />, 'Conquistas')}
            
            <div className="mt-6 mb-2 px-4 hidden md:block">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Conteúdo</p>
            </div>
            {renderSidebarItem('workouts', <Dumbbell size={18} />, 'Treinos')}
            
            <div className="mt-6 mb-2 px-4 hidden md:block">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Sistema</p>
            </div>
            {renderSidebarItem('communication', <MessageSquare size={18} />, 'Comunicação')}
            {renderSidebarItem('reports', <BarChart2 size={18} />, 'Relatórios')}
        </div>
        
        <div className="p-4 border-t border-dark-800">
             <div className="bg-dark-800 rounded-lg p-3 flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold shrink-0 text-sm">A</div>
                <div className="overflow-hidden hidden md:block">
                    <p className="text-sm font-bold text-white truncate">Administrador</p>
                    <p className="text-xs text-brand">Gestão Total</p>
                </div>
            </div>
            <button onClick={handleBackToStudent} className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors text-xs font-medium mb-1">
                <UserCheck size={16} /> <span className="hidden md:inline">Área do Aluno</span>
            </button>
            <button onClick={handleBackToHome} className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors text-xs font-medium">
                <Home size={16} /> <span className="hidden md:inline">Voltar ao Site</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 sm:ml-20 md:ml-64 p-6 sm:p-10 pb-24 sm:pb-10 overflow-y-auto min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-dark-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {activeTab === 'overview' && 'Visão Geral'}
                        {activeTab === 'users' && 'Gestão de Alunos'}
                        {activeTab === 'personals' && 'Personal Trainers'}
                        {activeTab === 'workouts' && 'Treinos da Academia'}
                        {activeTab === 'achievements' && 'Conquistas & Gamificação'}
                        {activeTab === 'communication' && 'Comunicação'}
                        {activeTab === 'reports' && 'Relatórios e Métricas'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Gerencie todos os aspectos da MonsterHouse Academy.</p>
                </div>
                
                <div className="flex gap-3">
                    {activeTab === 'users' && (
                        <button onClick={() => setShowStudentModal(true)} className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-brand/20">
                            <UserPlus size={18} /> Ativar Aluno
                        </button>
                    )}
                    {activeTab === 'personals' && (
                        <button onClick={() => setShowPersonalModal(true)} className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-brand/20">
                            <Plus size={18} /> Novo Personal
                        </button>
                    )}
                    {activeTab === 'workouts' && (
                        <button onClick={() => handleOpenWorkoutModal()} className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-brand/20">
                            <Plus size={18} /> Novo Treino
                        </button>
                    )}
                    {activeTab === 'achievements' && (
                        <button onClick={() => setShowAchievementModal(true)} className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-brand/20">
                            <Plus size={18} /> Nova Conquista
                        </button>
                    )}
                </div>
            </div>

            {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>}

            {!loading && (
                <>
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'Total de Alunos', value: stats.users, icon: Users, color: 'text-brand', bg: 'bg-brand/10' },
                                { label: 'Receita Estimada', value: `R$ ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
                                { label: 'Assinaturas Ativas', value: stats.activeSubs, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { label: 'Pendências', value: stats.late, icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-dark-800 p-6 rounded-lg border border-dark-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">{stat.label}</p>
                                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-lg ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- ALUNOS --- */}
                    {activeTab === 'users' && (
                        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-dark-700 flex gap-4 bg-dark-800">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input type="text" placeholder="Buscar aluno..." className="w-full bg-dark-900 border border-dark-600 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-brand outline-none"
                                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-dark-900 text-gray-400 text-xs uppercase border-b border-dark-700">
                                        <tr>
                                            <th className="px-6 py-5 font-bold tracking-wider">Aluno</th>
                                            <th className="px-6 py-5 font-bold tracking-wider">Contato</th>
                                            <th className="px-6 py-5 font-bold tracking-wider">Plano</th>
                                            <th className="px-6 py-5 font-bold tracking-wider">Status</th>
                                            <th className="px-6 py-5 font-bold tracking-wider text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-700">
                                        {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                                            <tr key={student.id} className="hover:bg-dark-700/30 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-brand/20 flex items-center justify-center text-brand font-bold text-sm">{student.name.charAt(0)}</div>
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{student.name}</p>
                                                            <p className="text-gray-500 text-xs font-mono">ID: {student.id.substring(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-gray-300 text-sm">{student.email}</p>
                                                    <p className="text-gray-500 text-xs">{student.phone || 'Sem telefone'}</p>
                                                </td>
                                                <td className="px-6 py-5 text-white text-sm font-medium">{student.plan || 'Sem Plano'}</td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wide border ${student.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        {student.status === 'active' ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEditStudent(student)} className="p-2 bg-dark-700 hover:bg-brand hover:text-white rounded text-gray-400 transition-colors">
                                                            <Edit size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- COMUNICAÇÃO --- */}
                    {activeTab === 'communication' && (
                        <div className="bg-dark-800 rounded-lg border border-dark-700 p-8 text-center">
                            <MessageSquare className="w-16 h-16 mx-auto text-brand mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-white mb-2">Central de Comunicação</h3>
                            <p className="text-gray-400 mb-6 max-w-lg mx-auto">Envie notificações e e-mails para todos os alunos ou grupos específicos.</p>
                            
                            <div className="bg-dark-900 p-6 rounded-lg border border-dark-600 max-w-2xl mx-auto text-left">
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Título da Mensagem</label>
                                    <input type="text" className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-white text-sm focus:border-brand outline-none" placeholder="Ex: Aviso Importante" />
                                </div>
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Conteúdo</label>
                                    <textarea rows={4} className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-white text-sm focus:border-brand outline-none" placeholder="Digite sua mensagem aqui..." />
                                </div>
                                <div className="flex justify-end">
                                    <button className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded font-bold flex items-center gap-2 text-sm">
                                        <Send size={16} /> Enviar Agora
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- RELATÓRIOS --- */}
                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
                                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Novos Alunos (Mês)</h3>
                                    <div className="flex items-end gap-2">
                                        <div className="w-full bg-dark-900 h-32 rounded-lg relative overflow-hidden flex items-end px-2 gap-1">
                                            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                                <div key={i} style={{height: `${h}%`}} className="flex-1 bg-brand/50 hover:bg-brand rounded-t transition-all"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
                                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Taxa de Retenção</h3>
                                    <div className="flex items-center justify-center h-32">
                                        <div className="text-4xl font-black text-white">98.5%</div>
                                    </div>
                                </div>
                                <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
                                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Receita Mensal</h3>
                                    <div className="flex items-center justify-center h-32">
                                        <div className="text-4xl font-black text-green-500">R$ {stats.revenue.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PERSONAIS --- */}
                    {activeTab === 'personals' && (
                        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-dark-900 text-gray-400 text-xs uppercase border-b border-dark-700">
                                    <tr>
                                        <th className="px-6 py-5 font-bold tracking-wider">Profissional</th>
                                        <th className="px-6 py-5 font-bold tracking-wider">Especialidade</th>
                                        <th className="px-6 py-5 font-bold tracking-wider">Código</th>
                                        <th className="px-6 py-5 font-bold tracking-wider text-center">Alunos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {personals.map((personal) => (
                                        <tr key={personal.id} className="hover:bg-dark-700/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    {personal.photo_url ? <img src={personal.photo_url} alt="" className="w-10 h-10 rounded object-cover border border-dark-600" /> : <div className="w-10 h-10 rounded bg-dark-700 flex items-center justify-center text-gray-400"><UserCheck size={20} /></div>}
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{personal.name}</p>
                                                        <p className="text-gray-500 text-xs">{personal.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-300">{personal.specialty}</td>
                                            <td className="px-6 py-5"><code className="bg-dark-900 border border-dark-600 px-2 py-1 rounded text-brand font-mono font-bold text-sm tracking-wider">{personal.access_code}</code></td>
                                            <td className="px-6 py-5 text-center text-white font-bold text-sm">{personal.students_count || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- TREINOS --- */}
                    {activeTab === 'workouts' && (
                        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-dark-900 text-gray-400 text-xs uppercase border-b border-dark-700">
                                    <tr>
                                        <th className="px-6 py-5 font-bold tracking-wider">Treino</th>
                                        <th className="px-6 py-5 font-bold tracking-wider">Categoria</th>
                                        <th className="px-6 py-5 font-bold tracking-wider">Dificuldade</th>
                                        <th className="px-6 py-5 font-bold tracking-wider text-center">Exercícios</th>
                                        <th className="px-6 py-5 font-bold tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {workouts.map((workout) => (
                                        <tr key={workout.id} className="hover:bg-dark-700/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 text-gray-400 shrink-0"><Dumbbell size={20} /></div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{workout.title}</p>
                                                        <p className="text-gray-500 text-xs truncate max-w-[200px]">{workout.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-300">{workout.category}</td>
                                            <td className="px-6 py-5"><span className="px-3 py-1 rounded text-xs font-medium border border-dark-600 text-gray-300 bg-dark-900">{workout.difficulty}</span></td>
                                            <td className="px-6 py-5 text-center text-white font-mono text-sm">{workout.exercises?.length || 0}</td>
                                            <td className="px-6 py-5 text-right"><button onClick={() => handleOpenWorkoutModal(workout)} className="px-4 py-2 bg-dark-900 border border-dark-600 text-white text-xs font-bold rounded hover:bg-brand hover:border-brand transition-colors">Editar</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- CONQUISTAS --- */}
                    {activeTab === 'achievements' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {achievements.map((ach, i) => (
                                <div key={i} className="bg-dark-800 p-6 rounded-lg border border-dark-700 flex flex-col items-center text-center relative">
                                    <div className={`w-16 h-16 rounded-full bg-${ach.color}-500/10 flex items-center justify-center mb-4 text-${ach.color}-500 ring-1 ring-${ach.color}-500/20`}>
                                        {renderIconByName(ach.icon, 28)}
                                    </div>
                                    <h3 className="text-white font-bold text-base mb-1">{ach.title}</h3>
                                    <p className="text-gray-500 text-xs mt-1 mb-4 line-clamp-2 h-8 leading-relaxed">{ach.description}</p>
                                    <div className="w-full pt-4 border-t border-dark-700 flex justify-between text-[10px] uppercase font-bold text-gray-400">
                                        <span>{ach.criteria_type}</span>
                                        <span>{ach.criteria_value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
      </main>

      {/* MODAL EDITAR ALUNO (CPF) */}
      {showEditStudentModal && editingStudent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-dark-800 rounded-lg w-full max-w-md overflow-hidden border border-dark-700 shadow-2xl">
                  <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                      <h2 className="text-lg font-bold text-white">Editar Dados do Aluno</h2>
                      <button onClick={() => setShowEditStudentModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleSaveStudentEdit} className="p-6 space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Nome</label>
                          <input type="text" className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                              value={editStudentForm.name} onChange={e => setEditStudentForm({...editStudentForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">CPF</label>
                          <input type="text" className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                              placeholder="000.000.000-00"
                              value={editStudentForm.cpf} onChange={e => setEditStudentForm({...editStudentForm, cpf: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Telefone</label>
                          <input type="text" className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                              value={editStudentForm.phone} onChange={e => setEditStudentForm({...editStudentForm, phone: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Plano</label>
                          <select className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                              value={editStudentForm.plan} onChange={e => setEditStudentForm({...editStudentForm, plan: e.target.value})}>
                              <option>Mensal</option><option>Semestral</option><option>Anual</option><option>Mensal Livre</option>
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                          <select className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                              value={editStudentForm.status} onChange={e => setEditStudentForm({...editStudentForm, status: e.target.value})}>
                              <option value="active">Ativo</option>
                              <option value="inactive">Inativo</option>
                              <option value="late">Pendente</option>
                          </select>
                      </div>
                      <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded transition-colors text-sm mt-4">
                          Salvar Alterações
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* MODAL ATIVAR ALUNO */}
      {showStudentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-800 rounded-lg w-full max-w-md overflow-hidden border border-dark-700 shadow-2xl">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Ativar Aluno (Pagamento Presencial)</h2>
                    <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-4 bg-brand/10 border-b border-brand/20 text-xs text-brand-light">
                    <p>Peça para o aluno criar uma conta gratuita no site. Depois, digite o e-mail dele aqui para liberar o acesso.</p>
                </div>
                <form onSubmit={handleActivateStudent} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">E-mail do Aluno</label>
                        <input type="email" required className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                            placeholder="exemplo@email.com"
                            value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Plano Contratado</label>
                        <select className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                            value={studentForm.plan} onChange={e => setStudentForm({...studentForm, plan: e.target.value})}>
                            <option>Mensal</option><option>Semestral</option><option>Anual</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded transition-colors text-sm mt-4">
                        Ativar Acesso
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* MODAIS EXISTENTES (PERSONAL, TREINO, CONQUISTA) MANTIDOS */}
      {showPersonalModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-800 rounded-lg w-full max-w-2xl overflow-hidden border border-dark-700 shadow-2xl">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Cadastrar Novo Personal</h2>
                    <button onClick={() => setShowPersonalModal(false)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSavePersonal} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Nome Completo *</label>
                            <input type="text" required className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                                value={personalForm.name} onChange={e => {
                                    setPersonalForm({...personalForm, name: e.target.value});
                                    if(!personalForm.access_code) setPersonalForm(prev => ({...prev, name: e.target.value, access_code: generateAccessCode(e.target.value)}));
                                }} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Email *</label>
                            <input type="email" required className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                                value={personalForm.email} onChange={e => setPersonalForm({...personalForm, email: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Especialidade</label>
                            <input type="text" className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                                placeholder="Ex: Musculação" value={personalForm.specialty} onChange={e => setPersonalForm({...personalForm, specialty: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-brand uppercase">Código de Acesso</label>
                            <div className="flex gap-2">
                                <input type="text" className="w-full bg-dark-900 border border-brand/30 rounded p-3 text-white text-sm font-mono font-bold focus:border-brand outline-none uppercase"
                                    value={personalForm.access_code} onChange={e => setPersonalForm({...personalForm, access_code: e.target.value.toUpperCase()})} />
                                <button type="button" onClick={() => setPersonalForm(prev => ({...prev, access_code: generateAccessCode(prev.name)}))} className="p-3 bg-dark-700 text-gray-300 rounded hover:bg-dark-600"><RefreshCw size={18} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setShowPersonalModal(false)} className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded transition-colors text-sm">Cancelar</button>
                        <button type="submit" className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded transition-colors text-sm">Salvar Personal</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {showWorkoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-800 rounded-lg w-full max-w-4xl overflow-hidden border border-dark-700 shadow-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center sticky top-0 bg-dark-800 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-white">{editingWorkoutId ? 'Editar Treino' : 'Criar Novo Treino'}</h2>
                        <p className="text-xs text-gray-400">Configure a rotina e os exercícios</p>
                    </div>
                    <button onClick={() => setShowWorkoutModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="overflow-y-auto p-6 flex-1">
                    <form id="workout-form" onSubmit={handleSaveWorkout} className="space-y-8">
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
                    </form>
                </div>
                <div className="p-6 border-t border-dark-700 bg-dark-800 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowWorkoutModal(false)} className="bg-dark-700 hover:bg-dark-600 text-white font-bold py-2 px-4 rounded text-sm">Cancelar</button>
                    <button type="button" onClick={handleSaveWorkout} className="bg-brand hover:bg-brand-dark text-white font-bold py-2 px-6 rounded text-sm flex items-center gap-2"><Save size={16} /> Salvar Treino</button>
                </div>
            </div>
        </div>
      )}

      {showAchievementModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-800 rounded-lg w-full max-w-3xl overflow-hidden border border-dark-700 shadow-2xl flex flex-col md:flex-row">
                <div className="p-6 flex-1 border-r border-dark-700 overflow-y-auto max-h-[90vh]">
                    <h2 className="text-lg font-bold text-white mb-6">Criar Nova Conquista</h2>
                    <form onSubmit={handleCreateAchievement} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Título</label>
                                <input type="text" required className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                    value={achievementForm.title} onChange={e => setAchievementForm({...achievementForm, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Pontos (XP)</label>
                                <input type="number" required className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                    value={achievementForm.points} onChange={e => setAchievementForm({...achievementForm, points: parseInt(e.target.value)})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Descrição</label>
                            <textarea required rows={2} className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                value={achievementForm.description} onChange={e => setAchievementForm({...achievementForm, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Critério</label>
                                <select className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                    // @ts-ignore
                                    value={achievementForm.criteria_type} onChange={e => setAchievementForm({...achievementForm, criteria_type: e.target.value})}>
                                    <option value="points">Por Pontos</option>
                                    <option value="workouts">Por Treinos</option>
                                    <option value="streak">Por Sequência</option>
                                    <option value="video">Por Vídeos Assistidos</option>
                                    <option value="custom">Personalizado (Manual)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Valor Alvo</label>
                                <input type="number" required className="w-full bg-dark-900 border border-dark-600 rounded p-2.5 text-white text-sm focus:border-brand outline-none"
                                    value={achievementForm.criteria_value} onChange={e => setAchievementForm({...achievementForm, criteria_value: parseInt(e.target.value)})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Ícone</label>
                            <div className="grid grid-cols-8 gap-2">
                                {AVAILABLE_ICONS.map(icon => (
                                    <button key={icon} type="button" onClick={() => setAchievementForm({...achievementForm, icon})}
                                        className={`p-2 rounded border flex items-center justify-center ${achievementForm.icon === icon ? 'bg-brand text-white border-brand' : 'bg-dark-900 text-gray-500 border-dark-600 hover:border-gray-400'}`}>
                                        {renderIconByName(icon, 16)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Cor</label>
                            <div className="flex gap-2">
                                {['yellow', 'red', 'blue', 'green', 'purple'].map(color => (
                                    <button key={color} type="button" onClick={() => setAchievementForm({...achievementForm, color})}
                                        className={`w-6 h-6 rounded-full border-2 ${achievementForm.color === color ? 'border-white scale-110' : 'border-transparent'} bg-${color}-500`} />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowAchievementModal(false)} className="flex-1 bg-dark-700 text-white py-3 rounded text-sm font-bold">Cancelar</button>
                            <button type="submit" className="flex-1 bg-brand text-white py-3 rounded text-sm font-bold">Criar Conquista</button>
                        </div>
                    </form>
                </div>
                <div className="p-6 w-full md:w-1/3 bg-dark-900 flex flex-col items-center justify-center border-l border-dark-700">
                    <h3 className="text-gray-500 text-[10px] uppercase font-bold mb-8">Preview</h3>
                    <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 flex flex-col items-center text-center w-full max-w-[200px] shadow-xl">
                        <div className={`w-16 h-16 rounded-full bg-${achievementForm.color}-500/10 flex items-center justify-center mb-4 text-${achievementForm.color}-500 ring-1 ring-${achievementForm.color}-500/20`}>
                            {renderIconByName(achievementForm.icon, 28)}
                        </div>
                        <h3 className="text-white font-bold text-sm mb-1">{achievementForm.title || "Título..."}</h3>
                        <p className="text-gray-500 text-[10px]">{achievementForm.description || "Descrição..."}</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;