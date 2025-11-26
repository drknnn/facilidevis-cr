# ⚠️ Sécurité - Token GitHub

## 🔐 Important : Sécurité du Token

**Votre token GitHub a été utilisé pour pousser le code.**

### ⚠️ Actions de sécurité recommandées :

1. **Révoquer le token** (recommandé après utilisation) :
   - Allez sur : [github.com/settings/tokens](https://github.com/settings/tokens)
   - Trouvez le token "FaciliDevis"
   - Cliquez sur "Revoke"

2. **Créer un nouveau token** si nécessaire :
   - Pour les prochains pushs, utilisez un nouveau token
   - Ou configurez SSH pour plus de sécurité

3. **Ne jamais partager le token** :
   - Ne le mettez pas dans le code
   - Ne le commitez pas dans Git
   - Ne le partagez pas publiquement

### 🔒 Alternative sécurisée : SSH

Pour éviter d'utiliser des tokens, configurez SSH :

```bash
# Générer une clé SSH (si pas déjà fait)
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Ajouter la clé à GitHub
# 1. Copiez le contenu de ~/.ssh/id_ed25519.pub
# 2. Allez sur github.com/settings/keys
# 3. Ajoutez la clé

# Changer le remote en SSH
git remote set-url origin git@github.com:drknnn/facilidevis-cr.git
```

---

**Le token a été retiré de la configuration Git pour votre sécurité.** ✅

