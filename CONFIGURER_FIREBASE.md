# 🔥 Configuration Firebase - Guide Simplifié

## 🎯 Ce que vous devez faire

Je ne peux pas créer le projet Firebase pour vous (cela nécessite d'aller sur la console Firebase), mais je peux vous guider étape par étape.

---

## ⚡ Démarrage rapide (5 minutes)

### 1. Créer le fichier `.env.local`

```bash
cp .env.local.example .env.local
```

### 2. Suivre le guide interactif

J'ai créé **3 guides** pour vous aider :

1. **📘 Guide rapide** : `SETUP_FIREBASE_QUICK.md` - Pour aller vite
2. **📗 Guide complet** : `docs/SETUP_FIREBASE.md` - Avec tous les détails
3. **🔍 Script de vérification** : `npm run check-firebase` - Pour vérifier votre config

### 3. Étapes principales

1. **Créer un projet Firebase** sur [console.firebase.google.com](https://console.firebase.google.com)
2. **Activer** Authentication (Email/Password)
3. **Activer** Firestore Database
4. **Activer** Storage
5. **Récupérer les clés** dans Paramètres du projet
6. **Remplir** `.env.local` avec les clés
7. **Vérifier** avec `npm run check-firebase`

---

## 📚 Guides disponibles

### Guide rapide
👉 **Lisez** : `SETUP_FIREBASE_QUICK.md`

### Guide complet avec règles de sécurité
👉 **Lisez** : `docs/SETUP_FIREBASE.md`

### Vérifier votre configuration
```bash
npm run check-firebase
```

---

## 🆘 Besoin d'aide ?

Si vous êtes bloqué à une étape précise, dites-moi :
- À quelle étape vous êtes
- Quelle erreur vous voyez
- Ce que vous avez déjà fait

Je pourrai vous aider plus précisément !

---

## ✅ Une fois configuré

Après avoir rempli `.env.local` avec vos clés Firebase :

```bash
npm run check-firebase  # Vérifier la config
npm run dev             # Lancer l'application
```

Votre application sera alors connectée à Firebase ! 🎉

