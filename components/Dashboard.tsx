import React, { useState } from 'react';
import Navbar from './Navbar';
import PunchClock from './PunchClock';
import TimeBank from './TimeBank';
import Reports from './Reports';
import Settings from './Settings';

type View = 'punch' | 'bank' | 'reports' | 'settings';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<View>('punch');

  const renderView = () => {
    switch (activeView) {
      case 'punch':
        return <PunchClock />;
      case 'bank':
        return <TimeBank />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <PunchClock />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-xl font-bold text-indigo-600">Ponto Certo</h1>
                <button 
                  onClick={onLogout}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-500 transition-colors"
                >
                  Sair
                </button>
            </div>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 mb-20">
        <div className="max-w-4xl mx-auto">
          {renderView()}
        </div>
      </main>
      <Navbar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default Dashboard;
