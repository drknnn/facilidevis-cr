/**
 * Service Stripe pour FaciliDevis
 * 
 * Préparation pour l'intégration des paiements SaaS
 * - Création de customers
 * - Gestion des abonnements
 * - Webhooks Stripe
 * 
 * TODO: Implémenter le tunnel de paiement complet
 */

import Stripe from 'stripe'

// Validation du secret Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ STRIPE_SECRET_KEY n\'est pas défini')
  console.warn('   L\'intégration Stripe ne fonctionnera pas en production')
}

// Initialiser Stripe (uniquement si la clé est définie)
export const stripe: Stripe | null = STRIPE_SECRET_KEY 
  ? new Stripe(STRIPE_SECRET_KEY!, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  : null

/**
 * Vérifie si Stripe est configuré
 */
export function isStripeConfigured(): boolean {
  return !!STRIPE_SECRET_KEY && !!stripe
}

/**
 * Crée un customer Stripe pour un utilisateur
 * 
 * @param userId - UID Firebase de l'utilisateur
 * @param email - Email de l'utilisateur
 * @param metadata - Métadonnées supplémentaires (ex: companyName)
 */
export async function createStripeCustomer(
  userId: string,
  email: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  if (!stripe) {
    throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY in .env')
  }

  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
        ...metadata,
      },
    })

    console.log(`[STRIPE] Customer created: ${customer.id} for user ${userId}`)
    return customer
  } catch (error: any) {
    console.error('[STRIPE] Create customer error:', error)
    throw new Error('Erreur lors de la création du client Stripe')
  }
}

/**
 * Crée une session Checkout Stripe pour un abonnement
 * 
 * TODO: Implémenter avec les plans Stripe réels
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string, // ID du prix Stripe (ex: price_xxx)
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return session
  } catch (error: any) {
    console.error('[STRIPE] Create checkout session error:', error)
    throw new Error('Erreur lors de la création de la session de paiement')
  }
}

/**
 * Gère un webhook Stripe
 * 
 * TODO: Implémenter les événements webhook (checkout.session.completed, etc.)
 */
export async function handleStripeWebhook(
  payload: string | Buffer,
  signature: string
): Promise<{ type: string; data: any }> {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured')
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    
    // TODO: Gérer les événements
    // - checkout.session.completed : créer/mettre à jour l'abonnement dans Firestore
    // - customer.subscription.updated : mettre à jour l'abonnement
    // - customer.subscription.deleted : marquer l'abonnement comme annulé
    // - invoice.payment_failed : gérer les échecs de paiement
    
    console.log(`[STRIPE] Webhook received: ${event.type}`)
    
    return {
      type: event.type,
      data: event.data.object,
    }
  } catch (error: any) {
    console.error('[STRIPE] Webhook error:', error)
    throw new Error('Erreur lors du traitement du webhook Stripe')
  }
}

