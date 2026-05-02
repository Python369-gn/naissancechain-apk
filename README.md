# 👶 NaissanceChain - Application Mobile Terrain

**NaissanceChain** est une application mobile hors ligne et sécurisée conçue pour l'enregistrement et la gestion des actes de naissance sur le terrain, permettant leur pré-validation et synchronisation avec un registre centralisé ou une blockchain.

## 🎯 Objectifs Principaux
- **Saisie hors connexion sécurisée** : Permet aux agents de santé d'enregistrer les données des naissances même dans des zones éloignées totalement dépourvues d'internet.
- **Intégrité et Traçabilité** : Sauvegarde des informations dans une base locale chiffrée de niveau système (SQLite) avec des empreintes cryptographiques pour garantir l'absence de falsification.
- **Authentification forte** : Accès limité par un code PIN local hautement sécurisé utilisant des algorithmes de hachage.
- **Validation sur site** : Génération de codes QR pour le partage local interactif et la preuve rapide d'enregistrement.

## 🛠 Technologies Utilisées
- **Framework Principal** : [React Native](https://reactnative.dev) propulsé par [Expo](https://expo.dev/) (SDK 54+).
- **Routage** : Expo Router (Routage moderne basé sur l'arborescence des fichiers).
- **Base de Données Locale** : `expo-sqlite` pour un stockage ACID robuste et persistant.
- **Sécurité & Hashage** : `crypto-js` pour la sécurisation locale par signature HMAC-SHA256.
- **Génération QR Code** : `react-native-qrcode-svg` pour la représentation des preuves.

## 📂 Architecture du Projet
- **/app** : Contient tous les écrans, points d'entrée et la logique de scénarisation applicative.
- **/services** : Cœur métier de l’application contenant la logique de traitement de l'information.
  - `database.native.ts` : Gestion asynchrone des migrations, requêtes et abstractions de la base `SQLite`.
  - `security.ts` : Fonctions dévouées au hashage, salage et vérifications d'identité.
- **/assets** : Ressources statiques (icônes, images par défaut, polices de caractères).
- **/components** : Blocs UI isolables et réutilisables (Boutons, Modales personnalisées, etc.).
- **/types** : Contrats d'interfaces et définitions de types stricts TypeScript (ex: `BirthRecord`).

## 🚀 Démarrage Rapide (Développement)

### 1️⃣ Prérequis
- L'environnement de gestion [Node.js](https://nodejs.org/) installé sur votre machine.
- Téléchargez l'application **Expo Go** sur votre smartphone ou possédez un émulateur (Android Studio/Xcode).

### 2️⃣ Installation

Clonez le projet et installez vos paquets :
```bash
npm install
```

### 3️⃣ Démarrage du Client
```bash
npx expo start
```
- Appuyez sur la touche `a` pour lancer le simulateur Android ou `i` pour votre simulateur iOS.
- Vous pouvez également scanner le code QR avec votre téléphone pour tester en situation réelle.

## 🔒 Le Modèle de Sécurité
La protection des données terrain et l'accès agents sont des éléments vitaux :
1. **Zéro mot de passe en clair** : La variable PIN configurée par l'agent local est salée (Salt d'application) et hachée. En cas de vol matériel de l'appareil, l'interface de connexion ne peut être by-passée.
2. **Initialisation par défaut** : Si aucun PIN n'est préalablement stocké lors de l'attribution d'un appareil, les valeurs de démarrage standardisées (comme `1234` ou `0000`) sont acceptées au premier lancement pour rediriger l'agent vers un changement obligatoire.

## 💾 Tables Métier (Data Schema)
La logique SQLite s'appuie sur la création conditionnelle des tables suivantes :
- `records` : Table maîtresse sauvegardant la fiche intégrale de l'enfant (Prénom, Nom du père/mère, lieu, date de naissance, nom de l'agent créateur, UUID généré en local, Hash complet et date de synchronisation potentielle).
- `users` : Gestion de l'identifiant local de l'agent qui opère (statut de synchronisation et PIN haché).
- `settings` : Paramètres utilisateurs et environnementaux de l'app.
