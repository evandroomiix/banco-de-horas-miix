import React, { useState } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import GoogleLoginModal from './GoogleLoginModal';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-sm mx-auto text-center">
          <h1 className="text-4xl font-bold text-indigo-600">Ponto Certo</h1>
          <p className="mt-2 text-slate-500">Seu gerenciador de horas de trabalho.</p>
          
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800">Acesse sua conta</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use sua conta Google para acessar e sincronizar seus dados de forma segura.
            </p>
            <button
              onClick={handleLoginClick}
              className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
              aria-haspopup="dialog"
            >
              <GoogleIcon className="w-6 h-6" />
              <span>Entrar com Google</span>
            </button>
          </div>
          <p className="mt-8 text-xs text-slate-400">
            © {new Date().getFullYear()} Ponto Certo. Todos os direitos reservados.
          </p>
        </div>
      </div>
      {isModalOpen && <GoogleLoginModal onLogin={onLogin} onClose={handleCloseModal} />}
    </>
  );
};

export default Login;
