
import React, { useState, useEffect } from 'react';
import { Upload, Film, Save, User, Users, CreditCard, CheckCircle, LayoutDashboard, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Profile, PersonalTrainer } from '../types';

const PersonalDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'students' | 'content'>('profile');
  const [personal, setPersonal] = useState<PersonalTrainer | null>(null);
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [profileForm, setProfileForm] = useState({
    specialty: '',
    bio: '',
    phone: '',
    payment_info: '',
    plans_info: ''
  });

  useEffect(() => {
    if (user) fetchPersonalData();
  }, [user]);

  const fetchPersonalData = async () => {
    try {
        // Em um app real, o user.id estaria linkado na tabela personal_trainers
        // Para este demo, vamos buscar pelo email ou pegar o primeiro para simular
        let { data, error } = await supabase.from('personal_trainers').select('*').limit(1).single();
        
        if (data) {
            setPersonal(data);
            setProfileForm({
                specialty: data.specialty || '',
                bio: data.bio || '',
                phone: data.phone || '',
                payment_info: data.payment_info || '',
                plans_info: data.plans_info || ''
            });

            // Fetch Students linked to this personal
            const { data: studentsData } = await supabase.from('profiles').select('*').eq('personal_id', data.id);
            if (studentsData) setStudents(studentsData);
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

      try {
          const { error } = await supabase.from('personal_trainers').update({
              ...profileForm
          }).eq('id', personal.id);

          if (error) throw error;
          alert('Perfil atualizado com sucesso!');
      } catch (err: any) {
          alert('Erro ao atualizar: ' + err.message);
      }
  };

  if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Carregando...</div>;

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
            <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'content' ? 'bg-brand text-white' : 'text-gray-400 hover:bg-dark-800'}`}>
                <Video size={20} /> <span className="hidden md:inline">Conteúdo</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 sm:ml-20 md:ml-64 p-8 overflow-y-auto min-h-screen bg-dark-900">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
                {activeTab === 'profile' && 'Gerenciar Perfil'}
                {activeTab === 'students' && 'Meus Alunos'}
                {activeTab === 'content' && 'Gerenciar Conteúdo'}
            </h1>

            {activeTab === 'profile' && (
                <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Nome (Visualização)</label>
                                <input type="text" disabled value={personal?.name} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Código de Acesso</label>
                                <input type="text" disabled value={personal?.access_code} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-brand font-bold cursor-not-allowed" />
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

                        <button type="submit" className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg transition-colors">
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

            {activeTab === 'content' && (
                <div className="text-center py-20 text-gray-500 bg-dark-800 rounded-xl border border-dark-700">
                    <Film className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-bold text-white">Em breve</h3>
                    <p>A gestão de vídeos exclusivos estará disponível na próxima atualização.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default PersonalDashboard;
