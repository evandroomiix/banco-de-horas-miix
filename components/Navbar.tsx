import React from 'react';
import { ClockIcon } from './icons/ClockIcon';
import { BankIcon } from './icons/BankIcon';
import { ChartIcon } from './icons/ChartIcon';
import { SettingsIcon } from './icons/SettingsIcon';

type View = 'punch' | 'bank' | 'reports' | 'settings';

interface NavbarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-indigo-600';
  const inactiveClasses = 'text-slate-500 hover:text-indigo-500';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-full transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-t border-slate-200 grid grid-cols-4 items-center justify-around md:hidden">
      <NavItem
        label="Registrar"
        icon={<ClockIcon className="w-6 h-6" />}
        isActive={activeView === 'punch'}
        onClick={() => setActiveView('punch')}
      />
      <NavItem
        label="Banco"
        icon={<BankIcon className="w-6 h-6" />}
        isActive={activeView === 'bank'}
        onClick={() => setActiveView('bank')}
      />
      <NavItem
        label="Relatórios"
        icon={<ChartIcon className="w-6 h-6" />}
        isActive={activeView === 'reports'}
        onClick={() => setActiveView('reports')}
      />
      <NavItem
        label="Ajustes"
        icon={<SettingsIcon className="w-6 h-6" />}
        isActive={activeView === 'settings'}
        onClick={() => setActiveView('settings')}
      />
    </nav>
  );
};

export default Navbar;
