/**
 * Route API d'inscription avec Firebase Auth
 * 
 * Crée un compte Firebase Auth et un document User dans Firestore
 */

import { NextRequest, NextResponse } from 'next/server'
import { signUpWithEmail } from '@/lib/firebase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, companyName, phone } = await request.json()

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Vérifier la force du mot de passe (minimum 6 caractères pour Firebase)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Inscription Firebase Auth + création document User
    const { user, userData } = await signUpWithEmail(
      email,
      password,
      companyName,
      phone
    )

    // Récupérer le token ID pour la session
    const idToken = await user.getIdToken()

    // Créer la réponse
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

    // Définir le cookie avec le token Firebase
    response.cookies.set('firebase-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[AUTH] Register error:', error)
    
    return NextResponse.json(
      { error: error.message || 'Erreur serveur lors de l\'inscription' },
      { status: 400 }
    )
  }
}

