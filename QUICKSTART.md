# 🚀 Démarrage Rapide - FaciliDevis

## Installation en 3 étapes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
Créez un fichier `.env` :
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="changez-moi-en-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optionnel : Configuration email pour envoyer les devis
# Option 1 : Resend (recommandé)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="FaciliDevis <no-reply@votre-domaine.com>"

# Option 2 : SMTP (Gmail, Outlook, etc.)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"
EMAIL_FROM="FaciliDevis <votre-email@gmail.com>"
```

### 3. Initialiser la base de données
```bash
npx prisma generate
npx prisma db push
```

### 4. Lancer l'application
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎯 Première utilisation

1. **Créer un compte** : `/register`
   - Renseignez votre nom d'entreprise, email et téléphone
   
2. **Créer un client** : `/clients/new`
   - Ajoutez au moins un client pour pouvoir créer des devis
   
3. **Créer un devis** : `/quotes/new`
   - Suivez les 3 étapes
   - Activez les relances automatiques si souhaité
   
4. **Envoyer le devis** : 
   - Cliquez sur le devis créé pour voir les détails
   - Cliquez sur **"Envoyer au client par email"** (nécessite la configuration email)
   - Ou utilisez **"Voir en PDF"** pour prévisualiser le devis

## 📱 Interface Mobile

L'application est optimisée pour mobile. Testez-la sur votre téléphone ou utilisez les outils de développement de votre navigateur (F12 > Mode mobile).

## 🔄 Relances Automatiques

Pour activer les relances automatiques, configurez un cron job qui appelle :
```
POST /api/reminders/process
Authorization: Bearer {CRON_SECRET}
```

Sur Vercel, vous pouvez utiliser Vercel Cron Jobs dans `vercel.json`.

## 🐛 Problèmes courants

**Erreur Prisma** : Assurez-vous d'avoir exécuté `npx prisma generate` et `npx prisma db push`

**Erreur de build** : Vérifiez que toutes les dépendances sont installées avec `npm install`

**Base de données vide** : C'est normal au premier démarrage, créez un compte et des données

## 📚 Documentation complète

Voir [README.md](./README.md) pour plus de détails.

