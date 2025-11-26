/**
 * Route API de connexion avec Firebase Auth
 * 
 * Remplace l'ancien système JWT + bcrypt par Firebase Auth
 * Retourne un token Firebase ID à stocker côté client
 */

import { NextRequest, NextResponse } from 'next/server'
import { signInWithEmail } from '@/lib/firebase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Connexion Firebase Auth
    const { user, idToken, userData } = await signInWithEmail(email, password)

    // Créer la réponse avec le token
    const response = NextResponse.json({
      success: true,
      token: idToken,
      user: {
        id: user.uid,
        email: userData.email,
        companyName: userData.companyName,
        phone: userData.phone,
      },
    })

    // Définir le cookie avec le token Firebase (pour compatibilité web)
    response.cookies.set('firebase-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 jours (les tokens Firebase expirent après 1h, le cookie sera rafraîchi côté client)
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[AUTH] Login error:', error)
    
    return NextResponse.json(
      { error: error.message || 'Erreur serveur lors de la connexion' },
      { status: 401 }
    )
  }
}

