import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { createProofHash, createRecordId } from '@/services/proof';
import { getSetting, setSetting, getAllRecords, insertRecord, updateRecordStatus, getUserPin, setUserPin } from '@/services/database';
import { syncPendingRecords } from '@/services/sync';
import { hashPin } from '@/services/security';
import { BirthFormData, BirthRecord, RegistryStats } from '@/types/birth';

type BirthRegistryContextValue = {
  agentName: string;
  agentPin: string | null;
  draft?: BirthFormData;
  isOnline: boolean;
  isReady: boolean;
  isSyncing: boolean;
  lastCreated?: BirthRecord;
  records: BirthRecord[];
  stats: RegistryStats;
  addRecord: (payload: BirthFormData) => Promise<BirthRecord>;
  setDraft: (payload: BirthFormData) => void;
  updatePin: (newPin: string) => Promise<void>;
  updateAgentName: (name: string) => Promise<void>;
  syncNow: () => Promise<void>;
  toggleConnection: () => void;
};

const BirthRegistryContext = createContext<BirthRegistryContextValue | null>(null);

export function BirthRegistryProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BirthFormData>();
  const [records, setRecords] = useState<BirthRecord[]>([]);
  const [agentPin, setAgentPin] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('Agent de Terrain');
  const [isReady, setIsReady] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastCreated, setLastCreated] = useState<BirthRecord>();

  const refreshRecords = useCallback(async () => {
    const loaded = await getAllRecords();
    setRecords(loaded);
  }, []);

  const refreshSettings = useCallback(async () => {
    const pin = await getUserPin();
    const name = await getSetting('agent_name');
    setAgentPin(pin);
    if (name) setAgentName(name);
  }, []);

  useEffect(() => {
    async function hydrate() {
      await refreshRecords();
      await refreshSettings();
      setIsReady(true);
    }

    hydrate();
  }, [refreshRecords, refreshSettings]);

  const stats = useMemo(
    () =>
      records.reduce<RegistryStats>(
        (accumulator, record) => {
          accumulator.total += 1;
          if (accumulator.hasOwnProperty(record.status)) {
            accumulator[record.status] += 1;
          }
          return accumulator;
        },
        { total: 0, pending: 0, synced: 0, failed: 0 },
      ),
    [records],
  );

  const addRecord = useCallback(
    async (payload: BirthFormData) => {
      const localSequence = records.length + 1;
      const id = createRecordId(localSequence);
      const record: BirthRecord = {
        ...payload,
        id,
        createdAt: new Date().toISOString(),
        status: 'pending',
        proofHash: createProofHash(payload, id),
      };

      await insertRecord(record);
      await refreshRecords();
      setLastCreated(record);
      setDraft(undefined);
      return record;
    },
    [records.length, refreshRecords],
  );

  const updatePin = useCallback(async (newPin: string) => {
    const hashed = hashPin(newPin);
    await setUserPin(hashed);
    await refreshSettings();
  }, [refreshSettings]);

  const updateAgentName = useCallback(async (name: string) => {
    await setSetting('agent_name', name);
    await refreshSettings();
  }, [refreshSettings]);

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    const nextRecords = await syncPendingRecords(records, isOnline);
    
    for (const record of nextRecords) {
      if (record.status === 'synced') {
        await updateRecordStatus(record.id, 'synced', record.syncedAt);
      }
    }
    
    await refreshRecords();
    setIsSyncing(false);
  }, [isOnline, records, refreshRecords]);

  const value = useMemo(
    () => ({
      agentName,
      agentPin,
      draft,
      isOnline,
      isReady,
      isSyncing,
      lastCreated,
      records,
      stats,
      addRecord,
      setDraft,
      updatePin,
      updateAgentName,
      syncNow,
      toggleConnection: () => setIsOnline((current) => !current),
    }),
    [addRecord, agentName, agentPin, draft, isOnline, isReady, isSyncing, lastCreated, records, stats, syncNow, updatePin, updateAgentName],
  );

  return <BirthRegistryContext.Provider value={value}>{children}</BirthRegistryContext.Provider>;
}

export function useBirthRegistry() {
  const context = useContext(BirthRegistryContext);
  if (!context) {
    throw new Error('useBirthRegistry must be used inside BirthRegistryProvider');
  }

  return context;
}
