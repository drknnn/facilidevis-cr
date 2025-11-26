/**
 * Route API pour les devis (Firestore)
 * 
 * GET: Récupère la liste des devis de l'utilisateur (avec filtrage par statut)
 * POST: Crée un nouveau devis avec ses lignes et éventuellement des relances
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-firebase'
import { getQuotes, createQuote, updateQuote, getClientById, getUserById } from '@/lib/firestore'
import { generateQuotePDF } from '@/lib/pdf'

async function getHandler(req: NextRequest, userId: string) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as any

    const quotes = await getQuotes(userId, status)

    return NextResponse.json({
      quotes: quotes.map((quote) => ({
        id: quote.id,
        title: quote.title,
        amountTtc: quote.amountTtc,
        status: quote.status,
        createdAt: quote.createdAt instanceof Date 
          ? quote.createdAt.toISOString() 
          : (quote.createdAt as any).toDate().toISOString(),
        client: {
          // Pour simplifier, on retourne juste le clientId
          // Le client complet sera récupéré dans la page de détail si nécessaire
          id: quote.clientId,
        },
      })),
    })
  } catch (error) {
    console.error('[API] Get quotes error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

async function postHandler(req: NextRequest, userId: string) {
  try {
    const { clientId, title, description, items, autoReminders } = await req.json()

    if (!clientId || !title || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Client, titre et articles requis' },
        { status: 400 }
      )
    }

    // Créer le devis dans Firestore
    const quote = await createQuote(userId, {
      clientId,
      title,
      description: description || null,
      items: items.map((item: any) => ({
        label: item.label,
        qty: item.qty || 1,
        unitPrice: item.unitPrice || 0,
        total: (item.qty || 0) * (item.unitPrice || 0),
      })),
      autoReminders: autoReminders || false,
    })

    // Générer le PDF (optionnel, peut être fait plus tard)
    try {
      // Récupérer les relations pour le PDF
      const client = await getClientById(clientId, userId)
      const user = await getUserById(userId)

      if (client && user) {
        const pdfDataUri = generateQuotePDF({
          id: quote.id,
          title: quote.title,
          description: quote.description || undefined,
          amountHt: quote.amountHt,
          amountTtc: quote.amountTtc,
          createdAt: quote.createdAt instanceof Date 
            ? quote.createdAt 
            : (quote.createdAt as any).toDate(),
          client: {
            id: client.id,
            name: client.name,
            phone: client.phone || null,
            email: client.email || null,
            address: client.address || null,
          },
          items: quote.items.map((item) => ({
            id: item.id || '',
            label: item.label,
            qty: item.qty,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
          user: {
            companyName: user.companyName || null,
            email: user.email,
            phone: user.phone || null,
          },
        })

        // TODO: En production, sauvegarder le PDF dans Firebase Storage
        // Pour l'instant, on peut stocker le data URI dans le document
        await updateQuote(quote.id, userId, { pdfUrl: pdfDataUri })
      }
    } catch (pdfError) {
      console.warn('[API] PDF generation error (non-blocking):', pdfError)
      // Ne pas bloquer la création du devis si le PDF échoue
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error('[API] Create quote error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getHandler)
export const POST = requireAuth(postHandler)

