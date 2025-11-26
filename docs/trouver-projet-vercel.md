# 🔍 Comment Retrouver ou Déployer votre Projet sur Vercel

## 🎯 Situation actuelle

Vous avez le code de FaciliDevis en local, mais vous ne savez pas si le projet est déjà sur Vercel ou comment y accéder.

---

## 🔹 Option 1 : Le projet est déjà sur Vercel

### Comment vérifier si le projet existe déjà

#### Méthode A : Via GitHub (si vous avez poussé le code)

1. **Vérifier sur GitHub** :
   - Allez sur [github.com](https://github.com)
   - Connectez-vous avec votre compte
   - Cherchez un repository nommé `facilidevis-cr` ou similaire
   - Si vous trouvez le repo, il est peut-être connecté à Vercel

2. **Vérifier les déploiements** :
   - Dans le repository GitHub, regardez s'il y a des badges "Deploy with Vercel"
   - Ou allez dans **Settings** > **Webhooks** pour voir si Vercel est connecté

#### Méthode B : Via email Vercel

1. **Chercher dans vos emails** :
   - Recherchez "vercel" dans votre boîte mail
   - Vercel envoie des emails lors des déploiements
   - Vous trouverez peut-être un lien vers votre projet

#### Méthode C : Tester l'URL

Si vous vous souvenez d'une URL possible :
- Essayez : `https://facilidevis.vercel.app`
- Ou : `https://facilidevis-cr.vercel.app`
- Ou votre domaine personnalisé si vous l'avez configuré

---

### Comment se connecter à Vercel

#### Si vous avez un compte Vercel

1. **Aller sur** : [vercel.com/login](https://vercel.com/login)
2. **Options de connexion** :
   - **GitHub** : Cliquez sur "Continue with GitHub"
   - **GitLab** : Cliquez sur "Continue with GitLab"
   - **Bitbucket** : Cliquez sur "Continue with Bitbucket"
   - **Email** : Entrez votre email et mot de passe

3. **Si vous avez oublié votre mot de passe** :
   - Cliquez sur "Forgot password"
   - Entrez votre email
   - Vérifiez votre boîte mail pour le lien de réinitialisation

#### Si vous n'avez pas de compte Vercel

1. **Créer un compte** :
   - Allez sur [vercel.com/signup](https://vercel.com/signup)
   - Choisissez "Sign up with GitHub" (recommandé)
   - Autorisez Vercel à accéder à vos repositories

2. **Une fois connecté** :
   - Vercel affichera automatiquement vos projets GitHub
   - Si votre projet est sur GitHub, il apparaîtra dans la liste

---

## 🔹 Option 2 : Le projet n'est pas encore sur Vercel

### Déployer le projet pour la première fois

#### Étape 1 : Préparer le code sur GitHub

1. **Créer un repository GitHub** (si pas déjà fait) :
   ```bash
   # Dans le terminal, à la racine du projet
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Créer le repo sur GitHub** :
   - Allez sur [github.com/new](https://github.com/new)
   - Créez un nouveau repository (ex: `facilidevis-cr`)
   - **Ne cochez PAS** "Initialize with README" (vous avez déjà des fichiers)

3. **Pousser le code** :
   ```bash
   git remote add origin https://github.com/VOTRE_USERNAME/facilidevis-cr.git
   git branch -M main
   git push -u origin main
   ```

#### Étape 2 : Déployer sur Vercel

1. **Se connecter à Vercel** :
   - Allez sur [vercel.com/login](https://vercel.com/login)
   - Connectez-vous avec GitHub

2. **Importer le projet** :
   - Cliquez sur **"Add New..."** > **"Project"**
   - Sélectionnez votre repository `facilidevis-cr`
   - Cliquez sur **"Import"**

3. **Configurer le projet** :
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - Cliquez sur **"Deploy"**

4. **Configurer les variables d'environnement** :
   - Après le premier déploiement, allez dans **Settings** > **Environment Variables**
   - Ajoutez toutes les variables depuis `.env.local.example`
   - Redéployez le projet

---

## 🔹 Option 3 : Utiliser Vercel CLI (Alternative)

Si vous préférez déployer depuis le terminal :

### Installation

```bash
npm install -g vercel
```

### Déploiement

```bash
# Dans le dossier du projet
cd /Users/lb/facilidevis-cr

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

**Avantages** :
- Pas besoin d'aller sur le site Vercel
- Déploiement rapide depuis le terminal
- Le projet sera automatiquement ajouté à votre dashboard Vercel

---

## 🔹 Option 4 : Vérifier si le projet est déjà déployé

### Commandes utiles

```bash
# Vérifier si Vercel CLI est installé
vercel --version

# Lister les projets Vercel
vercel ls

# Voir les informations du projet actuel
vercel inspect
```

---

## 🔹 Résolution de problèmes

### "Je ne me souviens plus de mon compte Vercel"

1. **Essayer toutes les méthodes de connexion** :
   - GitHub
   - GitLab
   - Bitbucket
   - Email

2. **Vérifier vos emails** :
   - Cherchez "vercel" dans votre boîte mail
   - Vérifiez tous vos comptes email

3. **Créer un nouveau compte** :
   - Si vous ne trouvez pas l'ancien, créez-en un nouveau
   - Vous pourrez toujours réimporter le projet

### "Le projet n'apparaît pas dans Vercel"

1. **Vérifier GitHub** :
   - Le projet est-il bien poussé sur GitHub ?
   - Le repository est-il public ou privé ? (Vercel peut accéder aux deux)

2. **Vérifier les permissions** :
   - Vercel a-t-il accès à votre compte GitHub ?
   - Allez dans GitHub > Settings > Applications > Vercel

3. **Importer manuellement** :
   - Dans Vercel Dashboard, cliquez sur "Add New..." > "Project"
   - Sélectionnez votre repository

### "Je veux déployer sans GitHub"

**Option : Vercel CLI**
- Utilisez `vercel` en ligne de commande
- Pas besoin de GitHub (mais recommandé pour les mises à jour automatiques)

---

## 📋 Checklist de récupération

- [ ] J'ai vérifié mes emails pour des notifications Vercel
- [ ] J'ai essayé de me connecter avec GitHub/GitLab/Bitbucket
- [ ] J'ai vérifié si le projet existe sur GitHub
- [ ] J'ai testé des URLs possibles (facilidevis.vercel.app)
- [ ] J'ai installé Vercel CLI et fait `vercel ls`
- [ ] J'ai créé un nouveau compte Vercel si nécessaire
- [ ] J'ai importé le projet depuis GitHub ou via CLI

---

## 🚀 Solution rapide (Recommandée)

**Si vous voulez déployer rapidement** :

1. **Installer Vercel CLI** :
   ```bash
   npm install -g vercel
   ```

2. **Se connecter** :
   ```bash
   vercel login
   ```

3. **Déployer** :
   ```bash
   cd /Users/lb/facilidevis-cr
   vercel
   ```

4. **Le projet sera automatiquement créé sur Vercel** et vous obtiendrez une URL

---

## 📞 Besoin d'aide ?

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)
- **Vercel CLI Docs** : [vercel.com/docs/cli](https://vercel.com/docs/cli)

---

**Dites-moi quelle option vous convient et je vous guide étape par étape !** 🎯

