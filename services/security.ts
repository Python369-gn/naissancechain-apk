import CryptoJS from 'crypto-js';

// Une clef secrète (Salt) pour renforcer le hashage
// Apperçu : NCH_SECURE_SALT_2024
const SALT = 'NCH_SECRET_KEY_PROD_2026';

/**
 * Génère un hash sécurisé à partir d'un code PIN
 */
export function hashPin(pin: string): string {
    return CryptoJS.HmacSHA256(pin, SALT).toString();
}

/**
 * Vérifie si un PIN correspond au hash stocké
 * Prend en compte les PIN par défaut si aucun hash n'est encore enregistré
 */
export function verifyPin(inputPin: string, storedHash: string | null): boolean {
    const hashedInput = hashPin(inputPin);
    
    // Si pas de hash en base (première installation)
    if (!storedHash) {
        const defaultPins = ['1234', '0000'].map(hashPin);
        return defaultPins.includes(hashedInput);
    }
    
    return hashedInput === storedHash;
}

/**
 * Erreurs courantes à éviter :
 * 1. Stocker en clair : Facilite le vol de données.
 * 2. Pas de Salt : Permet les attaques par "Rainbow Table".
 * 3. Trop de tentatives : Toujours implémenter un délai ou blocage (UI).
 */
