/**
 * Service de partage de QR Code - NaissanceChain
 * Utilise la nouvelle API expo-file-system v19 (File / Paths)
 * Compatibilité totale Android & iOS, mode offline
 */

// Import correct via l'API publique expo-file-system
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

/**
 * Convertit le QR code en base64 via toDataURL()
 * Retourne la chaîne base64 brute (sans préfixe "data:")
 */
function extractBase64FromQR(qrRef: any): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!qrRef?.current) {
      reject(new Error("Le QR code n'est pas encore prêt."));
      return;
    }
    qrRef.current.toDataURL((dataUrl: string) => {
      if (!dataUrl) {
        reject(new Error("Impossible de convertir le QR code en image."));
        return;
      }
      // Supprimer le préfixe "data:image/png;base64,"
      const base64 = dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      resolve(base64);
    });
  });
}

/**
 * Fonction principale de partage d'un QR code
 *
 * Nouvelle API expo-file-system v19 :
 *   new File(Paths.cache, filename)         → objet File dans le cache
 *   file.create({ overwrite: true })        → crée le fichier sur le disque
 *   file.write(base64, { encoding: 'base64' }) → écrit les données
 *   file.uri                                → URI pour le partage
 *   file.delete()                           → nettoyage après partage
 */
export async function handleShareQR(
  qrRef: any,
  recordId: string
): Promise<void> {
  if (Platform.OS === 'web') {
    Alert.alert(
      'Partage non disponible',
      "Le partage natif n'est disponible que sur Android et iOS."
    );
    return;
  }

  let file: InstanceType<typeof File> | null = null;

  try {
    // 1. Extraire le base64 du QR Code
    const base64Data = await extractBase64FromQR(qrRef);

    // 2. Créer un nom de fichier sûr et unique
    const safeId = recordId.replace(/[^a-z0-9]/gi, '_');
    const filename = `certificat_${safeId}_${Date.now()}.png`;

    // 3. Créer le fichier dans le cache (nouvelle API expo-file-system v19)
    file = new File(Paths.cache, filename);
    file.create({ overwrite: true });

    // 4. Écrire les données base64 (remplace writeAsStringAsync déprécié)
    file.write(base64Data, { encoding: 'base64' });

    // 5. Vérifier la disponibilité du partage natif
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Le partage n'est pas disponible sur cet appareil.");
    }

    // 6. Partager le fichier via le système natif (WhatsApp, Bluetooth, etc.)
    await Sharing.shareAsync(file.uri, {
      mimeType: 'image/png',
      dialogTitle: `Certificat de Naissance - ${recordId}`,
      UTI: 'public.png', // iOS uniquement, ignoré sur Android
    });

  } catch (error: any) {
    console.error('[NaissanceChain] Erreur partage QR:', error);
    Alert.alert(
      'Erreur de partage',
      error.message || 'Une erreur est survenue. Veuillez réessayer.'
    );
  } finally {
    // 7. Nettoyage du fichier temporaire
    try {
      if (file && file.exists) {
        file.delete();
      }
    } catch (cleanupErr) {
      console.warn('[NaissanceChain] Nettoyage cache échoué:', cleanupErr);
    }
  }
}
