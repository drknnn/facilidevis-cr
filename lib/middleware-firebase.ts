/**
 * Middleware Firebase pour les routes API
 * 
 * Remplace le middleware JWT par Firebase Auth
 * Vérifie les tokens Firebase ID côté serveur
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from './firebase-admin'

/**
 * Récupère l'UID Firebase de l'utilisateur authentifié depuis la requête
 * Vérifie le token Firebase ID depuis le cookie ou Authorization header
 */
export async function getAuthUser(request: NextRequest): Promise<string | null> {
  try {
    // Option 1 : Token depuis cookie (préféré pour web)
    const tokenFromCookie = request.cookies.get('firebase-token')?.value
    
    // Option 2 : Token depuis Authorization header (préféré pour API)
    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null
    
    const token = tokenFromCookie || tokenFromHeader

    if (!token) {
      return null
    }

    // Vérifier le token Firebase
    const decoded = await verifyIdToken(token)
    
    if (!decoded || !decoded.uid) {
      return null
    }

    return decoded.uid
  } catch (error) {
    console.error('[MIDDLEWARE] Error in getAuthUser:', error)
    return null
  }
}

/**
 * Wrapper pour routes API nécessitant une authentification
 * Vérifie l'authentification avant d'exécuter le handler
 */
export function requireAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const userId = await getAuthUser(req)

      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      return handler(req, userId)
    } catch (error) {
      console.error('[MIDDLEWARE] Error in requireAuth:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

