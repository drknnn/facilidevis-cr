/**
 * Route API de déconnexion
 * 
 * Supprime le cookie Firebase token
 * Note: La vraie déconnexion Firebase doit être faite côté client avec signOut()
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })

    // Supprimer le cookie
    response.cookies.delete('firebase-token')
    response.cookies.set('firebase-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[AUTH] Logout error:', error)
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la déconnexion' },
      { status: 500 }
    )
  }
}

