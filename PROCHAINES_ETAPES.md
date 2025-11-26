# 🎉 Projet déployé sur GitHub !

## ✅ Succès !

Votre projet FaciliDevis est maintenant disponible sur GitHub :
**https://github.com/drknnn/facilidevis-cr**

---

## 🚀 Prochaines étapes : Déployer sur Vercel

### Option 1 : Via le site Vercel (Recommandé)

1. **Aller sur** : [vercel.com/login](https://vercel.com/login)
2. **Se connecter** avec GitHub
3. **Importer le projet** :
   - Cliquez sur "Add New..." > "Project"
   - Sélectionnez `drknnn/facilidevis-cr`
   - Cliquez sur "Import"
4. **Configurer** :
   - Framework : Next.js (détecté automatiquement)
   - Build Command : `npm run build` (par défaut)
   - Output Directory : `.next` (par défaut)
5. **Cliquer sur** "Deploy"

### Option 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd /Users/lb/facilidevis-cr
vercel
```

---

## ⚙️ Configuration Vercel

### Variables d'environnement à ajouter

Après le premier déploiement, allez dans **Settings** > **Environment Variables** et ajoutez :

**Firebase (obligatoire)** :
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_ADMIN_SERVICE_ACCOUNT` (JSON complet)

**Application** :
- `NEXT_PUBLIC_APP_URL` (ex: `https://facilidevis.vercel.app`)

**Email (optionnel)** :
- `RESEND_API_KEY`
- `EMAIL_FROM`

**SMS (optionnel)** :
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

**Stripe (optionnel)** :
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## 🔐 Sécurité du Token GitHub

**⚠️ Important** : Votre token GitHub a été utilisé. Pour votre sécurité :

1. **Révoquer le token** (recommandé) :
   - Allez sur : [github.com/settings/tokens](https://github.com/settings/tokens)
   - Trouvez le token utilisé
   - Cliquez sur "Revoke"

2. **Pour les prochains pushs** :
   - Utilisez un nouveau token
   - Ou configurez SSH (plus sécurisé)

---

## ✅ Checklist de déploiement

- [x] Code poussé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Premier déploiement réussi
- [ ] Application accessible via l'URL Vercel
- [ ] Firebase configuré et testé
- [ ] (Optionnel) Domaine personnalisé connecté

---

## 📚 Documentation

- **Guide complet** : Voir [docs/install-checklist.md](./docs/install-checklist.md)
- **Configuration domaine** : Voir [docs/guide-domaine-vercel.md](./docs/guide-domaine-vercel.md)
- **Firebase** : Voir [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md)

---

**Votre projet est prêt pour le déploiement sur Vercel !** 🚀

