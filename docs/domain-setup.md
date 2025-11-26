# 🌐 Configuration Nom de Domaine - FaciliDevis

Ce guide explique comment configurer un nom de domaine personnalisé pour FaciliDevis sur Vercel.

---

## 📋 Prérequis

- Un nom de domaine acheté (ex: `facilidevis.com`, `facilidevis.fr`)
- Un compte Vercel avec le projet FaciliDevis déployé
- Accès au panneau de contrôle de votre registrar (ex: OVH, Gandi, Namecheap, etc.)

---

## 🚀 Configuration sur Vercel

### Étape 1 : Ajouter le domaine dans Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **FaciliDevis**
3. Allez dans **Settings** > **Domains**
4. Cliquez sur **Add Domain**
5. Entrez votre domaine (ex: `facilidevis.com` ou `www.facilidevis.com`)
6. Vercel vous donnera des instructions pour configurer le DNS

### Étape 2 : Types de configuration

Vercel propose deux méthodes :

#### Option A : Configuration automatique (Recommandé)

Si votre registrar supporte la configuration automatique :
- Vercel détectera automatiquement votre registrar
- Suivez les instructions pour connecter votre compte
- Vercel configurera automatiquement les enregistrements DNS

#### Option B : Configuration manuelle

Si vous préférez configurer manuellement :

1. **Pour un domaine racine** (ex: `facilidevis.com`) :
   - Ajoutez un enregistrement **A** :
     - Type: `A`
     - Name: `@` ou vide
     - Value: `76.76.21.21` (IP Vercel)
   - OU un enregistrement **ALIAS** :
     - Type: `ALIAS` ou `ANAME`
     - Name: `@` ou vide
     - Value: `cname.vercel-dns.com`

2. **Pour un sous-domaine** (ex: `www.facilidevis.com`) :
   - Ajoutez un enregistrement **CNAME** :
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`

### Étape 3 : Vérification

Après avoir configuré le DNS, Vercel vérifiera automatiquement la configuration. Cela peut prendre quelques minutes à 48 heures (propagation DNS).

---

## 🔒 Configuration HTTPS / SSL

Vercel configure automatiquement le certificat SSL (Let's Encrypt) pour votre domaine. Aucune action supplémentaire n'est nécessaire.

Le certificat SSL est :
- ✅ Automatiquement renouvelé
- ✅ Valide pour le domaine racine et `www`
- ✅ Compatible avec HSTS (déjà configuré dans `next.config.js`)

---

## 📝 Exemples de configuration DNS

### OVH

1. Connectez-vous à votre [espace client OVH](https://www.ovh.com/manager/)
2. Allez dans **Domaines** > Votre domaine > **Zone DNS**
3. Ajoutez les enregistrements :

```
Type: A
Sous-domaine: @
Cible: 76.76.21.21
TTL: 3600

Type: CNAME
Sous-domaine: www
Cible: cname.vercel-dns.com
TTL: 3600
```

### Gandi

1. Connectez-vous à votre [compte Gandi](https://www.gandi.net/fr)
2. Allez dans **Domaines** > Votre domaine > **Enregistrements DNS**
3. Ajoutez les enregistrements :

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Namecheap

1. Connectez-vous à votre [compte Namecheap](https://www.namecheap.com/)
2. Allez dans **Domain List** > Votre domaine > **Advanced DNS**
3. Ajoutez les enregistrements :

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

---

## 🔄 Redirection www vers domaine racine (Optionnel)

Si vous voulez rediriger `www.facilidevis.com` vers `facilidevis.com` :

1. Dans Vercel Dashboard > **Settings** > **Domains**
2. Ajoutez les deux domaines (`facilidevis.com` et `www.facilidevis.com`)
3. Vercel redirigera automatiquement `www` vers le domaine racine

---

## ✅ Vérification finale

Une fois la configuration terminée, vérifiez :

1. **Accès HTTPS** : `https://facilidevis.com` doit fonctionner
2. **Certificat SSL** : Le cadenas vert doit apparaître dans le navigateur
3. **Redirection www** : `www.facilidevis.com` doit rediriger vers `facilidevis.com`
4. **HSTS** : Les headers de sécurité doivent être présents (vérifiez avec [SecurityHeaders.com](https://securityheaders.com))

---

## 🐛 Dépannage

### Le domaine ne se résout pas

- Vérifiez que les enregistrements DNS sont corrects
- Attendez la propagation DNS (peut prendre jusqu'à 48h)
- Utilisez [DNS Checker](https://dnschecker.org/) pour vérifier la propagation

### Erreur SSL

- Vercel configure automatiquement SSL, attendez quelques minutes
- Vérifiez que le domaine est bien ajouté dans Vercel
- Contactez le support Vercel si le problème persiste

### Redirection en boucle

- Vérifiez que vous n'avez pas de redirections multiples configurées
- Vérifiez les enregistrements CNAME et A (ne doivent pas être en conflit)

---

## 📚 Ressources

- [Documentation Vercel - Domaines](https://vercel.com/docs/concepts/projects/domains)
- [Vérification DNS](https://dnschecker.org/)
- [Vérification SSL](https://www.ssllabs.com/ssltest/)

---

**Configuration terminée !** 🎉

Votre domaine est maintenant configuré et sécurisé avec HTTPS automatique.

