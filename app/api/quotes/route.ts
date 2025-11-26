import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { generateQuotePDF } from '@/lib/pdf'

async function getHandler(req: NextRequest, userId: string) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = { userId }
    if (status && status !== 'all') {
      where.status = status
    }

    const quotes = await prisma.quote.findMany({
      where,
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
    })

    return NextResponse.json({
      quotes: quotes.map((quote) => ({
        id: quote.id,
        title: quote.title,
        amountTtc: quote.amountTtc,
        status: quote.status,
        createdAt: quote.createdAt.toISOString(),
        client: quote.client,
      })),
    })
  } catch (error) {
    console.error('Get quotes error:', error)
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

    const amountHt = items.reduce((sum: number, item: any) => {
      const total = (item.qty || 0) * (item.unitPrice || 0)
      return sum + total
    }, 0)
    const amountTtc = amountHt * 1.2 // 20% TVA

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        userId,
        clientId,
        title,
        description: description || null,
        amountHt,
        amountTtc,
        status: 'draft',
      },
    })

    // Create quote items
    await prisma.quoteItem.createMany({
      data: items.map((item: any) => ({
        quoteId: quote.id,
        label: item.label,
        qty: item.qty || 1,
        unitPrice: item.unitPrice || 0,
        total: (item.qty || 0) * (item.unitPrice || 0),
      })),
    })

    // Generate PDF
    const quoteWithRelations = await prisma.quote.findUnique({
      where: { id: quote.id },
      include: {
        client: true,
        items: true,
        user: {
          select: {
            companyName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (quoteWithRelations) {
      const pdfDataUri = generateQuotePDF({
        id: quoteWithRelations.id,
        title: quoteWithRelations.title,
        description: quoteWithRelations.description || undefined,
        amountHt: quoteWithRelations.amountHt,
        amountTtc: quoteWithRelations.amountTtc,
        createdAt: quoteWithRelations.createdAt,
        client: quoteWithRelations.client,
        items: quoteWithRelations.items,
        user: quoteWithRelations.user,
      })

      // Update quote with PDF URL (in production, save to storage and get URL)
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          pdfUrl: pdfDataUri,
        },
      })
    }

    // Create reminders if auto reminders enabled
    if (autoReminders) {
      const reminderDates = [
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // J+3
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // J+7
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // J+14
      ]

      await prisma.reminder.createMany({
        data: reminderDates.map((date, index) => ({
          quoteId: quote.id,
          userId,
          reminderDate: date,
          reminderType: 'email',
          status: 'pending',
        })),
      })
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error('Create quote error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getHandler)
export const POST = requireAuth(postHandler)
