import React, { useState, useMemo } from 'react';
import { getDailyRecords } from '../services/storageService';
import { getSettings } from '../services/storageService';
import BarChart from './BarChart';

const Reports: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const settings = useMemo(() => getSettings(), []);

  const allRecords = useMemo(() => getDailyRecords(), []);

  const { monthlySummary, chartData, maxHours } = useMemo(() => {
    const records = allRecords.filter(record => {
      const recordDate = new Date(record.date);
      // Adjust for UTC date issues from storage
      const utcRecordDate = new Date(recordDate.getUTCFullYear(), recordDate.getUTCMonth(), recordDate.getUTCDate());
      return utcRecordDate.getMonth() === currentMonth && utcRecordDate.getFullYear() === currentYear;
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const data = [];
    let totalHours = 0;
    let totalOvertime = 0;
    let totalExpectedHours = 0;
    let max = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(currentYear, currentMonth, day));
        const dateString = date.toISOString().split('T')[0];
        const record = records.find(r => r.date === dateString);

        const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
        if (!isWeekend) {
            totalExpectedHours += settings.workDayHours;
        }

        const workedHours = record?.totalHours || 0;
        const overtime = record?.overtimeHours || 0;
        const regularHours = workedHours - overtime;
        
        totalHours += workedHours;
        totalOvertime += overtime;

        if (workedHours > max) {
            max = workedHours;
        }

        data.push({
            day,
            totalHours: workedHours,
            regularHours: regularHours,
            overtimeHours: overtime
        });
    }
    
    const balance = totalHours - totalExpectedHours;

    return {
        monthlySummary: { totalHours, overtimeHours: totalOvertime, balance },
        chartData: data,
        maxHours: Math.max(max, settings.workDayHours, 1)
    };
  }, [allRecords, currentMonth, currentYear, settings]);

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentYear, currentMonth + delta, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };
  
  const formatHourDuration = (hours: number, showSign = false) => {
    const isNegative = hours < 0;
    const absHours = Math.abs(hours);
    const h = Math.floor(absHours);
    const m = Math.round((absHours - h) * 60);
    const sign = isNegative ? '-' : (showSign ? '+' : '');
    return `${sign}${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
  };
  
  const monthName = new Date(currentYear, currentMonth).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-lg font-semibold capitalize text-center text-slate-800">{monthName}</h2>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-slate-50/70 rounded-lg">
            <p className="text-sm text-slate-500">Total de Horas</p>
            <p className="text-2xl font-bold text-indigo-600">{formatHourDuration(monthlySummary.totalHours)}</p>
          </div>
          <div className="p-4 bg-slate-50/70 rounded-lg">
            <p className="text-sm text-slate-500">Horas Extras</p>
            <p className="text-2xl font-bold text-green-600">{formatHourDuration(monthlySummary.overtimeHours)}</p>
          </div>
          <div className="p-4 bg-slate-50/70 rounded-lg">
            <p className="text-sm text-slate-500">Saldo do Mês</p>
            <p className={`text-2xl font-bold ${monthlySummary.balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{formatHourDuration(monthlySummary.balance, true)}</p>
          </div>
        </div>

        <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-700 mb-2">Desempenho Diário</h3>
            <BarChart data={chartData} maxHours={maxHours} workDayHours={settings.workDayHours} />
        </div>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Registros Detalhados</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {chartData.filter(d => d.totalHours > 0).length > 0 ? (
            chartData
              .filter(d => d.totalHours > 0)
              .sort((a,b) => a.day - b.day)
              .map(data => (
                <div key={data.day} className="grid grid-cols-3 items-center p-3 text-sm bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">{new Date(currentYear, currentMonth, data.day).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', weekday: 'short' })}</span>
                  <span className="text-center font-mono text-slate-800">{formatHourDuration(data.totalHours)}</span>
                  <span className="text-right font-mono text-green-600">{formatHourDuration(data.overtimeHours)}</span>
                </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">Nenhum registro para este mês.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;