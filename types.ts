export interface Punch {
  id: string;
  type: 'in' | 'out';
  timestamp: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  punches: Punch[];
  totalHours: number;
  overtimeHours: number;
  breakHours: number;
}

export interface TimeBankEntry {
  date: string; // YYYY-MM-DD
  hours: number;
  reason: string;
}

export interface Settings {
  workDayHours: number;
  breakHours: number;
}
