/**
 * Types TypeScript pour le modèle de données CRM FaciliDevis
 * 
 * Ces types correspondent aux collections Firestore :
 * - users
 * - clients
 * - quotes (devis)
 * - reminders (relances)
 * - signatures
 * 
 * Les sous-collections (quoteItems) sont incluses dans les types Quote
 */

import { Timestamp } from 'firebase/firestore'

// ============================================
// USER (Utilisateur / Artisan)
// ============================================
export interface User {
  id: string // UID Firebase Auth
  email: string
  role: 'artisan' | 'admin' // Rôle utilisateur
  companyName?: string | null // Nom de l'entreprise
  phone?: string | null // Téléphone de l'entreprise
  createdAt: Timestamp | Date // Date de création du compte
  updatedAt: Timestamp | Date // Date de dernière mise à jour
}

// ============================================
// CLIENT
// ============================================
export interface Client {
  id: string // ID Firestore (auto-généré)
  userId: string // UID de l'utilisateur propriétaire
  name: string // Nom complet du client
  phone?: string | null // Téléphone du client
  email?: string | null // Email du client
  address?: string | null // Adresse complète
  createdAt: Timestamp | Date // Date de création
  updatedAt?: Timestamp | Date | null // Date de dernière mise à jour
}

// ============================================
// QUOTE ITEM (Ligne de devis)
// ============================================
export interface QuoteItem {
  id?: string // ID Firestore (optionnel car peut être sous-collection)
  label: string // Désignation de la ligne
  qty: number // Quantité
  unitPrice: number // Prix unitaire HT
  total: number // Total HT (qty × unitPrice)
}

// ============================================
// QUOTE (Devis)
// ============================================
export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'reminded' | 'accepted' | 'refused'

export interface Quote {
  id: string // ID Firestore (auto-généré)
  userId: string // UID de l'utilisateur propriétaire
  clientId: string // ID du client
  title: string // Titre du devis
  description?: string | null // Description du projet
  amountHt: number // Total HT
  amountTtc: number // Total TTC (avec TVA 20%)
  status: QuoteStatus // Statut du devis
  pdfUrl?: string | null // URL du PDF (si stocké dans Firebase Storage)
  sentAt?: Timestamp | Date | null // Date d'envoi initial
  lastSentAt?: Timestamp | Date | null // Date du dernier envoi
  viewedAt?: Timestamp | Date | null // Date de consultation par le client
  acceptedAt?: Timestamp | Date | null // Date d'acceptation
  createdAt: Timestamp | Date // Date de création
  updatedAt?: Timestamp | Date | null // Date de dernière mise à jour
  // Sous-collection ou tableau inclus
  items: QuoteItem[] // Lignes du devis
}

// ============================================
// REMINDER (Relance)
// ============================================
export type ReminderType = 'SMS' | 'email'
export type ReminderStatus = 'pending' | 'done'

export interface Reminder {
  id: string // ID Firestore (auto-généré)
  quoteId: string // ID du devis concerné
  userId: string // UID de l'utilisateur propriétaire
  reminderDate: Timestamp | Date // Date programmée pour la relance
  reminderType: ReminderType // Type de relance (SMS ou email)
  status: ReminderStatus // Statut (en attente ou effectuée)
  createdAt?: Timestamp | Date // Date de création
  completedAt?: Timestamp | Date | null // Date d'exécution si done
}

// ============================================
// SIGNATURE
// ============================================
export interface Signature {
  id: string // ID Firestore (auto-généré)
  quoteId: string // ID du devis (unique)
  signatureImageUrl: string // URL de l'image de signature (Firebase Storage)
  signedAt: Timestamp | Date // Date de signature
  ipAddress?: string | null // Adresse IP du signataire
  clientName?: string | null // Nom du client signataire
}

// ============================================
// ACTIVITY (Log d'activité - optionnel)
// ============================================
export type ActivityType = 
  | 'quote_created'
  | 'quote_sent'
  | 'quote_viewed'
  | 'quote_accepted'
  | 'quote_refused'
  | 'client_created'
  | 'reminder_sent'

export interface Activity {
  id: string // ID Firestore (auto-généré)
  userId: string // UID de l'utilisateur
  type: ActivityType // Type d'activité
  quoteId?: string | null // ID du devis concerné (si applicable)
  clientId?: string | null // ID du client concerné (si applicable)
  metadata?: Record<string, any> // Métadonnées supplémentaires
  createdAt: Timestamp | Date // Date de l'activité
}

// ============================================
// SUBSCRIPTION / BILLING (Préparation Stripe)
// ============================================
export interface Subscription {
  id: string // ID Firestore (auto-généré)
  userId: string // UID de l'utilisateur
  stripeCustomerId: string // ID client Stripe
  stripeSubscriptionId?: string | null // ID abonnement Stripe
  status: 'active' | 'canceled' | 'past_due' | 'trialing' // Statut abonnement
  plan: 'free' | 'starter' | 'pro' | 'enterprise' // Plan souscrit
  currentPeriodStart?: Timestamp | Date | null // Début période courante
  currentPeriodEnd?: Timestamp | Date | null // Fin période courante
  cancelAtPeriodEnd?: boolean // Annulation à la fin de la période
  createdAt: Timestamp | Date // Date de création
  updatedAt?: Timestamp | Date | null // Date de dernière mise à jour
}

// ============================================
// HELPERS - Conversion Firestore Timestamp
// ============================================
/**
 * Convertit un Timestamp Firestore en Date JavaScript
 */
export function timestampToDate(
  timestamp: Timestamp | Date | null | undefined
): Date | null {
  if (!timestamp) return null
  if (timestamp instanceof Date) return timestamp
  return timestamp.toDate()
}

/**
 * Convertit une Date JavaScript en Timestamp Firestore
 */
export function dateToTimestamp(date: Date | null | undefined) {
  if (!date) return null
  // En client-side, on utilise Timestamp.fromDate
  // En server-side, on peut utiliser directement Date
  return date
}

