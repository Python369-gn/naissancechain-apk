import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader, OfflineStrip, Page } from '@/components/mockup-shell';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';

export default function HomeScreen() {
  const { records, stats, agentName } = useBirthRegistry();
  
  const todayRecords = records.filter((r) => {
    const createdAt = new Date(r.createdAt);
    const today = new Date();
    return (
      createdAt.getDate() === today.getDate() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    );
  });

  return (
    <Page>
      <AppHeader title="Tableau de Bord" />
      <OfflineStrip />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.agentName}>{agentName}</Text>
        </View>

        {/* Primary Action Card */}
        <Link href="/register" asChild>
          <Pressable style={styles.actionCard}>
            <View style={styles.actionCardContent}>
              <View style={styles.actionIcon}>
                <MaterialIcons color="#FFFFFF" name="add-circle" size={32} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Nouvel Enregistrement</Text>
                <Text style={styles.actionSubtitle}>Ajouter une naissance au registre local</Text>
              </View>
            </View>
            <MaterialIcons color="#111111" name="chevron-right" size={24} />
          </Pressable>
        </Link>

        {/* Stats Grid */}
        <View style={styles.grid}>
          <View style={[styles.gridItem, { backgroundColor: '#E0F2FE' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#BAE6FD' }]}>
              <MaterialIcons color="#0369A1" name="today" size={20} />
            </View>
            <Text style={styles.gridValue}>{todayRecords.length}</Text>
            <Text style={styles.gridLabel}>Naissances aujourd'hui</Text>
          </View>

          <View style={[styles.gridItem, { backgroundColor: '#FEF3C7' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#FDE68A' }]}>
              <MaterialIcons color="#B45309" name="cloud-sync" size={20} />
            </View>
            <Text style={styles.gridValue}>{stats.pending}</Text>
            <Text style={styles.gridLabel}>En attente de sync.</Text>
          </View>
        </View>


        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>ACTIVITÉ RÉCENTE</Text>
        {todayRecords.length === 0 ? (
          <View style={styles.emptyActivity}>
            <Text style={styles.emptyText}>Aucun enregistrement saisi aujourd'hui.</Text>
          </View>
        ) : (
          todayRecords.slice(0, 3).map((record) => (
            <View key={record.id} style={styles.recentItem}>
              <View style={styles.recentIcon}>
                <MaterialIcons color={NaissanceTheme.muted} name="child-care" size={20} />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{record.childFirstName} {record.childLastName}</Text>
                <Text style={styles.recentTime}>{new Date(record.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={[styles.statusBadge, record.status === 'synced' ? styles.statusSynced : styles.statusPending]}>
                <Text style={styles.statusText}>{record.status === 'synced' ? 'Sync' : 'Local'}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#FFA35D',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#FFA35D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
      web: {
        // @ts-ignore
        boxShadow: '0px 8px 15px rgba(255, 163, 93, 0.3)'
      }
    }),
  },
  actionCardContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  actionTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
  },
  actionSubtitle: {
    color: 'rgba(17,17,17,0.6)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  agentName: {
    color: NaissanceTheme.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyActivity: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  emptyText: {
    color: NaissanceTheme.muted,
    fontSize: 14,
  },
  greeting: {
    color: NaissanceTheme.muted,
    fontSize: 16,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  gridItem: {
    borderRadius: 20,
    flex: 1,
    padding: 16,
  },
  gridValue: {
    color: NaissanceTheme.ink,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 12,
  },
  gridLabel: {
    color: NaissanceTheme.ink,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.7,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  menuGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  menuItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    height: 56,
    justifyContent: 'center',
  },
  menuText: {
    color: NaissanceTheme.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  recentItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
  },
  recentIcon: {
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  recentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentName: {
    color: NaissanceTheme.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  recentTime: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 32,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusPending: {
    backgroundColor: NaissanceTheme.goldSoft,
  },
  statusSynced: {
    backgroundColor: NaissanceTheme.greenSoft,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  welcomeSection: {
    marginTop: 8,
  },
});
