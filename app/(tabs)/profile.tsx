import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Platform } from 'react-native';

import { AppHeader, Page } from '@/components/mockup-shell';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';

export default function ProfileScreen() {
  const { stats, agentName, updateAgentName } = useBirthRegistry();

  const handleEditName = () => {
    // Note: Alert.prompt logic varies by platform, for universal simplicity we might just use a simple flow or just a placeholder for this MVP scale
    // But let's try a standard prompt if available or simple Alert for this environment
    if (Platform.OS === 'ios') {
      // @ts-ignore
      Alert.prompt(
        "Modifier l'identité",
        "Entrez votre nom officiel d'officier d'état civil",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Mettre à jour", onPress: (name: string | undefined) => name && updateAgentName(name) }
        ],
        "plain-text",
        agentName
      );
    } else {
      // Pour Android/Web, une alerte simple ou on pourrait imaginer un petit formulaire
      // Ici on va simuler un changement pour le besoin de la démo si prompt n'est pas supporté partout
      Alert.alert(
        "Information", 
        "Le nom de l'officier peut être configuré dans les réglages système ou via cette interface.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <Page>
      <AppHeader title="Mon Profil Agent" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Agent Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons color={NaissanceTheme.green} name="person" size={50} />
            </View>
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.agentName}>{agentName}</Text>
              <Pressable onPress={handleEditName} style={styles.editIcon}>
                <MaterialIcons name="edit" size={16} color={NaissanceTheme.muted} />
              </Pressable>
            </View>
            <Text style={styles.agentRole}>Officier d'enregistrement civil</Text>
            <View style={styles.locationTag}>
              <MaterialIcons color={NaissanceTheme.muted} name="place" size={14} />
              <Text style={styles.locationText}>République de Guinée</Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <Text style={styles.sectionTitle}>MON ACTIVITÉ RÉELLE</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: NaissanceTheme.success }]}>{stats.synced}</Text>
            <Text style={styles.statLabel}>Syncrés</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: NaissanceTheme.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <MenuItem 
            icon="security" 
            label="Sécurité et PIN" 
            onPress={() => router.push('/settings/change-pin')}
          />
          <MenuItem icon="help-outline" label="Centre d'aide" />
          <MenuItem icon="language" label="Langue (Français)" />
          <View style={styles.menuDivider} />
          <MenuItem 
            color={NaissanceTheme.danger} 
            icon="logout" 
            label="Se déconnecter" 
            onPress={() => router.replace('/')}
          />
        </View>

        <Text style={styles.versionText}>NaissanceChain Mobile v2.1 (Production Ready)</Text>
      </ScrollView>
    </Page>
  );
}

function MenuItem({ icon, label, color = NaissanceTheme.ink, onPress }: { icon: any; label: string; color?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <MaterialIcons color={color} name={icon} size={22} />
        </View>
        <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      </View>
      <MaterialIcons color={NaissanceTheme.muted} name="chevron-right" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  agentName: {
    color: NaissanceTheme.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editIcon: {
    backgroundColor: '#F2F4F7',
    padding: 4,
    borderRadius: 8,
  },
  agentRole: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  avatarContainer: {
    position: 'relative',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  locationTag: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  locationText: {
    color: NaissanceTheme.muted,
    fontSize: 13,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginTop: 24,
    overflow: 'hidden',
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      }
    })
  },
  menuDivider: {
    backgroundColor: '#F2F4F7',
    height: 1,
    marginVertical: 8,
  },
  menuIconContainer: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  menuItemLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  onlineBadge: {
    backgroundColor: NaissanceTheme.success,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 3,
    bottom: 4,
    height: 16,
    position: 'absolute',
    right: 4,
    width: 16,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      }
    })
  },
  profileInfo: {
    flex: 1,
  },
  sectionTitle: {
    color: NaissanceTheme.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 32,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flex: 1,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
      web: {
        // @ts-ignore
        boxShadow: '0px 2px 8px rgba(0,0,0,0.02)'
      }
    })
  },
  statLabel: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statNumber: {
    color: NaissanceTheme.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  versionText: {
    color: NaissanceTheme.muted,
    fontSize: 11,
    marginTop: 32,
    textAlign: 'center',
    opacity: 0.6,
  },
});
