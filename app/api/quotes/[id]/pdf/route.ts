import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { generateQuotePDF } from '@/lib/pdf'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getAuthUser(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const quote = await prisma.quote.findFirst({
      where: {
        id: params.id,
        userId,
      },
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

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfDataUri = generateQuotePDF({
      id: quote.id,
      title: quote.title,
      description: quote.description || undefined,
      amountHt: quote.amountHt,
      amountTtc: quote.amountTtc,
      createdAt: quote.createdAt,
      client: quote.client,
      items: quote.items,
      user: quote.user,
    })

    // Convert data URI to buffer
    const base64Data = pdfDataUri.split(',')[1]
    const pdfBuffer = Buffer.from(base64Data, 'base64')

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devis-${quote.id.slice(0, 8)}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    )
  }
}

