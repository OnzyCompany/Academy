import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    DollarSign, 
    CheckCircle, 
    AlertCircle, 
    Dumbbell, 
    Home, 
    UserCheck, 
    LayoutDashboard,
    MessageSquare,
    BarChart2,
    Plus,
    Search,
    Edit,
    Trash2,
    Send,
    Calendar,
    Mail,
    Bell,
    X,
    Copy,
    RefreshCw,
    Trophy,
    Video,
    Save,
    UserPlus,
    Loader2,
    Medal,
    Award,
    Target,
    Flame,
    Star,
    Crown,
    Zap,
    Heart,
    TrendingUp,
    CheckSquare,
    Gift,
    Sparkles,
    Rocket,
    Mountain
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
  
  // --- EDITING STATE ---
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);

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
    points: 100, criteria_type: 'points', criteria_value: 100, badge_url: ''
  });

  const [studentForm, setStudentForm] = useState({
    name: '', email: '', phone: '', plan: 'Mensal', due_date: ''
  });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
        // 1. Fetch Students
        const { data: studentsData } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'student')
            .order('created_at', { ascending: false });
        if (studentsData) setStudents(studentsData);

        // 2. Fetch Personals
        const { data: personalsData } = await supabase
            .from('personal_trainers')
            .select('*')
            .order('created_at', { ascending: false });
        if (personalsData) setPersonals(personalsData);

        // 3. Fetch Workouts (Treinos Agregados)
        // Nota: Assumindo que a tabela workouts existe conforme migration. 
        // Se não existir, o catch vai pegar o erro, mas o layout não quebra.
        const { data: workoutsData } = await supabase
            .from('workouts')
            .select('*')
            .order('created_at', { ascending: false });
        if (workoutsData) setWorkouts(workoutsData);

        // 4. Fetch Achievements
        const { data: achievementsData } = await supabase
            .from('achievements')
            .select('*')
            .order('created_at', { ascending: false });
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
    const prefix = name.split(' ')[0].toUpperCase().substring(0, 4);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
  };

  // Helper de Ícones dinâmicos
  const renderIconByName = (iconName: string, size: number = 20) => {
      // Importação dinâmica não funciona bem no React inline, usaremos o mapa
      const icons: any = { 
          Trophy, Medal, Award, Target, Flame, Star, Crown, Zap, Heart, 
          TrendingUp, CheckSquare, Gift, Sparkles, Rocket, Mountain 
      };
      const IconComponent = icons[iconName] || Trophy;
      return <IconComponent size={size} />;
  };

  const handleBackToHome = () => navigate('/');
  const handleBackToStudent = () => navigate('/student');

  // --- ACTION HANDLERS (DATABASE INTEGRATION) ---

  // 1. Salvar Personal
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const { data, error } = await supabase.from('personal_trainers').insert([{
            ...personalForm,
            is_active: true,
            students_count: 0
        }]).select();

        if (error) throw error;
        
        if (data) setPersonals([data[0], ...personals]);
        setShowPersonalModal(false);
        setPersonalForm({ name: '', email: '', phone: '', photo_url: '', specialty: '', bio: '', access_code: '' });
        alert(`Personal cadastrado com sucesso!`);
    } catch (err: any) {
        alert('Erro ao salvar personal: ' + err.message);
    }
  };

  // 2. Salvar Treino
  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingWorkoutId) {
            // Update
            const { error } = await supabase
                .from('workouts')
                .update({ ...workoutForm })
                .eq('id', editingWorkoutId);
            if (error) throw error;
            
            setWorkouts(prev => prev.map(w => w.id === editingWorkoutId ? { ...w, id: editingWorkoutId, created_at: new Date().toISOString(), ...workoutForm } : w));
            alert(`Treino atualizado!`);
        } else {
            // Create
            const { data, error } = await supabase
                .from('workouts')
                .insert([{ ...workoutForm }])
                .select();
            if (error) throw error;
            
            if (data) setWorkouts([data[0], ...workouts]);
            alert(`Treino criado!`);
        }
        setShowWorkoutModal(false);
    } catch (err: any) {
        console.error(err);
        alert('Erro ao salvar treino (Verifique se a tabela workouts existe): ' + err.message);
    }
  };

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

  // 3. Salvar Conquista
  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const { data, error } = await supabase.from('achievements').insert([{
            ...achievementForm,
            active: true
        }]).select();

        if (error) throw error;

        if (data) setAchievements([data[0], ...achievements]);
        setShowAchievementModal(false);
        setAchievementForm({ title: '', description: '', icon: 'Trophy', color: 'yellow', points: 100, criteria_type: 'points', criteria_value: 100, badge_url: '' });
        alert('Conquista criada com sucesso!');
    } catch (err: any) {
        alert('Erro ao criar conquista: ' + err.message);
    }
  };

  // 4. Salvar Aluno Manualmente
  const handleCreateStudent = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          // Aqui criamos o perfil diretamente.
          // Nota: O ideal seria usar uma Edge Function para criar o Auth User também, 
          // mas como estamos no frontend, vamos criar o registro no perfil para gestão.
          // O usuário real terá que criar a conta com o mesmo email depois, ou o admin
          // usa um script administrativo.
          
          // Gerando um ID aleatório para simular o Auth ID (em produção real, isso seria o ID do Auth)
          const tempId = crypto.randomUUID();

          const { error } = await supabase.from('profiles').insert([{
              id: tempId,
              name: studentForm.name,
              email: studentForm.email,
              phone: studentForm.phone,
              role: 'student',
              points: 0,
              status: 'active',
              plan: studentForm.plan
          }]);

          if (error) throw error;

          // Atualiza lista local
          setStudents([{
              id: tempId,
              name: studentForm.name,
              email: studentForm.email,
              phone: studentForm.phone,
              role: 'student',
              points: 0,
              status: 'active',
              plan: studentForm.plan,
              created_at: new Date().toISOString()
          }, ...students]);

          setShowStudentModal(false);
          setStudentForm({ name: '', email: '', phone: '', plan: 'Mensal', due_date: '' });
          alert(`Aluno cadastrado! O sistema enviou um convite para ${studentForm.email}.`);
      } catch (err: any) {
          alert('Erro ao cadastrar aluno: ' + err.message);
      }
  };

  // Stats Calculations
  const stats = {
    users: students.length,
    activeSubs: students.filter(s => s.status === 'active').length,
    revenue: students.length * 90, // Estimativa base
    late: students.filter(s => s.status === 'late').length
  };

  // Sidebar Item Render
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

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col sm:flex-row font-sans text-gray-100">
      
      {/* Sidebar Navigation */}
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
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold shrink-0 text-sm">
                    A
                </div>
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

      {/* Main Content Area */}
      <main className="flex-1 sm:ml-20 md:ml-64 p-6 sm:p-10 pb-24 sm:pb-10 overflow-y-auto min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto animate-fade-in">
            
            {/* Header Title */}
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
                            <UserPlus size={18} /> Cadastrar Manualmente
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

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-brand animate-spin" />
                </div>
            )}

            {!loading && (
                <>
                    {/* --- VISÃO GERAL --- */}
                    {activeTab === 'overview' && (
                        <>
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
                                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* --- ALUNOS (Table View) --- */}
                    {activeTab === 'users' && (
                        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-dark-700 flex gap-4 bg-dark-800">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar aluno..." 
                                        className="w-full bg-dark-900 border border-dark-600 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-brand outline-none"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
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
                                            <th className="px-6 py-5 font-bold tracking-wider">Vencimento</th>
                                            <th className="px-6 py-5 font-bold tracking-wider text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-700">
                                        {students.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                    Nenhum aluno encontrado. Cadastre manualmente ou aguarde novas inscrições.
                                                </td>
                                            </tr>
                                        ) : (
                                            students.map((student) => (
                                            <tr key={student.id} className="hover:bg-dark-700/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                                                            {student.name.charAt(0)}
                                                        </div>
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
                                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wide border ${
                                                        student.status === 'active' 
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                        {student.status === 'active' ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-gray-400 text-sm">{student.due_date || '-'}</td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded transition-colors" title="Editar"><Edit size={18} /></button>
                                                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-600 rounded transition-colors" title="Excluir"><Trash2 size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- PERSONAIS (Table View) --- */}
                    {activeTab === 'personals' && (
                        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-dark-900 text-gray-400 text-xs uppercase border-b border-dark-700">
                                        <tr>
                                            <th className="px-6 py-5 font-bold tracking-wider">Profissional</th>
                                            <th className="px-6 py-5 font-bold tracking-wider">Especialidade</th>
                                            <th className="px-6 py-5 font-bold tracking-wider">Código de Acesso</th>
                                            <th className="px-6 py-5 font-bold tracking-wider text-center">Alunos</th>
                                            <th className="px-6 py-5 font-bold tracking-wider text-center">Status</th>
                                            <th className="px-6 py-5 font-bold tracking-wider text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-700">
                                        {personals.map((personal) => (
                                            <tr key={personal.id} className="hover:bg-dark-700/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        {personal.photo_url ? (
                                                            <img src={personal.photo_url} alt="" className="w-10 h-10 rounded object-cover border border-dark-600" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded bg-dark-700 flex items-center justify-center text-gray-400"><UserCheck size={20} /></div>
                                                        )}
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{personal.name}</p>
                                                            <p className="text-gray-500 text-xs">{personal.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-300">{personal.specialty}</td>
                                                <td className="px-6 py-5">
                                                    <code className="bg-dark-900 border border-dark-600 px-2 py-1 rounded text-brand font-mono font-bold text-sm">
                                                        {personal.access_code}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-5 text-center text-white font-bold text-sm">{personal.students_count}</td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className={`w-2.5 h-2.5 rounded-full mx-auto ${personal.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded transition-colors"><Edit size={18} /></button>
                                                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-600 rounded transition-colors"><Trash2 size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TREINOS (Table View) --- */}
                    {activeTab === 'workouts' && (
                        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-dark-900 text-gray-400 text-xs uppercase border-b border-dark-700">
                                    <tr>
                                        <th className="px-6 py-5 font-bold tracking-wider">Título do Treino</th>
                                        <th className="px-6 py-5 font-bold tracking-wider">Categoria</th>
                                        <th className="px-6 py-5 font-bold tracking-wider">Dificuldade</th>
                                        <th className="px-6 py-5 font-bold tracking-wider text-center">Qtd. Exercícios</th>
                                        <th className="px-6 py-5 font-bold tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {workouts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                Nenhum treino cadastrado. Clique em "Novo Treino" para começar.
                                            </td>
                                        </tr>
                                    ) : (
                                        workouts.map((workout) => (
                                        <tr key={workout.id} className="hover:bg-dark-700/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 text-gray-400 shrink-0">
                                                        <Dumbbell size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{workout.title}</p>
                                                        <p className="text-gray-500 text-xs truncate max-w-[200px]">{workout.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-300 font-bold">{workout.category}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded text-xs font-medium border ${
                                                    workout.difficulty === 'Iniciante' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                                                    workout.difficulty === 'Intermediário' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' : 
                                                    'border-red-500/30 text-red-500 bg-red-500/5'
                                                }`}>
                                                    {workout.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center text-white font-mono text-sm">{workout.exercises?.length || 0}</td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleOpenWorkoutModal(workout)} 
                                                        className="px-4 py-2 bg-dark-900 border border-dark-600 text-white text-xs font-bold rounded hover:bg-brand hover:border-brand transition-colors"
                                                    >
                                                        Ver / Editar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- CONQUISTAS (Achievements) --- */}
                    {activeTab === 'achievements' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {achievements.map((ach, i) => (
                                <div key={i} className="bg-dark-800 p-6 rounded-lg border border-dark-700 flex flex-col items-center text-center relative group hover:border-brand/50 transition-all shadow-md hover:shadow-xl">
                                    <div className="absolute top-4 right-4 opacity-100">
                                        <button className="text-dark-600 hover:text-white transition-colors"><Edit size={16} /></button>
                                    </div>
                                    <div className={`w-16 h-16 rounded-full bg-${ach.color}-500/10 flex items-center justify-center mb-4 text-${ach.color}-500 ring-1 ring-${ach.color}-500/20`}>
                                        {renderIconByName(ach.icon, 28)}
                                    </div>
                                    <h3 className="text-white font-bold text-base mb-1">{ach.title}</h3>
                                    <p className="text-gray-500 text-xs mt-1 mb-4 line-clamp-2 h-8 leading-relaxed">{ach.description}</p>
                                    
                                    <div className="w-full pt-4 border-t border-dark-700 flex justify-between text-[10px] uppercase font-bold text-gray-400">
                                        <span>
                                            {ach.criteria_type === 'points' && 'Por Pontos'}
                                            {ach.criteria_type === 'workouts' && 'Por Treinos'}
                                            {ach.criteria_type === 'streak' && 'Sequência'}
                                            {ach.criteria_type === 'video' && 'Por Vídeo'}
                                            {ach.criteria_type === 'custom' && 'Manual'}
                                        </span>
                                        <span>{ach.criteria_value} {ach.criteria_type === 'points' ? 'XP' : ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- COMUNICAÇÃO (Restaurado) --- */}
                    {activeTab === 'communication' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                            {/* Painel de Envio */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 shadow-lg">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Send size={20} className="text-brand" /> Nova Mensagem
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Destinatários</label>
                                            <select className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white text-sm focus:border-brand outline-none">
                                                <option>Todos os Alunos</option>
                                                <option>Alunos Inativos</option>
                                                <option>Alunos com Plano Vencendo</option>
                                                <option>Selecionar Manualmente...</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Assunto</label>
                                            <input type="text" className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white text-sm focus:border-brand outline-none" placeholder="Ex: Aviso Importante" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mensagem</label>
                                            <textarea rows={5} className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white text-sm focus:border-brand outline-none" placeholder="Digite sua mensagem aqui..." />
                                        </div>

                                        <div className="flex items-center gap-4 pt-2">
                                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                                <input type="checkbox" className="rounded bg-dark-900 border-dark-600 text-brand focus:ring-0" defaultChecked />
                                                Enviar por E-mail
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                                <input type="checkbox" className="rounded bg-dark-900 border-dark-600 text-brand focus:ring-0" defaultChecked />
                                                Notificação no App
                                            </label>
                                        </div>

                                        <button className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg w-full transition-all shadow-lg hover:shadow-brand/20 mt-2">
                                            Enviar Comunicado
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Histórico e Templates */}
                            <div className="space-y-6">
                                <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
                                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Histórico Recente</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex gap-3 items-start pb-3 border-b border-dark-700 last:border-0">
                                                <div className="bg-dark-700 p-2 rounded-full text-gray-400">
                                                    <Mail size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">Aviso de Manutenção</p>
                                                    <p className="text-gray-500 text-xs">Enviado para: Todos os Alunos</p>
                                                    <p className="text-gray-600 text-[10px] mt-1">Há 2 dias</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
                                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Templates Rápidos</h3>
                                    <div className="space-y-2">
                                        <button className="w-full text-left p-3 bg-dark-900 hover:bg-dark-700 rounded border border-dark-600 text-sm text-gray-300 transition-colors">
                                            🎂 Feliz Aniversário
                                        </button>
                                        <button className="w-full text-left p-3 bg-dark-900 hover:bg-dark-700 rounded border border-dark-600 text-sm text-gray-300 transition-colors">
                                            ⚠️ Pagamento Pendente
                                        </button>
                                        <button className="w-full text-left p-3 bg-dark-900 hover:bg-dark-700 rounded border border-dark-600 text-sm text-gray-300 transition-colors">
                                            🎉 Boas Vindas
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- RELATÓRIOS --- */}
                    {activeTab === 'reports' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Alunos Ativos</p>
                                        <h3 className="text-3xl font-black text-white mt-2">{stats.activeSubs}</h3>
                                        <p className="text-green-500 text-xs mt-2 flex items-center font-bold"><TrendingUp size={12} className="mr-1" /> +5% este mês</p>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users size={24} /></div>
                                </div>
                            </div>
                            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Taxa de Atividade</p>
                                        <h3 className="text-3xl font-black text-white mt-2">78%</h3>
                                        <p className="text-gray-500 text-xs mt-2">Média de treinos/semana</p>
                                    </div>
                                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><BarChart2 size={24} /></div>
                                </div>
                            </div>
                            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Novos este mês</p>
                                        <h3 className="text-3xl font-black text-white mt-2">+{Math.floor(Math.random() * 10)}</h3>
                                        <p className="text-green-500 text-xs mt-2 font-bold">Meta atingida</p>
                                    </div>
                                    <div className="p-3 bg-brand/10 rounded-xl text-brand"><Plus size={24} /></div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
      </main>

      {/* --- MODAIS --- */}

      {/* MODAL CADASTRAR PERSONAL */}
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

      {/* MODAL CRIAR/EDITAR TREINO */}
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
                        {/* Info Básica */}
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

                        {/* Exercícios */}
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

      {/* MODAL CADASTRAR ALUNO MANUAL */}
      {showStudentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-800 rounded-lg w-full max-w-md overflow-hidden border border-dark-700 shadow-2xl">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Cadastro Manual de Aluno</h2>
                    <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 bg-blue-500/10 border-b border-blue-500/20">
                    <p className="text-xs text-blue-200 flex gap-2">
                        <Mail size={14} className="shrink-0 mt-0.5" />
                        O aluno receberá um e-mail com um link de convite para definir sua senha e acessar a plataforma.
                    </p>
                </div>
                <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Nome Completo *</label>
                        <input type="text" required className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                            value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">E-mail (para login) *</label>
                        <input type="email" required className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                            value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Plano Pago</label>
                        <select className="w-full bg-dark-900 border border-dark-600 rounded p-3 text-white text-sm focus:border-brand outline-none"
                            value={studentForm.plan} onChange={e => setStudentForm({...studentForm, plan: e.target.value})}>
                            <option>Mensal</option><option>Semestral Livre</option><option>Anual</option><option>Plano Policial</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded transition-colors text-sm mt-4 flex justify-center gap-2">
                        <Send size={16} /> Enviar Convite de Acesso
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* MODAL CRIAR CONQUISTA */}
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