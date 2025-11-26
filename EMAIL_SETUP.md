# 📧 Configuration Email - FaciliDevis

## Option 1 : Resend (Recommandé - Simple et rapide)

### Étape 1 : Créer un compte Resend
1. Allez sur [https://resend.com](https://resend.com)
2. Créez un compte gratuit (100 emails/jour en gratuit)
3. Vérifiez votre email

### Étape 2 : Créer une clé API
1. Dans le dashboard Resend, allez dans **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez un nom (ex: "FaciliDevis Dev")
4. Copiez la clé (elle commence par `re_`)

### Étape 3 : Configurer le domaine (optionnel pour commencer)
- Pour tester rapidement, vous pouvez utiliser le domaine de test de Resend
- Pour la production, ajoutez votre domaine dans Resend

### Étape 4 : Ajouter dans .env
```env
RESEND_API_KEY="re_votre_cle_api_ici"
EMAIL_FROM="FaciliDevis <onboarding@resend.dev>"
```

**C'est tout !** L'envoi d'email fonctionnera immédiatement.

---

## Option 2 : SMTP (Gmail, Outlook, etc.)

### Pour Gmail

1. **Activer l'authentification à deux facteurs** sur votre compte Gmail
2. **Créer un mot de passe d'application** :
   - Allez sur [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Sélectionnez "Mail" et votre appareil
   - Copiez le mot de passe généré (16 caractères)

3. **Ajouter dans .env** :
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app-16-caracteres"
EMAIL_FROM="FaciliDevis <votre-email@gmail.com>"
```

### Pour Outlook/Office 365

```env
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@outlook.com"
SMTP_PASS="votre-mot-de-passe"
EMAIL_FROM="FaciliDevis <votre-email@outlook.com>"
```

---

## Mode Développement (Sans Configuration)

Si vous ne configurez pas l'email, FaciliDevis fonctionnera en **mode simulation** :

- ✅ Le bouton "Envoyer au client par email" fonctionne
- ✅ Le devis est marqué comme envoyé dans la base de données
- ✅ La date `lastSentAt` est enregistrée
- ⚠️ Aucun email réel n'est envoyé (simulation dans les logs)

Cela permet de tester l'application sans configurer l'email immédiatement.

---

## Vérification

Pour vérifier que votre configuration fonctionne :

1. Créez un devis avec un client qui a un email
2. Cliquez sur "Envoyer au client par email"
3. Si configuré : l'email part réellement
4. Si non configuré : message "simulation en mode développement"

---

## Dépannage

### Erreur "Email configuration missing"
- Vérifiez que les variables sont bien dans `.env`
- Redémarrez le serveur (`npm run dev`)
- Vérifiez qu'il n'y a pas d'espaces dans les valeurs

### Erreur Resend "Invalid API key"
- Vérifiez que la clé commence bien par `re_`
- Vérifiez qu'elle n'a pas expiré dans le dashboard Resend

### Erreur SMTP "Authentication failed"
- Pour Gmail : utilisez un mot de passe d'application, pas votre mot de passe normal
- Vérifiez que l'authentification à deux facteurs est activée
- Vérifiez les paramètres SMTP (port, secure)

---

## Production

En production, utilisez **Resend** avec votre propre domaine :

1. Ajoutez votre domaine dans Resend
2. Configurez les enregistrements DNS
3. Utilisez votre domaine dans `EMAIL_FROM` :
   ```env
   EMAIL_FROM="FaciliDevis <no-reply@votre-domaine.com>"
   ```

