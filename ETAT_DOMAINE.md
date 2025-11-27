# 🌐 État actuel : Intégration d'un nom de domaine

## 📊 Où en sommes-nous ?

### ✅ Ce qui est déjà fait

1. **Documentation complète créée** :
   - ✅ `docs/quick-start-domain.md` - Guide rapide (5 minutes)
   - ✅ `docs/guide-domaine-vercel.md` - Guide détaillé en français
   - ✅ `docs/domain-setup.md` - Documentation technique
   - ✅ `README.md` - Section sur les domaines

2. **Configuration Vercel prête** :
   - ✅ `vercel.json` configuré
   - ✅ Headers de sécurité configurés
   - ✅ Build optimisé pour Next.js

3. **Code prêt** :
   - ✅ Variables d'environnement documentées
   - ✅ `NEXT_PUBLIC_APP_URL` configurable

### ⏳ Ce qui reste à faire

1. **Déployer sur Vercel** (si pas encore fait)
   - Importer le projet depuis GitHub
   - Configurer les variables d'environnement Firebase

2. **Acheter/configurer un domaine** (si vous n'en avez pas)
   - Acheter un domaine (ex: Namecheap, OVH, Google Domains)
   - Ou utiliser un domaine existant

3. **Connecter le domaine à Vercel** (5 minutes)
   - Ajouter le domaine dans Vercel Dashboard
   - Configurer les enregistrements DNS
   - Attendre la propagation DNS (quelques minutes à 48h)

4. **Mettre à jour les variables d'environnement**
   - Mettre à jour `NEXT_PUBLIC_APP_URL` avec votre domaine
   - Redéployer sur Vercel

---

## 🚀 Prochaines étapes

### Étape 1 : Déployer sur Vercel (si pas encore fait)

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New..."** > **"Project"**
4. Sélectionnez `drknnn/facilidevis-cr`
5. Cliquez sur **"Import"**
6. **Configurez les variables d'environnement** :
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_APP_URL` = `https://votre-projet.vercel.app` (pour l'instant)
7. Cliquez sur **"Deploy"**

### Étape 2 : Acheter/configurer un domaine

**Si vous n'avez pas de domaine** :
- **Namecheap** : [namecheap.com](https://www.namecheap.com) - ~10€/an
- **OVH** : [ovh.com](https://www.ovh.com) - ~5-10€/an
- **Google Domains** : [domains.google](https://domains.google) - ~10€/an
- **Porkbun** : [porkbun.com](https://porkbun.com) - ~5€/an

**Si vous avez déjà un domaine** :
- Allez directement à l'étape 3

### Étape 3 : Connecter le domaine à Vercel

**Guide rapide** (5 minutes) :

1. **Dans Vercel Dashboard** :
   - Allez dans votre projet
   - Cliquez sur **"Settings"** > **"Domains"**
   - Cliquez sur **"Add Domain"**
   - Entrez votre domaine (ex: `facilidevis.fr` ou `www.facilidevis.fr`)
   - Cliquez sur **"Add"**

2. **Vercel vous donnera des instructions DNS** :
   - Soit un **enregistrement A** (ex: `76.76.21.21`)
   - Soit un **enregistrement CNAME** (ex: `cname.vercel-dns.com`)

3. **Configurez les DNS chez votre registrar** :
   - Allez sur le site de votre registrar (Namecheap, OVH, etc.)
   - Trouvez la section **"DNS"** ou **"Gestion DNS"**
   - Ajoutez l'enregistrement donné par Vercel :
     - **Type** : A ou CNAME
     - **Nom** : `@` (pour le domaine racine) ou `www` (pour www)
     - **Valeur** : La valeur donnée par Vercel
     - **TTL** : 3600 (ou par défaut)

4. **Attendre la propagation** :
   - Généralement 5-30 minutes
   - Parfois jusqu'à 48h (rare)
   - Vercel vous notifiera quand c'est prêt

5. **HTTPS automatique** :
   - Vercel configure automatiquement le certificat SSL
   - Votre site sera accessible en HTTPS automatiquement !

### Étape 4 : Mettre à jour les variables d'environnement

1. **Dans Vercel Dashboard** :
   - Allez dans **Settings** > **Environment Variables**
   - Trouvez `NEXT_PUBLIC_APP_URL`
   - Modifiez la valeur : `https://votre-domaine.com`
   - Sauvegardez

2. **Redéployer** :
   - Allez dans **Deployments**
   - Cliquez sur **"Redeploy"** sur le dernier déploiement
   - Ou poussez un nouveau commit sur GitHub

---

## 📚 Guides disponibles

### Guide rapide (5 minutes)
👉 **Lisez** : `docs/quick-start-domain.md`

### Guide complet (détaillé)
👉 **Lisez** : `docs/guide-domaine-vercel.md`

### Documentation technique
👉 **Lisez** : `docs/domain-setup.md`

---

## ✅ Checklist

- [ ] Projet déployé sur Vercel
- [ ] Variables d'environnement Firebase configurées sur Vercel
- [ ] Domaine acheté ou existant disponible
- [ ] Domaine ajouté dans Vercel Dashboard
- [ ] Enregistrements DNS configurés chez le registrar
- [ ] Propagation DNS terminée (vérifié dans Vercel)
- [ ] HTTPS actif automatiquement
- [ ] `NEXT_PUBLIC_APP_URL` mis à jour avec le domaine
- [ ] Redéploiement effectué
- [ ] Site accessible via le domaine personnalisé

---

## 🆘 Besoin d'aide ?

### Problème : "Domain not verified"
→ Attendez quelques minutes, la propagation DNS peut prendre du temps

### Problème : "DNS records not found"
→ Vérifiez que vous avez bien ajouté les enregistrements chez votre registrar

### Problème : "HTTPS not working"
→ Vercel configure automatiquement HTTPS, attendez quelques minutes après la vérification du domaine

### Problème : "Site not loading"
→ Vérifiez que `NEXT_PUBLIC_APP_URL` est bien configuré avec votre domaine

---

## 💡 Astuce

**Pour tester rapidement** :
- Vous pouvez utiliser le domaine Vercel gratuit : `votre-projet.vercel.app`
- Il fonctionne déjà en HTTPS
- Parfait pour tester avant de connecter votre domaine personnalisé

---

## 🎯 Résumé

**État actuel** : ✅ **Tout est prêt côté code et documentation**

**Action requise** : 
1. Déployer sur Vercel (si pas encore fait)
2. Acheter/configurer un domaine
3. Connecter le domaine à Vercel (5 minutes)
4. Mettre à jour `NEXT_PUBLIC_APP_URL`

**Temps estimé** : 10-15 minutes (sans compter l'achat du domaine)

---

**✅ Vous êtes prêt à connecter votre domaine ! Suivez le guide rapide : `docs/quick-start-domain.md`**

