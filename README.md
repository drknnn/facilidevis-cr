# FaciliDevis - CRM Mobile pour Artisans

FaciliDevis est le CRM mobile le plus rapide de France pour artisans. Créez des devis 2× plus vite, relancez automatiquement, supprimez toute complexité.

## 🚀 Fonctionnalités V1

- ✅ Authentification sécurisée (inscription, connexion, déconnexion)
- ✅ Gestion des clients
- ✅ Création de devis en 3 étapes avec modèles rapides
- ✅ Génération automatique de PDF
- ✅ Envoi de devis par email avec PDF en pièce jointe
- ✅ Aperçu complet du devis avec visualisation PDF
- ✅ Relances automatiques (J+3, J+7, J+14)
- ✅ Tracking d'ouverture des devis
- ✅ Signature client simplifiée
- ✅ Interface mobile-first optimisée
- ✅ Tableau de bord avec statistiques

## 🛠️ Technologies

- **Next.js 14** - Framework React (App Router)
- **TypeScript** - Typage statique
- **Firebase** - Authentification + Base de données (Firestore)
- **Firebase Auth** - Authentification utilisateur (email/password, Google)
- **Firestore** - Base de données NoSQL
- **Tailwind CSS** - Styling
- **jsPDF** - Génération de PDF
- **Resend** - Envoi d'emails (optionnel, recommandé)
- **Nodemailer** - Alternative pour l'envoi d'emails (SMTP)
- **Stripe** - Paiements SaaS (préparation)
- **React Icons** - Icônes

**Note** : Le projet utilise actuellement **Firebase** (Auth + Firestore) comme backend. L'ancien système Prisma/SQLite peut encore être présent mais n'est plus utilisé.

## 📦 Installation et Configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration Firebase

**Étape 1 : Créer un projet Firebase**

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Cliquez sur **"Ajouter un projet"**
3. Suivez les étapes pour créer le projet
4. Activez **Authentication** > **Email/Password**
5. Activez **Firestore Database** (mode production ou test)

**Étape 2 : Configurer les règles Firestore**

1. Dans Firebase Console > **Firestore Database** > **Règles**
2. Copiez le contenu de `firestore.rules.example`
3. Collez-le dans les règles Firestore

**Étape 3 : Récupérer les clés Firebase**

1. Dans Firebase Console > **Paramètres du projet** > **Mes applications**
2. Créez une application web si nécessaire
3. Copiez les valeurs de configuration Firebase

### 3. Configuration de l'environnement

Créez un fichier `.env.local` à la racine du projet. Copiez `.env.local.example` et remplissez les valeurs :

```env
# ============================================
# FIREBASE CONFIGURATION (OBLIGATOIRE)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=votre-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# ============================================
# FIREBASE ADMIN SDK (Optionnel, pour production)
# ============================================
# Option A : Service Account JSON (pour Vercel)
# FIREBASE_ADMIN_SERVICE_ACCOUNT={"type":"service_account",...}

# Option B : Fichier JSON local (pour développement)
# GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-key.json

# ============================================
# URL DE L'APPLICATION
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ============================================
# CONFIGURATION EMAIL (OPTIONNEL)
# ============================================
# Option 1 : Resend (Recommandé)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="FaciliDevis <onboarding@resend.dev>"

# Option 2 : SMTP générique
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"

# ============================================
# STRIPE (Optionnel, pour paiements SaaS)
# ============================================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# ============================================
# SMS (Optionnel, pour relances SMS)
# ============================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_PHONE_NUMBER=+33123456789
```

**⚠️ Variables obligatoires pour Firebase :**
- Toutes les variables `NEXT_PUBLIC_FIREBASE_*` doivent être définies

**📚 Documentation complète** : Voir [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md) pour plus de détails.

**📧 Configuration Email :**
- Si aucune configuration email n'est fournie, l'application fonctionne en **mode simulation** en développement
- Les emails ne sont pas envoyés mais le devis est marqué comme envoyé dans la base de données
- Voir la section "Envoi de devis par email" ci-dessous pour plus de détails

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Authentification

FaciliDevis utilise **Firebase Authentication** pour gérer les utilisateurs.

### Flux d'authentification

1. **Inscription** (`/register`)
   - Création d'un compte avec email, mot de passe, nom d'entreprise
   - Compte Firebase Auth créé automatiquement
   - Document User créé dans Firestore avec les informations complémentaires
   - Token Firebase ID stocké dans un cookie HTTP-only
   - Redirection automatique vers `/dashboard`

2. **Connexion** (`/login`)
   - Vérification de l'email et du mot de passe via Firebase Auth
   - Génération d'un token Firebase ID
   - Stockage du token dans un cookie HTTP-only (sécurisé)
   - Redirection vers `/dashboard`

3. **Pages protégées**
   - Toutes les pages CRM sont protégées par Firebase Auth
   - Si non authentifié, redirection automatique vers `/login`
   - Le token Firebase est vérifié côté serveur à chaque requête API

4. **Déconnexion** (`/settings`)
   - Déconnexion Firebase Auth
   - Suppression du cookie de session
   - Redirection vers `/login`

### Sécurité

- ✅ **Firebase Auth** : Gestion sécurisée des mots de passe par Google
- ✅ **Tokens Firebase ID** : Tokens signés et vérifiables côté serveur
- ✅ **Cookies HTTP-only** : Empêche l'accès JavaScript au token (protection XSS)
- ✅ **Règles Firestore** : Chaque utilisateur ne peut accéder qu'à ses propres données
- ✅ **Normalisation email** : Emails convertis en lowercase avant stockage
- ✅ **Validation** : Vérification des champs obligatoires côté serveur et client

### Dépannage

**Problème : "Je ne peux plus me connecter"**

1. Vérifiez que toutes les variables `NEXT_PUBLIC_FIREBASE_*` sont bien définies dans `.env.local`
2. Vérifiez que Firebase Authentication est bien activé dans Firebase Console
3. Vérifiez les logs du serveur pour les erreurs
4. Vérifiez que l'utilisateur existe dans Firebase Console > Authentication

**Problème : "Firebase initialization error"**

- Vérifiez que toutes les clés Firebase sont correctes dans `.env.local`
- Redémarrez le serveur (`npm run dev`)

## 📱 Utilisation

### Première connexion

1. Allez sur `/register` pour créer un compte
2. Renseignez vos informations :
   - Nom de l'entreprise
   - Email (sera utilisé pour vous connecter)
   - Téléphone (optionnel)
   - Mot de passe (minimum 6 caractères)
3. Vous êtes automatiquement connecté et redirigé vers le dashboard

### Créer un devis

1. Allez dans **Clients** et créez un nouveau client
2. Allez dans **Devis** et cliquez sur **Nouveau**
3. Suivez les 3 étapes :
   - **Étape 1** : Choisir un client
   - **Étape 2** : Ajouter les articles
     - Utilisez les **modèles rapides** pour remplir rapidement les descriptions
     - Ajoutez quantité et prix unitaire
   - **Étape 3** : Récapitulatif et activation des relances automatiques
4. Le devis est créé en brouillon avec PDF généré automatiquement
5. Sur la page de détail du devis :
   - Cliquez sur **"Envoyer au client par email"** pour envoyer le devis par email
   - Cliquez sur **"Voir en PDF"** pour prévisualiser le PDF dans un nouvel onglet
   - Cliquez sur **"Télécharger"** pour télécharger le PDF

### Envoi de devis par email

FaciliDevis permet d'envoyer directement les devis par email aux clients depuis l'interface.

#### Configuration Email

**Option 1 : Resend (Recommandé)**

1. Créez un compte sur [Resend](https://resend.com) (gratuit jusqu'à 3000 emails/mois)
2. Allez dans **API Keys** > **Create API Key**
3. Copiez la clé (commence par `re_`)
4. Ajoutez dans `.env` :
   ```env
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   EMAIL_FROM="FaciliDevis <onboarding@resend.dev>"
   ```
5. Redémarrez le serveur

**Option 2 : SMTP (Gmail, Outlook, etc.)**

Pour Gmail :
1. Activez la validation en 2 étapes sur votre compte Google
2. Créez un [mot de passe d'application](https://myaccount.google.com/apppasswords)
3. Ajoutez dans `.env` :
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="votre-email@gmail.com"
   SMTP_PASS="votre-mot-de-passe-app"
   EMAIL_FROM="FaciliDevis <votre-email@gmail.com>"
   ```

**Mode développement (sans configuration) :**

Si vous ne configurez pas l'email :
- ✅ Le bouton fonctionne normalement
- ✅ Le devis est marqué comme envoyé dans la base de données
- ⚠️ Aucun email réel n'est envoyé (simulation dans les logs console)
- 📝 Un message clair s'affiche : "Mode développement - configurez l'email pour un envoi réel"

#### Utilisation

1. Ouvrez un devis depuis la liste des devis
2. Vérifiez que le client a une adresse email (sinon, ajoutez-la dans les informations du client)
3. Cliquez sur **"Envoyer au client par email"**
4. Le devis est envoyé avec :
   - Un email HTML avec le détail du devis
   - Le PDF en pièce jointe
   - Un lien pour accepter le devis en ligne
5. La date du dernier envoi est enregistrée et affichée sur la page du devis

**Guide de configuration détaillé :** Voir [EMAIL_SETUP.md](./EMAIL_SETUP.md)

### Relances automatiques

Les relances sont programmées automatiquement lors de la création du devis si l'option est activée :
- **J+3** : Première relance
- **J+7** : Deuxième relance
- **J+14** : Relance finale

Pour activer le traitement automatique des relances, configurez un cron job qui appelle :
```
POST /api/reminders/process
Authorization: Bearer {CRON_SECRET}
```

### Signature client

Les clients peuvent accepter un devis via le lien public `/quote/[id]`. L'acceptation met à jour automatiquement le statut du devis.

## 🎨 Design System

### Couleurs

- **Bleu principal** : `#2196F3` / `#1E88E5` - Confiance, actions principales
- **Gris clair** : `#F5F5F7` - Fonds de page
- **Gris moyen** : `#757575` - Textes secondaires
- **Gris foncé** : `#212121` - Textes principaux
- **Succès** : `#4CAF50` - Badges "Accepté"
- **Attention** : `#FF9800` - Badges "Relancé", états en attente
- **Erreur** : `#F44336` - Messages d'erreur, badges "Refusé"

### Badges de statut

- **Brouillon** : Gris
- **Envoyé** : Bleu
- **Vu** : Bleu clair
- **Relancé** : Orange
- **Accepté** : Vert
- **Refusé** : Rouge

## 📊 Structure de la base de données (Firestore)

### Collections Principales

- **`users`** - Profils utilisateurs (artisans)
  - `id`: UID Firebase Auth
  - `email`, `companyName`, `phone`, `role`
  - `createdAt`, `updatedAt`

- **`clients`** - Clients des artisans
  - `id`: ID Firestore
  - `userId`: Propriétaire
  - `name`, `phone`, `email`, `address`
  - `createdAt`, `updatedAt`

- **`quotes`** - Devis
  - `id`: ID Firestore
  - `userId`, `clientId`
  - `title`, `description`, `amountHt`, `amountTtc`, `status`
  - `pdfUrl`, `sentAt`, `viewedAt`, `acceptedAt`
  - Sous-collection : `items` (lignes du devis)

- **`reminders`** - Relances programmées
  - `id`: ID Firestore
  - `quoteId`, `userId`
  - `reminderDate`, `reminderType`, `status`
  - `createdAt`, `completedAt`

- **`signatures`** - Signatures clients (futur)
- **`subscriptions`** - Abonnements Stripe (futur)

**📚 Documentation complète** : Voir [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md) pour le schéma détaillé et les règles de sécurité.

## 🔧 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run start` - Lancer le serveur de production
- `npm run lint` - Vérifier le code avec ESLint

## 🚀 Déploiement

### Vercel (recommandé)

1. Poussez votre code sur GitHub
2. Importez le projet sur Vercel
3. Configurez les variables d'environnement dans les paramètres du projet
4. Déployez !

### Connecter un nom de domaine

Pour connecter votre domaine personnalisé à Vercel :

1. **Guide rapide** : Voir [docs/quick-start-domain.md](./docs/quick-start-domain.md) (5 minutes)
2. **Guide complet** : Voir [docs/guide-domaine-vercel.md](./docs/guide-domaine-vercel.md) (détaillé)
3. **Documentation technique** : Voir [docs/domain-setup.md](./docs/domain-setup.md)

**Résumé** :
- Allez sur Vercel Dashboard > Settings > Domains
- Ajoutez votre domaine
- Configurez les enregistrements DNS chez votre registrar (A ou CNAME)
- HTTPS est automatique !

### Variables d'environnement en production (Vercel)

Dans Vercel Dashboard > Settings > Environment Variables, ajoutez :

**Firebase (obligatoire) :**
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`

**Firebase Admin (pour vérification tokens) :**
- ✅ `FIREBASE_ADMIN_SERVICE_ACCOUNT` (JSON complet du Service Account)

**Application :**
- ✅ `NEXT_PUBLIC_APP_URL` - URL de votre application (ex: `https://votre-domaine.com`)

**Services optionnels :**
- ✅ `RESEND_API_KEY` ou configuration SMTP - Pour l'envoi d'emails
- ✅ `EMAIL_FROM` - Adresse email d'envoi
- ✅ `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` - Pour les paiements SaaS
- ✅ `TWILIO_*` - Pour les SMS

**📚 Guide complet** : Voir [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md) pour le déploiement détaillé.

## 📝 Notes importantes

### Migration Firebase (Décembre 2024)

✅ **Migration complète vers Firebase** :
- ✅ Firebase Authentication (remplace JWT + bcrypt)
- ✅ Firestore Database (remplace Prisma + SQLite)
- ✅ Routes API Firebase créées (`-firebase` suffix)
- ✅ Services Firestore complets (clients, quotes, reminders)
- ✅ Middleware Firebase pour protection des routes
- ✅ Services SMS et Stripe préparés (squelettes)

**⚠️ Ancien système** : Les routes API Prisma (`/api/auth/login`, `/api/clients`, etc.) existent toujours mais ne sont plus utilisées. Les nouvelles routes Firebase sont disponibles avec le suffixe `-firebase`.

**📚 Documentation** : Voir [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md) pour tous les détails de la migration.

### Limitations actuelles

- Le système de relances par email nécessite la configuration SMTP/Resend
- Les PDF sont générés côté serveur (en production, stockez-les dans Firebase Storage)
- L'application est optimisée pour mobile mais fonctionne aussi sur desktop
- SMS et Stripe sont en préparation (squelettes créés)

## 🎯 Roadmap V2

- Facturation
- Scan de tickets
- Import contacts téléphone
- App native iOS / Android
- Paiement acompte

## 🐛 Dépannage

### Problèmes courants

**1. "Firebase initialization error"**
- Solution : Vérifiez que toutes les variables `NEXT_PUBLIC_FIREBASE_*` sont définies dans `.env.local`
- Vérifiez que les clés Firebase sont correctes dans Firebase Console

**2. "Email configuration missing"**
- Solution : C'est normal en développement. Configurez Resend ou SMTP pour un envoi réel (voir section Email)

**3. "Unauthorized" sur les routes API**
- Solution : Vérifiez que l'utilisateur est bien connecté avec Firebase Auth
- Vérifiez que les règles Firestore sont correctement configurées

**4. Problèmes de connexion Firebase**
- Solution : Vérifiez que Firebase Authentication est activé dans Firebase Console
- Vérifiez que le provider Email/Password est activé
- Vérifiez les logs du serveur pour les erreurs détaillées

## 📄 Licence

Propriétaire - Tous droits réservés
