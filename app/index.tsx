import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NaissanceTheme } from '@/constants/theme';
import { useBirthRegistry } from '@/context/birth-registry';
import { verifyPin } from '@/services/security';

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'delete'];

export default function PinScreen() {
  const { agentPin } = useBirthRegistry();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const press = (value: string) => {
    setError(false);
    if (value === 'C') {
      setPin('');
      return;
    }
    if (value === 'delete') {
      setPin((current) => current.slice(0, -1));
      return;
    }
    if (pin.length < 4) {
      const newPin = pin + value;
      setPin(newPin);
      
      // Auto-validate if 4 digits
      if (newPin.length === 4) {
        setTimeout(() => {
          const isValid = verifyPin(newPin, agentPin);

          if (isValid) {
            router.replace('/(tabs)');
          } else {
            setError(true);
            setPin('');
          }
        }, 400);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.logoImage} 
            />
          </View>
          <Text style={styles.brandName}>NAISSANCECHAIN</Text>
          <Text style={styles.tagline}>République de Guinée</Text>
        </View>

        {/* PIN Entry Section */}
        <View style={styles.entrySection}>
          <Text style={styles.title}>Accès Sécurisé</Text>
          <Text style={styles.subtitle}>Veuillez saisir votre code d'accès agent</Text>
          <Text style={styles.defaultPinHint}>Codes par défaut : 1234 ou 0000</Text>
          
          <View style={styles.pinContainer}>
            {[0, 1, 2, 3].map((index) => (
              <View 
                key={index} 
                style={[
                  styles.pinSlot, 
                  pin.length > index && styles.pinSlotFilled,
                  error && styles.pinSlotError
                ]} 
              />
            ))}
          </View>
          {error && <Text style={styles.errorText}>Code PIN incorrect. Veuillez réessayer.</Text>}
        </View>

        {/* Keypad Section */}
        <View style={styles.keypad}>
          {digits.map((digit) => (
            <Pressable 
              key={digit} 
              onPress={() => press(digit)} 
              style={({ pressed }) => [
                styles.key,
                pressed && styles.keyPressed,
                (digit === 'C' || digit === 'delete') && styles.keySpecial
              ]}
            >
              {digit === 'delete' ? (
                <MaterialIcons color={NaissanceTheme.ink} name="backspace" size={24} />
              ) : (
                <Text style={[
                  styles.keyText, 
                  digit === 'C' && styles.clearText,
                  error && digit !== 'C' && digit !== 'delete' && { color: NaissanceTheme.danger }
                ]}>
                  {digit}
                </Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.agentInfo}>AGENT ID: AO-768-2024</Text>
          <Text style={styles.versionInfo}>Système d'Enregistrement Civil - v2.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  agentInfo: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandName: {
    color: NaissanceTheme.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 16,
  },
  clearText: {
    color: NaissanceTheme.danger,
    fontSize: 18,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 60,
  },
  entrySection: {
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: NaissanceTheme.danger,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  header: {
    alignItems: 'center',
  },
  key: {
    alignItems: 'center',
    borderRadius: 40,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
    maxWidth: 280,
  },
  keyPressed: {
    backgroundColor: '#F2F4F7',
  },
  keySpecial: {
    // Styling for special keys if needed
  },
  keyText: {
    color: NaissanceTheme.ink,
    fontSize: 28,
    fontWeight: '600',
  },
  logoBadge: {
    alignItems: 'center',
    backgroundColor: NaissanceTheme.green,
    borderRadius: 24,
    height: 64,
    justifyContent: 'center',
    width: 64,
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
        // @ts-ignore
        boxShadow: `0px 8px 15px rgba(23, 146, 107, 0.3)`,
      }
    }),
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 40,
  },
  pinSlot: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    height: 16,
    width: 16,
  },
  pinSlotError: {
    backgroundColor: '#FEE4E2',
  },
  pinSlotFilled: {
    backgroundColor: NaissanceTheme.green,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  subtitle: {
    color: NaissanceTheme.muted,
    fontSize: 16,
    marginTop: 8,
  },
  defaultPinHint: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    fontWeight: '500',
  },
  tagline: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 4,
  },
  title: {
    color: NaissanceTheme.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  versionInfo: {
    color: NaissanceTheme.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
