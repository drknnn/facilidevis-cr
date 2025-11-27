# ⚡ Configuration Firebase - Guide Rapide

## 🎯 Objectif
Configurer Firebase en **5 minutes** pour que votre application FaciliDevis fonctionne.

---

## 📝 Étapes rapides

### 1️⃣ Créer le fichier `.env.local`

```bash
# À la racine du projet
cp .env.local.example .env.local
```

### 2️⃣ Créer un projet Firebase

1. **Allez sur** : [console.firebase.google.com](https://console.firebase.google.com)
2. **Cliquez** sur "Ajouter un projet"
3. **Nom** : `facilidevis` (ou votre choix)
4. **Continuez** jusqu'à la fin

### 3️⃣ Activer les services Firebase

#### Authentication
1. Menu gauche → **Authentication** → **Commencer**
2. Onglet **"Sign-in method"** → **Email/Password** → **Activer** → **Enregistrer**

#### Firestore Database
1. Menu gauche → **Firestore Database** → **Créer une base de données**
2. Mode **Production** → Emplacement `europe-west` → **Activer**

#### Storage
1. Menu gauche → **Storage** → **Commencer**
2. Acceptez les règles par défaut → **Terminé**

### 4️⃣ Récupérer les clés

1. **Paramètres du projet** (icône ⚙️) → **Paramètres du projet**
2. Onglet **"Général"** → Descendez à **"Vos applications"**
3. Cliquez sur l'icône **`</>`** (Web)
4. Nom : `FaciliDevis Web` → **Enregistrer l'application**
5. **Copiez les valeurs** de l'objet `firebaseConfig`

### 5️⃣ Remplir `.env.local`

Ouvrez `.env.local` et remplacez les valeurs :

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...          # ← Collez votre apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com  # ← Collez votre authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx             # ← Collez votre projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com   # ← Collez votre storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789    # ← Collez votre messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxx # ← Collez votre appId
```

### 6️⃣ Vérifier la configuration

```bash
npm run check-firebase
```

Si tout est ✅, vous pouvez lancer :

```bash
npm run dev
```

---

## 🆘 Problèmes courants

### ❌ "Firebase configuration missing"
→ Vérifiez que toutes les variables dans `.env.local` sont remplies (pas de `votre-` ou `XXXX`)

### ❌ "Permission denied" dans Firestore
→ Allez dans Firestore > Règles et copiez le contenu de `firestore.rules.example`

### ❌ Le script `check-firebase` ne fonctionne pas
→ Assurez-vous d'avoir Node.js installé et exécutez : `node scripts/check-firebase-config.js`

---

## 📚 Guide complet

Pour plus de détails, voir : **[docs/SETUP_FIREBASE.md](./docs/SETUP_FIREBASE.md)**

---

**✅ Une fois ces étapes terminées, votre application sera connectée à Firebase !**

