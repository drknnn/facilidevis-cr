# 🎨 Refonte Design Devis - FaciliDevis

## ✅ Refonte Complète Terminée

Le visuel des devis a été complètement refondu pour ressembler à un devis professionnel type Bati'Renov, avec un style pro et moderne adapté aux artisans.

---

## 📁 Fichiers Créés/Modifiés

### Nouveaux Composants

1. **`components/quote/QuoteHeader.tsx`**
   - Header structuré en 3 colonnes (Logo/Entreprise, Client, Infos Devis)
   - Affiche le logo FaciliDevis, les informations de l'entreprise, du client et du devis
   - Badge de statut intégré
   - Date de validité calculée automatiquement (+30 jours)

2. **`components/quote/QuoteTable.tsx`**
   - Tableau professionnel avec colonnes : Désignation, Unité, Quantité, Prix unitaire HT, Total HT
   - En-tête avec fond coloré (bleu clair)
   - Alternance de lignes pour la lisibilité
   - Support de la description du projet

3. **`components/quote/QuoteTotals.tsx`**
   - Bloc totaux aligné à droite
   - Affichage : Total HT, TVA (20%), Total TTC
   - Style avec bordure et fond gris clair
   - Total TTC mis en avant (grande taille, couleur primaire)

4. **`components/quote/QuoteFooter.tsx`**
   - Conditions de règlement (acompte 20%, solde à la livraison)
   - Mentions légales
   - Blocs de signature (entreprise et client)
   - Footer avec mention "Document généré par FaciliDevis"

### Fichiers Modifiés

1. **`app/quotes/[id]/page.tsx`**
   - Refonte complète pour utiliser les nouveaux composants
   - Layout pro avec espacements cohérents
   - Conservation de toutes les fonctionnalités existantes (relances, envoi email, etc.)

2. **`lib/pdf.ts`**
   - Refonte complète de la génération PDF
   - Même structure que la page web (header 3 colonnes, tableau, totaux, footer)
   - Style professionnel avec couleurs et espacements
   - Gestion des sauts de page automatiques

3. **`app/api/quotes/[id]/route.ts`**
   - Ajout des données utilisateur (`user`) dans la réponse API
   - Nécessaire pour afficher les informations de l'entreprise dans le header

---

## 🎨 Design System Appliqué

### Structure du Devis

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (3 colonnes)                                    │
│  ┌──────────┬──────────┬──────────┐                    │
│  │ Logo +   │ Client   │ Infos    │                    │
│  │ Entreprise│         │ Devis    │                    │
│  └──────────┴──────────┴──────────┘                    │
├─────────────────────────────────────────────────────────┤
│  Titre du devis                                         │
├─────────────────────────────────────────────────────────┤
│  TABLEAU DES LIGNES                                     │
│  ┌──────────┬────┬────┬─────────┬──────────┐          │
│  │ Désign.  │ U  │Qté │ Prix u. │ Total HT │          │
│  ├──────────┼────┼────┼─────────┼──────────┤          │
│  │ Ligne 1  │ U  │ 1  │ 100.00€ │ 100.00€  │          │
│  └──────────┴────┴────┴─────────┼──────────┘          │
│                                 │                      │
│  TOTAUX (aligné droite)         │                      │
│  ┌─────────────────────────────┐                      │
│  │ Total HT:     1000.00 €     │                      │
│  │ TVA (20%):     200.00 €     │                      │
│  │ Total TTC:    1200.00 €     │                      │
│  └─────────────────────────────┘                      │
├─────────────────────────────────────────────────────────┤
│  CONDITIONS DE RÈGLEMENT                                │
│  • Acompte 20%: 240.00 €                               │
│  • Solde: 960.00 €                                      │
│  • Mentions légales                                     │
│  • Blocs signature                                      │
└─────────────────────────────────────────────────────────┘
```

### Couleurs Utilisées

- **Bleu principal** : `#1E88E5` (primary-600) - Headers, totaux, accents
- **Gris clair** : `#F9FAFB` (gray-50) - Fonds de tableaux, totaux
- **Gris moyen** : `#6B7280` (gray-500) - Textes secondaires
- **Gris foncé** : `#1F2937` (gray-800) - Textes principaux
- **Bleu très clair** : `#ECEFF1` - En-têtes de tableaux

### Typographie

- **Titres** : Font-bold, tailles variables (text-lg à text-2xl)
- **Tableaux** : Font-medium pour les désignations, font-semibold pour les totaux
- **Mentions** : Font-normal, text-xs, couleur grisée

---

## 🖼️ Intégration du Logo FaciliDevis

### Pour la Page Web

Dans `components/quote/QuoteHeader.tsx`, ligne ~20 :

1. Placez votre logo dans `/public/facilidevis-logo.png`
2. Décommentez la ligne :
   ```tsx
   <Image src="/facilidevis-logo.png" width={48} height={48} alt="FaciliDevis" className="object-contain" />
   ```
3. Supprimez le placeholder `<span>FD</span>`

### Pour le PDF

Dans `lib/pdf.ts`, vous pouvez ajouter une image dans le PDF en utilisant `doc.addImage()` :

```typescript
// Exemple (à adapter selon votre besoin)
const logoData = 'data:image/png;base64,...' // Base64 de votre logo
doc.addImage(logoData, 'PNG', margin, margin, 20, 20)
```

**Note** : Pour le PDF, vous devrez convertir votre logo en base64 ou utiliser une URL accessible.

---

## 📱 Responsive Design

### Desktop / PDF
- Layout en 3 colonnes pour le header
- Tableau complet avec toutes les colonnes
- Totaux alignés à droite

### Mobile
- Header adaptatif (colonnes empilées)
- Tableau avec scroll horizontal si nécessaire
- Totaux toujours alignés à droite
- Espacements optimisés pour petits écrans

---

## ✨ Fonctionnalités Conservées

✅ Toutes les fonctionnalités existantes sont préservées :
- Affichage du devis
- Génération PDF
- Envoi par email
- Relances programmées
- Dernier envoi
- Boutons d'action (Voir PDF, Télécharger, Envoyer)

---

## 🚀 Utilisation

Les composants sont automatiquement utilisés dans :
- La page de détail du devis (`/quotes/[id]`)
- La génération PDF (`/api/quotes/[id]/pdf`)

Aucune configuration supplémentaire n'est nécessaire. Le design s'applique automatiquement à tous les devis.

---

## 📝 Personnalisation

### Modifier le taux d'acompte

Dans `components/quote/QuoteFooter.tsx`, ligne 5 :
```tsx
depositRate = 20 // Changez cette valeur (en %)
```

### Modifier le taux de TVA

Dans `components/quote/QuoteTotals.tsx`, ligne 5 :
```tsx
tvaRate = 20 // Changez cette valeur (en %)
```

### Modifier la validité du devis

Dans `components/quote/QuoteHeader.tsx`, ligne 10 :
```tsx
const validUntil = addDays(quoteDate, 30) // Changez 30 pour le nombre de jours
```

---

## 🎯 Résultat

Votre application FaciliDevis affiche maintenant des devis :
- ✅ **Professionnels** - Style type Bati'Renov
- ✅ **Structurés** - Layout clair et organisé
- ✅ **Cohérents** - Même design entre page web et PDF
- ✅ **Modernes** - Palette de couleurs pro et lisible
- ✅ **Complets** - Toutes les informations nécessaires

**Prêt pour la production !** 🚀

