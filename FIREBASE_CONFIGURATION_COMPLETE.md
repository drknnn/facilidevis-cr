# ✅ Firebase Configuration Complète !

## 🎉 Félicitations !

Votre projet FaciliDevis est maintenant connecté à Firebase !

---

## ✅ Ce qui a été configuré

- ✅ Fichier `.env.local` créé avec vos clés Firebase
- ✅ Toutes les variables d'environnement sont présentes
- ✅ Le build passe sans erreur
- ✅ Firebase est prêt à être utilisé

---

## 🔥 Prochaines étapes dans Firebase Console

Pour que tout fonctionne, vous devez activer les services Firebase :

### 1. Activer Authentication

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet **facilidevis**
3. Menu gauche → **Authentication** → **Commencer**
4. Onglet **"Sign-in method"** (Méthodes de connexion)
5. Cliquez sur **"Email/Password"**
6. **Activez** le premier bouton (Email/Password, pas Email link)
7. Cliquez sur **"Enregistrer"**

### 2. Activer Firestore Database

1. Menu gauche → **Firestore Database** → **Créer une base de données**
2. Choisissez **Mode production** (plus sécurisé)
3. Emplacement : `europe-west` (ou celui de votre choix)
4. Cliquez sur **"Activer"**

#### Configurer les règles de sécurité Firestore

1. Dans Firestore Database, allez dans l'onglet **"Règles"**
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

3. Cliquez sur **"Publier"**

### 3. Activer Storage

1. Menu gauche → **Storage** → **Commencer**
2. Acceptez les règles par défaut pour commencer
3. Emplacement : `europe-west` (ou celui de votre choix)
4. Cliquez sur **"Terminé"**

#### Configurer les règles de sécurité Storage

1. Dans Storage, allez dans l'onglet **"Règles"**
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

## 🚀 Tester l'application

Une fois les services activés :

```bash
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000)

### Testez :

1. **Créer un compte** : `/register`
2. **Se connecter** : `/login`
3. **Créer un client** : `/clients/new`
4. **Créer un devis** : `/quotes/new`

---

## 📋 Checklist

- [x] Fichier `.env.local` créé avec les clés Firebase
- [x] Variables d'environnement configurées
- [x] Build passe sans erreur
- [ ] Authentication activé dans Firebase Console
- [ ] Firestore Database créé et règles configurées
- [ ] Storage activé et règles configurées
- [ ] Application testée localement

---

## 🆘 En cas de problème

### Erreur "Permission denied" dans Firestore
→ Vérifiez que les règles Firestore sont bien publiées (voir étape 2)

### Erreur "Auth domain not authorized"
→ Dans Firebase Console > Authentication > Settings > Authorized domains, ajoutez `localhost`

### Erreur "Storage permission denied"
→ Vérifiez que les règles Storage sont bien publiées (voir étape 3)

---

## 🎯 Prochaine étape : Déployer sur Vercel

Une fois que tout fonctionne localement :

1. Allez sur [Vercel](https://vercel.com)
2. Importez votre projet depuis GitHub
3. **Ajoutez les mêmes variables d'environnement** dans Settings > Environment Variables
4. Déployez !

---

**✅ Votre application FaciliDevis est prête à fonctionner avec Firebase !**

