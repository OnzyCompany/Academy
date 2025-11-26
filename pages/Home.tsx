
import React, { useState } from 'react';
import { ArrowRight, Check, MapPin, Phone, Mail, ChevronRight, Star, Instagram, Facebook, Youtube, Loader2, Play, Clock } from 'lucide-react';
import { Plan } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../lib/stripe';
import { Link, useNavigate } from 'react-router-dom';

interface HomeProps {
  onOpenAuth: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Configuração exata dos planos conforme o print
  const plans: (Plan & { features: string[], popular?: boolean })[] = [
    { 
      id: 'anual', 
      name: 'Anual Livre', 
      price: 100.00, 
      description: 'Anual Livre - 12 parcelas - 12 meses', 
      stripePriceId: 'price_1S5BHaLvT23f7KhbR8z1g8uD',
      features: ['Acesso total ilimitado', 'Avaliação completa bimensal', 'Treino + dieta + suplementação', 'Personal trainer 2x/mês', 'Desconto em produtos']
    },
    { 
      id: 'semestral', 
      name: 'Semestral Livre', 
      price: 110.00, 
      description: 'Semestral Livre - 6 parcelas - meses', 
      stripePriceId: 'price_1S5BGiLvT23f7KhbnpNG0Wic',
      popular: true,
      features: ['Acesso ilimitado', 'Avaliação física completa', 'Treino + dieta personalizada', 'Acompanhamento mensal', 'Suporte 24/7']
    },
    { 
      id: 'policial', 
      name: 'Plano policial', 
      price: 95.00, 
      description: 'Plano Policial - 1 parcela - 1 mês', 
      stripePriceId: 'price_1S5BFsLvT23f7Khb9gRa02mu',
      features: ['Desconto especial para policiais', 'Acesso ilimitado', 'Treino personalizado', 'Suporte especializado']
    },
    { 
      id: 'especial', 
      name: 'Horário Especial', 
      price: 100.00, 
      description: 'Horário especial - 1 parcela - 1 mês', 
      stripePriceId: 'price_1S5BEtLvT23f7KhbcvTPutmE',
      features: ['Horário 10h às 15h', 'Acesso ilimitado no período', 'Treino personalizado', 'Ambiente mais reservado']
    },
    { 
      id: 'mensal-livre', 
      name: 'Mensal Livre', 
      price: 120.00, 
      description: 'Mensal livre - 1 parcela - 1 mês', 
      stripePriceId: 'price_1S5BE3LvT23f7Khb7ogabwmy',
      features: ['Acesso ilimitado', 'Avaliação física completa', 'Treino personalizado', 'Suporte 24/7']
    },
    { 
      id: 'mensal-seg-sab', 
      name: 'Mensal segunda à sábado', 
      price: 110.00, 
      description: 'Mensal Segunda à Sábado - 1 parcela - 1 mês', 
      stripePriceId: 'price_1S5BCNLvT23f7KhbtIoaMmtP',
      features: ['Acesso segunda à sábado', 'Avaliação física inicial']
    },
    { 
      id: 'mensal', 
      name: 'Mensal', 
      price: 90.00, 
      description: 'Mensal 3x por semana - 1 parcela - 2 mês', 
      stripePriceId: 'price_1S5BB8LvT23f7KhbPKIF5P0I',
      features: ['Acesso 3x por semana', 'Avaliação física inicial', 'Treino personalizado']
    },
  ];

  const handlePlanClick = async (plan: Plan) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    try {
      setLoadingPlanId(plan.id);
      await createCheckoutSession(plan.stripePriceId);
    } catch (error: any) {
      alert(error.message || 'Erro ao iniciar pagamento');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePersonalAccess = () => {
    if (user) {
      navigate('/personal');
    } else {
      onOpenAuth();
    }
  };

  const galleryImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574680096141-9c31f28187a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Gym Background" 
            className="w-full h-full object-cover animate-pulse-slow"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center pt-20">
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Mais que <span className="text-brand">músculos</span>,<br/>
            uma filosofia <span className="text-brand">de vida</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-10 max-w-2xl font-light">
            Transforme seu corpo e sua mente na academia mais intensa de Maracás
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-24">
            <button 
              onClick={() => scrollTo('plans')}
              className="px-8 py-3 bg-brand hover:bg-brand-dark text-white rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              Conheça os Planos
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={onOpenAuth}
              className="px-8 py-3 bg-transparent border border-white hover:bg-white/10 text-white rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" />
              Quero Treinar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="bg-dark-900/80 backdrop-blur-sm border border-white/5 p-6 rounded-lg hover:border-brand/50 transition-colors">
                <h3 className="text-4xl font-bold text-brand mb-1">500+</h3>
                <p className="text-gray-300">Atletas Transformados</p>
            </div>
            <div className="bg-dark-900/80 backdrop-blur-sm border border-white/5 p-6 rounded-lg hover:border-brand/50 transition-colors">
                <h3 className="text-4xl font-bold text-brand mb-1">5 Anos</h3>
                <p className="text-gray-300">De Experiência</p>
            </div>
            <div className="bg-dark-900/80 backdrop-blur-sm border border-white/5 p-6 rounded-lg hover:border-brand/50 transition-colors">
                <h3 className="text-4xl font-bold text-brand mb-1">24/7</h3>
                <p className="text-gray-300">Suporte Total</p>
            </div>
          </div>

        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 bg-[#111827] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-2">Escolha seu <span className="text-brand">Plano</span></h2>
            <p className="text-gray-400">Planos flexíveis para todos os perfis. Comece sua transformação hoje mesmo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={plan.id} 
                className={`relative rounded-xl p-6 flex flex-col transition-all duration-300 border ${
                  plan.popular 
                    ? 'bg-[#1f2937] border-brand shadow-2xl shadow-brand/10 transform scale-105 z-10' 
                    : 'bg-[#1f2937] border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg tracking-wider">
                    <Star size={10} fill="currentColor" /> MAIS POPULAR
                  </div>
                )}
                
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-500 text-xs min-h-[32px]">{plan.description}</p>
                    
                    <div className="text-3xl font-bold text-brand mt-4">
                      <span className="text-sm text-gray-500 font-normal mr-1">R$</span> 
                      {plan.price.toFixed(2)}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                </div>
                
                <div className="h-px w-full bg-gray-700 mb-6"></div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((benefit, i) => (
                    <li key={i} className="flex items-start text-gray-400 text-xs">
                      <Check className="w-4 h-4 text-brand mr-2 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handlePlanClick(plan)}
                  disabled={loadingPlanId === plan.id}
                  className={`w-full py-3 rounded text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.popular 
                      ? 'bg-brand hover:bg-brand-dark text-white' 
                      : 'bg-transparent border border-gray-600 text-brand hover:border-brand hover:text-white hover:bg-brand'
                  } ${loadingPlanId === plan.id ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Processando...
                    </>
                  ) : (
                    'Escolher Plano'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-dark-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand rounded-tl-3xl opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-dark-800 border border-dark-700 rounded-br-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="About MonsterHouse" 
                className="rounded-2xl shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div>
              <span className="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">SOBRE NÓS</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 italic">
                A EVOLUÇÃO DO <br/>SEU TREINO
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Na OnzyAcademy, não vendemos apenas acesso a equipamentos. Vendemos um estilo de vida. Nossa metodologia combina treino de alta performance com tecnologia de ponta para garantir que você atinja seus objetivos.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Ambiente climatizado e moderno',
                  'Equipamentos de última geração',
                  'Profissionais qualificados',
                  'Aplicativo exclusivo de acompanhamento'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <div className="bg-brand/20 p-1 rounded-full mr-3">
                      <Check className="w-4 h-4 text-brand" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={onOpenAuth} className="text-brand font-bold hover:text-white flex items-center gap-2 transition-colors">
                Saiba mais sobre nós <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">NOSSO ESPAÇO</span>
            <h2 className="text-4xl font-black text-white italic">CONHEÇA A ONZY</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className={`relative overflow-hidden group rounded-xl ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors z-10"></div>
                <img 
                  src={img} 
                  alt={`Gallery ${index + 1}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venha nos Conhecer Section */}
      <section id="contact" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Venha nos <span className="text-brand">Conhecer</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Estamos prontos para receber você. Faça uma visita e sinta a energia Onzy Academy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Contact Details */}
            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Endereço</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Praça Rui Barbosa, 201<br/>
                    Centro - Maracás, BA<br/>
                    CEP: 45360-000
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">WhatsApp</h3>
                  <p className="text-gray-400">(77) 99999-9999</p>
                  <p className="text-gray-500 text-sm">Respondemos rapidamente</p>
                </div>
              </div>

              {/* Funcionamento */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Funcionamento</h3>
                  <div className="text-gray-400 text-sm space-y-1">
                    <p>Segunda a Sexta: 05:00 - 22:00</p>
                    <p>Sábados: 07:00 - 18:00</p>
                    <p>Domingos: 08:00 - 12:00</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">E-mail</h3>
                  <p className="text-gray-400">contato@onzyacademy.com.br</p>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://wa.me/5577999999999" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-brand hover:bg-brand-dark text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-brand/20"
                >
                  Fale Conosco Agora
                </a>
              </div>
            </div>
            
            {/* Right Column: Map */}
            <div className="h-[500px] w-full bg-dark-800 rounded-3xl overflow-hidden shadow-2xl border border-dark-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.6644026850257!2d-40.43309692497746!3d-13.435728486940026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x747970792120e29%3A0xc391152a5585040e!2sMarac%C3%A1s%20-%20BA!5e0!3m2!1spt-BR!2sbr!4v1709405400000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(1) contrast(1.2)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0f19] pt-16 pb-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Brand & Socials */}
            <div>
              <h3 className="text-2xl font-black text-white italic mb-4">Onzy<span className="text-brand">Academy</span></h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Transformando vidas através do movimento, disciplina e superação. Junte-se à nossa comunidade.
              </p>
              <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all border border-dark-700">
                      <Instagram size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all border border-dark-700">
                      <Facebook size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all border border-dark-700">
                      <Youtube size={20} />
                  </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6">Links Rápidos</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><button onClick={() => scrollTo('root')} className="hover:text-brand transition-colors">Início</button></li>
                <li><button onClick={() => scrollTo('plans')} className="hover:text-brand transition-colors">Planos</button></li>
                <li><button onClick={() => scrollTo('about')} className="hover:text-brand transition-colors">Sobre</button></li>
                <li><button onClick={() => scrollTo('gallery')} className="hover:text-brand transition-colors">Galeria</button></li>
                <li>
                  <button onClick={handlePersonalAccess} className="hover:text-brand transition-colors text-left">
                    Área do Personal
                  </button>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-white font-bold mb-6">Horário de Funcionamento</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex justify-between border-b border-dark-800 pb-2">
                    <span>Segunda a Sexta</span>
                    <span className="text-white">05:00 - 22:00</span>
                </li>
                <li className="flex justify-between border-b border-dark-800 pb-2">
                    <span>Sábado</span>
                    <span className="text-white">08:00 - 18:00</span>
                </li>
                <li className="flex justify-between pt-1">
                    <span>Domingo</span>
                    <span className="text-white">08:00 - 12:00</span>
                </li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-dark-800 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 OnzyAcademy. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
