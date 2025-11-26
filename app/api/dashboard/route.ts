import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

async function handler(req: NextRequest, userId: string) {
  try {
    const quotes = await prisma.quote.findMany({
      where: { userId },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    const sent = await prisma.quote.count({
      where: {
        userId,
        status: {
          in: ['sent', 'viewed', 'reminded', 'accepted'],
        },
      },
    })

    const accepted = await prisma.quote.count({
      where: {
        userId,
        status: 'accepted',
      },
    })

    const conversionRate = sent > 0 ? (accepted / sent) * 100 : 0

    return NextResponse.json({
      stats: {
        sent,
        accepted,
        conversionRate,
      },
      recentQuotes: quotes.map((quote) => ({
        id: quote.id,
        title: quote.title,
        amountTtc: quote.amountTtc,
        status: quote.status,
        createdAt: quote.createdAt.toISOString(),
        client: quote.client,
      })),
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler)

