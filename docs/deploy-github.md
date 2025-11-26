# 🚀 Déployer FaciliDevis sur GitHub

## 📋 Étapes pour pousser votre projet sur GitHub

### Étape 1 : Vérifier l'état Git

```bash
cd /Users/lb/facilidevis-cr
git status
```

### Étape 2 : Initialiser Git (si pas déjà fait)

```bash
git init
```

### Étape 3 : Ajouter tous les fichiers

```bash
git add .
```

### Étape 4 : Faire le premier commit

```bash
git commit -m "Initial commit - FaciliDevis CRM"
```

### Étape 5 : Créer un repository sur GitHub

1. **Aller sur** : [github.com/new](https://github.com/new)
2. **Remplir** :
   - **Repository name** : `facilidevis-cr` (ou le nom que vous voulez)
   - **Description** : "CRM mobile pour artisans - FaciliDevis"
   - **Visibilité** : Public ou Private (votre choix)
   - **⚠️ NE COCHEZ PAS** "Initialize with README" (vous avez déjà des fichiers)
3. **Cliquer sur** "Create repository"

### Étape 6 : Connecter le repo local à GitHub

GitHub vous donnera des commandes, mais voici les commandes à exécuter :

```bash
# Remplacer VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/facilidevis-cr.git
git branch -M main
git push -u origin main
```

---

## 🔐 Si GitHub demande une authentification

### Option 1 : Token d'accès personnel (Recommandé)

1. **Créer un token** :
   - Allez sur GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Cliquez sur "Generate new token (classic)"
   - Donnez un nom (ex: "FaciliDevis")
   - Cochez `repo` (accès complet aux repositories)
   - Cliquez sur "Generate token"
   - **⚠️ COPIEZ LE TOKEN** (vous ne le reverrez plus)

2. **Utiliser le token** :
   - Quand Git demande votre mot de passe, utilisez le token au lieu du mot de passe

### Option 2 : SSH (Alternative)

Si vous préférez SSH :

```bash
# Générer une clé SSH (si pas déjà fait)
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Ajouter la clé à GitHub
# Copiez le contenu de ~/.ssh/id_ed25519.pub
# Allez sur GitHub > Settings > SSH and GPG keys > New SSH key

# Utiliser SSH pour le remote
git remote set-url origin git@github.com:VOTRE_USERNAME/facilidevis-cr.git
```

---

## ✅ Vérification

Après avoir poussé le code :

1. **Aller sur** : `https://github.com/VOTRE_USERNAME/facilidevis-cr`
2. **Vérifier** que tous les fichiers sont présents
3. **Vérifier** que le README.md s'affiche correctement

---

## 🚀 Prochaines étapes

Une fois sur GitHub, vous pouvez :

1. **Déployer sur Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez le projet depuis GitHub
   - Vercel détectera automatiquement Next.js

2. **Configurer CI/CD** :
   - Vercel se connectera automatiquement à GitHub
   - Chaque push déclenchera un nouveau déploiement

---

## 🐛 Problèmes courants

### "fatal: remote origin already exists"

**Solution** :
```bash
git remote remove origin
git remote add origin https://github.com/VOTRE_USERNAME/facilidevis-cr.git
```

### "Permission denied"

**Solution** :
- Vérifiez que vous avez les droits sur le repository
- Utilisez un token d'accès personnel au lieu du mot de passe

### "Large files detected"

**Solution** :
- Vérifiez que `.gitignore` contient bien `node_modules`, `.next`, etc.
- Si vous avez des gros fichiers, utilisez [Git LFS](https://git-lfs.github.com/)

---

**Votre projet sera sur GitHub en quelques minutes !** 🎉

