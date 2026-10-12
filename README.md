# Cesizen FrontOffice

Application mobile développée avec **React Native**, **Expo**, et **Clerk** pour l'authentification.  
Elle permet aux utilisateurs de suivre leur bien-être et d'interagir avec les services proposés via l'API Cesizen.

---

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [React Native](https://reactnative.dev/)
- Un compte [Clerk](https://clerk.dev/) configuré
- Un émulateur Android/iOS ou un smartphone avec [Expo Go](https://expo.dev/client)

---

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/CecileVexe/CesiZen_FrontOffice.git
cd CesiZen_FrontOffice
```


### 2. Installer les dépendances

```bash
npm install
# ou
yarn
```

### 3. Configurer les variables d’environnement

```bash
CLERK_PUBLISHABLE_KEY=pk_test_...
API_URL=http://localhost:3000
```
### 💡 Pour utiliser react-native-dotenv, les variables doivent être en majuscules et sans guillemets.

## 🚀 Démarrage

### Lancer en mode développement

```bash
npm run start
# ou
npx expo start
```

### L’interface web d’Expo s’ouvrira. Il faudra :

scanner le QR Code avec l’app Expo Go (iOS/Android)

ou lancer un émulateur Android/iOS

## 🔑 Authentification Clerk

L’authentification est gérée avec [Clerk Expo](https://clerk.com/docs/quickstarts/expo) :

- Le SDK utilise expo-secure-store pour stocker les tokens
- L'utilisateur peut se connecter, s'inscrire et accéder à des écrans protégés

## 🧾 Licence
### Ce projet est sous licence UNLICENSED.
