import nodemailer from 'nodemailer'

export type SendEmailPayload = {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

export type EmailConfigStatus = {
  isConfigured: boolean
  method: 'resend' | 'smtp' | 'none'
  error?: string
}

/**
 * Vérifie si la configuration email est disponible
 */
export function checkEmailConfig(): EmailConfigStatus {
  // Vérifier Resend
  if (process.env.RESEND_API_KEY) {
    return {
      isConfigured: true,
      method: 'resend',
    }
  }

  // Vérifier SMTP
  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (smtpHost && smtpUser && smtpPass) {
    return {
      isConfigured: true,
      method: 'smtp',
    }
  }

  return {
    isConfigured: false,
    method: 'none',
    error: 'Email configuration missing. Please set RESEND_API_KEY or SMTP_HOST, SMTP_USER, SMTP_PASS in .env',
  }
}

/**
 * Envoie un email via Resend
 */
async function sendViaResend(payload: SendEmailPayload): Promise<void> {
  const emailFrom = process.env.EMAIL_FROM || 'FaciliDevis <no-reply@facilidevis.app>'
  const apiKey = process.env.RESEND_API_KEY!

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: emailFrom,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      attachments: payload.attachments?.map(att => ({
        filename: att.filename,
        content: att.content.toString('base64'),
      })),
    }),
  })

  if (!resendResponse.ok) {
    const error = await resendResponse.json()
    throw new Error(error.message || 'Failed to send email via Resend')
  }
}

/**
 * Envoie un email via SMTP (Nodemailer)
 */
async function sendViaSMTP(payload: SendEmailPayload): Promise<void> {
  const emailFrom = process.env.EMAIL_FROM || 'FaciliDevis <no-reply@facilidevis.app>'

  const config = {
    host: process.env.SMTP_HOST!,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  }

  const transporter = nodemailer.createTransport(config)

  await transporter.sendMail({
    from: emailFrom,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    attachments: payload.attachments,
  })
}

/**
 * Simule l'envoi d'email en mode développement
 */
async function simulateEmail(payload: SendEmailPayload): Promise<void> {
  console.log('📧 [DEV MODE] Email simulation:')
  console.log('  To:', payload.to)
  console.log('  Subject:', payload.subject)
  console.log('  Attachments:', payload.attachments?.length || 0)
  console.log('  HTML length:', payload.html.length, 'chars')
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log('✅ [DEV MODE] Email would be sent successfully')
}

/**
 * Fonction principale pour envoyer un email
 * 
 * @param payload - Les données de l'email à envoyer
 * @param options - Options supplémentaires
 * @param options.allowSimulation - Si true, simule l'envoi en dev si la config est manquante (défaut: true en dev)
 * @throws {Error} Si la configuration est manquante et que la simulation n'est pas autorisée
 */
export async function sendEmail(
  payload: SendEmailPayload,
  options: { allowSimulation?: boolean } = {}
): Promise<void> {
  const { allowSimulation = process.env.NODE_ENV === 'development' } = options
  const configStatus = checkEmailConfig()

  // Si pas de config et simulation autorisée, simuler l'envoi
  if (!configStatus.isConfigured && allowSimulation) {
    await simulateEmail(payload)
    return
  }

  // Si pas de config et simulation non autorisée, lancer une erreur
  if (!configStatus.isConfigured) {
    throw new Error(
      configStatus.error || 
      'Email configuration missing. Please set RESEND_API_KEY or SMTP_HOST, SMTP_USER, SMTP_PASS in .env'
    )
  }

  // Envoyer via la méthode configurée
  try {
    if (configStatus.method === 'resend') {
      await sendViaResend(payload)
    } else if (configStatus.method === 'smtp') {
      await sendViaSMTP(payload)
    }
  } catch (error: any) {
    // Si erreur Resend, essayer SMTP en fallback (si configuré)
    if (configStatus.method === 'resend' && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.warn('Resend failed, falling back to SMTP:', error.message)
      try {
        await sendViaSMTP(payload)
        return
      } catch (smtpError) {
        throw new Error(`Email sending failed: ${smtpError instanceof Error ? smtpError.message : 'Unknown error'}`)
      }
    }
    throw error
  }
}

/**
 * Génère le HTML de l'email pour un devis
 */
export function generateQuoteEmailHTML(quote: {
  id?: string
  title: string
  description?: string | null
  amountHt: number
  amountTtc: number
  createdAt: Date
  client: {
    name: string
  }
  items: Array<{
    label: string
    qty: number
    unitPrice: number
    total: number
  }>
  user: {
    companyName?: string | null
    email: string
    phone?: string | null
  }
}): string {
  const tva = quote.amountTtc - quote.amountHt
  const quoteId = quote.id || ''
  const quoteUrl = quoteId ? `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quoteId}` : '#'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #111111;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            color: #1E88E5;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            color: #111111;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th {
            background-color: #ECEFF1;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ECEFF1;
          }
          .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
          }
          .total-ttc {
            font-size: 18px;
            color: #1E88E5;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ECEFF1;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1E88E5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">FaciliDevis</div>
          
          <div class="section">
            <div class="section-title">Devis : ${quote.title}</div>
            <p>Bonjour ${quote.client.name},</p>
            <p>Vous trouverez ci-joint votre devis détaillé.</p>
          </div>

          ${quote.description ? `
          <div class="section">
            <div class="section-title">Description</div>
            <p>${quote.description}</p>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Détail du devis</div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qté</th>
                  <th>Prix unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${quote.items.map(item => `
                  <tr>
                    <td>${item.label}</td>
                    <td>${item.qty}</td>
                    <td>${item.unitPrice.toFixed(2)} €</td>
                    <td>${item.total.toFixed(2)} €</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="3">Total HT</td>
                  <td>${quote.amountHt.toFixed(2)} €</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3">TVA (20%)</td>
                  <td>${tva.toFixed(2)} €</td>
                </tr>
                <tr class="total-row total-ttc">
                  <td colspan="3">Total TTC</td>
                  <td>${quote.amountTtc.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <p>Vous pouvez consulter et accepter ce devis en ligne en cliquant sur le bouton ci-dessous :</p>
            <a href="${quoteUrl}" class="button">Voir le devis en ligne</a>
          </div>

          <div class="footer">
            <p>${quote.user.companyName || 'FaciliDevis'}</p>
            <p>${quote.user.email}${quote.user.phone ? ` | ${quote.user.phone}` : ''}</p>
            <p style="margin-top: 10px;">Document généré par FaciliDevis</p>
          </div>
        </div>
      </body>
    </html>
  `
}
