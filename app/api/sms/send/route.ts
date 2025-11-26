/**
 * Route API pour l'envoi de SMS
 * 
 * POST /api/sms/send
 * Body: { to: string, message: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-firebase'
import { sendSMS, checkSMSConfig } from '@/lib/sms'

async function handler(req: NextRequest, userId: string) {
  try {
    const { to, message } = await req.json()

    // Validation
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Les champs "to" et "message" sont requis' },
        { status: 400 }
      )
    }

    // Vérifier la configuration SMS
    const configStatus = checkSMSConfig()
    if (!configStatus.isConfigured) {
      return NextResponse.json(
        { 
          error: 'Configuration SMS manquante',
          details: configStatus.error,
        },
        { status: 500 }
      )
    }

    // Envoyer le SMS
    await sendSMS(
      { to, message },
      { allowSimulation: false } // En production, ne pas simuler
    )

    // Log de l'envoi (optionnel : sauvegarder dans Firestore)
    console.log(`[SMS] SMS sent to ${to} by user ${userId}`)

    return NextResponse.json({
      success: true,
      message: 'SMS envoyé avec succès',
    })
  } catch (error: any) {
    console.error('[API] Send SMS error:', error)
    
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi du SMS' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler)

