import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/5577999999999"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 hover:rotate-6 flex items-center justify-center group"
      aria-label="Fale conosco no WhatsApp"
    >
      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping-slow"></div>
      <MessageCircle size={32} fill="white" className="text-transparent" />
      <span className="absolute right-full mr-4 bg-white text-dark-900 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale conosco
      </span>
    </a>
  );
};

export default WhatsAppFloat;