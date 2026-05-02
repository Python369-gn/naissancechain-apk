import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { 
  Alert, 
  Pressable, 
  StyleSheet, 
  Text, 
  View, 
  Platform,
  ActivityIndicator 
} from 'react-native';

import { AppHeader, Page } from '@/components/mockup-shell';
import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';
import { verifyPin } from '@/services/security';

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'delete'];

type Phase = 'old' | 'new' | 'confirm';

export default function ChangePinScreen() {
  const { agentPin, updatePin } = useBirthRegistry();
  const [phase, setPhase] = useState<Phase>('old');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const press = async (value: string) => {
    if (isSuccess) return;

    let current: string;
    let setter: (v: string | ((v: string) => string)) => void;

    if (phase === 'old') { current = oldPin; setter = setOldPin; }
    else if (phase === 'new') { current = newPin; setter = setNewPin; }
    else { current = confirmPin; setter = setConfirmPin; }

    if (value === 'C') return setter('');
    if (value === 'delete') return setter(prev => prev.slice(0, -1));

    if (current.length < 4) {
      const next = current + value;
      setter(next);
      
      if (next.length === 4) {
        if (phase === 'old') {
            const isValid = verifyPin(next, agentPin);
            if (isValid) {
                setTimeout(() => {
                    setPhase('new');
                }, 400);
            } else {
                Alert.alert('Erreur', 'Ancien code PIN incorrect.');
                setOldPin('');
            }
        } else if (phase === 'new') {
            setTimeout(() => setPhase('confirm'), 400);
        } else {
            if (next === newPin) {
                await updatePin(next);
                setIsSuccess(true);
                setTimeout(() => {
                    router.back();
                }, 1800);
            } else {
                Alert.alert('Erreur', 'Les codes ne correspondent pas.');
                setConfirmPin('');
                setNewPin('');
                setPhase('new');
            }
        }
      }
    }
  };

  if (isSuccess) {
      return (
          <Page>
              <View style={styles.successOverlay}>
                  <View style={styles.successCircle}>
                    <MaterialIcons name="check" size={50} color="#FFFFFF" />
                  </View>
                  <Text style={styles.successTitle}>Code PIN Mis à Jour</Text>
                  <Text style={styles.successSub}>Votre sécurité a été renforcée.</Text>
              </View>
          </Page>
      );
  }

  const getTitle = () => {
      if (phase === 'old') return "Entrez votre code actuel";
      if (phase === 'new') return "Nouveau code PIN";
      return "Confirmez le nouveau PIN";
  };

  const getDots = () => {
      if (phase === 'old') return oldPin;
      if (phase === 'new') return newPin;
      return confirmPin;
  };

  return (
    <Page>
      <AppHeader title="Sécurité PIN" />
      <View style={styles.container}>
        <View style={styles.stateIcon}>
            <MaterialIcons name={phase === 'old' ? "lock-open" : "security"} size={32} color={NaissanceTheme.green} />
        </View>
        <Text style={styles.title}>{getTitle()}</Text>
        
        <View style={styles.dots}>
            {[0, 1, 2, 3].map(i => (
                <View key={i} style={[styles.dot, getDots().length > i && styles.dotActive]} />
            ))}
        </View>

        <View style={styles.keypad}>
            {digits.map(d => (
                <Pressable key={d} onPress={() => press(d)} style={styles.key}>
                    {d === 'delete' ? <MaterialIcons name="backspace" size={24} color={NaissanceTheme.ink} /> : <Text style={styles.keyText}>{d}</Text>}
                </Pressable>
            ))}
        </View>

        <Pressable onPress={() => router.back()} style={styles.cancel}>
            <Text style={styles.cancelText}>ANNULER</Text>
        </Pressable>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40 },
  stateIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E6F4F0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700', color: NaissanceTheme.ink, marginBottom: 40 },
  dots: { flexDirection: 'row', gap: 20, marginBottom: 60 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E5E7EB' },
  dotActive: { backgroundColor: NaissanceTheme.green },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 280, gap: 20, justifyContent: 'center' },
  key: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 24, fontWeight: '600', color: NaissanceTheme.ink },
  cancel: { marginTop: 40 },
  cancelText: { color: NaissanceTheme.muted, fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  // Success styles
  successOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  successCircle: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: NaissanceTheme.green, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    ...Platform.select({
        ios: {
            shadowColor: NaissanceTheme.green,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
        },
        android: {
            elevation: 10,
        },
        web: {
            boxShadow: '0px 8px 15px rgba(23, 146, 107, 0.3)'
        }
    })
  },
  successTitle: { fontSize: 22, fontWeight: '900', color: NaissanceTheme.ink },
  successSub: { fontSize: 14, color: NaissanceTheme.muted, marginTop: 8 }
});
