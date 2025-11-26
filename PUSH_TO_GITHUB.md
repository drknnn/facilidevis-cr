# 🚀 Pousser FaciliDevis sur GitHub - Instructions

## ✅ Étape 1 : Fait ! ✅

J'ai déjà :
- ✅ Initialisé Git
- ✅ Ajouté tous les fichiers
- ✅ Fait le commit initial

---

## 📋 Étape 2 : Créer le repository sur GitHub

### Option A : Via le site web (Recommandé)

1. **Ouvrez** : [github.com/new](https://github.com/new)
2. **Remplissez** :
   - **Repository name** : `facilidevis-cr` (ou le nom que vous préférez)
   - **Description** : "CRM mobile pour artisans - FaciliDevis"
   - **Visibilité** : Public ou Private (votre choix)
   - **⚠️ IMPORTANT** : NE COCHEZ PAS "Add a README file"
   - **⚠️ IMPORTANT** : NE COCHEZ PAS "Add .gitignore"
   - **⚠️ IMPORTANT** : NE COCHEZ PAS "Choose a license"
3. **Cliquez sur** "Create repository"

### Option B : Via GitHub CLI (si installé)

```bash
gh repo create facilidevis-cr --public --source=. --remote=origin --push
```

---

## 🔗 Étape 3 : Connecter et pousser le code

**Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub** dans les commandes ci-dessous.

### Commande complète :

```bash
cd /Users/lb/facilidevis-cr
git remote add origin https://github.com/VOTRE_USERNAME/facilidevis-cr.git
git branch -M main
git push -u origin main
```

### Exemple avec un username :

Si votre username GitHub est `john-doe`, la commande serait :
```bash
git remote add origin https://github.com/john-doe/facilidevis-cr.git
git branch -M main
git push -u origin main
```

---

## 🔐 Authentification GitHub

Quand vous exécutez `git push`, GitHub vous demandera de vous authentifier.

### Option 1 : Token d'accès personnel (Recommandé)

1. **Créer un token** :
   - Allez sur : [github.com/settings/tokens](https://github.com/settings/tokens)
   - Cliquez sur "Generate new token (classic)"
   - Donnez un nom : "FaciliDevis"
   - Cochez la case `repo` (accès complet aux repositories)
   - Cliquez sur "Generate token"
   - **⚠️ COPIEZ LE TOKEN** (vous ne le reverrez plus !)

2. **Utiliser le token** :
   - Quand Git demande votre **Username** : entrez votre username GitHub
   - Quand Git demande votre **Password** : collez le token (pas votre mot de passe)

### Option 2 : GitHub CLI

Si vous avez GitHub CLI installé :
```bash
gh auth login
```

---

## ✅ Vérification

Après avoir poussé le code :

1. **Allez sur** : `https://github.com/VOTRE_USERNAME/facilidevis-cr`
2. **Vérifiez** que tous les fichiers sont présents
3. **Vérifiez** que le README.md s'affiche correctement

---

## 🚀 Prochaines étapes

Une fois sur GitHub, vous pouvez :

1. **Déployer sur Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub
   - Importez le projet `facilidevis-cr`
   - Vercel déploiera automatiquement

2. **Configurer les variables d'environnement** :
   - Dans Vercel Dashboard > Settings > Environment Variables
   - Ajoutez toutes les variables depuis `.env.local.example`

---

## 🐛 Problèmes courants

### "remote origin already exists"

Si vous avez déjà un remote :
```bash
git remote remove origin
git remote add origin https://github.com/VOTRE_USERNAME/facilidevis-cr.git
```

### "Permission denied"

- Vérifiez que vous avez les droits sur le repository
- Utilisez un token d'accès personnel au lieu du mot de passe

### "Large files detected"

- Vérifiez que `.gitignore` contient bien `node_modules`, `.next`, etc.
- Les gros fichiers sont déjà ignorés

---

## 📝 Résumé des commandes

```bash
# 1. Créer le repo sur GitHub (via le site web)
# https://github.com/new

# 2. Connecter et pousser (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/facilidevis-cr.git
git branch -M main
git push -u origin main
```

---

**Votre projet sera sur GitHub en 2 minutes !** 🎉

