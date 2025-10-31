import { DailyRecord, TimeBankEntry, Settings } from '../types';

const DAILY_RECORDS_KEY = 'dailyRecords';
const TIME_BANK_ENTRIES_KEY = 'timeBankEntries';
const SETTINGS_KEY = 'pontoCertoSettings';

export const getDailyRecords = (): DailyRecord[] => {
  const data = localStorage.getItem(DAILY_RECORDS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDailyRecords = (records: DailyRecord[]) => {
  localStorage.setItem(DAILY_RECORDS_KEY, JSON.stringify(records));
};

export const getTimeBankEntries = (): TimeBankEntry[] => {
  const data = localStorage.getItem(TIME_BANK_ENTRIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTimeBankEntries = (entries: TimeBankEntry[]) => {
  localStorage.setItem(TIME_BANK_ENTRIES_KEY, JSON.stringify(entries));
};

export const getSettings = (): Settings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  const defaultSettings: Settings = { workDayHours: 8, breakHours: 1 };
  return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
};

export const saveSettings = (settings: Settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
