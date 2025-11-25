import React from 'react';
import { ArrowRight, Check, Trophy, Users, Zap, Clock, MapPin, Phone, Mail, ChevronRight, Star, Instagram, Facebook } from 'lucide-react';
import { Plan } from '../types';

interface HomeProps {
  onOpenAuth: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenAuth }) => {
  const plans: Plan[] = [
    { id: '1', name: 'Mensal', price: 90, description: '3x por semana', stripePriceId: 'price_1' },
    { id: '2', name: 'Mensal Livre', price: 120, description: 'Acesso total', stripePriceId: 'price_2' },
    { id: '3', name: 'Semestral Livre', price: 110, description: '6 meses de fidelidade', stripePriceId: 'price_3' },
  ];

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
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Gym Background" 
            className="w-full h-full object-cover animate-pulse-slow"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-brand rounded-full"></div>
              <span className="text-brand font-bold tracking-widest uppercase text-sm">Bem-vindo à MonsterHouse</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight italic">
              CONSTRUA A SUA <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">MELHOR VERSÃO</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Mais do que uma academia, somos um centro de treinamento focado em resultados reais. Estrutura completa e profissionais dedicados a você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onOpenAuth}
                className="px-8 py-4 bg-brand hover:bg-brand-dark text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand/30 hover:shadow-brand/50"
              >
                COMEÇAR AGORA
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#plans"
                className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center"
              >
                CONHECER PLANOS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <section className="bg-brand py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Trophy size={400} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4">
              <Trophy className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white mb-1">GAMIFICAÇÃO</h3>
              <p className="text-white/80">Ganhe pontos e conquistas treinando</p>
            </div>
            <div className="p-4">
              <Users className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white mb-1">+1000</h3>
              <p className="text-white/80">Alunos transformados</p>
            </div>
            <div className="p-4">
              <Zap className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white mb-1">APP EXCLUSIVO</h3>
              <p className="text-white/80">Acompanhe seus treinos online</p>
            </div>
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
                Na MonsterHouse, não vendemos apenas acesso a equipamentos. Vendemos um estilo de vida. Nossa metodologia combina treino de alta performance com tecnologia de ponta para garantir que você atinja seus objetivos.
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
            <h2 className="text-4xl font-black text-white italic">CONHEÇA A MONSTERHOUSE</h2>
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

      {/* Plans Section */}
      <section id="plans" className="py-24 bg-dark-900 relative overflow-hidden">
        {/* Decorative bg elements */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">PLANOS E PREÇOS</span>
            <h2 className="text-4xl font-black text-white italic">INVESTIMENTO NA SUA SAÚDE</h2>
            <p className="text-gray-400 mt-4">Escolha o plano ideal para seus objetivos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={plan.id} 
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  index === 2 
                    ? 'bg-dark-800 border-2 border-brand shadow-2xl shadow-brand/10 scale-105 z-10' 
                    : 'bg-dark-800/50 border border-dark-700 hover:border-dark-600'
                }`}
              >
                {index === 2 && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={12} fill="currentColor" /> MAIS POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                <div className="text-4xl font-black text-white mb-6">
                  <span className="text-lg text-gray-500 font-normal">R$</span> 
                  {plan.price}
                  <span className="text-lg text-gray-500 font-normal">/mês</span>
                </div>

                <div className="h-px w-full bg-dark-700 mb-6"></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    'Acesso à área de musculação',
                    index > 0 ? 'Acesso todos os dias' : 'Acesso 3x na semana',
                    'Avaliação física inicial',
                    index === 2 ? 'App de treino incluso' : 'Ficha de treino impressa',
                    index === 2 ? 'Direito a trancar 30 dias' : null
                  ].filter(Boolean).map((benefit, i) => (
                    <li key={i} className="flex items-start text-gray-300 text-sm">
                      <Check className="w-5 h-5 text-brand mr-3 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={onOpenAuth}
                  className={`w-full py-4 rounded-lg font-bold uppercase tracking-wide transition-all ${
                    index === 2 
                      ? 'bg-brand hover:bg-brand-dark text-white shadow-lg shadow-brand/20' 
                      : 'bg-dark-700 hover:bg-dark-600 text-white'
                  }`}
                >
                  ESCOLHER PLANO
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 rounded-3xl overflow-hidden bg-dark-900 shadow-2xl border border-dark-700">
            <div className="p-12">
              <span className="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">FALE CONOSCO</span>
              <h2 className="text-3xl font-black text-white mb-8 italic">ENTRE EM CONTATO</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                    <MapPin className="text-brand w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Localização</h3>
                    <p className="text-gray-400">Praça Rui Barbosa, 201<br/>Maracás, BA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                    <Phone className="text-brand w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Telefone</h3>
                    <p className="text-gray-400">(77) 99999-9999</p>
                    <p className="text-gray-500 text-sm mt-1">Atendimento via WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                    <Mail className="text-brand w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Email</h3>
                    <p className="text-gray-400">contato@monsterhouse.com.br</p>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-dark-700">
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all">
                            <Facebook size={20} />
                        </a>
                    </div>
                </div>
              </div>
            </div>
            
            <div className="relative min-h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.6644026850257!2d-40.43309692497746!3d-13.435728486940026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x747970792120e29%3A0xc391152a5585040e!2sMarac%C3%A1s%20-%20BA!5e0!3m2!1spt-BR!2sbr!4v1709405400000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(1) contrast(1.2)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 pt-16 pb-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black text-white italic mb-6">MONSTER<span className="text-brand">HOUSE</span></h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Transformando vidas através do movimento, disciplina e superação. Junte-se à nossa comunidade.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Links Rápidos</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-brand transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-brand transition-colors">Sobre</a></li>
                <li><a href="#plans" className="hover:text-brand transition-colors">Planos</a></li>
                <li><a href="#contact" className="hover:text-brand transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Horário de Funcionamento</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex justify-between">
                    <span>Segunda a Sexta</span>
                    <span className="text-white">05:00 - 22:00</span>
                </li>
                <li className="flex justify-between">
                    <span>Sábado</span>
                    <span className="text-white">08:00 - 16:00</span>
                </li>
                <li className="flex justify-between">
                    <span>Domingo</span>
                    <span className="text-brand">Fechado</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Newsletter</h4>
              <p className="text-gray-500 text-sm mb-4">Receba dicas de treino e novidades.</p>
              <div className="flex">
                <input 
                    type="email" 
                    placeholder="Seu email" 
                    className="bg-dark-800 border border-dark-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:border-brand w-full"
                />
                <button className="bg-brand hover:bg-brand-dark px-4 py-2 rounded-r-lg text-white transition-colors">
                    <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-dark-800 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 MonsterHouse Academy. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;