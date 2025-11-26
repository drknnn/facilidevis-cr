import jsPDF from 'jspdf'
import { addDays, format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

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

export function generateQuotePDF(quote: QuoteData): string {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = margin

  // Couleurs
  const primaryColor = [30, 136, 229] // #1E88E5
  const grayColor = [107, 114, 128] // #6B7280
  const lightGrayColor = [243, 244, 246] // #F3F4F6

  // ============================================
  // HEADER - 3 colonnes
  // ============================================
  
  // Colonne 1 : Logo + Entreprise (gauche)
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('FaciliDevis', margin, yPos)
  
  yPos += 8
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  
  if (quote.user.companyName) {
    doc.text(quote.user.companyName, margin, yPos)
    yPos += 6
  }
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  if (quote.user.email) {
    doc.text(`Email: ${quote.user.email}`, margin, yPos)
    yPos += 5
  }
  if (quote.user.phone) {
    doc.text(`Tél: ${quote.user.phone}`, margin, yPos)
    yPos += 5
  }

  // Colonne 2 : Client (centre)
  const centerX = pageWidth / 2
  yPos = margin + 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Adresse du client', centerX - 30, yPos)
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.text(quote.client.name, centerX - 30, yPos)
  yPos += 5
  if (quote.client.address) {
    const addressLines = doc.splitTextToSize(quote.client.address, 60)
    doc.text(addressLines, centerX - 30, yPos)
    yPos += addressLines.length * 5
  }
  if (quote.client.phone) {
    doc.text(`Tél: ${quote.client.phone}`, centerX - 30, yPos)
    yPos += 5
  }
  if (quote.client.email) {
    doc.text(`Email: ${quote.client.email}`, centerX - 30, yPos)
  }

  // Colonne 3 : Informations devis (droite)
  const rightX = pageWidth - margin - 50
  yPos = margin + 8
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
  doc.roundedRect(rightX, yPos - 5, 50, 35, 3, 3, 'F')
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text('DEVIS', rightX + 5, yPos)
  yPos += 7
  
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.text(`N° ${quote.id.slice(0, 8).toUpperCase()}`, rightX + 5, yPos)
  yPos += 5
  
  const quoteDate = new Date(quote.createdAt)
  doc.text(`Date: ${format(quoteDate, 'dd/MM/yyyy', { locale: fr })}`, rightX + 5, yPos)
  yPos += 5
  
  const validUntil = addDays(quoteDate, 30)
  doc.text(`Valable jusqu'au:`, rightX + 5, yPos)
  yPos += 4
  doc.text(format(validUntil, 'dd/MM/yyyy', { locale: fr }), rightX + 5, yPos)

  yPos = margin + 50

  // Titre du devis
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(quote.title, margin, yPos)
  yPos += 10

  // ============================================
  // DESCRIPTION (si présente)
  // ============================================
  if (quote.description) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Description du projet:', margin, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    const descriptionLines = doc.splitTextToSize(quote.description, pageWidth - 2 * margin)
    doc.text(descriptionLines, margin, yPos)
    yPos += descriptionLines.length * 5 + 8
  }

  // ============================================
  // TABLEAU DES LIGNES
  // ============================================
  yPos += 5
  
  // En-tête du tableau
  const tableTop = yPos
  const colWidths = {
    designation: pageWidth - 2 * margin - 100,
    unite: 15,
    qty: 20,
    prixUnit: 30,
    total: 35,
  }
  
  const colX = {
    designation: margin,
    unite: margin + colWidths.designation,
    qty: margin + colWidths.designation + colWidths.unite,
    prixUnit: margin + colWidths.designation + colWidths.unite + colWidths.qty,
    total: margin + colWidths.designation + colWidths.unite + colWidths.qty + colWidths.prixUnit,
  }

  // Fond de l'en-tête
  doc.setFillColor(236, 239, 241) // #ECEFF1
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F')
  
  // Texte de l'en-tête
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Désignation', colX.designation + 2, yPos)
  doc.text('U', colX.unite + 2, yPos, { align: 'center' })
  doc.text('Qté', colX.qty + 2, yPos, { align: 'right' })
  doc.text('Prix unit.', colX.prixUnit + 2, yPos, { align: 'right' })
  doc.text('Total HT', colX.total + 2, yPos, { align: 'right' })
  
  yPos += 10

  // Lignes du tableau
  doc.setFont('helvetica', 'normal')
  quote.items.forEach((item, index) => {
    // Nouvelle page si nécessaire
    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = margin + 20
    }

    // Alternance de couleurs
    if (index % 2 === 1) {
      doc.setFillColor(249, 250, 251) // #F9FAFB
      doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 6, 'F')
    }

    // Désignation (peut être sur plusieurs lignes)
    const labelLines = doc.splitTextToSize(item.label, colWidths.designation - 4)
    doc.setFontSize(9)
    doc.text(labelLines, colX.designation + 2, yPos)
    
    // Unité
    doc.text('U', colX.unite + 2, yPos, { align: 'center' })
    
    // Quantité
    doc.text(item.qty.toString(), colX.qty + 2, yPos, { align: 'right' })
    
    // Prix unitaire
    doc.text(`${item.unitPrice.toFixed(2)} €`, colX.prixUnit + 2, yPos, { align: 'right' })
    
    // Total
    doc.setFont('helvetica', 'bold')
    doc.text(`${item.total.toFixed(2)} €`, colX.total + 2, yPos, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    
    yPos += Math.max(labelLines.length * 5, 6) + 2
  })

  yPos += 5

  // ============================================
  // TOTAUX
  // ============================================
  const totalsX = pageWidth - margin - 35
  const totalsStartY = yPos
  
  // Fond pour les totaux
  doc.setFillColor(249, 250, 251) // #F9FAFB
  doc.rect(totalsX - 80, totalsStartY - 5, 80, 30, 'F')
  doc.setDrawColor(30, 136, 229) // Bordure bleue
  doc.setLineWidth(0.5)
  doc.rect(totalsX - 80, totalsStartY - 5, 80, 30, 'D')

  yPos = totalsStartY
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Total HT:', totalsX - 10, yPos, { align: 'right' })
  doc.text(`${quote.amountHt.toFixed(2)} €`, totalsX, yPos, { align: 'right' })
  yPos += 7

  const tva = quote.amountTtc - quote.amountHt
  doc.text('TVA (20%):', totalsX - 10, yPos, { align: 'right' })
  doc.text(`${tva.toFixed(2)} €`, totalsX, yPos, { align: 'right' })
  yPos += 7

  doc.setDrawColor(200, 200, 200)
  doc.line(totalsX - 80, yPos, totalsX, yPos)
  yPos += 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text('Total TTC:', totalsX - 10, yPos, { align: 'right' })
  doc.text(`${quote.amountTtc.toFixed(2)} €`, totalsX, yPos, { align: 'right' })

  yPos += 15

  // ============================================
  // CONDITIONS DE RÈGLEMENT
  // ============================================
  if (yPos > pageHeight - 80) {
    doc.addPage()
    yPos = margin
  }

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Conditions de règlement:', margin, yPos)
  yPos += 6

  doc.setFont('helvetica', 'normal')
  const depositRate = 20
  const depositAmount = (quote.amountTtc * depositRate) / 100
  const balanceAmount = quote.amountTtc - depositAmount

  doc.text(`Acompte de ${depositRate}% à la commande: ${depositAmount.toFixed(2)} €`, margin, yPos)
  yPos += 5
  doc.text(`Solde à la livraison: ${balanceAmount.toFixed(2)} €`, margin, yPos)
  yPos += 5
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
  doc.text('Paiement comptant dès réception des travaux.', margin, yPos)
  yPos += 8

  // Mentions
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const mentionText = 'Merci de nous retourner un exemplaire de ce devis signé avec votre nom et revêtu de la mention « Bon pour accord et commande ».'
  const mentionLines = doc.splitTextToSize(mentionText, pageWidth - 2 * margin)
  doc.text(mentionLines, margin, yPos)

  // ============================================
  // FOOTER
  // ============================================
  yPos = pageHeight - 15
  doc.setFontSize(7)
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
  doc.setFont('helvetica', 'normal')
  doc.text('Document généré par FaciliDevis', margin, yPos, { align: 'left' })

  return doc.output('datauristring')
}
