import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTime } from '../hooks/useTime';
import { getDailyRecords, saveDailyRecords, getTimeBankEntries, saveTimeBankEntries, getSettings } from '../services/storageService';
import { Punch, DailyRecord, Settings } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import PunchModal from './PunchModal';

const calculateMetrics = (punches: Punch[], settings: Settings) => {
  let totalWorkMillis = 0;
  let totalBreakMillis = 0;

  const sortedPunches = [...punches].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  for (let i = 0; i < sortedPunches.length; i++) {
    const currentPunch = sortedPunches[i];
    const nextPunch = sortedPunches[i + 1];

    if (currentPunch.type === 'in' && nextPunch && nextPunch.type === 'out') {
      totalWorkMillis += new Date(nextPunch.timestamp).getTime() - new Date(currentPunch.timestamp).getTime();
    }
    
    if (currentPunch.type === 'out' && nextPunch && nextPunch.type === 'in') {
      totalBreakMillis += new Date(nextPunch.timestamp).getTime() - new Date(currentPunch.timestamp).getTime();
    }
  }

  const totalHours = totalWorkMillis / (1000 * 60 * 60);
  const breakHours = totalBreakMillis / (1000 * 60 * 60);
  const overtimeHours = Math.max(0, totalHours - settings.workDayHours);

  return { totalHours, breakHours, overtimeHours };
};

const PunchClock: React.FC = () => {
  const now = useTime();
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [modal, setModal] = useState<{ isOpen: boolean; punch?: Punch }>({ isOpen: false });
  const todayDateString = now.toISOString().split('T')[0];

  const updateRecords = useCallback((updatedRecord: DailyRecord) => {
    setTodayRecord(updatedRecord);
    const allRecords = getDailyRecords();
    const recordIndex = allRecords.findIndex(r => r.date === todayDateString);
    if (recordIndex > -1) {
      allRecords[recordIndex] = updatedRecord;
    } else {
      allRecords.push(updatedRecord);
    }
    saveDailyRecords(allRecords);
  }, [todayDateString]);

  useEffect(() => {
    setSettings(getSettings());
    const records = getDailyRecords();
    const foundRecord = records.find(r => r.date === todayDateString);
    if (foundRecord) {
      const punchesWithIds = foundRecord.punches.map(p => ({...p, id: p.id || crypto.randomUUID()}));
      const metrics = calculateMetrics(punchesWithIds, settings);
      setTodayRecord({...foundRecord, punches: punchesWithIds, ...metrics});
    } else {
      setTodayRecord({ date: todayDateString, punches: [], totalHours: 0, overtimeHours: 0, breakHours: 0 });
    }
  }, [todayDateString, settings.workDayHours, settings.breakHours]);


  const handlePunch = (type: 'in' | 'out') => {
    const newPunch: Punch = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
    };

    const punches = [...(todayRecord?.punches || []), newPunch];
    const metrics = calculateMetrics(punches, settings);
    const updatedRecord = { ...todayRecord!, punches, ...metrics };
    
    updateRecords(updatedRecord);
  };

  const handleSavePunch = (timestamp: string, punchId?: string) => {
    let punches = [...(todayRecord?.punches || [])];
    if (punchId) {
      punches = punches.map(p => p.id === punchId ? { ...p, timestamp } : p);
    } else {
      const newPunch: Punch = {
        id: crypto.randomUUID(),
        type: (punches.length > 0 && punches[punches.length - 1].type === 'in') ? 'out' : 'in',
        timestamp,
      };
      punches.push(newPunch);
    }
    const sortedPunches = punches.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const metrics = calculateMetrics(sortedPunches, settings);
    updateRecords({ ...todayRecord!, punches: sortedPunches, ...metrics });
    setModal({ isOpen: false });
  };

  const handleDeletePunch = (punchId: string) => {
    const punches = todayRecord?.punches.filter(p => p.id !== punchId) || [];
    const metrics = calculateMetrics(punches, settings);
    updateRecords({ ...todayRecord!, punches, ...metrics });
  };
  
  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const formatHourDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
  };

  const { status, nextAction, predictedExit } = useMemo(() => {
    const punches = todayRecord?.punches || [];
    if (punches.length === 0) {
      return { status: 'Fora do expediente', nextAction: { label: 'Iniciar Jornada', type: 'in' }, predictedExit: null };
    }

    const lastPunch = punches[punches.length - 1];
    const firstPunchTime = new Date(punches[0].timestamp).getTime();
    const exitTime = firstPunchTime + (settings.workDayHours + settings.breakHours) * 60 * 60 * 1000;
    const predictedExit = new Date(exitTime);

    if (lastPunch.type === 'in') {
      return { status: 'Trabalhando', nextAction: { label: 'Iniciar Pausa', type: 'out' }, predictedExit };
    } else {
      return { status: 'Em pausa', nextAction: { label: 'Finalizar Pausa', type: 'in' }, predictedExit };
    }
  }, [todayRecord, settings]);

  const punches = todayRecord?.punches || [];
  const lastPunch = punches.length > 0 ? punches[punches.length - 1] : null;

  return (
    <div className="space-y-6">
      <div className="text-center bg-white p-6 rounded-2xl shadow-md">
        <p className="font-medium text-slate-500">{formatDate(now)}</p>
        <p className="text-5xl font-bold tracking-tight text-slate-800">{formatTime(now)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-sm font-medium text-slate-500">Trabalhado hoje</p>
            <p className="text-2xl font-bold text-indigo-600">{formatHourDuration(todayRecord?.totalHours || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-sm font-medium text-slate-500">Previsão de Saída</p>
            <p className="text-2xl font-bold text-slate-800">{predictedExit ? formatTime(predictedExit) : '--:--'}</p>
        </div>
      </div>

      <div className="text-center space-y-3">
        {punches.length === 0 ? (
          <button onClick={() => handlePunch('in')} className="w-full max-w-xs mx-auto text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 bg-indigo-600 hover:bg-indigo-700">Iniciar Jornada</button>
        ) : (
          <div className="flex gap-4 justify-center">
             <button onClick={() => handlePunch(lastPunch?.type === 'in' ? 'out' : 'in')} className={`w-full text-white font-bold py-3 px-6 rounded-full shadow-lg ${lastPunch?.type === 'in' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}>{lastPunch?.type === 'in' ? 'Iniciar Pausa' : 'Finalizar Pausa'}</button>
             <button onClick={() => handlePunch('out')} className="w-full text-white font-bold py-3 px-6 rounded-full shadow-lg bg-red-500 hover:bg-red-600">Encerrar Jornada</button>
          </div>
        )}
        <p className="text-sm text-slate-500">Status: {status}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Registros de Hoje</h2>
          <button onClick={() => setModal({ isOpen: true })} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
            <PlusIcon className="w-5 h-5" /> Adicionar
          </button>
        </div>
        {punches.length > 0 ? (
          <div className="space-y-3">
            {punches.map((punch) => (
              <div key={punch.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                <span className={`font-semibold ${punch.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {punch.type === 'in' ? 'Entrada' : 'Saída'}
                </span>
                <span className="font-mono text-slate-700">{formatTime(new Date(punch.timestamp))}</span>
                <div className="flex gap-2">
                  <button onClick={() => setModal({ isOpen: true, punch })} className="text-slate-500 hover:text-indigo-600"><EditIcon className="w-4 h-4" /></button>
                  <button onClick={() => handleDeletePunch(punch.id)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-4">Nenhum registro hoje.</p>
        )}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between font-semibold">
            <span>Intervalo:</span>
            <span>{formatHourDuration(todayRecord?.breakHours || 0)}</span>
        </div>
        <div className="mt-2 flex justify-between font-semibold">
            <span>Total Trabalhado:</span>
            <span>{formatHourDuration(todayRecord?.totalHours || 0)}</span>
        </div>
      </div>
      {modal.isOpen && <PunchModal onClose={() => setModal({ isOpen: false })} onSave={handleSavePunch} punch={modal.punch} />}
    </div>
  );
};

export default PunchClock;
