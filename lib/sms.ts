/**
 * Service SMS pour FaciliDevis
 * 
 * Abstraction pour l'envoi de SMS
 * En développement : simulation
 * En production : intégration avec Twilio ou Vonage
 */

export type SendSMSPayload = {
  to: string // Numéro de téléphone (format international)
  message: string // Message texte
}

export type SMSConfigStatus = {
  isConfigured: boolean
  provider: 'twilio' | 'vonage' | 'none'
  error?: string
}

/**
 * Vérifie si la configuration SMS est disponible
 */
export function checkSMSConfig(): SMSConfigStatus {
  // Vérifier Twilio
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    return {
      isConfigured: true,
      provider: 'twilio',
    }
  }

  // Vérifier Vonage
  if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET && process.env.VONAGE_FROM) {
    return {
      isConfigured: true,
      provider: 'vonage',
    }
  }

  return {
    isConfigured: false,
    provider: 'none',
    error: 'SMS configuration missing. Please set TWILIO_* or VONAGE_* variables in .env',
  }
}

/**
 * Envoie un SMS via Twilio
 */
async function sendViaTwilio(payload: SendSMSPayload): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!
  const authToken = process.env.TWILIO_AUTH_TOKEN!
  const fromPhone = process.env.TWILIO_PHONE_NUMBER!

  try {
    // Utiliser l'API REST Twilio directement (pas besoin du SDK pour une simple requête)
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          From: fromPhone,
          To: payload.to,
          Body: payload.message,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send SMS via Twilio')
    }

    const result = await response.json()
    console.log(`[SMS] SMS sent successfully via Twilio: ${result.sid}`)
  } catch (error: any) {
    console.error('[SMS] Twilio error:', error)
    throw new Error(`Erreur lors de l'envoi du SMS: ${error.message || 'Unknown error'}`)
  }
}

/**
 * Envoie un SMS via Vonage (Nexmo)
 * TODO: Implémenter avec le SDK Vonage
 */
async function sendViaVonage(payload: SendSMSPayload): Promise<void> {
  const apiKey = process.env.VONAGE_API_KEY!
  const apiSecret = process.env.VONAGE_API_SECRET!
  const fromNumber = process.env.VONAGE_FROM!

  // TODO: Implémenter avec vonage SDK
  // const Vonage = require('@vonage/server-sdk')
  // const vonage = new Vonage({ apiKey, apiSecret })
  // await vonage.sms.send({ to: payload.to, from: fromNumber, text: payload.message })

  throw new Error('Vonage integration not yet implemented')
}

/**
 * Simule l'envoi d'un SMS en mode développement
 */
async function simulateSMS(payload: SendSMSPayload): Promise<void> {
  console.log('📱 [DEV MODE] SMS simulation:')
  console.log('  To:', payload.to)
  console.log('  Message:', payload.message)
  console.log('  Length:', payload.message.length, 'chars')
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log('✅ [DEV MODE] SMS would be sent successfully')
}

/**
 * Fonction principale pour envoyer un SMS
 * 
 * @param payload - Les données du SMS à envoyer
 * @param options - Options supplémentaires
 * @param options.allowSimulation - Si true, simule l'envoi en dev si la config est manquante (défaut: true en dev)
 * @throws {Error} Si la configuration est manquante et que la simulation n'est pas autorisée
 */
export async function sendSMS(
  payload: SendSMSPayload,
  options: { allowSimulation?: boolean } = {}
): Promise<void> {
  const { allowSimulation = process.env.NODE_ENV === 'development' } = options
  const configStatus = checkSMSConfig()

  // Si pas de config et simulation autorisée, simuler l'envoi
  if (!configStatus.isConfigured && allowSimulation) {
    await simulateSMS(payload)
    return
  }

  // Si pas de config et simulation non autorisée, lancer une erreur
  if (!configStatus.isConfigured) {
    throw new Error(
      configStatus.error || 
      'SMS configuration missing. Please set TWILIO_* or VONAGE_* variables in .env'
    )
  }

  // Envoyer via le provider configuré
  try {
    if (configStatus.provider === 'twilio') {
      await sendViaTwilio(payload)
    } else if (configStatus.provider === 'vonage') {
      await sendViaVonage(payload)
    }
  } catch (error: any) {
    console.error('[SMS] Send SMS error:', error)
    throw error
  }
}

