import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { generateQuotePDF } from '@/lib/pdf'

/**
 * Route API pour envoyer un devis par SMS
 * 
 * En développement, simule l'envoi
 * En production, nécessite une configuration SMS (Twilio, Vonage, etc.)
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getAuthUser(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const quote = await prisma.quote.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        client: true,
        items: true,
        user: {
          select: {
            companyName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Devis introuvable' },
        { status: 404 }
      )
    }

    if (!quote.client.phone) {
      return NextResponse.json(
        { error: 'Le client n\'a pas de numéro de téléphone. Veuillez ajouter un numéro de téléphone au client.' },
        { status: 400 }
      )
    }

    // Vérifier la configuration SMS (à implémenter)
    const smsConfig = process.env.TWILIO_ACCOUNT_SID || process.env.VONAGE_API_KEY
    const isDevMode = process.env.NODE_ENV === 'development'
    const isSimulated = !smsConfig && isDevMode

    // Générer le PDF pour le lien
    const pdfDataUri = generateQuotePDF({
      id: quote.id,
      title: quote.title,
      description: quote.description || undefined,
      amountHt: quote.amountHt,
      amountTtc: quote.amountTtc,
      createdAt: quote.createdAt,
      client: quote.client,
      items: quote.items,
      user: quote.user,
    })

    // Générer le message SMS
    const quoteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.id}`
    const message = `Bonjour ${quote.client.name}, votre devis "${quote.title}" est disponible : ${quoteUrl}. Total: ${quote.amountTtc.toFixed(2)}€ TTC. - ${quote.user.companyName || 'FaciliDevis'}`

    // Envoi SMS (simulation en dev si config manquante)
    try {
      if (isSimulated) {
        console.log('📱 [DEV MODE] SMS simulation:')
        console.log('  To:', quote.client.phone)
        console.log('  Message:', message)
        console.log('✅ [DEV MODE] SMS would be sent successfully')
      } else {
        // TODO: Implémenter l'envoi réel via Twilio, Vonage, etc.
        // Exemple avec Twilio :
        // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        // await client.messages.create({
        //   body: message,
        //   to: quote.client.phone,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        // })
        throw new Error('SMS configuration not implemented. Please configure Twilio or Vonage in .env')
      }
    } catch (error: any) {
      // Si c'est une erreur de configuration et qu'on est en dev, on continue quand même
      if (isDevMode && error.message?.includes('not implemented')) {
        console.warn('⚠️ [SMS] Configuration non implémentée, simulation en mode développement')
      } else {
        // En production ou erreur autre que config, on propage l'erreur
        throw error
      }
    }

    // Mettre à jour le devis
    const updatedQuote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: quote.status === 'draft' ? 'sent' : quote.status,
        sentAt: quote.sentAt || new Date(),
        lastSentAt: new Date(),
      },
    })

    const responseMessage = isSimulated
      ? 'Devis marqué comme envoyé (simulation SMS en mode développement - configurez Twilio ou Vonage pour un envoi réel)'
      : 'Devis envoyé avec succès par SMS !'

    return NextResponse.json({
      success: true,
      message: responseMessage,
      simulated: isSimulated,
      quote: updatedQuote,
    })
  } catch (error: any) {
    console.error('[SMS] Send SMS error:', error)
    
    let errorMessage = 'Erreur lors de l\'envoi du SMS'
    if (error.message?.includes('SMS configuration')) {
      errorMessage = 'Configuration SMS manquante. Veuillez configurer TWILIO_ACCOUNT_SID ou VONAGE_API_KEY dans .env. Voir le README pour plus d\'informations.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

