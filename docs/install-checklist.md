# ✅ Checklist de Déploiement - FaciliDevis

Cette checklist vous guide étape par étape pour déployer FaciliDevis en production.

---

## 🔥 1. Configuration Firebase

### Authentication
- [ ] Créer un projet Firebase sur [Firebase Console](https://console.firebase.google.com)
- [ ] Activer **Authentication** > **Email/Password**
- [ ] (Optionnel) Activer **Google** pour l'authentification Google
- [ ] Configurer les domaines autorisés dans Firebase Auth (votre domaine de production)

### Firestore Database
- [ ] Activer **Firestore Database** (mode production)
- [ ] Copier les règles de sécurité depuis `firestore.rules.example`
- [ ] Coller dans Firebase Console > Firestore > Règles
- [ ] Créer les index nécessaires (Firebase les suggérera automatiquement)

### Storage
- [ ] Activer **Storage** dans Firebase Console
- [ ] Configurer les règles de sécurité Storage (voir ci-dessous)
- [ ] Vérifier que les règles autorisent l'upload pour les utilisateurs authentifiés

**Règles Storage recommandées :**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /quotes/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /clients/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Récupérer les clés
- [ ] Aller dans Firebase Console > Paramètres du projet > Mes applications
- [ ] Créer une application web si nécessaire
- [ ] Copier toutes les clés de configuration Firebase

---

## 📧 2. Configuration Email (Resend)

- [ ] Créer un compte sur [Resend](https://resend.com)
- [ ] Vérifier un domaine (ou utiliser `onboarding@resend.dev` pour les tests)
- [ ] Créer une clé API dans Resend Dashboard
- [ ] Copier la clé API (commence par `re_`)

**Alternative : SMTP**
- [ ] Configurer SMTP (Gmail, Outlook, etc.)
- [ ] Créer un mot de passe d'application si nécessaire

---

## 📱 3. Configuration SMS (Twilio)

- [ ] Créer un compte sur [Twilio](https://www.twilio.com)
- [ ] Acheter un numéro de téléphone Twilio (ou utiliser le numéro d'essai)
- [ ] Récupérer `Account SID` et `Auth Token` depuis Twilio Console
- [ ] Copier le numéro de téléphone Twilio (format: `+33XXXXXXXXX`)

**Alternative : Vonage**
- [ ] Configurer Vonage (Nexmo) si préféré

---

## 💳 4. Configuration Stripe (Optionnel)

- [ ] Créer un compte sur [Stripe](https://stripe.com)
- [ ] Récupérer les clés API (Test et Production)
- [ ] Créer les produits/plans dans Stripe Dashboard
- [ ] Configurer le webhook Stripe :
  - [ ] Aller dans Stripe Dashboard > Developers > Webhooks
  - [ ] Ajouter endpoint : `https://votre-domaine.com/api/stripe/webhook`
  - [ ] Sélectionner les événements : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
  - [ ] Copier le secret du webhook (`whsec_...`)

---

## 🚀 5. Déploiement Vercel

### Préparation
- [ ] Pousser le code sur GitHub (ou GitLab, Bitbucket)
- [ ] Créer un compte Vercel si nécessaire
- [ ] Importer le projet depuis GitHub

### Variables d'environnement
Dans Vercel Dashboard > Settings > Environment Variables, ajouter :

**Firebase (obligatoire) :**
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_ADMIN_SERVICE_ACCOUNT` (JSON complet)

**Application :**
- [ ] `NEXT_PUBLIC_APP_URL` (ex: `https://facilidevis.com`)

**Email :**
- [ ] `RESEND_API_KEY` (ou configuration SMTP)
- [ ] `EMAIL_FROM`

**SMS (optionnel) :**
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`

**Stripe (optionnel) :**
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

### Déploiement
- [ ] Déployer sur Vercel
- [ ] Vérifier que le build passe sans erreur
- [ ] Tester l'application déployée

---

## 🌐 6. Configuration Nom de Domaine

- [ ] Acheter un nom de domaine (ex: `facilidevis.com`)
- [ ] Ajouter le domaine dans Vercel Dashboard > Settings > Domains
- [ ] Configurer les enregistrements DNS selon les instructions Vercel
- [ ] Attendre la propagation DNS (jusqu'à 48h)
- [ ] Vérifier que HTTPS fonctionne automatiquement
- [ ] Tester l'accès via le domaine personnalisé

**Voir** : [docs/domain-setup.md](./domain-setup.md) pour les détails

---

## 🔒 7. Sécurité

### Vérifications
- [ ] Vérifier que tous les secrets sont dans les variables d'environnement (pas en dur dans le code)
- [ ] Vérifier que les règles Firestore sont correctes
- [ ] Vérifier que les règles Storage sont correctes
- [ ] Tester que les utilisateurs ne peuvent accéder qu'à leurs propres données
- [ ] Vérifier les headers de sécurité (utiliser [SecurityHeaders.com](https://securityheaders.com))

### Tests de sécurité
- [ ] Tester l'authentification (login, register, logout)
- [ ] Tester que les routes API sont protégées
- [ ] Tester que les données sont bien isolées par utilisateur
- [ ] Vérifier que les erreurs ne révèlent pas d'informations sensibles

---

## 📊 8. Monitoring & Logs

### Configuration
- [ ] (Optionnel) Configurer Sentry pour le monitoring d'erreurs
- [ ] Vérifier que les logs sont bien structurés
- [ ] Configurer des alertes pour les erreurs critiques

### Vérifications
- [ ] Tester que les logs apparaissent dans Vercel Dashboard
- [ ] Vérifier que les erreurs sont bien capturées

---

## ✅ 9. Tests Finaux

### Fonctionnalités principales
- [ ] **Authentification** : Inscription, connexion, déconnexion
- [ ] **Clients** : Création, modification, suppression
- [ ] **Devis** : Création, modification, visualisation
- [ ] **PDF** : Génération et téléchargement
- [ ] **Email** : Envoi de devis par email
- [ ] **SMS** : (Si configuré) Envoi de SMS
- [ ] **Relances** : Programmation et exécution des relances
- [ ] **Dashboard** : Affichage des statistiques

### Tests de performance
- [ ] Vérifier les temps de chargement des pages
- [ ] Tester sur mobile (responsive)
- [ ] Vérifier que les images sont optimisées

### Tests de compatibilité
- [ ] Tester sur Chrome, Firefox, Safari
- [ ] Tester sur mobile (iOS, Android)
- [ ] Vérifier que l'application fonctionne hors ligne (si applicable)

---

## 📝 10. Documentation

- [ ] Mettre à jour le README avec les instructions de déploiement
- [ ] Documenter les variables d'environnement
- [ ] Créer un guide utilisateur (optionnel)
- [ ] Documenter les procédures de maintenance

---

## 🎉 Déploiement Terminé !

Une fois toutes les cases cochées, votre application FaciliDevis est prête pour la production !

### Prochaines étapes recommandées

1. **Backup** : Configurer des sauvegardes automatiques de Firestore
2. **Monitoring** : Mettre en place un monitoring avancé (Sentry, LogRocket)
3. **Analytics** : Ajouter Google Analytics ou Plausible
4. **SEO** : Optimiser le SEO si nécessaire
5. **Performance** : Optimiser les performances avec Lighthouse

---

## 🐛 En cas de problème

Consultez :
- [README.md](../README.md) - Documentation principale
- [FIREBASE_MIGRATION.md](../FIREBASE_MIGRATION.md) - Guide Firebase
- [docs/domain-setup.md](./domain-setup.md) - Configuration domaine
- [Vercel Documentation](https://vercel.com/docs) - Documentation Vercel
- [Firebase Documentation](https://firebase.google.com/docs) - Documentation Firebase

---

**Bon déploiement !** 🚀

