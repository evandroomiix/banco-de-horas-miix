
import React, { useState, useEffect, useMemo } from 'react';
import { getTimeBankEntries } from '../services/storageService';
import { TimeBankEntry } from '../types';

const TimeBank: React.FC = () => {
  const [entries, setEntries] = useState<TimeBankEntry[]>([]);

  useEffect(() => {
    setEntries(getTimeBankEntries());
  }, []);

  const totalBalance = useMemo(() => {
    return entries.reduce((acc, entry) => acc + entry.hours, 0);
  }, [entries]);
  
  const formatHourDuration = (hours: number) => {
    const isNegative = hours < 0;
    const absHours = Math.abs(hours);
    const h = Math.floor(absHours);
    const m = Math.round((absHours - h) * 60);
    return `${isNegative ? '-' : ''}${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
  };

  const balanceColor = totalBalance >= 0 ? 'text-green-600' : 'text-red-500';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-lg font-semibold text-slate-800">Saldo do Banco de Horas</h2>
        <p className={`text-4xl font-bold mt-2 ${balanceColor}`}>{formatHourDuration(totalBalance)}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Histórico de Movimentações</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.length > 0 ? (
            [...entries].reverse().map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-700">{entry.reason}</p>
                  <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`font-semibold font-mono ${entry.hours >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {entry.hours >= 0 ? '+' : ''}{formatHourDuration(entry.hours)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">Nenhuma movimentação no banco de horas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeBank;
