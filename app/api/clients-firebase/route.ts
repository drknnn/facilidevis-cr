/**
 * Route API pour les clients (Firestore)
 * 
 * GET: Récupère la liste des clients de l'utilisateur
 * POST: Crée un nouveau client
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-firebase'
import { getClients, createClient } from '@/lib/firestore'

async function getHandler(req: NextRequest, userId: string) {
  try {
    const clients = await getClients(userId)

    return NextResponse.json({ clients })
  } catch (error) {
    console.error('[API] Get clients error:', error)
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

    const client = await createClient(userId, {
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
    })

    return NextResponse.json({ client })
  } catch (error) {
    console.error('[API] Create client error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getHandler)
export const POST = requireAuth(postHandler)

