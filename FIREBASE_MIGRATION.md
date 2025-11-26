# 🔥 Migration Firebase - FaciliDevis

## ✅ Migration Complète vers Firebase

Cette documentation décrit la migration complète de FaciliDevis de **Prisma + SQLite** vers **Firebase (Firestore + Auth)**.

---

## 📋 Structure de la Migration

### 1. Configuration Firebase

#### Fichiers Créés
- ✅ `lib/firebase.ts` - Configuration Firebase App, Auth, Firestore
- ✅ `lib/firebase-auth.ts` - Services d'authentification Firebase (signUp, signIn, signOut)
- ✅ `lib/firebase-admin.ts` - Firebase Admin SDK (vérification tokens côté serveur)
- ✅ `lib/firestore.ts` - Services Firestore (CRUD pour clients, quotes, reminders)
- ✅ `lib/middleware-firebase.ts` - Middleware d'authentification pour routes API

#### Types TypeScript
- ✅ `types/crm.ts` - Types complets pour le modèle de données CRM

### 2. Routes API Migrées

#### Authentification
- ✅ `app/api/auth/login-firebase/route.ts` - Connexion Firebase Auth
- ✅ `app/api/auth/register-firebase/route.ts` - Inscription Firebase Auth
- ✅ `app/api/auth/me-firebase/route.ts` - Récupération utilisateur connecté
- ✅ `app/api/auth/logout-firebase/route.ts` - Déconnexion

#### CRM
- ✅ `app/api/clients-firebase/route.ts` - CRUD clients (Firestore)
- ✅ `app/api/quotes-firebase/route.ts` - CRUD devis (Firestore)
- ✅ `app/api/dashboard-firebase/route.ts` - Statistiques dashboard (Firestore)

### 3. Services Prêts

- ✅ `lib/sms.ts` - Service SMS (abstraction Twilio/Vonage)
- ✅ `lib/stripe.ts` - Service Stripe (customers, subscriptions, webhooks)
- ✅ `app/api/stripe/webhook/route.ts` - Webhook Stripe

---

## 🚀 Installation et Configuration

### 1. Installer les Dépendances

Les dépendances Firebase sont déjà installées :

```bash
npm install firebase firebase-admin stripe @stripe/stripe-js
```

### 2. Configuration Firebase

#### Étape 1 : Créer un Projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Cliquez sur **"Ajouter un projet"**
3. Suivez les étapes pour créer le projet
4. Activez **Authentication** et **Firestore Database**

#### Étape 2 : Configurer Authentication

1. Dans Firebase Console > **Authentication**
2. Activez le provider **Email/Password**
3. (Optionnel) Activez **Google** pour l'authentification Google

#### Étape 3 : Configurer Firestore

1. Dans Firebase Console > **Firestore Database**
2. Créez la base de données en **mode production** (ou test pour dev)
3. Copiez les règles de sécurité depuis `firestore.rules.example`
4. Collez-les dans Firebase Console > Firestore > Règles

#### Étape 4 : Récupérer les Clés Firebase

1. Dans Firebase Console > **Paramètres du projet** > **Mes applications**
2. Si vous n'avez pas encore d'application web, créez-en une
3. Copiez les valeurs de configuration :

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

#### Étape 5 : Configurer les Variables d'Environnement

1. Copiez `.env.local.example` vers `.env.local`
2. Remplissez les variables Firebase :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### Étape 6 : Configurer Firebase Admin (Optionnel, pour production)

Pour vérifier les tokens côté serveur en production, configurez Firebase Admin :

**Option A : Service Account JSON (Recommandé pour Vercel)**

1. Firebase Console > Paramètres du projet > **Comptes de service**
2. Cliquez sur **Générer une nouvelle clé privée**
3. Téléchargez le fichier JSON
4. Copiez le contenu du JSON dans `.env.local` :

```env
FIREBASE_ADMIN_SERVICE_ACCOUNT={"type":"service_account","project_id":"...",...}
```

**Option B : Fichier JSON local (Pour développement)**

1. Téléchargez le fichier JSON du Service Account
2. Placez-le dans le projet (ex: `firebase-admin-key.json`)
3. Ajoutez dans `.env.local` :

```env
GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-key.json
```

⚠️ **Important** : Ajoutez `firebase-admin-key.json` dans `.gitignore` !

---

## 📊 Modèle de Données Firestore

### Collections Principales

1. **`users`** - Profils utilisateurs (artisans)
   - `id`: UID Firebase Auth
   - `email`: Email utilisateur
   - `role`: 'artisan' | 'admin'
   - `companyName`: Nom de l'entreprise
   - `phone`: Téléphone
   - `createdAt`, `updatedAt`: Dates

2. **`clients`** - Clients des artisans
   - `id`: ID Firestore (auto-généré)
   - `userId`: UID du propriétaire
   - `name`: Nom complet
   - `phone`, `email`, `address`: Coordonnées
   - `createdAt`, `updatedAt`: Dates

3. **`quotes`** - Devis
   - `id`: ID Firestore (auto-généré)
   - `userId`: UID du propriétaire
   - `clientId`: ID du client
   - `title`: Titre du devis
   - `description`: Description
   - `amountHt`, `amountTtc`: Montants
   - `status`: 'draft' | 'sent' | 'viewed' | 'reminded' | 'accepted' | 'refused'
   - `pdfUrl`: URL du PDF (Firebase Storage)
   - `sentAt`, `lastSentAt`, `viewedAt`, `acceptedAt`: Dates événements
   - `createdAt`, `updatedAt`: Dates
   - Sous-collection : `items` - Lignes du devis

4. **`reminders`** - Relances programmées
   - `id`: ID Firestore (auto-généré)
   - `quoteId`: ID du devis
   - `userId`: UID du propriétaire
   - `reminderDate`: Date programmée
   - `reminderType`: 'SMS' | 'email'
   - `status`: 'pending' | 'done'
   - `createdAt`, `completedAt`: Dates

5. **`signatures`** - Signatures clients
   - `id`: ID Firestore (auto-généré)
   - `quoteId`: ID du devis (unique)
   - `signatureImageUrl`: URL de l'image (Firebase Storage)
   - `signedAt`: Date de signature
   - `ipAddress`, `clientName`: Métadonnées

6. **`subscriptions`** - Abonnements Stripe (futur)
   - `id`: ID Firestore (auto-généré)
   - `userId`: UID du propriétaire
   - `stripeCustomerId`, `stripeSubscriptionId`: IDs Stripe
   - `status`: 'active' | 'canceled' | 'past_due' | 'trialing'
   - `plan`: 'free' | 'starter' | 'pro' | 'enterprise'
   - `currentPeriodStart`, `currentPeriodEnd`: Dates période
   - `createdAt`, `updatedAt`: Dates

---

## 🔐 Règles de Sécurité Firestore

Les règles de sécurité garantissent que chaque utilisateur ne peut accéder qu'à ses propres données :

```javascript
// Un utilisateur peut lire/écrire uniquement ses propres clients
match /clients/{clientId} {
  allow read: if isOwner(resource.data.userId);
  allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
  allow update: if isOwner(resource.data.userId);
  allow delete: if isOwner(resource.data.userId);
}
```

**Copiez les règles complètes depuis `firestore.rules.example`** dans Firebase Console > Firestore > Règles.

---

## 🔄 Migration des Données (Optionnel)

Si vous avez déjà des données dans Prisma/SQLite, vous pouvez migrer :

1. **Exporter les données** depuis Prisma Studio ou SQLite
2. **Convertir le format** pour correspondre aux types Firestore
3. **Importer dans Firestore** via Firebase Console ou scripts

⚠️ **Note** : La migration automatique n'est pas implémentée. Pour un projet en production, envisagez un script de migration personnalisé.

---

## 📝 Utilisation des Routes API Firebase

### Authentification

```typescript
// POST /api/auth/login-firebase
const response = await fetch('/api/auth/login-firebase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})

// POST /api/auth/register-firebase
const response = await fetch('/api/auth/register-firebase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, companyName, phone }),
})

// GET /api/auth/me-firebase
const response = await fetch('/api/auth/me-firebase', {
  credentials: 'include', // Pour envoyer le cookie
})
```

### CRM

```typescript
// GET /api/clients-firebase
const response = await fetch('/api/clients-firebase', {
  credentials: 'include',
})

// POST /api/quotes-firebase
const response = await fetch('/api/quotes-firebase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    clientId,
    title,
    description,
    items: [...],
    autoReminders: true,
  }),
})
```

---

## 🚢 Déploiement sur Vercel

### Variables d'Environnement

Dans Vercel, ajoutez toutes les variables de `.env.local.example` :

1. Vercel Dashboard > Votre Projet > **Settings** > **Environment Variables**
2. Ajoutez les variables Firebase (NEXT_PUBLIC_*)
3. Ajoutez les variables Firebase Admin (FIREBASE_ADMIN_SERVICE_ACCOUNT)
4. Ajoutez les autres services (EMAIL, SMS, STRIPE)

### Build

Le build Next.js devrait fonctionner sans modification :

```bash
npm run build
```

---

## ⚠️ Notes Importantes

### Ancien vs Nouveau Système

- **Ancien** : Routes API `/api/auth/login`, `/api/clients`, `/api/quotes`
- **Nouveau** : Routes API `/api/auth/login-firebase`, `/api/clients-firebase`, `/api/quotes-firebase`

⚠️ **Pour migrer complètement**, vous devrez :
1. Mettre à jour les appels API côté client
2. Remplacer les anciennes routes par les nouvelles
3. Supprimer les dépendances Prisma (optionnel)

### Compatibilité

Les deux systèmes (Prisma et Firebase) coexistent pour l'instant. Vous pouvez :
- Tester les nouvelles routes Firebase en parallèle
- Migrer progressivement les pages
- Supprimer l'ancien code une fois la migration validée

---

## 🔧 Prochaines Étapes

1. ✅ Configuration Firebase complète
2. ✅ Routes API Firebase créées
3. ⏳ Migrer les pages client (login, register, dashboard, etc.)
4. ⏳ Implémenter le rafraîchissement automatique des tokens Firebase
5. ⏳ Migrer la génération PDF vers Firebase Storage
6. ⏳ Implémenter complètement SMS (Twilio/Vonage)
7. ⏳ Implémenter complètement Stripe (checkout, webhooks)

---

## 📚 Ressources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Stripe Documentation](https://stripe.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Migration Firebase terminée !** 🎉

