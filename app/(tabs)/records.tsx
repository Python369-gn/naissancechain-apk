import { StyleSheet, Text, View } from 'react-native';

import { RecordCard } from '@/components/record-card';
import { Screen } from '@/components/screen';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';

export default function RecordsScreen() {
  const { records } = useBirthRegistry();

  return (
    <Screen title="Dossiers" subtitle="Tous les actes créés localement sur cet appareil.">
      {records.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucun dossier</Text>
          <Text style={styles.emptyText}>Les naissances enregistrées apparaîtront ici.</Text>
        </View>
      ) : (
        records.map((record) => <RecordCard key={record.id} record={record} />)
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    backgroundColor: NaissanceTheme.paper,
    borderColor: NaissanceTheme.border,
    borderRadius: 11,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  emptyText: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyTitle: {
    color: NaissanceTheme.ink,
    fontSize: 14,
    fontWeight: '900',
  },
});
