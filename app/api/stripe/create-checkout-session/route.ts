/**
 * Route API pour créer une session Checkout Stripe
 * 
 * POST /api/stripe/create-checkout-session
 * Body: { priceId: string, successUrl: string, cancelUrl: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-firebase'
import { createCheckoutSession, createStripeCustomer, isStripeConfigured } from '@/lib/stripe'
import { getUserById } from '@/lib/firestore'
import { adminDb } from '@/lib/firebase-admin'

async function handler(req: NextRequest, userId: string) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Stripe n\'est pas configuré' },
        { status: 500 }
      )
    }

    const { priceId, successUrl, cancelUrl } = await req.json()

    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Les champs priceId, successUrl et cancelUrl sont requis' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur
    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur a déjà un customer Stripe
    const subscriptionDoc = await adminDb
      .collection('subscriptions')
      .where('userId', '==', userId)
      .limit(1)
      .get()

    let customerId: string

    if (!subscriptionDoc.empty) {
      // Customer existe déjà
      const subscription = subscriptionDoc.docs[0].data()
      customerId = subscription.stripeCustomerId
    } else {
      // Créer un nouveau customer Stripe
      const metadata: Record<string, string> = {}
      if (user.companyName) metadata.companyName = user.companyName
      if (user.phone) metadata.phone = user.phone
      
      const customer = await createStripeCustomer(userId, user.email, metadata)
      customerId = customer.id

      // Sauvegarder dans Firestore
      await adminDb.collection('subscriptions').add({
        userId,
        stripeCustomerId: customerId,
        status: 'trialing',
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Créer la session Checkout
    const session = await createCheckoutSession(
      customerId,
      priceId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('[STRIPE] Create checkout session error:', error)
    
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler)

