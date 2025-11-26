/**
 * Template email pour les relances automatiques
 * 
 * Template React pour générer un email HTML de relance professionnel
 */

interface ReminderEmailProps {
  quote: {
    id?: string
    title: string
    amountTtc: number
    createdAt: Date
    lastSentAt?: Date | null
    client: {
      name: string
    }
    user: {
      companyName?: string | null
      email: string
      phone?: string | null
    }
  }
  reminderType: 'first' | 'second' | 'final' // Type de relance (J+3, J+7, J+14)
}

export function generateReminderEmailHTML(props: ReminderEmailProps): string {
  const { quote, reminderType } = props
  const quoteId = quote.id || ''
  const quoteUrl = quoteId 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quoteId}` 
    : '#'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://facilidevis.app'

  // Messages selon le type de relance
  const messages = {
    first: {
      title: 'Rappel : Votre devis vous attend',
      intro: 'Il y a quelques jours, nous vous avons envoyé un devis. Nous souhaitons nous assurer que vous l\'avez bien reçu.',
      urgency: 'N\'hésitez pas à nous contacter si vous avez des questions.',
    },
    second: {
      title: 'Relance : Votre devis est toujours valable',
      intro: 'Nous vous relançons concernant le devis que nous vous avons transmis. Il est toujours valable et nous restons à votre disposition.',
      urgency: 'Nous serions ravis de pouvoir vous accompagner dans ce projet.',
    },
    final: {
      title: 'Dernière relance : Votre devis expire bientôt',
      intro: 'Ceci est notre dernière relance concernant votre devis. Celui-ci expire prochainement.',
      urgency: 'Si vous souhaitez bénéficier de cette offre, n\'hésitez pas à nous contacter rapidement.',
    },
  }

  const message = messages[reminderType]

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${message.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #111111;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .email-header {
            background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .email-header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .email-body {
            padding: 30px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #111111;
          }
          .quote-summary {
            background-color: #FFF3E0;
            border-left: 4px solid #FF9800;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .quote-summary p {
            margin: 5px 0;
            font-size: 14px;
          }
          .quote-summary strong {
            color: #E65100;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
          }
          .cta-button:hover {
            background: linear-gradient(135deg, #F57C00 0%, #E65100 100%);
            box-shadow: 0 4px 8px rgba(255, 152, 0, 0.4);
          }
          .email-footer {
            background-color: #F5F5F5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #E0E0E0;
          }
          .company-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #E0E0E0;
          }
          .company-info strong {
            color: #FF9800;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>${message.title}</h1>
          </div>
          
          <div class="email-body">
            <div class="greeting">
              Bonjour <strong>${quote.client.name}</strong>,
            </div>
            
            <p>${message.intro}</p>

            <div class="quote-summary">
              <p><strong>Devis :</strong> ${quote.title}</p>
              <p><strong>Montant TTC :</strong> ${quote.amountTtc.toFixed(2)} €</p>
              ${quote.lastSentAt ? `
                <p><strong>Envoyé le :</strong> ${new Date(quote.lastSentAt).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</p>
              ` : ''}
            </div>

            <p>${message.urgency}</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${quoteUrl}" class="cta-button">Voir le devis en ligne</a>
            </div>

            <div class="company-info">
              <p><strong>${quote.user.companyName || 'FaciliDevis'}</strong></p>
              <p>${quote.user.email}${quote.user.phone ? ` | ${quote.user.phone}` : ''}</p>
            </div>
          </div>

          <div class="email-footer">
            <p>Relance automatique générée par <strong>FaciliDevis</strong></p>
            <p>Le CRM mobile le plus simple pour artisans</p>
          </div>
        </div>
      </body>
    </html>
  `
}

