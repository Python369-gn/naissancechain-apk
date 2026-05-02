import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';

type ScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Screen({ title, subtitle, children }: ScreenProps) {
  const { isOnline } = useBirthRegistry();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>NaissanceChain</Text>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <View style={[styles.network, isOnline ? styles.online : styles.offline]}>
            <View style={[styles.dot, isOnline ? styles.onlineDot : styles.offlineDot]} />
            <Text style={[styles.networkText, isOnline ? styles.onlineText : styles.offlineText]}>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Text>
          </View>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 13,
    padding: 13,
    paddingBottom: 71,
  },
  dot: {
    borderRadius: 64,
    height: 5,
    width: 5,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'space-between',
  },
  kicker: {
    color: NaissanceTheme.green,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  network: {
    alignItems: 'center',
    borderRadius: 649,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '900',
  },
  offline: {
    backgroundColor: NaissanceTheme.goldSoft,
  },
  offlineDot: {
    backgroundColor: NaissanceTheme.gold,
  },
  offlineText: {
    color: NaissanceTheme.warning,
  },
  online: {
    backgroundColor: NaissanceTheme.greenSoft,
  },
  onlineDot: {
    backgroundColor: NaissanceTheme.success,
  },
  onlineText: {
    color: NaissanceTheme.green,
  },
  safeArea: {
    backgroundColor: NaissanceTheme.background,
    flex: 1,
  },
  subtitle: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 13,
    marginTop: 3,
    maxWidth: 270,
  },
  title: {
    color: NaissanceTheme.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 3,
  },
});
