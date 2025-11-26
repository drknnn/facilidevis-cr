/**
 * Validation avec Zod pour FaciliDevis
 * 
 * Schémas de validation réutilisables pour les formulaires et API
 */

import { z } from 'zod'

// ============================================
// AUTHENTIFICATION
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  companyName: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères').optional(),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide').optional(),
})

// ============================================
// CLIENTS
// ============================================

export const clientSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide').optional().or(z.literal('')),
  address: z.string().max(500, 'L\'adresse est trop longue').optional().or(z.literal('')),
})

// ============================================
// DEVIS
// ============================================

export const quoteItemSchema = z.object({
  label: z.string().min(1, 'La désignation est requise'),
  qty: z.number().positive('La quantité doit être positive'),
  unitPrice: z.number().nonnegative('Le prix unitaire doit être positif ou nul'),
  total: z.number().nonnegative('Le total doit être positif ou nul'),
})

export const quoteSchema = z.object({
  clientId: z.string().min(1, 'Le client est requis'),
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().max(2000, 'La description est trop longue').optional().or(z.literal('')),
  items: z.array(quoteItemSchema).min(1, 'Au moins un article est requis'),
  autoReminders: z.boolean().optional(),
})

// ============================================
// EMAIL
// ============================================

export const sendEmailSchema = z.object({
  to: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Le sujet est requis'),
  html: z.string().min(1, 'Le contenu HTML est requis'),
})

// ============================================
// SMS
// ============================================

export const sendSMSSchema = z.object({
  to: z.string().regex(/^\+33[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide (format: +33XXXXXXXXX)'),
  message: z.string().min(1, 'Le message est requis').max(1600, 'Le message est trop long (max 1600 caractères)'),
})

// ============================================
// STRIPE
// ============================================

export const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, 'Le priceId est requis'),
  successUrl: z.string().url('URL de succès invalide'),
  cancelUrl: z.string().url('URL d\'annulation invalide'),
})

// ============================================
// HELPERS
// ============================================

/**
 * Valide les données avec un schéma Zod
 * Retourne les erreurs formatées ou null si valide
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    throw error
  }
}

