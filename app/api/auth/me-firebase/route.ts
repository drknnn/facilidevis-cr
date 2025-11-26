/**
 * Route API pour récupérer l'utilisateur connecté
 * 
 * Vérifie le token Firebase et retourne les données utilisateur
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware-firebase'
import { getUserById } from '@/lib/firestore'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUser(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Récupérer les données utilisateur depuis Firestore
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('[AUTH] Me error:', error)
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

