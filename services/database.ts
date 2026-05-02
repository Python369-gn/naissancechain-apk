import { BirthRecord, SyncStatus } from '@/types/birth';

const WEB_STORAGE_KEY = 'naissancechain_records';
const WEB_SETTINGS_KEY = 'naissancechain_settings';

function getWebRecords(): BirthRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(WEB_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveWebRecords(records: BirthRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(records));
}

function getWebSetting(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const settings = JSON.parse(localStorage.getItem(WEB_SETTINGS_KEY) || '{}');
  return settings[key] || null;
}

function setWebSetting(key: string, value: string) {
  if (typeof window === 'undefined') return;
  const settings = JSON.parse(localStorage.getItem(WEB_SETTINGS_KEY) || '{}');
  settings[key] = value;
  localStorage.setItem(WEB_SETTINGS_KEY, JSON.stringify(settings));
}

function getWebUserPin(): string | null {
  if (typeof window === 'undefined') return null;
  const users = JSON.parse(localStorage.getItem('naissancechain_users') || '[]');
  return users[0]?.pin || null;
}

function setWebUserPin(pin: string) {
  if (typeof window === 'undefined') return;
  const users = [{ id: 1, pin, sync_status: 0, last_updated: new Date().toISOString() }];
  localStorage.setItem('naissancechain_users', JSON.stringify(users));
}

export async function initDatabase() {
  return null;
}

export async function getUserPin(): Promise<string | null> {
  return getWebUserPin();
}

export async function setUserPin(pin: string) {
  setWebUserPin(pin);
}

export async function getSetting(key: string): Promise<string | null> {
  return getWebSetting(key);
}

export async function setSetting(key: string, value: string) {
  setWebSetting(key, value);
}

export async function insertRecord(record: BirthRecord) {
  const records = getWebRecords();
  saveWebRecords([record, ...records]);
}

export async function getAllRecords(): Promise<BirthRecord[]> {
  return getWebRecords();
}

export async function updateRecordStatus(id: string, status: SyncStatus, syncedAt?: string) {
  const records = getWebRecords();
  const updated = records.map(r => r.id === id ? { ...r, status, syncedAt } : r);
  saveWebRecords(updated);
}

export async function deleteDatabase() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WEB_STORAGE_KEY);
}
