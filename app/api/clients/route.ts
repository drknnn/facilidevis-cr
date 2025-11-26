import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

async function getHandler(req: NextRequest, userId: string) {
  try {
    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ clients })
  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

async function postHandler(req: NextRequest, userId: string) {
  try {
    const { name, phone, email, address } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        userId,
        name,
        phone: phone || null,
        email: email || null,
        address: address || null,
      },
    })

    return NextResponse.json({ client })
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getHandler)
export const POST = requireAuth(postHandler)

