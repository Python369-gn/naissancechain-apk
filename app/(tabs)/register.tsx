import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';

import { AppHeader, OfflineStrip, Page } from '@/components/mockup-shell';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';
import { BirthFormData } from '@/types/birth';

const initialForm: BirthFormData = {
  childFirstName: '',
  childLastName: '',
  sex: 'Masculin',
  birthDate: new Date().toLocaleDateString('fr-FR'),
  birthTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  birthPlace: '',
  fatherName: '',
  motherName: '',
  address: '',
  healthCenter: '',
  agentName: 'Agent Mobile',
};

export default function RegisterScreen() {
  const { setDraft } = useBirthRegistry();
  const [form, setForm] = useState(initialForm);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const update = (key: keyof BirthFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      update('birthDate', selectedDate.toLocaleDateString('fr-FR'));
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      update('birthTime', selectedTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const continueToVerification = () => {
    if (!form.childFirstName || !form.childLastName || !form.birthPlace || !form.motherName) {
      Alert.alert('Informations manquantes', 'Complète au minimum le prénom, le nom, le lieu et la mère.');
      return;
    }
    setDraft({
      ...form,
      healthCenter: form.healthCenter || form.birthPlace,
    });
    router.push('/verification');
  };

  return (
    <Page>
      <AppHeader title="Enregistrement" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Nouvelle Naissance</Text>
          <Text style={styles.subtitle}>Enregistrement sécurisé pour le registre national civil.</Text>
          <OfflineStrip compact />
        </View>

        {/* Section Enfant */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons color={NaissanceTheme.green} name="child-care" size={20} />
            <Text style={styles.sectionTitle}>IDENTITÉ DE L'ENFANT</Text>
          </View>

          <Field 
            label="Prénom(s)" 
            placeholder="Ex: Mamadou Alimou" 
            value={form.childFirstName} 
            onChangeText={(v) => update('childFirstName', v)} 
          />
          <Field 
            label="Nom de famille" 
            placeholder="NOM DE FAMILLE" 
            value={form.childLastName} 
            onChangeText={(v) => update('childLastName', v)} 
          />
          
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Sexe</Text>
            <View style={styles.sexRow}>
              {(['Masculin', 'Féminin'] as const).map((sex) => (
                <Pressable 
                  key={sex} 
                  onPress={() => update('sex', sex)} 
                  style={[styles.sexButton, form.sex === sex && styles.sexActive]}
                >
                  <MaterialIcons 
                    color={form.sex === sex ? NaissanceTheme.green : NaissanceTheme.muted} 
                    name={sex === 'Masculin' ? 'male' : 'female'} 
                    size={20} 
                  />
                  <Text style={[styles.sexText, form.sex === sex && styles.sexTextActive]}>{sex}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Section Naissance avec Date & Heure Pickers */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons color={NaissanceTheme.green} name="access-time" size={20} />
            <Text style={styles.sectionTitle}>DATE ET LIEU</Text>
          </View>

          <View style={[styles.twoCols, { gap: 12 }]}>
            <View style={{ flex: 1.5 }}>
              <PressableField 
                label="Date de naissance" 
                value={form.birthDate} 
                icon="calendar-today" 
                onPress={() => setShowDatePicker(true)} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <PressableField 
                label="Heure" 
                value={form.birthTime} 
                icon="schedule" 
                onPress={() => setShowTimePicker(true)} 
              />
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}

          <Field 
            label="Lieu de naissance" 
            placeholder="Hôpital, Ville..." 
            value={form.birthPlace} 
            onChangeText={(v) => update('birthPlace', v)} 
            icon="place" 
          />
          <Field 
            label="Adresse de résidence" 
            placeholder="Quartier, Secteur..." 
            value={form.address} 
            onChangeText={(v) => update('address', v)} 
            icon="home" 
          />
        </View>

        {/* Section Parents */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons color={NaissanceTheme.green} name="family-restroom" size={20} />
            <Text style={styles.sectionTitle}>FILIATION</Text>
          </View>

          <Field 
            label="Nom de la mère" 
            placeholder="Identité complète" 
            value={form.motherName} 
            onChangeText={(v) => update('motherName', v)} 
            icon="person" 
          />
          <Field 
            label="Nom du père" 
            placeholder="Identité complète (optionnel)" 
            value={form.fatherName} 
            onChangeText={(v) => update('fatherName', v)} 
            icon="person-outline" 
          />
        </View>

        <Pressable onPress={continueToVerification} style={styles.continueButton}>
          <Text style={styles.continueText}>VÉRIFIER LES DONNÉES</Text>
          <MaterialIcons color="#111111" name="arrow-forward" size={22} />
        </Pressable>
      </ScrollView>
    </Page>
  );
}

function Field({ label, icon, ...props }: { label: string; icon?: any } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon && <MaterialIcons color={NaissanceTheme.muted} name={icon} size={18} style={styles.fieldIcon} />}
        <TextInput placeholderTextColor="#98A2B3" style={styles.input} {...props} />
      </View>
    </View>
  );
}

function PressableField({ label, value, icon, onPress }: { label: string; value: string; icon: any; onPress: () => void }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onPress} style={styles.inputWrap}>
        <MaterialIcons color={NaissanceTheme.green} name={icon} size={18} style={styles.fieldIcon} />
        <Text style={styles.pressableValue}>{value}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
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
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F2F4F7',
    flexDirection: 'row',
    height: 52,
    paddingHorizontal: 16,
  },
  input: {
    color: NaissanceTheme.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  pressableValue: {
    color: NaissanceTheme.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  fieldIcon: {
    marginRight: 10,
  },
  twoCols: {
    flexDirection: 'row',
  },
  sexRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sexButton: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F2F4F7',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    justifyContent: 'center',
  },
  sexActive: {
    backgroundColor: '#E6F4F0',
    borderColor: NaissanceTheme.green,
  },
  sexText: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  sexTextActive: {
    color: NaissanceTheme.green,
    fontWeight: '700',
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: '#FFA35D',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    height: 64,
    justifyContent: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#FFA35D',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      }
    }),
  },
  continueText: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
