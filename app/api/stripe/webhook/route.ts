/**
 * Route API Webhook Stripe
 * 
 * Reçoit les événements Stripe (checkout.session.completed, etc.)
 * TODO: Implémenter la gestion complète des événements
 */

import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook, isStripeConfigured } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Traiter le webhook
    const event = await handleStripeWebhook(body, signature)

    // Gérer les événements selon le type
    const { adminDb } = await import('@/lib/firebase-admin')

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const customerId = session.customer
        const subscriptionId = session.subscription

        // Trouver l'utilisateur par customerId
        const subscriptionDoc = await adminDb
          .collection('subscriptions')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get()

        if (!subscriptionDoc.empty) {
          const subscriptionRef = subscriptionDoc.docs[0].ref
          await subscriptionRef.update({
            stripeSubscriptionId: subscriptionId,
            status: 'active',
            updatedAt: new Date(),
          })
          console.log(`[STRIPE] Subscription activated: ${subscriptionId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const subscriptionId = subscription.id
        const status = subscription.status

        // Mettre à jour l'abonnement dans Firestore
        const subscriptionDoc = await adminDb
          .collection('subscriptions')
          .where('stripeSubscriptionId', '==', subscriptionId)
          .limit(1)
          .get()

        if (!subscriptionDoc.empty) {
          const subscriptionRef = subscriptionDoc.docs[0].ref
          await subscriptionRef.update({
            status: status === 'active' ? 'active' : 
                   status === 'canceled' ? 'canceled' : 
                   status === 'past_due' ? 'past_due' : 'trialing',
            currentPeriodStart: subscription.current_period_start 
              ? new Date(subscription.current_period_start * 1000) 
              : null,
            currentPeriodEnd: subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000) 
              : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            updatedAt: new Date(),
          })
          console.log(`[STRIPE] Subscription updated: ${subscriptionId} -> ${status}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const subscriptionId = subscription.id

        // Marquer l'abonnement comme annulé
        const subscriptionDoc = await adminDb
          .collection('subscriptions')
          .where('stripeSubscriptionId', '==', subscriptionId)
          .limit(1)
          .get()

        if (!subscriptionDoc.empty) {
          const subscriptionRef = subscriptionDoc.docs[0].ref
          await subscriptionRef.update({
            status: 'canceled',
            updatedAt: new Date(),
          })
          console.log(`[STRIPE] Subscription canceled: ${subscriptionId}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        const customerId = invoice.customer

        // Mettre à jour le statut de l'abonnement
        const subscriptionDoc = await adminDb
          .collection('subscriptions')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get()

        if (!subscriptionDoc.empty) {
          const subscriptionRef = subscriptionDoc.docs[0].ref
          await subscriptionRef.update({
            status: 'past_due',
            updatedAt: new Date(),
          })
          console.log(`[STRIPE] Payment failed for customer: ${customerId}`)
        }
        break
      }

      default:
        console.log(`[STRIPE] Unhandled event type: ${event.type}`)
    }

    console.log(`[STRIPE] Webhook processed: ${event.type}`)

    return NextResponse.json({ received: true, type: event.type })
  } catch (error: any) {
    console.error('[STRIPE] Webhook error:', error)
    
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 400 }
    )
  }
}

