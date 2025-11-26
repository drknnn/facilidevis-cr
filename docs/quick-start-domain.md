# ⚡ Quick Start : Connecter votre domaine en 5 minutes

## 🎯 Objectif
Connecter `votre-domaine.com` à votre projet FaciliDevis sur Vercel.

---

## 📋 Checklist rapide

### 1. Sur Vercel (2 minutes)
- [ ] Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Sélectionner le projet **FaciliDevis**
- [ ] **Settings** > **Domains** > **Add Domain**
- [ ] Entrer votre domaine : `votre-domaine.com`
- [ ] **Copier les valeurs DNS** affichées par Vercel

### 2. Chez votre registrar (2 minutes)
- [ ] Aller dans la section **DNS** de votre registrar
- [ ] Ajouter un enregistrement **A** :
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  ```
- [ ] (Optionnel) Ajouter un enregistrement **CNAME** pour www :
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

### 3. Attendre (15-30 minutes)
- [ ] Attendre la propagation DNS
- [ ] Vérifier sur [dnschecker.org](https://dnschecker.org/)

### 4. Vérifier (1 minute)
- [ ] Retourner sur Vercel > **Settings** > **Domains**
- [ ] Vérifier que le domaine a un ✅ vert
- [ ] Tester : `https://votre-domaine.com`

---

## ✅ C'est fait !

Votre domaine est maintenant connecté avec HTTPS automatique.

---

**Guide détaillé** : Voir [guide-domaine-vercel.md](./guide-domaine-vercel.md)

