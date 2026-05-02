import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { 
  Alert, 
  Platform, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/mockup-shell';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';
import { buildVerificationPayload } from '@/services/proof';
import { handleShareQR } from '@/services/sharing';

export default function ProofScreen() {
  const { lastCreated } = useBirthRegistry();
  const [sharing, setSharing] = useState(false);
  const qrRef = useRef<any>(null);
  const record = lastCreated;

  const onShare = async () => {
    setSharing(true);
    await handleShareQR(qrRef, record?.id ?? 'NC-XXXX');
    setSharing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Preuve Numérique" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bandeau succès */}
        <View style={styles.successHeader}>
          <View style={styles.successIconBox}>
            <MaterialIcons color="#FFFFFF" name="check" size={40} />
          </View>
          <Text style={styles.successTitle}>Enregistré !</Text>
          <Text style={styles.successSubtitle}>Dossier créé et sécurisé localement.</Text>
        </View>

        {/* Carte QR */}
        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>CERTIFICAT OFFICIEL</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={record ? buildVerificationPayload(record) : 'NC-NULL'}
              size={220}
              color="#111111"
              backgroundColor="#FFFFFF"
              getRef={(c) => (qrRef.current = c)}
            />
          </View>
          <View style={styles.idBox}>
            <Text style={styles.idLabel}>NUMÉRO D'ACTE</Text>
            <Text style={styles.idValue}>{record?.id ?? 'NC-2024-XXXX'}</Text>
          </View>
        </View>

        {/* Informations */}
        <View style={styles.detailsCard}>
          <DetailRow label="Enfant" value={`${record?.childFirstName ?? ''} ${record?.childLastName ?? ''}`} />
          <DetailRow label="Date de naissance" value={record?.birthDate} />
          <DetailRow label="Lieu" value={record?.birthPlace} />
          <DetailRow label="Mère" value={record?.motherName} />
          <DetailRow label="Père" value={record?.fatherName || 'Non renseigné'} />
          <DetailRow label="Agent" value={record?.agentName} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable 
            style={({ pressed }) => [
              styles.primaryBtn, 
              (sharing || pressed) && { opacity: 0.75 }
            ]} 
            onPress={onShare}
            disabled={sharing}
          >
            {sharing ? (
              <ActivityIndicator color="#111111" size="small" />
            ) : (
              <>
                <MaterialIcons color="#111111" name="ios-share" size={22} />
                <Text style={styles.primaryBtnText}>PARTAGER LE CERTIFICAT</Text>
              </>
            )}
          </Pressable>

          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>RETOUR AU TABLEAU DE BORD</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '--'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFC' },
  content: { padding: 20, paddingBottom: 40 },
  successHeader: { alignItems: 'center', marginVertical: 24 },
  successIconBox: { 
    width: 72, height: 72, borderRadius: 36, 
    backgroundColor: NaissanceTheme.green, 
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      android: { elevation: 6 },
      ios: { shadowColor: NaissanceTheme.green, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12 },
    }),
  },
  successTitle: { fontSize: 24, fontWeight: '900', color: NaissanceTheme.ink, marginTop: 16 },
  successSubtitle: { color: NaissanceTheme.muted, marginTop: 6, fontSize: 14 },
  qrCard: { 
    backgroundColor: '#fff', borderRadius: 30, padding: 24, alignItems: 'center',
    ...Platform.select({
      android: { elevation: 5 },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
    }),
  },
  qrLabel: { fontSize: 11, fontWeight: '800', color: NaissanceTheme.green, letterSpacing: 1.5, marginBottom: 20 },
  qrContainer: { padding: 16, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#F2F4F7' },
  idBox: { backgroundColor: '#F8F9FB', padding: 16, borderRadius: 18, width: '100%', marginTop: 24, alignItems: 'center' },
  idLabel: { fontSize: 10, fontWeight: '800', color: NaissanceTheme.muted, letterSpacing: 1 },
  idValue: { fontSize: 20, fontWeight: '900', color: NaissanceTheme.ink, marginTop: 4, letterSpacing: -0.5 },
  detailsCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginTop: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' },
  detailLabel: { color: NaissanceTheme.muted, fontWeight: '600', fontSize: 14 },
  detailValue: { color: NaissanceTheme.ink, fontWeight: '800', fontSize: 14, textAlign: 'right', flex: 1, marginLeft: 16 },
  actions: { marginTop: 28, gap: 14 },
  primaryBtn: { 
    backgroundColor: '#FFA35D', height: 64, borderRadius: 20, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  primaryBtnText: { fontWeight: '900', fontSize: 16, color: '#111111' },
  backBtn: { height: 56, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: NaissanceTheme.muted, fontWeight: '700', fontSize: 14 }
});
