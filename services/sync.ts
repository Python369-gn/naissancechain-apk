import { BirthRecord } from '@/types/birth';

const sleep = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

export async function syncPendingRecords(records: BirthRecord[], online: boolean) {
  if (!online) {
    return records;
  }

  const now = new Date().toISOString();
  await sleep(700);

  return records.map((record) => {
    if (record.status !== 'pending' && record.status !== 'failed') {
      return record;
    }

    return {
      ...record,
      status: 'synced' as const,
      syncedAt: now,
    };
  });
}
