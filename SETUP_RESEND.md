# 🚀 Configuration Resend - Guide Pas à Pas

## Étape 1 : Créer un compte Resend

1. **Allez sur** : https://resend.com
2. **Cliquez sur** "Sign Up" (en haut à droite)
3. **Créez un compte** avec votre email
4. **Vérifiez votre email** (vérifiez vos spams si nécessaire)

## Étape 2 : Obtenir votre clé API

1. **Connectez-vous** à Resend
2. Dans le menu de gauche, cliquez sur **"API Keys"**
3. Cliquez sur le bouton **"Create API Key"** (en haut à droite)
4. **Donnez un nom** : `FaciliDevis Dev` (ou ce que vous voulez)
5. Cliquez sur **"Add"**
6. **⚠️ IMPORTANT** : Copiez la clé API immédiatement (elle commence par `re_`)
   - Vous ne pourrez la voir qu'une seule fois !
   - Si vous la perdez, vous devrez en créer une nouvelle

## Étape 3 : Ajouter la clé dans votre .env

Ouvrez le fichier `.env` à la racine du projet et **décommentez/modifiez** ces lignes :

```env
RESEND_API_KEY="re_votre_cle_ici"
EMAIL_FROM="FaciliDevis <onboarding@resend.dev>"
```

**Remplacez** `re_votre_cle_ici` par la clé que vous venez de copier.

**Note** : `onboarding@resend.dev` est un domaine de test fourni par Resend. Pour la production, vous devrez ajouter votre propre domaine.

## Étape 4 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C dans le terminal)
# Puis relancez :
npm run dev
```

## Étape 5 : Tester

1. Ouvrez votre application : http://localhost:3000
2. Connectez-vous
3. Ouvrez un devis
4. Cliquez sur **"Envoyer au client par email"**
5. ✅ Si tout fonctionne, vous verrez : "Devis envoyé avec succès par email !"
6. ✅ Le client recevra réellement l'email avec le PDF en pièce jointe

## ✅ C'est tout !

Votre configuration Resend est maintenant active. Les emails partiront réellement.

---

## 🆘 Besoin d'aide ?

- **Erreur "Invalid API key"** : Vérifiez que la clé commence bien par `re_` et qu'il n'y a pas d'espaces
- **Erreur "Email not sent"** : Vérifiez que vous avez bien redémarré le serveur après avoir modifié `.env`
- **Pas d'email reçu** : Vérifiez les spams, et assurez-vous que l'adresse email du client est valide

