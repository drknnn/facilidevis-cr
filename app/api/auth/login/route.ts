import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

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

    // Normaliser l'email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      console.warn(`[AUTH] Tentative de connexion avec email inexistant: ${normalizedEmail}`)
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      console.warn(`[AUTH] Mot de passe incorrect pour l'utilisateur: ${normalizedEmail}`)
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Générer le token
    const token = generateToken(user.id)

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        phone: user.phone,
      },
    })

    // Définir le cookie côté serveur (plus fiable que côté client)
    response.cookies.set('token', token, {
      httpOnly: true, // Sécurité : empêche l'accès JavaScript au cookie
      secure: process.env.NODE_ENV === 'production', // HTTPS en production
      sameSite: 'lax', // Protection CSRF
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: '/',
    })

    console.log(`[AUTH] Connexion réussie pour: ${normalizedEmail}`)
    return response
  } catch (error: any) {
    console.error('[AUTH] Login error:', error)
    
    // Erreurs Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    )
  }
}
