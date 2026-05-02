import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { NaissanceTheme } from '@/constants/theme';

type QrProofProps = {
  value: string;
  size?: number;
};

export function QrProof({ value, size = 136 }: QrProofProps) {
  return (
    <View style={[styles.frame, { height: size + 18, width: size + 18 }]}>
      <QRCode value={value} size={size} color="#111111" backgroundColor="#FFFFFF" quietZone={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    backgroundColor: NaissanceTheme.paper,
    borderColor: NaissanceTheme.green,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
});
