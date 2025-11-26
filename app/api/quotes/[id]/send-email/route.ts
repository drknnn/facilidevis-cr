import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateQuoteEmailHTML, checkEmailConfig } from '@/lib/email'
import { generateQuotePDF } from '@/lib/pdf'

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

    if (!quote.client.email) {
      return NextResponse.json(
        { error: 'Le client n\'a pas d\'adresse email. Veuillez ajouter une adresse email au client.' },
        { status: 400 }
      )
    }

    // Vérifier la configuration email
    const emailConfig = checkEmailConfig()
    const isDevMode = process.env.NODE_ENV === 'development'
    const isSimulated = !emailConfig.isConfigured && isDevMode

    // Generate PDF
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

    const base64Data = pdfDataUri.split(',')[1]
    const pdfBuffer = Buffer.from(base64Data, 'base64')

    // Generate email HTML
    const emailHTML = generateQuoteEmailHTML({
      ...quote,
      id: quote.id,
    })

    // Send email (avec simulation en dev si config manquante)
    try {
      await sendEmail({
        to: quote.client.email,
        subject: `Devis : ${quote.title}`,
        html: emailHTML,
        attachments: [
          {
            filename: `devis-${quote.id.slice(0, 8)}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      }, {
        allowSimulation: isDevMode,
      })
    } catch (error: any) {
      // Si c'est une erreur de configuration et qu'on est en dev, on continue quand même
      if (isDevMode && error.message?.includes('Email configuration missing')) {
        console.warn('⚠️ [EMAIL] Configuration manquante, simulation en mode développement')
      } else {
        // En production ou erreur autre que config, on propage l'erreur
        throw error
      }
    }

    // Update quote status and lastSentAt
    const updatedQuote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: quote.status === 'draft' ? 'sent' : quote.status,
        sentAt: quote.sentAt || new Date(),
        lastSentAt: new Date(),
      },
    })

    const message = isSimulated
      ? 'Devis marqué comme envoyé (simulation en mode développement - configurez l\'email pour un envoi réel)'
      : 'Devis envoyé avec succès'

    return NextResponse.json({
      success: true,
      message,
      simulated: isSimulated,
      quote: updatedQuote,
    })
  } catch (error: any) {
    console.error('[EMAIL] Send email error:', error)
    
    // Message d'erreur plus clair selon le type d'erreur
    let errorMessage = 'Erreur lors de l\'envoi de l\'email'
    if (error.message?.includes('Email configuration missing')) {
      errorMessage = 'Configuration email manquante. Veuillez configurer RESEND_API_KEY ou SMTP dans .env. Voir le README pour plus d\'informations.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
