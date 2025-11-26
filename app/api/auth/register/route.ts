import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Normaliser l'email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      console.warn(`[AUTH] Tentative d'inscription avec email existant: ${normalizedEmail}`)
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        companyName: companyName || null,
        phone: phone || null,
        role: 'artisan',
      },
    })

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

    console.log(`[AUTH] Inscription réussie pour: ${normalizedEmail}`)
    return response
  } catch (error: any) {
    console.error('[AUTH] Register error:', error)
    
    // Erreurs Prisma spécifiques
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
