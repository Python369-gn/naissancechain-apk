export type SyncStatus = 'pending' | 'synced' | 'failed';

export type BirthRecord = {
  id: string;
  childFirstName: string;
  childLastName: string;
  sex: 'Masculin' | 'Féminin';
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  fatherName: string;
  motherName: string;
  address: string;
  healthCenter: string;
  agentName: string;
  createdAt: string;
  syncedAt?: string;
  status: SyncStatus;
  proofHash: string;
};

export type BirthFormData = Omit<BirthRecord, 'id' | 'createdAt' | 'syncedAt' | 'status' | 'proofHash'>;

export type RegistryStats = {
  total: number;
  pending: number;
  synced: number;
  failed: number;
};
