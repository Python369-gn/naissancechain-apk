import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { NaissanceTheme } from '@/constants/theme';

type FieldProps = TextInputProps & {
  label: string;
};

export function Field({ label, style, ...props }: FieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#98A2A0"
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  label: {
    color: NaissanceTheme.muted,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: NaissanceTheme.paper,
    borderColor: NaissanceTheme.border,
    borderRadius: 7,
    borderWidth: 1,
    color: NaissanceTheme.ink,
    fontSize: 14,
    minHeight: 31,
    paddingHorizontal: 9,
  },
});
