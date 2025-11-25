import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Video, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    activeSubs: 0,
    revenue: 0
  });

  useEffect(() => {
    // Mock dashboard data fetching
    const fetchStats = async () => {
        // In a real app, these would be real aggregations
        setStats({
            users: 124,
            activeSubs: 89,
            revenue: 12400
        });
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Alunos</p>
                <h3 className="text-3xl font-bold text-white">{stats.users}</h3>
              </div>
              <div className="p-3 bg-brand/10 rounded-lg">
                <Users className="w-6 h-6 text-brand" />
              </div>
            </div>
          </div>
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Receita Mensal</p>
                <h3 className="text-3xl font-bold text-white">R$ {stats.revenue.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Assinaturas Ativas</p>
                <h3 className="text-3xl font-bold text-white">{stats.activeSubs}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Gestão Recente</h3>
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                                    <Users size={14} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-white font-medium">Novo aluno cadastrado</p>
                                    <p className="text-xs text-gray-500">Há 2 horas</p>
                                </div>
                            </div>
                            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Ativo</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Avisos do Sistema</h3>
                 <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-yellow-500 shrink-0" />
                    <div>
                        <p className="text-yellow-200 text-sm font-bold">5 Pagamentos Pendentes</p>
                        <p className="text-yellow-200/70 text-sm mt-1">Verifique a aba financeira para processar renovações manuais.</p>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;