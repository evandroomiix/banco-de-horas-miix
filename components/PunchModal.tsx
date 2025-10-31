import React, { useState } from 'react';
import { Punch } from '../types';

interface PunchModalProps {
  onClose: () => void;
  onSave: (timestamp: string, punchId?: string) => void;
  punch?: Punch;
}

const PunchModal: React.FC<PunchModalProps> = ({ onClose, onSave, punch }) => {
  const getInitialTime = () => {
    const date = punch ? new Date(punch.timestamp) : new Date();
    return date.toTimeString().slice(0, 5);
  };
  
  const [time, setTime] = useState(getInitialTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = punch ? new Date(punch.timestamp) : new Date();
    newDate.setHours(hours, minutes, 0, 0);
    onSave(newDate.toISOString(), punch?.id);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{punch ? 'Editar Ponto' : 'Adicionar Ponto'}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="time-input" className="block text-sm font-medium text-slate-700 mb-2">
            Horário
          </label>
          <input
            id="time-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            autoFocus
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PunchModal;
