
import React, { useState } from 'react';
import { X, Copy, CheckCircle, QrCode, Loader2 } from 'lucide-react';

interface PixModalProps {
  onClose: () => void;
}

const PixModal: React.FC<PixModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [paid, setPaid] = useState(false);

  const pixKey = "00020126580014BR.GOV.BCB.PIX0136a1f2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6520400005303986540510.005802BR5925MonsterHouse Academy6009SAO PAULO62070503***6304E2CA";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setSimulating(true);
    // Simula verificação do banco
    setTimeout(() => {
        setSimulating(false);
        setPaid(true);
        // Em produção real, aqui chamariamos uma função para atualizar o status no banco
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-800 rounded-2xl w-full max-w-md overflow-hidden border border-dark-700 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
        
        <div className="p-8 text-center">
            {!paid ? (
                <>
                    <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="text-brand w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pagamento via PIX</h2>
                    <p className="text-gray-400 text-sm mb-6">Escaneie o QR Code ou copie a chave abaixo para liberar seu acesso instantaneamente.</p>
                    
                    <div className="bg-white p-4 rounded-xl mb-6 mx-auto w-48 h-48 flex items-center justify-center">
                        {/* Placeholder QR Code */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="w-full h-full" />
                    </div>

                    <div className="bg-dark-900 border border-dark-600 rounded-lg p-3 flex items-center gap-2 mb-6">
                        <input type="text" readOnly value={pixKey} className="bg-transparent text-gray-400 text-xs flex-1 outline-none truncate" />
                        <button onClick={handleCopy} className="text-brand hover:text-white transition-colors">
                            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                        </button>
                    </div>

                    <button 
                        onClick={simulatePayment}
                        disabled={simulating}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {simulating ? <><Loader2 className="animate-spin" size={20} /> Verificando...</> : 'Já fiz o pagamento'}
                    </button>
                </>
            ) : (
                <div className="py-10 animate-fade-in">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-500 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pagamento Aprovado!</h2>
                    <p className="text-gray-400 mb-6">Seu acesso foi liberado. Bem-vindo!</p>
                    <button onClick={onClose} className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg">
                        Começar a Treinar
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PixModal;
