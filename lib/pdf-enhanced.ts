/**
 * Service PDF amélioré avec stockage Firebase Storage
 * 
 * Génère un PDF et le stocke automatiquement dans Firebase Storage
 */

import { generateQuotePDF } from './pdf'
import { uploadQuotePDF } from './firebase-storage'
import { Buffer } from 'buffer'

interface QuoteData {
  id: string
  title: string
  description?: string
  amountHt: number
  amountTtc: number
  createdAt: Date
  client: {
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
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

/**
 * Génère un PDF et le stocke dans Firebase Storage
 * 
 * @param userId - UID de l'utilisateur
 * @param quote - Données du devis
 * @returns URL de téléchargement du PDF depuis Firebase Storage
 */
export async function generateAndStoreQuotePDF(
  userId: string,
  quote: QuoteData
): Promise<string> {
  try {
    // Générer le PDF (retourne un data URI)
    const pdfDataUri = generateQuotePDF(quote)
    
    // Convertir le data URI en Buffer
    // Format data URI: data:application/pdf;base64,<base64>
    const base64Data = pdfDataUri.split(',')[1]
    const pdfBuffer = Buffer.from(base64Data, 'base64')
    
    // Upload dans Firebase Storage
    const downloadURL = await uploadQuotePDF(userId, quote.id, pdfBuffer)
    
    console.log(`[PDF] PDF generated and stored: ${downloadURL}`)
    
    return downloadURL
  } catch (error) {
    console.error('[PDF] Generate and store PDF error:', error)
    throw new Error('Erreur lors de la génération et du stockage du PDF')
  }
}

/**
 * Génère uniquement le PDF (sans stockage)
 * Utile pour les prévisualisations ou téléchargements temporaires
 */
export function generateQuotePDFOnly(quote: QuoteData): string {
  return generateQuotePDF(quote)
}

