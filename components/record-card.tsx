import { StyleSheet, Text, View } from 'react-native';

import { NaissanceTheme } from '@/constants/theme';
import { BirthRecord } from '@/types/birth';

export function RecordCard({ record }: { record: BirthRecord }) {
  const isSynced = record.status === 'synced';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.name}>
            {record.childFirstName} {record.childLastName}
          </Text>
          <Text style={styles.meta}>{record.id}</Text>
        </View>
        <View style={[styles.badge, isSynced ? styles.synced : styles.pending]}>
          <Text style={[styles.badgeText, isSynced ? styles.syncedText : styles.pendingText]}>
            {isSynced ? 'Synchronisé' : 'En attente'}
          </Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.detail}>Naissance: {record.birthDate}</Text>
        <Text style={styles.detail}>Lieu: {record.birthPlace}</Text>
        <Text style={styles.detail}>Centre: {record.healthCenter}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 649,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    backgroundColor: NaissanceTheme.paper,
    borderColor: NaissanceTheme.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 9,
    padding: 10,
  },
  detail: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  details: {
    gap: 12,
  },
  meta: {
    color: NaissanceTheme.green,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  name: {
    color: NaissanceTheme.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  pending: {
    backgroundColor: NaissanceTheme.goldSoft,
  },
  pendingText: {
    color: NaissanceTheme.warning,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  synced: {
    backgroundColor: NaissanceTheme.greenSoft,
  },
  syncedText: {
    color: NaissanceTheme.green,
  },
});
