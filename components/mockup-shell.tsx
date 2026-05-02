import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ReactNode } from 'react';
import { StyleSheet, Text, View, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NaissanceTheme } from '@/constants/theme';

export function AppHeader({ title = 'NaissanceChain' }: { title?: string }) {
  return (
    <SafeAreaView edges={['top']} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.logoImage} 
            />
          </View>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusDot} />
          <MaterialIcons color={NaissanceTheme.muted} name="notifications-none" size={24} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export function OfflineStrip({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.strip, compact && styles.compactStrip]}>
      <MaterialIcons color={NaissanceTheme.warning} name="cloud-off" size={compact ? 14 : 20} />
      <Text style={[styles.stripText, compact && styles.compactStripText]}>MODE HORS-LIGNE ACTIVÉ</Text>
    </View>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <View style={styles.page}>{children}</View>;
}

const styles = StyleSheet.create({
  compactStrip: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  compactStripText: {
    color: NaissanceTheme.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0,0,0,0.03)',
      }
    }),
  },
  headerSafe: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  headerTitle: {
    color: NaissanceTheme.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  logoBadge: {
    alignItems: 'center',
    backgroundColor: NaissanceTheme.green,
    borderRadius: 8,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  page: {
    backgroundColor: '#FAFBFC',
    flex: 1,
  },
  statusDot: {
    backgroundColor: NaissanceTheme.success,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  strip: {
    alignItems: 'center',
    backgroundColor: NaissanceTheme.goldSoft,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  stripText: {
    color: NaissanceTheme.warning,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
