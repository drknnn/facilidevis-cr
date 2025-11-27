# 🔧 Firebase Tools - Guide d'utilisation

## 📋 Vue d'ensemble

`firebase-tools` est utile pour **gérer les règles de sécurité** Firestore et Storage, mais **pas nécessaire pour héberger** votre application Next.js.

---

## 🎯 Pourquoi utiliser Firebase Tools ?

### ✅ Utile pour :
1. **Déployer les règles Firestore** depuis votre code
2. **Déployer les règles Storage** depuis votre code
3. **Tester localement** avec Firebase Emulator
4. **Gérer les fonctions Firebase** (si vous en ajoutez plus tard)

### ❌ Pas nécessaire pour :
- **Héberger votre site** → Utilisez **Vercel** (déjà configuré)
- **Développer l'application** → Vous pouvez tout faire depuis Firebase Console

---

## 🚀 Installation

```bash
npm install -g firebase-tools
```

Vérifier l'installation :
```bash
firebase --version
```

---

## 🔐 Connexion à Firebase

```bash
firebase login
```

Cela ouvrira votre navigateur pour vous connecter avec votre compte Google.

---

## 📁 Configuration du projet

### 1. Initialiser Firebase dans votre projet

```bash
firebase init
```

Choisissez :
- ✅ **Firestore** : Pour déployer les règles
- ✅ **Storage** : Pour déployer les règles Storage
- ❌ **Hosting** : Pas nécessaire (on utilise Vercel)

### 2. Structure créée

Après `firebase init`, vous aurez :
```
facilidevis-cr/
├── firebase.json          # Configuration Firebase
├── .firebaserc           # ID du projet Firebase
├── firestore.rules      # Règles Firestore (à déployer)
└── storage.rules         # Règles Storage (à déployer)
```

---

## 📝 Déployer les règles de sécurité

### Déployer les règles Firestore

1. Créez `firestore.rules` (ou copiez depuis `firestore.rules.example`) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    match /quotes/{quoteId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      
      match /items/{itemId} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/quotes/$(quoteId)).data.userId == request.auth.uid;
      }
      
      match /reminders/{reminderId} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/quotes/$(quoteId)).data.userId == request.auth.uid;
      }
    }
    
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

2. Déployez :
```bash
firebase deploy --only firestore:rules
```

### Déployer les règles Storage

1. Créez `storage.rules` :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /quotes/{quoteId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/quotes/$(quoteId)).data.userId == request.auth.uid;
    }
    
    match /clients/{clientId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/clients/$(clientId)).data.userId == request.auth.uid;
    }
  }
}
```

2. Déployez :
```bash
firebase deploy --only storage
```

---

## 🧪 Tester localement avec Firebase Emulator

### Installer les emulators

```bash
firebase init emulators
```

Choisissez :
- ✅ **Authentication**
- ✅ **Firestore**
- ✅ **Storage**

### Lancer les emulators

```bash
firebase emulators:start
```

Les emulators seront disponibles sur :
- Authentication : `http://localhost:9099`
- Firestore : `http://localhost:8080`
- Storage : `http://localhost:9199`

### Utiliser les emulators dans votre code

Dans `.env.local`, ajoutez (pour le développement) :
```bash
USE_FIREBASE_EMULATOR=true
```

Puis modifiez `lib/firebase.ts` pour utiliser les emulators en dev.

---

## 🆚 Firebase Hosting vs Vercel

### Firebase Hosting
- ✅ Gratuit jusqu'à 10 Go/mois
- ✅ Intégration native avec Firebase
- ❌ Moins optimisé pour Next.js
- ❌ Pas de Serverless Functions intégrées (nécessite Cloud Functions)

### Vercel (Recommandé pour ce projet)
- ✅ Optimisé pour Next.js
- ✅ Serverless Functions intégrées
- ✅ Déploiement automatique depuis GitHub
- ✅ CDN global
- ✅ Gratuit pour les projets personnels
- ✅ **Déjà configuré** dans ce projet

**Conclusion** : Restez sur **Vercel** pour l'hébergement, utilisez **Firebase Tools** uniquement pour gérer les règles.

---

## 📋 Checklist

- [ ] Installer `firebase-tools` : `npm install -g firebase-tools`
- [ ] Se connecter : `firebase login`
- [ ] Initialiser : `firebase init` (choisir Firestore + Storage)
- [ ] Créer `firestore.rules` avec les règles de sécurité
- [ ] Créer `storage.rules` avec les règles de sécurité
- [ ] Déployer les règles : `firebase deploy --only firestore:rules,storage`

---

## 🆘 Commandes utiles

```bash
# Voir l'état du projet
firebase projects:list

# Déployer uniquement les règles Firestore
firebase deploy --only firestore:rules

# Déployer uniquement les règles Storage
firebase deploy --only storage

# Déployer tout
firebase deploy

# Tester les règles localement
firebase emulators:start --only firestore,storage
```

---

## 💡 Recommandation

**Pour ce projet FaciliDevis** :
1. ✅ **Hébergement** : Utilisez **Vercel** (déjà configuré)
2. ✅ **Règles de sécurité** : Vous pouvez soit :
   - Les configurer directement dans Firebase Console (plus simple)
   - OU utiliser Firebase Tools pour les déployer depuis le code (plus professionnel)

**Si vous voulez utiliser Firebase Tools** : Suivez les étapes ci-dessus pour initialiser et déployer les règles.

**Si vous préférez la simplicité** : Configurez les règles directement dans Firebase Console (voir `FIREBASE_CONFIGURATION_COMPLETE.md`).

---

**✅ Les deux approches fonctionnent parfaitement !**

