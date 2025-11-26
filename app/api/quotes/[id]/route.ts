import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

async function getHandler(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    const quote = await prisma.quote.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        client: true,
        items: true,
        reminders: {
          orderBy: {
            reminderDate: 'asc',
          },
        },
        signature: true,
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
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error('Get quote error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getAuthUser(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return getHandler(req, userId, { params })
}
