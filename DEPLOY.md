# 🚀 Guide de Déploiement Rapide - FaciliDevis

## ⚡ Solution la plus rapide : Vercel CLI

### Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

### Étape 2 : Se connecter

```bash
vercel login
```

Cela ouvrira votre navigateur pour vous connecter (GitHub, GitLab, Bitbucket, ou email).

### Étape 3 : Déployer le projet

```bash
cd /Users/lb/facilidevis-cr
vercel
```

Vercel CLI va :
- Détecter automatiquement que c'est un projet Next.js
- Vous poser quelques questions (appuyez sur Entrée pour les valeurs par défaut)
- Déployer le projet
- Vous donner une URL (ex: `https://facilidevis-cr.vercel.app`)

### Étape 4 : Déployer en production

```bash
vercel --prod
```

---

## 🌐 Solution alternative : Via le site Vercel

### Si vous préférez utiliser l'interface web

#### 1. Préparer le code sur GitHub (si pas déjà fait)

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire un commit
git commit -m "Initial commit"

# Créer un repository sur GitHub
# Allez sur https://github.com/new
# Créez un nouveau repo (ex: facilidevis-cr)
# Ne cochez PAS "Initialize with README"

# Connecter le repo local à GitHub
git remote add origin https://github.com/VOTRE_USERNAME/facilidevis-cr.git
git branch -M main
git push -u origin main
```

#### 2. Déployer sur Vercel

1. **Aller sur** : [vercel.com/login](https://vercel.com/login)
2. **Se connecter** avec GitHub
3. **Cliquer sur** "Add New..." > "Project"
4. **Sélectionner** votre repository `facilidevis-cr`
5. **Cliquer sur** "Import"
6. **Configurer** :
   - Framework : Next.js (détecté automatiquement)
   - Build Command : `npm run build` (par défaut)
   - Output Directory : `.next` (par défaut)
7. **Cliquer sur** "Deploy"

#### 3. Configurer les variables d'environnement

Après le premier déploiement :

1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez toutes les variables depuis `.env.local.example`
3. **Important** : Ajoutez toutes les variables Firebase
4. Redéployez le projet

---

## 🔍 Retrouver un projet existant

### Si le projet est déjà sur Vercel

#### Méthode 1 : Via le dashboard Vercel

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Connectez-vous avec votre compte (GitHub, GitLab, etc.)
3. Tous vos projets apparaîtront dans la liste

#### Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Lister tous vos projets
vercel ls

# Voir les détails d'un projet
vercel inspect
```

#### Méthode 3 : Chercher dans vos emails

- Recherchez "vercel" dans votre boîte mail
- Vercel envoie des emails lors des déploiements
- Vous trouverez peut-être un lien vers votre projet

#### Méthode 4 : Tester des URLs possibles

Essayez ces URLs dans votre navigateur :
- `https://facilidevis.vercel.app`
- `https://facilidevis-cr.vercel.app`
- `https://facilidevis-cr-[votre-username].vercel.app`

---

## ✅ Après le déploiement

### Vérifier que tout fonctionne

1. **Tester l'URL** : Ouvrez l'URL fournie par Vercel
2. **Vérifier les logs** : Allez dans Vercel Dashboard > Deployments pour voir les logs
3. **Configurer les variables d'environnement** : Settings > Environment Variables

### Prochaines étapes

1. **Configurer Firebase** : Ajoutez toutes les variables Firebase dans Vercel
2. **Tester l'authentification** : Créez un compte de test
3. **Connecter un domaine** : Voir [docs/guide-domaine-vercel.md](./docs/guide-domaine-vercel.md)

---

## 🐛 Problèmes courants

### "Je ne me souviens plus de mon compte Vercel"

**Solution** :
1. Essayez toutes les méthodes de connexion (GitHub, GitLab, Bitbucket, Email)
2. Si vous ne trouvez pas, créez un nouveau compte
3. Vous pourrez toujours réimporter le projet

### "Le projet ne se déploie pas"

**Vérifications** :
- Les variables d'environnement sont-elles configurées ?
- Le build passe-t-il en local ? (`npm run build`)
- Y a-t-il des erreurs dans les logs Vercel ?

### "Je veux déployer sans GitHub"

**Solution** : Utilisez Vercel CLI
```bash
vercel login
vercel
```

---

## 📞 Besoin d'aide ?

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)
- **Vercel CLI** : [vercel.com/docs/cli](https://vercel.com/docs/cli)

---

**Commande rapide pour déployer maintenant** :

```bash
npm install -g vercel && vercel login && vercel --prod
```

