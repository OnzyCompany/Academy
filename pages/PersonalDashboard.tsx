import React, { useState } from 'react';
import { Upload, Film, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PersonalDashboard = () => {
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    url: '',
    category: 'musculacao',
    difficulty: 'beginner'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate upload
    console.log("Uploading video:", videoForm);
    alert("Vídeo enviado com sucesso!");
    setVideoForm({ title: '', description: '', url: '', category: 'musculacao', difficulty: 'beginner' });
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Área do Personal</h1>

        <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Film className="text-brand" />
                Novo Conteúdo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Título da Aula</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand outline-none"
                        value={videoForm.title}
                        onChange={e => setVideoForm({...videoForm, title: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">URL do Vídeo (YouTube/Vimeo)</label>
                    <input 
                        type="url" 
                        required
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand outline-none"
                        value={videoForm.url}
                        onChange={e => setVideoForm({...videoForm, url: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Dificuldade</label>
                        <select 
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand outline-none"
                            value={videoForm.difficulty}
                            onChange={e => setVideoForm({...videoForm, difficulty: e.target.value})}
                        >
                            <option value="beginner">Iniciante</option>
                            <option value="intermediate">Intermediário</option>
                            <option value="advanced">Avançado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Categoria</label>
                        <select 
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand outline-none"
                            value={videoForm.category}
                            onChange={e => setVideoForm({...videoForm, category: e.target.value})}
                        >
                            <option value="musculacao">Musculação</option>
                            <option value="cardio">Cardio</option>
                            <option value="alongamento">Alongamento</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                    <textarea 
                        rows={4}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand outline-none"
                        value={videoForm.description}
                        onChange={e => setVideoForm({...videoForm, description: e.target.value})}
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <Save size={20} />
                    Publicar Aula
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;