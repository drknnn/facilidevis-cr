/**
 * Route API pour le tableau de bord (Firestore)
 * 
 * Retourne les statistiques du CRM (devis envoyés, acceptés, taux de conversion)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-firebase'
import { getDashboardStats } from '@/lib/firestore'

async function handler(req: NextRequest, userId: string) {
  try {
    const stats = await getDashboardStats(userId)

    return NextResponse.json({
      stats: {
        sent: stats.sent,
        accepted: stats.accepted,
        conversionRate: Math.round(stats.conversionRate * 100) / 100, // Arrondir à 2 décimales
      },
      recentQuotes: stats.recentQuotes.map((quote) => ({
        id: quote.id,
        title: quote.title,
        amountTtc: quote.amountTtc,
        status: quote.status,
        createdAt: quote.createdAt instanceof Date 
          ? quote.createdAt.toISOString() 
          : (quote.createdAt as any).toDate().toISOString(),
        clientId: quote.clientId,
      })),
    })
  } catch (error) {
    console.error('[API] Dashboard error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler)

