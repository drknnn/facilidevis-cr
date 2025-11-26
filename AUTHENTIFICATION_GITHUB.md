# 🔐 Authentification GitHub pour le Push

## ⚠️ Problème actuel

Git demande une authentification pour pousser le code sur GitHub.

## ✅ Solution : Utiliser un Token d'Accès Personnel

### Étape 1 : Créer un token GitHub

1. **Allez sur** : [github.com/settings/tokens](https://github.com/settings/tokens)
2. **Cliquez sur** "Generate new token" > "Generate new token (classic)"
3. **Remplissez** :
   - **Note** : "FaciliDevis Deployment"
   - **Expiration** : 90 days (ou No expiration)
   - **Scopes** : Cochez `repo` (accès complet aux repositories)
4. **Cliquez sur** "Generate token"
5. **⚠️ COPIEZ LE TOKEN** (commence par `ghp_...`) - vous ne le reverrez plus !

### Étape 2 : Utiliser le token

Quand vous exécutez `git push`, Git vous demandera :

```
Username for 'https://github.com': jpfk4kn9vh-debug
Password for 'https://github.com': [COLLEZ VOTRE TOKEN ICI]
```

**Important** :
- **Username** : `jpfk4kn9vh-debug`
- **Password** : Collez le token (pas votre mot de passe GitHub)

### Étape 3 : Pousser le code

```bash
cd /Users/lb/facilidevis-cr
git push -u origin main
```

---

## 🔄 Alternative : Utiliser SSH (Plus sécurisé)

### Si vous préférez SSH :

1. **Générer une clé SSH** (si pas déjà fait) :
   ```bash
   ssh-keygen -t ed25519 -C "votre-email@example.com"
   ```

2. **Ajouter la clé à GitHub** :
   - Copiez le contenu de `~/.ssh/id_ed25519.pub`
   - Allez sur [github.com/settings/keys](https://github.com/settings/keys)
   - Cliquez sur "New SSH key"
   - Collez la clé

3. **Changer le remote en SSH** :
   ```bash
   git remote set-url origin git@github.com:jpfk4kn9vh-debug/facilidevis-cr.git
   git push -u origin main
   ```

---

## 🚀 Commande complète avec authentification

```bash
cd /Users/lb/facilidevis-cr
git push -u origin main
# Quand demandé :
# Username: jpfk4kn9vh-debug
# Password: [votre token GitHub]
```

---

## ✅ Vérification

Après le push réussi :

1. **Allez sur** : [github.com/jpfk4kn9vh-debug/facilidevis-cr](https://github.com/jpfk4kn9vh-debug/facilidevis-cr)
2. **Vérifiez** que tous les fichiers sont présents
3. **Vérifiez** que le README.md s'affiche correctement

---

**Une fois authentifié, le code sera sur GitHub !** 🎉

