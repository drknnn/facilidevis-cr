import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUser(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        companyName: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!user) {
      console.warn(`[AUTH] Utilisateur introuvable avec ID: ${userId}`)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('[AUTH] Get user error:', error)
    
    // Erreurs Prisma
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
