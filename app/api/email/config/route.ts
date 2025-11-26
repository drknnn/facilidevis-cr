import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware'
import { checkEmailConfig } from '@/lib/email'

/**
 * Route API pour vérifier la configuration email
 * Permet au frontend de savoir si l'email est configuré et désactiver le bouton si nécessaire
 */
export async function GET(req: NextRequest) {
  const userId = await getAuthUser(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const configStatus = checkEmailConfig()

  return NextResponse.json({
    isConfigured: configStatus.isConfigured,
    method: configStatus.method,
    // Ne pas exposer l'erreur complète en production pour des raisons de sécurité
    message: configStatus.isConfigured 
      ? 'Email configuration is ready' 
      : 'Email configuration is missing. Email sending will be simulated in development mode.',
  })
}

