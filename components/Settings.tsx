import React, { useState } from 'react';
import { getSettings, saveSettings } from '../services/storageService';
import { Settings } from '../types';

const SettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow decimal input
    const parsedValue = parseFloat(value);
    setSettings(prev => ({ 
      ...prev, 
      [name]: isNaN(parsedValue) ? prev[name as keyof Settings] : parsedValue 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const hoursToHHMM = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };
  
  const HHMMToHours = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h + (m / 60);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Ajustes da Jornada</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="workDayHours" className="block text-sm font-medium text-slate-700">
              Carga horária diária
            </label>
            <input
              type="time"
              id="workDayHours"
              name="workDayHours"
              value={hoursToHHMM(settings.workDayHours)}
              onChange={(e) => setSettings(prev => ({ ...prev, workDayHours: HHMMToHours(e.target.value) }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
             <p className="mt-2 text-xs text-slate-500">Total de horas que você deve trabalhar por dia.</p>
          </div>
          <div>
            <label htmlFor="breakHours" className="block text-sm font-medium text-slate-700">
              Intervalo padrão
            </label>
            <input
              type="time"
              id="breakHours"
              name="breakHours"
              value={hoursToHHMM(settings.breakHours)}
              onChange={(e) => setSettings(prev => ({ ...prev, breakHours: HHMMToHours(e.target.value) }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-2 text-xs text-slate-500">Tempo de intervalo padrão (almoço, etc.).</p>
          </div>

          <div className="flex items-center justify-end">
             {saved && <span className="text-sm text-green-600 mr-4">Configurações salvas!</span>}
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsComponent;
