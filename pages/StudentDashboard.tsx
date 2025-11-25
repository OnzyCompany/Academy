import React, { useState, useEffect } from 'react';
import { Play, Award, Flame, BarChart3, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { VideoLesson, UserStats } from '../types';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    total_points: 0,
    workouts_completed: 0,
    videos_completed: 0,
    current_streak: 0
  });
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const loadData = async () => {
        try {
            // Mock fetching videos if tables don't exist yet
            const { data: videoData, error } = await supabase.from('video_lessons').select('*').eq('is_active', true);
            
            if (error || !videoData) {
                // Mock data
                setVideos([
                    {
                        id: '1', title: 'Introdução ao Treino de Força', description: 'Fundamentos básicos', 
                        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail_url: 'https://picsum.photos/400/225', 
                        duration: '10:00', difficulty: 'beginner', category: 'Musculação', personal_id: null, is_free: true, views_count: 100
                    },
                    {
                        id: '2', title: 'Cardio HIIT Intenso', description: 'Queime calorias rápido', 
                        video_url: '', thumbnail_url: 'https://picsum.photos/400/226', 
                        duration: '20:00', difficulty: 'advanced', category: 'Cardio', personal_id: null, is_free: false, views_count: 50
                    }
                ]);
            } else {
                setVideos(videoData);
            }

            // Mock fetching stats
             const { data: statsData } = await supabase.from('user_stats').select('*').eq('user_id', profile?.id).single();
             if(statsData) setStats(statsData);
             else {
                 // Default stats
                 setStats({ level: 1, total_points: 150, workouts_completed: 5, videos_completed: 2, current_streak: 3 });
             }

        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [profile]);

  const levelProgress = (stats.total_points % 100); // Assuming 100 points per level

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Olá, {profile?.name}! 👋</h1>
          <p className="text-gray-400">Continue focado nos seus objetivos.</p>
        </div>

        {/* Gamification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-brand-dark to-brand p-6 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-brand/20">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium">Nível Atual</p>
                  <h3 className="text-4xl font-bold">{stats.level}</h3>
                </div>
                <Award className="w-8 h-8 text-white/80" />
              </div>
              <div className="w-full bg-black/20 rounded-full h-2 mb-2">
                <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: `${levelProgress}%` }}></div>
              </div>
              <p className="text-xs text-white/80">{100 - levelProgress} pontos para o próximo nível</p>
            </div>
            <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
          </div>

          <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Sequência</p>
                <h3 className="text-2xl font-bold text-white">{stats.current_streak} Dias</h3>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Pontos</p>
                <h3 className="text-2xl font-bold text-white">{stats.total_points}</h3>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Treinos</p>
                <h3 className="text-2xl font-bold text-white">{stats.workouts_completed}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Play className="w-5 h-5 text-brand" />
          Videoaulas Recentes
        </h2>

        {loading ? (
          <div className="text-white">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand/50 transition-all group">
                <div className="relative aspect-video bg-dark-900">
                  <img src={video.thumbnail_url || 'https://via.placeholder.com/400'} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                  {!video.is_free && profile?.status !== 'active' && (
                     <div className="absolute inset-0 bg-dark-900/80 flex flex-col items-center justify-center text-center p-4">
                         <Lock className="w-8 h-8 text-gray-400 mb-2"/>
                         <span className="text-gray-300 text-sm font-bold">Conteúdo Exclusivo</span>
                     </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        video.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' : 
                        video.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'
                    }`}>
                        {video.difficulty === 'beginner' ? 'Iniciante' : video.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </span>
                    <span className="text-xs text-gray-500">{video.category}</span>
                  </div>
                  <h3 className="text-white font-bold mb-1 truncate">{video.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;