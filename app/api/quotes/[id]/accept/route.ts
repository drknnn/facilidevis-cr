import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { signature } = await req.json()

    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Update quote status
    const updatedQuote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: 'accepted',
        acceptedAt: new Date(),
      },
    })

    // Save signature if provided
    if (signature) {
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      
      await prisma.signature.create({
        data: {
          quoteId: params.id,
          signatureImageUrl: signature,
          ipAddress: clientIp,
        },
      })
    }

    return NextResponse.json({ quote: updatedQuote })
  } catch (error) {
    console.error('Accept quote error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

