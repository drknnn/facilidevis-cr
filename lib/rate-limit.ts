/**
 * Rate limiting simple pour les API routes
 * 
 * Utilise un Map en mémoire (pour production, utilisez Redis ou un service dédié)
 */

interface RateLimitStore {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitStore>()

/**
 * Vérifie si une requête dépasse la limite de taux
 * 
 * @param identifier - Identifiant unique (ex: IP, userId)
 * @param maxRequests - Nombre maximum de requêtes
 * @param windowMs - Fenêtre de temps en millisecondes
 * @returns true si la limite est dépassée, false sinon
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute par défaut
): boolean {
  const now = Date.now()
  const record = store.get(identifier)

  // Si pas de record ou fenêtre expirée, créer un nouveau record
  if (!record || now > record.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return false
  }

  // Incrémenter le compteur
  record.count++

  // Vérifier si la limite est dépassée
  if (record.count > maxRequests) {
    return true
  }

  return false
}

/**
 * Nettoie les enregistrements expirés (à appeler périodiquement)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  const keysToDelete: string[] = []
  store.forEach((record, key) => {
    if (now > record.resetTime) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach(key => store.delete(key))
}

// Nettoyer toutes les 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

/**
 * Middleware de rate limiting pour Next.js API routes
 */
export function rateLimitMiddleware(
  maxRequests: number = 100,
  windowMs: number = 60000
) {
  return (req: Request): { allowed: boolean; remaining: number } => {
    // Utiliser l'IP comme identifiant (ou userId si disponible)
    const identifier = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown'
    
    const isLimited = checkRateLimit(identifier, maxRequests, windowMs)
    const record = store.get(identifier)
    
    return {
      allowed: !isLimited,
      remaining: record ? Math.max(0, maxRequests - record.count) : maxRequests,
    }
  }
}

