import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const Success = () => {
  useEffect(() => {
    // Fire confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-2xl p-8 max-w-md w-full text-center border border-brand/20 shadow-2xl shadow-brand/10">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2">Pagamento Confirmado!</h1>
        <p className="text-gray-400 mb-8">
          Bem-vindo à família MonsterHouse! Seu acesso à plataforma já foi liberado.
        </p>

        <Link 
          to="/student" 
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          ACESSAR ÁREA DO ALUNO
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Success;