import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { 
    Pressable, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View, 
    Platform, 
    Modal, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useState, useRef } from 'react';

import { AppHeader, Page } from '@/components/mockup-shell';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';
import { BirthRecord } from '@/types/birth';
import { buildVerificationPayload } from '@/services/proof';
import { handleShareQR } from '@/services/sharing';

export default function SyncScreen() {
  const { records, stats, isSyncing, syncNow } = useBirthRegistry();
  const [selectedRecord, setSelectedRecord] = useState<BirthRecord | null>(null);
  const [sharing, setSharing] = useState(false);
  const qrRef = useRef<any>(null);
  
  const syncPercent = stats.total > 0 ? Math.round(((stats.total - stats.pending) / stats.total) * 100) : 100;

  const handleShare = async () => {
    if (!selectedRecord) return;
    setSharing(true);
    await handleShareQR(qrRef, selectedRecord.id);
    setSharing(false);
  };

  return (
    <Page>
      <AppHeader title="Archives & Sync" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.syncHeader}>
            <View style={styles.progressBox}>
                <Text style={styles.progressText}>{syncPercent}%</Text>
                <Text style={styles.progressLabel}>SYNC</Text>
            </View>
            <View style={styles.syncMeta}>
                <Text style={styles.syncTitle}>
                    {stats.pending > 0 ? `${stats.pending} dossiers locaux` : 'Données à jour'}
                </Text>
                <Text style={styles.syncSub}>Canal Sécurisé (Offline SQLite)</Text>
            </View>
        </View>

        <Pressable
          onPress={syncNow}
          disabled={isSyncing || stats.pending === 0}
          style={[styles.syncBtn, (isSyncing || stats.pending === 0) && { opacity: 0.5 }]}
        >
          {isSyncing ? <ActivityIndicator color="#111111" /> : <Text style={styles.syncBtnText}>SYNCHRONISER AU RÉGISTRE</Text>}
        </Pressable>

        <Text style={styles.listTitle}>HISTORIQUE DES ENREGISTREMENTS</Text>
        <View style={styles.list}>
          {records.length === 0 ? (
              <View style={styles.emptyList}>
                  <Text style={styles.emptyText}>Aucune archive trouvée localement.</Text>
              </View>
          ) : records.map((record) => (
            <Pressable key={record.id} onPress={() => setSelectedRecord(record)} style={styles.item}>
                <View style={styles.itemLeft}>
                    <View style={[styles.icon, record.status === 'synced' && styles.iconSynced]}>
                        <MaterialIcons name="child-care" size={20} color={record.status === 'synced' ? NaissanceTheme.green : NaissanceTheme.muted} />
                    </View>
                    <View>
                        <Text style={styles.itemName}>{record.childFirstName} {record.childLastName}</Text>
                        <Text style={styles.itemId}>{record.id} • {record.birthDate}</Text>
                    </View>
                </View>
                <View style={[styles.badge, record.status === 'synced' && styles.badgeSynced]}>
                    <Text style={[styles.badgeText, record.status === 'synced' && styles.badgeTextSynced]}>
                        {record.status === 'synced' ? 'TRANSMI' : 'LOCAL'}
                    </Text>
                </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!selectedRecord} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View style={styles.handle} />
                        <Text style={styles.modalTitle}>Fiche d'Information</Text>
                    </View>

                    <ScrollView>
                        {selectedRecord && (
                            <View style={styles.modalBody}>
                                <View style={styles.qrBox}>
                                    <QRCode 
                                        value={buildVerificationPayload(selectedRecord)} 
                                        size={180} 
                                        getRef={(c) => qrRef.current = c} 
                                    />
                                    <Text style={styles.qrLabel}>SCANNEZ POUR VÉRIFIER</Text>
                                </View>

                                <Pressable style={styles.shareOption} onPress={handleShare}>
                                    {sharing ? <ActivityIndicator color={NaissanceTheme.green} /> : (
                                        <>
                                            <MaterialIcons name="ios-share" size={20} color={NaissanceTheme.green} />
                                            <Text style={styles.shareOptionText}>PARTAGER LE CERTIFICAT</Text>
                                        </>
                                    )}
                                </Pressable>

                                <View style={styles.dataList}>
                                    <DataRow label="NUMÉRO" value={selectedRecord.id} />
                                    <DataRow label="ENFANT" value={`${selectedRecord.childFirstName} ${selectedRecord.childLastName}`} bold />
                                    <DataRow label="NAISSANCE" value={`${selectedRecord.birthDate} - ${selectedRecord.birthTime}`} />
                                    <DataRow label="LIEU" value={selectedRecord.birthPlace} />
                                    <DataRow label="MÈRE" value={selectedRecord.motherName} />
                                    <DataRow label="PÈRE" value={selectedRecord.fatherName || "Non déclaré"} />
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <Pressable style={styles.closeBtn} onPress={() => setSelectedRecord(null)}>
                        <Text style={styles.closeBtnText}>FERMER LA FICHE</Text>
                    </Pressable>
              </View>
          </View>
      </Modal>
    </Page>
  );
}

function DataRow({ label, value, bold = false }: any) {
    return (
        <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{label}</Text>
            <Text style={[styles.dataValue, bold && { color: NaissanceTheme.green, fontWeight: '900' }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  syncHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 24, gap: 20 },
  progressBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E6F4F0', justifyContent: 'center', alignItems: 'center' },
  progressText: { fontSize: 22, fontWeight: '900', color: NaissanceTheme.green },
  progressLabel: { fontSize: 10, fontWeight: '800', color: NaissanceTheme.muted },
  syncMeta: { flex: 1 },
  syncTitle: { fontSize: 18, fontWeight: '900', color: NaissanceTheme.ink },
  syncSub: { fontSize: 13, color: NaissanceTheme.muted, marginTop: 4 },
  syncBtn: { backgroundColor: '#FFA35D', height: 60, borderRadius: 18, marginTop: 24, justifyContent: 'center', alignItems: 'center' },
  syncBtnText: { fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
  listTitle: { fontSize: 11, fontWeight: '800', color: NaissanceTheme.muted, marginTop: 32, marginBottom: 16, letterSpacing: 1.5 },
  list: { gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  iconSynced: { backgroundColor: '#E6F4F0' },
  itemName: { fontSize: 15, fontWeight: '800', color: NaissanceTheme.ink },
  itemId: { fontSize: 13, color: NaissanceTheme.muted, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#F3F4F6' },
  badgeSynced: { backgroundColor: '#E6F4F0' },
  badgeText: { fontSize: 10, fontWeight: '800', color: NaissanceTheme.muted },
  badgeTextSynced: { color: NaissanceTheme.green },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
  modalHeader: { alignItems: 'center', marginBottom: 24 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  modalBody: { alignItems: 'center' },
  qrBox: { padding: 24, backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#F2F4F7', alignItems: 'center' },
  qrLabel: { fontSize: 11, fontWeight: '800', color: NaissanceTheme.green, marginTop: 16, letterSpacing: 1 },
  shareOption: { width: '100%', height: 56, borderRadius: 16, borderWidth: 2, borderColor: NaissanceTheme.green, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  shareOptionText: { color: NaissanceTheme.green, fontWeight: '900', fontSize: 14 },
  dataList: { width: '100%', marginTop: 32, gap: 14 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dataLabel: { color: NaissanceTheme.muted, fontWeight: '700', fontSize: 13 },
  dataValue: { color: NaissanceTheme.ink, fontWeight: '700', fontSize: 14, textAlign: 'right', flex: 1, marginLeft: 24 },
  closeBtn: { backgroundColor: NaissanceTheme.ink, height: 64, borderRadius: 20, marginTop: 32, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  emptyList: { padding: 40, alignItems: 'center' },
  emptyText: { color: NaissanceTheme.muted, fontSize: 14 }
});
