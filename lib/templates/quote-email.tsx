/**
 * Template email pour l'envoi d'un devis
 * 
 * Template React pour générer un email HTML professionnel
 */

interface QuoteEmailProps {
  quote: {
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
  }
}

export function generateQuoteEmailHTML(props: QuoteEmailProps): string {
  const { quote } = props
  const tva = quote.amountTtc - quote.amountHt
  const quoteId = quote.id || ''
  const quoteUrl = quoteId 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quoteId}` 
    : '#'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://facilidevis.app'

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Devis - ${quote.title}</title>
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
            background: linear-gradient(135deg, #1E88E5 0%, #1976D2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .email-header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .email-header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .email-body {
            padding: 30px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #111111;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 12px;
            color: #1E88E5;
            border-bottom: 2px solid #E3F2FD;
            padding-bottom: 8px;
          }
          .quote-info {
            background-color: #F5F5F5;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .quote-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          .quote-info strong {
            color: #1E88E5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 14px;
          }
          th {
            background-color: #ECEFF1;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            font-size: 13px;
            color: #424242;
            border-bottom: 2px solid #BDBDBD;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #E0E0E0;
          }
          tr:hover {
            background-color: #FAFAFA;
          }
          .total-row {
            font-weight: bold;
            background-color: #F5F5F5;
            border-top: 2px solid #BDBDBD;
          }
          .total-ttc {
            font-size: 18px;
            color: #1E88E5;
            background-color: #E3F2FD;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #1E88E5 0%, #1976D2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(30, 136, 229, 0.3);
          }
          .cta-button:hover {
            background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
            box-shadow: 0 4px 8px rgba(30, 136, 229, 0.4);
          }
          .email-footer {
            background-color: #F5F5F5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #E0E0E0;
          }
          .email-footer p {
            margin: 5px 0;
          }
          .company-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #E0E0E0;
          }
          .company-info strong {
            color: #1E88E5;
          }
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100% !important;
            }
            .email-body {
              padding: 20px !important;
            }
            table {
              font-size: 12px !important;
            }
            th, td {
              padding: 8px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>FaciliDevis</h1>
            <p>Votre devis professionnel</p>
          </div>
          
          <div class="email-body">
            <div class="greeting">
              Bonjour <strong>${quote.client.name}</strong>,
            </div>
            
            <div class="section">
              <p>Vous trouverez ci-joint votre devis détaillé pour le projet :</p>
              <div class="quote-info">
                <p><strong>Titre :</strong> ${quote.title}</p>
                <p><strong>Date :</strong> ${new Date(quote.createdAt).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</p>
                <p><strong>Total TTC :</strong> ${quote.amountTtc.toFixed(2)} €</p>
              </div>
            </div>

            ${quote.description ? `
            <div class="section">
              <div class="section-title">Description du projet</div>
              <p>${quote.description.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}

            <div class="section">
              <div class="section-title">Détail du devis</div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Qté</th>
                    <th style="text-align: right;">Prix unit.</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${quote.items.map(item => `
                    <tr>
                      <td>${item.label}</td>
                      <td style="text-align: center;">${item.qty}</td>
                      <td style="text-align: right;">${item.unitPrice.toFixed(2)} €</td>
                      <td style="text-align: right;">${item.total.toFixed(2)} €</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td colspan="3"><strong>Total HT</strong></td>
                    <td style="text-align: right;"><strong>${quote.amountHt.toFixed(2)} €</strong></td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="3"><strong>TVA (20%)</strong></td>
                    <td style="text-align: right;"><strong>${tva.toFixed(2)} €</strong></td>
                  </tr>
                  <tr class="total-row total-ttc">
                    <td colspan="3"><strong>TOTAL TTC</strong></td>
                    <td style="text-align: right;"><strong>${quote.amountTtc.toFixed(2)} €</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section" style="text-align: center;">
              <p>Vous pouvez consulter et accepter ce devis en ligne :</p>
              <a href="${quoteUrl}" class="cta-button">Voir le devis en ligne</a>
            </div>

            <div class="company-info">
              <p><strong>${quote.user.companyName || 'FaciliDevis'}</strong></p>
              <p>${quote.user.email}${quote.user.phone ? ` | ${quote.user.phone}` : ''}</p>
            </div>
          </div>

          <div class="email-footer">
            <p>Document généré par <strong>FaciliDevis</strong></p>
            <p>Le CRM mobile le plus simple pour artisans</p>
            <p style="margin-top: 10px;">
              <a href="${appUrl}" style="color: #1E88E5; text-decoration: none;">${appUrl}</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

