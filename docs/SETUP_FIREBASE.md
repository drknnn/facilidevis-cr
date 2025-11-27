# 🔥 Guide complet : Configuration Firebase pour FaciliDevis

## 📋 Vue d'ensemble

Ce guide vous accompagne étape par étape pour configurer Firebase (Authentication, Firestore, Storage) pour votre projet FaciliDevis.

---

## 🚀 Étape 1 : Créer un projet Firebase

### 1.1 Aller sur Firebase Console

1. Ouvrez votre navigateur et allez sur : **[console.firebase.google.com](https://console.firebase.google.com)**
2. Connectez-vous avec votre compte Google

### 1.2 Créer un nouveau projet

1. Cliquez sur **"Ajouter un projet"** (ou "Add project")
2. **Nom du projet** : `facilidevis` (ou un nom de votre choix)
3. Cliquez sur **"Continuer"**
4. **Google Analytics** : Vous pouvez activer ou désactiver (optionnel pour commencer)
5. Cliquez sur **"Créer le projet"**
6. Attendez quelques secondes que le projet soit créé
7. Cliquez sur **"Continuer"**

---

## 🔐 Étape 2 : Configurer Firebase Authentication

### 2.1 Activer l'authentification par email/mot de passe

1. Dans le menu de gauche, cliquez sur **"Authentication"** (ou "Authentification")
2. Cliquez sur **"Commencer"** (ou "Get started")
3. Allez dans l'onglet **"Sign-in method"** (ou "Méthodes de connexion")
4. Cliquez sur **"Email/Password"** (ou "E-mail/Mot de passe")
5. Activez le premier bouton **"Email/Password"** (pas "Email link")
6. Cliquez sur **"Enregistrer"**

### 2.2 (Optionnel) Activer Google Sign-in

1. Toujours dans "Sign-in method"
2. Cliquez sur **"Google"**
3. Activez Google Sign-in
4. Sélectionnez un email de support (votre email)
5. Cliquez sur **"Enregistrer"**

---

## 💾 Étape 3 : Configurer Firestore Database

### 3.1 Créer la base de données Firestore

1. Dans le menu de gauche, cliquez sur **"Firestore Database"** (ou "Base de données Firestore")
2. Cliquez sur **"Créer une base de données"** (ou "Create database")
3. **Mode** : Choisissez **"Mode production"** (plus sécurisé)
4. Cliquez sur **"Suivant"**
5. **Emplacement** : Choisissez `europe-west` (ou `us-central` si vous préférez)
6. Cliquez sur **"Activer"**
7. Attendez quelques secondes que la base soit créée

### 3.2 Configurer les règles de sécurité

1. Dans Firestore Database, allez dans l'onglet **"Règles"** (ou "Rules")
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs ne peuvent accéder qu'à leurs propres données
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
      
      // Les sous-collections (items, reminders)
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

3. Cliquez sur **"Publier"** (ou "Publish")

---

## 📦 Étape 4 : Configurer Firebase Storage

### 4.1 Activer Storage

1. Dans le menu de gauche, cliquez sur **"Storage"** (ou "Stockage")
2. Cliquez sur **"Commencer"** (ou "Get started")
3. **Règles de sécurité** : Acceptez les règles par défaut pour commencer
4. **Emplacement** : Choisissez le même que Firestore (`europe-west`)
5. Cliquez sur **"Terminé"**

### 4.2 Configurer les règles de sécurité Storage

1. Dans Storage, allez dans l'onglet **"Règles"** (ou "Rules")
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Les utilisateurs ne peuvent accéder qu'à leurs propres fichiers
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

3. Cliquez sur **"Publier"**

---

## 🔑 Étape 5 : Récupérer les clés de configuration

### 5.1 Obtenir les clés du projet

1. Dans Firebase Console, cliquez sur l'icône **⚙️ Paramètres** (en haut à gauche)
2. Cliquez sur **"Paramètres du projet"** (ou "Project settings")
3. Allez dans l'onglet **"Général"** (ou "General")
4. Descendez jusqu'à **"Vos applications"** (ou "Your apps")
5. Cliquez sur l'icône **`</>`** (Web) pour ajouter une application web
6. **Nom de l'application** : `FaciliDevis Web`
7. **Cochez** "Configurer également Firebase Hosting" (optionnel)
8. Cliquez sur **"Enregistrer l'application"**

### 5.2 Copier les clés de configuration

Vous verrez un objet JavaScript avec vos clés. **Copiez ces valeurs** :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",           // ← Copiez cette valeur
  authDomain: "xxx.firebaseapp.com",  // ← Copiez cette valeur
  projectId: "xxx",            // ← Copiez cette valeur
  storageBucket: "xxx.appspot.com",   // ← Copiez cette valeur
  messagingSenderId: "123456789",      // ← Copiez cette valeur
  appId: "1:123456789:web:xxx"  // ← Copiez cette valeur
};
```

---

## 📝 Étape 6 : Configurer les variables d'environnement

### 6.1 Créer le fichier `.env.local`

1. À la racine de votre projet, créez un fichier `.env.local` (s'il n'existe pas)
2. Ajoutez les variables suivantes avec **vos valeurs** :

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=VOTRE_API_KEY_ICI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=VOTRE_AUTH_DOMAIN_ICI
NEXT_PUBLIC_FIREBASE_PROJECT_ID=VOTRE_PROJECT_ID_ICI
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=VOTRE_STORAGE_BUCKET_ICI
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=VOTRE_MESSAGING_SENDER_ID_ICI
NEXT_PUBLIC_FIREBASE_APP_ID=VOTRE_APP_ID_ICI
```

**Exemple concret** :
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=facilidevis.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=facilidevis
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=facilidevis.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 6.2 (Optionnel) Configurer Firebase Admin SDK

Pour les opérations serveur (webhooks, etc.), vous pouvez configurer Firebase Admin :

1. Dans Firebase Console, allez dans **Paramètres du projet** > **Comptes de service**
2. Cliquez sur **"Générer une nouvelle clé privée"**
3. Téléchargez le fichier JSON
4. **⚠️ Ne commitez JAMAIS ce fichier dans Git !**
5. Dans `.env.local`, ajoutez :

```bash
# Firebase Admin (optionnel pour l'instant)
FIREBASE_ADMIN_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

**Ou** placez le fichier JSON dans le projet et ajoutez :
```bash
GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-key.json
```

---

## ✅ Étape 7 : Vérifier la configuration

### 7.1 Tester localement

1. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez votre application dans le navigateur
3. Essayez de créer un compte ou de vous connecter
4. Vérifiez la console du navigateur (F12) pour d'éventuelles erreurs

### 7.2 Vérifier dans Firebase Console

1. Allez dans **Authentication** > **Users** : vous devriez voir votre utilisateur
2. Allez dans **Firestore Database** : vous devriez voir les collections `users`, `clients`, `quotes`

---

## 🚀 Étape 8 : Configurer sur Vercel

### 8.1 Ajouter les variables sur Vercel

1. Allez sur **[vercel.com](https://vercel.com)** et connectez-vous
2. Sélectionnez votre projet `facilidevis-cr`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez **chaque variable** une par une :

   - `NEXT_PUBLIC_FIREBASE_API_KEY` = (votre valeur)
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = (votre valeur)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = (votre valeur)
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = (votre valeur)
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = (votre valeur)
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = (votre valeur)

5. Pour chaque variable, sélectionnez **"Production"**, **"Preview"**, et **"Development"**
6. Cliquez sur **"Save"**

### 8.2 Redéployer

1. Allez dans **Deployments**
2. Cliquez sur **"Redeploy"** sur le dernier déploiement
3. Ou poussez un nouveau commit sur GitHub

---

## 🆘 Dépannage

### Erreur : "Firebase configuration missing"

**Solution** : Vérifiez que toutes les variables `NEXT_PUBLIC_FIREBASE_*` sont bien définies dans `.env.local`

### Erreur : "Permission denied" dans Firestore

**Solution** : Vérifiez que les règles de sécurité Firestore sont bien publiées (voir Étape 3.2)

### Erreur : "Storage permission denied"

**Solution** : Vérifiez que les règles de sécurité Storage sont bien publiées (voir Étape 4.2)

### Erreur : "Auth domain not authorized"

**Solution** : Dans Firebase Console > Authentication > Settings > Authorized domains, ajoutez votre domaine Vercel

---

## 📚 Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Guide Firestore](https://firebase.google.com/docs/firestore)
- [Guide Authentication](https://firebase.google.com/docs/auth)

---

**✅ Une fois toutes ces étapes terminées, votre application FaciliDevis sera connectée à Firebase !**

