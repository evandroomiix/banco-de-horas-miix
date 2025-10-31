import React, { useState } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { UserIcon } from './icons/UserIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface GoogleLoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

const FakeUser = ({ name, email, onSelect }: { name: string, email: string, onSelect: () => void }) => (
  <li
    onClick={onSelect}
    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
    role="button"
  >
    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
      <UserIcon className="w-6 h-6" />
    </div>
    <div>
      <p className="font-medium text-slate-800">{name}</p>
      <p className="text-sm text-slate-500">{email}</p>
    </div>
  </li>
);

const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ onLogin, onClose }) => {
  const [view, setView] = useState<'list' | 'email' | 'password'>('list');
  const [email, setEmail] = useState('');

  const handleSelectUser = () => {
    onLogin();
    onClose();
  };
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const enteredEmail = formData.get('email') as string;
    if (enteredEmail) {
      setEmail(enteredEmail);
      setView('password');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSelectUser();
  };

  const renderListView = () => (
    <>
      <div className="p-6 border-b border-slate-200 text-center">
        <GoogleIcon className="w-8 h-8 mx-auto mb-2" />
        <h2 id="google-login-title" className="text-xl font-semibold text-slate-800">Escolha uma conta</h2>
        <p className="text-sm text-slate-500 mt-1">para continuar em <span className="font-medium">Ponto Certo</span></p>
      </div>
      <div className="p-2">
        <ul className="divide-y divide-slate-200">
          <FakeUser name="Maria Silva" email="maria.silva@example.com" onSelect={handleSelectUser} />
          <FakeUser name="João Pereira" email="joao.p@example.com" onSelect={handleSelectUser} />
        </ul>
      </div>
      <div className="p-2 border-b border-slate-200">
          <div 
              onClick={() => setView('email')}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              role="button"
          >
              <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-500">
                  <UserIcon className="w-6 h-6" />
              </div>
              <div>
                  <p className="font-medium text-slate-800">Usar outra conta</p>
              </div>
          </div>
      </div>
      <div className="p-6 text-center text-xs text-slate-500">
          <p>Para continuar, o Google compartilhará seu nome, endereço de e-mail e foto do perfil com o Ponto Certo. Antes de usar este app, consulte a <a href="#" className="text-indigo-600 hover:underline">política de privacidade</a> e os <a href="#" className="text-indigo-600 hover:underline">termos de serviço</a>.</p>
      </div>
    </>
  );

  const renderEmailView = () => (
    <div className="p-8">
       <button onClick={() => setView('list')} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      <div className="text-center">
        <GoogleIcon className="w-8 h-8 mx-auto mb-2" />
        <h2 className="text-2xl font-semibold text-slate-800">Fazer login</h2>
        <p className="text-sm text-slate-500 mt-1">Use sua Conta Google</p>
      </div>
      <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
        <div>
           <input 
            id="email" 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            autoFocus
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="E-mail ou telefone"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Próxima
          </button>
        </div>
      </form>
    </div>
  );

  const renderPasswordView = () => (
     <div className="p-8">
        <button onClick={() => setView('email')} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      <div className="text-center">
        <GoogleIcon className="w-8 h-8 mx-auto mb-2" />
        <h2 className="text-2xl font-semibold text-slate-800">Bem-vindo</h2>
        <div className="mt-2 text-sm text-slate-500 border border-slate-300 rounded-full inline-flex items-center px-3 py-1">
          <UserIcon className="w-4 h-4 mr-2 text-slate-400" />
          {email}
        </div>
      </div>
      <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
        <div>
           <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            autoFocus
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Digite sua senha"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Próxima
          </button>
        </div>
      </form>
    </div>
  );


  const renderContent = () => {
    switch(view) {
      case 'email':
        return renderEmailView();
      case 'password':
        return renderPasswordView();
      case 'list':
      default:
        return renderListView();
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-login-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default GoogleLoginModal;
