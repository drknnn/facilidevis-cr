# 🌐 Guide Complet : Connecter un Domaine à FaciliDevis sur Vercel

## 🔹 1. Ce que Cursor peut faire (et ne peut pas faire)

### ❌ Ce que Cursor NE PEUT PAS faire automatiquement :
- **Configurer les enregistrements DNS** chez votre registrar (OVH, Gandi, Namecheap, etc.)
- **Modifier les paramètres DNS** de votre domaine
- **Valider la propriété du domaine**

### ✅ Ce que Cursor PEUT faire :
- ✅ Créer les fichiers de configuration nécessaires (`vercel.json` - déjà fait)
- ✅ Vous guider étape par étape avec des instructions précises
- ✅ Vérifier que la configuration Vercel est correcte
- ✅ Vous donner les valeurs exactes à copier-coller

**Conclusion** : Vous devrez configurer le DNS manuellement chez votre registrar, mais je vous donne toutes les valeurs exactes à utiliser.

---

## 🔹 2. Étapes pour connecter votre domaine à Vercel

### Étape 1 : Préparer Vercel

1. **Aller sur Vercel Dashboard**
   - Ouvrez [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sélectionnez votre projet **FaciliDevis**

2. **Ajouter le domaine**
   - Cliquez sur **Settings** (Paramètres)
   - Allez dans l'onglet **Domains** (Domaines)
   - Cliquez sur **Add Domain** (Ajouter un domaine)

3. **Entrer votre domaine**
   - Tapez votre domaine (ex: `facilidevis.com` ou `www.facilidevis.com`)
   - Cliquez sur **Add**

4. **Vercel vous donne les instructions**
   - Vercel affichera les enregistrements DNS à configurer
   - **Notez ces valeurs** (elles sont spécifiques à votre projet)

---

### Étape 2 : Configurer le DNS chez votre registrar

**IMPORTANT** : Les valeurs exactes dépendent de votre projet Vercel. Vercel vous les donnera automatiquement.

#### Option A : Domaine racine (ex: `facilidevis.com`)

**Méthode recommandée : Utiliser un enregistrement A**

1. Allez dans le panneau de contrôle de votre registrar
2. Trouvez la section **DNS** ou **Zone DNS**
3. Ajoutez un enregistrement **A** :
   ```
   Type: A
   Name: @ (ou vide, ou votre domaine racine)
   Value: 76.76.21.21
   TTL: 3600 (ou Auto)
   ```

**Alternative : Utiliser un enregistrement ALIAS/ANAME** (si supporté par votre registrar)
```
Type: ALIAS (ou ANAME)
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

#### Option B : Sous-domaine www (ex: `www.facilidevis.com`)

1. Ajoutez un enregistrement **CNAME** :
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

#### Option C : Les deux (domaine racine + www)

Configurez les deux :
- **A** pour `@` → `76.76.21.21`
- **CNAME** pour `www` → `cname.vercel-dns.com`

Vercel redirigera automatiquement `www` vers le domaine racine.

---

### Étape 3 : Exemples par registrar

#### OVH
1. Connectez-vous à [espace client OVH](https://www.ovh.com/manager/)
2. **Domaines** > Votre domaine > **Zone DNS**
3. Cliquez sur **Ajouter un enregistrement**
4. Remplissez :
   - **Sous-domaine** : `@` (pour domaine racine) ou `www`
   - **Type** : `A` ou `CNAME`
   - **Cible** : `76.76.21.21` (A) ou `cname.vercel-dns.com` (CNAME)
   - **TTL** : `3600`

#### Gandi
1. Connectez-vous à [Gandi](https://www.gandi.net/fr)
2. **Domaines** > Votre domaine > **Enregistrements DNS**
3. Cliquez sur **Ajouter un enregistrement**
4. Remplissez selon le type (A ou CNAME)

#### Namecheap
1. Connectez-vous à [Namecheap](https://www.namecheap.com/)
2. **Domain List** > Votre domaine > **Advanced DNS**
3. Cliquez sur **Add New Record**
4. Remplissez selon le type

#### Cloudflare
1. Connectez-vous à [Cloudflare](https://dash.cloudflare.com/)
2. Sélectionnez votre domaine
3. Allez dans **DNS** > **Records**
4. Ajoutez les enregistrements

---

### Étape 4 : Attendre la propagation DNS

- ⏱️ **Temps d'attente** : 5 minutes à 48 heures (généralement 15-30 minutes)
- 🔍 **Vérifier** : Utilisez [dnschecker.org](https://dnschecker.org/) pour voir la propagation mondiale

---

### Étape 5 : Vérifier dans Vercel

1. Retournez dans Vercel Dashboard > **Settings** > **Domains**
2. Vercel vérifiera automatiquement la configuration
3. Quand c'est validé, vous verrez un ✅ vert
4. **HTTPS est automatique** : Vercel configure SSL automatiquement (Let's Encrypt)

---

## 🔹 3. Configuration dans Cursor (déjà faite)

### Fichiers créés automatiquement

✅ **`vercel.json`** - Déjà créé avec :
- Configuration de déploiement
- Headers de sécurité
- Cron jobs

✅ **`next.config.js`** - Déjà configuré avec :
- Headers de sécurité (HSTS, XSS Protection, etc.)
- Optimisations
- Configuration Firebase Storage

### Ce qui est déjà prêt

Votre projet est **déjà configuré** pour fonctionner avec un domaine personnalisé. Aucune modification de code n'est nécessaire.

---

## 🔹 4. Vérifications finales

### Checklist "Domaine bien connecté"

- [ ] **DNS configuré** : Les enregistrements A/CNAME sont ajoutés chez votre registrar
- [ ] **Propagation DNS** : Vérifié sur [dnschecker.org](https://dnschecker.org/)
- [ ] **Vercel validé** : Le domaine apparaît avec ✅ dans Vercel Dashboard
- [ ] **HTTPS actif** : Le cadenas vert apparaît dans le navigateur
- [ ] **Accès fonctionnel** : `https://votre-domaine.com` charge correctement
- [ ] **Redirection www** : `www.votre-domaine.com` redirige vers `votre-domaine.com` (si configuré)

### Test depuis téléphone

1. **Ouvrez votre navigateur mobile** (Chrome, Safari, etc.)
2. **Tapez** : `https://votre-domaine.com`
3. **Vérifiez** :
   - ✅ Le site charge
   - ✅ Le cadenas vert est visible (HTTPS)
   - ✅ L'application fonctionne (login, navigation, etc.)
   - ✅ Les images et ressources se chargent correctement

### Test depuis ordinateur

1. **Ouvrez** : `https://votre-domaine.com`
2. **Vérifiez** :
   - ✅ Le site charge
   - ✅ HTTPS est actif (cadenas vert)
   - ✅ Toutes les fonctionnalités marchent
   - ✅ Les redirections fonctionnent

### Commandes de vérification

```bash
# Vérifier la résolution DNS
nslookup votre-domaine.com

# Vérifier HTTPS
curl -I https://votre-domaine.com

# Vérifier les headers de sécurité
curl -I https://votre-domaine.com | grep -i "strict-transport-security"
```

---

## 🔹 5. Résolution de problèmes

### Le domaine ne se résout pas

**Symptôme** : `ERR_NAME_NOT_RESOLVED` ou timeout

**Solutions** :
1. Vérifiez que les enregistrements DNS sont corrects
2. Attendez la propagation DNS (jusqu'à 48h)
3. Vérifiez sur [dnschecker.org](https://dnschecker.org/)

### Erreur SSL / HTTPS

**Symptôme** : "Votre connexion n'est pas privée"

**Solutions** :
1. Attendez quelques minutes (Vercel configure SSL automatiquement)
2. Vérifiez que le domaine est bien validé dans Vercel
3. Contactez le support Vercel si le problème persiste

### Redirection en boucle

**Symptôme** : Le site redirige en boucle

**Solutions** :
1. Vérifiez qu'il n'y a pas de redirections multiples
2. Vérifiez les enregistrements CNAME et A (ne doivent pas être en conflit)
3. Vérifiez la configuration dans Vercel Dashboard

---

## 🔹 6. Résumé rapide

### Ce que vous devez faire (5 minutes)

1. ✅ Aller sur Vercel Dashboard > Settings > Domains
2. ✅ Ajouter votre domaine
3. ✅ Copier les valeurs DNS affichées par Vercel
4. ✅ Aller chez votre registrar
5. ✅ Ajouter les enregistrements DNS (A ou CNAME)
6. ✅ Attendre la propagation (15-30 minutes)
7. ✅ Vérifier dans Vercel que c'est validé

### Ce qui est automatique

- ✅ Configuration SSL/HTTPS (Vercel le fait automatiquement)
- ✅ Renouvellement du certificat SSL
- ✅ Redirection www → domaine racine (si configuré)
- ✅ Headers de sécurité (déjà configurés dans `next.config.js`)

---

## 📞 Besoin d'aide ?

Si vous bloquez sur une étape :
1. Vérifiez la [documentation Vercel](https://vercel.com/docs/concepts/projects/domains)
2. Consultez [docs/domain-setup.md](./domain-setup.md) pour plus de détails
3. Contactez le support de votre registrar pour l'aide DNS

---

**Votre domaine sera connecté en moins de 30 minutes !** 🚀

