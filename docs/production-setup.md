# 🚀 Configuration Production - FaciliDevis

Résumé de la configuration technique complète pour la production.

---

## 📦 Services Configurés

### ✅ Firebase
- **Authentication** : Email/Password, Google (optionnel)
- **Firestore** : Base de données NoSQL avec règles de sécurité
- **Storage** : Stockage de fichiers (PDFs, logos, photos)

### ✅ Email (Resend)
- Templates HTML professionnels
- Envoi de devis avec PDF en pièce jointe
- Relances automatiques par email

### ✅ SMS (Twilio)
- Envoi de SMS pour relances
- API route `/api/sms/send`
- Support simulation en développement

### ✅ PDF
- Génération server-side avec jsPDF
- Stockage automatique dans Firebase Storage
- Templates professionnels

### ✅ Stripe
- Création de customers
- Sessions Checkout pour abonnements
- Webhooks pour gestion des abonnements
- Support complet des événements Stripe

---

## 🔧 Fichiers de Configuration

### `next.config.js`
- Headers de sécurité (HSTS, XSS Protection, etc.)
- Optimisations (compression, images)
- Configuration pour Firebase Storage

### `vercel.json`
- Configuration de déploiement
- Headers de sécurité
- Cron jobs pour relances automatiques

### `.env.local.example`
- Toutes les variables d'environnement nécessaires
- Documentation complète

---

## 📁 Structure des Services

```
lib/
├── firebase.ts              # Configuration Firebase (Auth, Firestore, Storage)
├── firebase-admin.ts        # Firebase Admin SDK (serveur)
├── firebase-auth.ts         # Authentification Firebase
├── firebase-storage.ts      # Upload/Download fichiers
├── firestore.ts             # Services Firestore (CRUD)
├── middleware-firebase.ts   # Middleware authentification
├── email.ts                 # Service email (Resend/SMTP)
├── sms.ts                   # Service SMS (Twilio/Vonage)
├── stripe.ts                # Service Stripe
├── pdf.ts                   # Génération PDF
├── pdf-enhanced.ts          # PDF + Storage Firebase
├── validation.ts            # Schémas Zod
├── rate-limit.ts           # Rate limiting
└── logger.ts               # Logs structurés

lib/templates/
├── quote-email.tsx         # Template email devis
└── reminder-email.tsx      # Template email relance

app/api/
├── auth/
│   ├── login-firebase/     # Connexion Firebase
│   ├── register-firebase/  # Inscription Firebase
│   ├── me-firebase/        # Utilisateur connecté
│   └── logout-firebase/    # Déconnexion
├── clients-firebase/       # CRUD clients
├── quotes-firebase/        # CRUD devis
├── dashboard-firebase/     # Statistiques
├── sms/
│   └── send/               # Envoi SMS
└── stripe/
    ├── create-checkout-session/  # Création session paiement
    └── webhook/                  # Webhooks Stripe
```

---

## 🔐 Sécurité

### Headers de Sécurité
- ✅ HSTS (Strict-Transport-Security)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### Validation
- ✅ Schémas Zod pour toutes les entrées utilisateur
- ✅ Validation côté serveur et client

### Rate Limiting
- ✅ Rate limiting sur les API routes
- ✅ Protection contre les abus

### Logs
- ✅ Logs structurés
- ✅ Prêt pour intégration Sentry

---

## 📚 Documentation

- **[README.md](../README.md)** - Documentation principale
- **[FIREBASE_MIGRATION.md](../FIREBASE_MIGRATION.md)** - Guide migration Firebase
- **[docs/domain-setup.md](./domain-setup.md)** - Configuration nom de domaine
- **[docs/install-checklist.md](./install-checklist.md)** - Checklist de déploiement

---

## 🎯 Prochaines Étapes

1. **Déploiement** : Suivre [docs/install-checklist.md](./install-checklist.md)
2. **Monitoring** : Configurer Sentry ou équivalent
3. **Backup** : Configurer sauvegardes Firestore
4. **Analytics** : Ajouter Google Analytics ou Plausible
5. **Performance** : Optimiser avec Lighthouse

---

**Configuration terminée !** 🎉

