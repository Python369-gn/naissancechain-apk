/**
 * Configuration globale de l'application
 */
export const CONFIG = {
  // L'URL est maintenant gérée dynamiquement via le fichier .env (EXPO_PUBLIC_API_URL)
  // Cela permet de changer facilement entre local et production.
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://10.71.196.162:3001/api',
  
  // Timeout pour les requêtes (en ms)
  REQUEST_TIMEOUT: 10000,
  
  // Version de l'application
  VERSION: '1.0.0',
};
