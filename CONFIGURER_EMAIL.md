# 🚀 Configuration Email - Guide Rapide

## Option 1 : Resend (Recommandé - 2 minutes)

### Étape 1 : Créer un compte Resend
1. Allez sur **https://resend.com**
2. Cliquez sur **"Sign Up"** (gratuit)
3. Créez un compte avec votre email
4. Vérifiez votre email

### Étape 2 : Obtenir votre clé API
1. Une fois connecté, allez dans **"API Keys"** (menu de gauche)
2. Cliquez sur **"Create API Key"**
3. Donnez un nom : `FaciliDevis Dev`
4. Cliquez sur **"Add"**
5. **Copiez la clé** (elle commence par `re_` - ⚠️ vous ne pourrez la voir qu'une seule fois !)

### Étape 3 : Ajouter dans votre .env
Ouvrez le fichier `.env` à la racine du projet et ajoutez :

```env
RESEND_API_KEY="re_votre_cle_ici"
EMAIL_FROM="FaciliDevis <onboarding@resend.dev>"
```

**Note** : `onboarding@resend.dev` est un domaine de test fourni par Resend. Pour la production, vous devrez ajouter votre propre domaine.

### Étape 4 : Redémarrer le serveur
```bash
# Arrêtez le serveur (Ctrl+C) puis relancez :
npm run dev
```

**C'est tout !** L'envoi d'email fonctionnera maintenant réellement.

---

## Option 2 : SMTP (Gmail)

Si vous préférez utiliser Gmail :

### Étape 1 : Créer un mot de passe d'application Gmail
1. Allez sur **https://myaccount.google.com/apppasswords**
2. Connectez-vous avec votre compte Gmail
3. Sélectionnez **"Mail"** et **"Other (Custom name)"**
4. Tapez : `FaciliDevis`
5. Cliquez sur **"Generate"**
6. **Copiez le mot de passe** (16 caractères, espaces séparés)

### Étape 2 : Ajouter dans votre .env
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
EMAIL_FROM="FaciliDevis <votre-email@gmail.com>"
```

**Important** : Remplacez les espaces dans le mot de passe par rien (ou gardez-les, ça fonctionne aussi).

### Étape 3 : Redémarrer le serveur
```bash
npm run dev
```

---

## Tester l'envoi

1. Ouvrez un devis dans l'application
2. Cliquez sur **"Envoyer au client par email"**
3. Si configuré correctement :
   - ✅ L'email part réellement
   - ✅ Le client reçoit l'email avec le PDF
   - ✅ Message de succès : "Devis envoyé avec succès par email !"

Si vous voyez encore "simulation en mode développement", vérifiez :
- Que les variables sont bien dans `.env`
- Que vous avez redémarré le serveur
- Qu'il n'y a pas d'erreurs dans la console

---

## Besoin d'aide ?

Consultez le fichier `EMAIL_SETUP.md` pour plus de détails et le dépannage.

