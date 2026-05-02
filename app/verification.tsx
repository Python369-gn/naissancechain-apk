import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/mockup-shell';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';
import { BirthFormData } from '@/types/birth';

const fallback: BirthFormData = {
  childFirstName: 'Mamadou Alimou',
  childLastName: 'Diallo',
  sex: 'Masculin',
  birthDate: '14 Mai 2024',
  birthTime: '12:00',
  birthPlace: 'Hôpital National Ignace Deen, Conakry',
  fatherName: 'Non renseigné',
  motherName: 'Aissatou Lamarana Sow',
  address: 'Conakry',
  healthCenter: 'Hôpital National Ignace Deen',
  agentName: 'Agent Mobile',
};

export default function VerificationScreen() {
  const { addRecord, draft } = useBirthRegistry();
  const data = draft ?? fallback;

  const save = async () => {
    await addRecord(data);
    router.replace('/proof');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Récapitulatif" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Vérifiez les informations</Text>
          <Text style={styles.subtitle}>{"Veuillez confirmer l'exactitude des données avant l'insertion définitive dans le registre local."}</Text>
        </View>

        {/* Section Enfant */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons color={NaissanceTheme.green} name="child-care" size={20} />
            <Text style={styles.sectionTitle}>IDENTITÉ DE L'ENFANT</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.label}>Prénom(s)</Text>
            <Text style={styles.value}>{data.childFirstName}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Nom de famille</Text>
            <Text style={styles.value}>{data.childLastName}</Text>
          </View>
          <View style={styles.twoCols}>
            <View style={styles.col}>
              <Text style={styles.label}>Sexe</Text>
              <Text style={styles.value}>{data.sex}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Date de Naissance</Text>
              <Text style={styles.value}>{data.birthDate}</Text>
            </View>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Lieu de Naissance</Text>
            <Text style={styles.value}>{data.birthPlace}</Text>
          </View>
        </View>

        {/* Section Parents */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons color={NaissanceTheme.green} name="family-restroom" size={20} />
            <Text style={styles.sectionTitle}>FILIATION ET ADRESSE</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.label}>Nom de la Mère</Text>
            <Text style={styles.value}>{data.motherName}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Nom du Père</Text>
            <Text style={styles.value}>{data.fatherName || 'Non renseigné'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Adresse de résidence</Text>
            <Text style={styles.value}>{data.address || 'Non renseignée'}</Text>
          </View>
        </View>

        <View style={styles.warningBox}>
          <MaterialIcons color={NaissanceTheme.danger} name="report-problem" size={20} />
          <Text style={styles.warningText}>Toute erreur après enregistrement devra faire l'objet d'un jugement supplétif.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={save} style={styles.saveButton}>
            <MaterialIcons color="#111111" name="check-circle" size={22} />
            <Text style={styles.saveText}>CONFIRMER L'ENREGISTREMENT</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.editButton}>
            <MaterialIcons color={NaissanceTheme.muted} name="edit" size={18} />
            <Text style={styles.editText}>MODIFIER LES INFORMATIONS</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 8,
  },
  safeArea: {
    backgroundColor: '#FAFBFC',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    color: NaissanceTheme.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        // @ts-ignore
        boxShadow: '0px 2px 10px rgba(0,0,0,0.05)'
      }
    }),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: NaissanceTheme.green,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  dataRow: {
    marginBottom: 16,
  },
  label: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    color: NaissanceTheme.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  twoCols: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  col: {
    flex: 1,
  },
  warningBox: {
    alignItems: 'center',
    backgroundColor: '#FEE4E2',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    marginBottom: 32,
  },
  warningText: {
    color: NaissanceTheme.danger,
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#FFA35D',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    height: 60,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FFA35D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        // @ts-ignore
        boxShadow: '0px 4px 12px rgba(255, 163, 93, 0.3)'
      }
    }),
  },
  saveText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  editButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 48,
    justifyContent: 'center',
  },
  editText: {
    color: NaissanceTheme.muted,
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
