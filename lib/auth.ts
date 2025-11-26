import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Validation du JWT_SECRET avec message d'erreur clair
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('❌ ERREUR CRITIQUE: JWT_SECRET n\'est pas défini dans .env')
  console.error('   Ajoutez JWT_SECRET="votre-secret-aleatoire" dans votre fichier .env')
  console.error('   En développement, vous pouvez utiliser: JWT_SECRET="dev-secret-key-change-in-production"')
  throw new Error('JWT_SECRET is required. Please set it in your .env file.')
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 10)
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Erreur lors du hashage du mot de passe')
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export function generateToken(userId: string): string {
  try {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' })
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Erreur lors de la génération du token')
  }
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error: any) {
    // Log détaillé pour debug
    if (error.name === 'JsonWebTokenError') {
      console.warn('Invalid token format:', error.message)
    } else if (error.name === 'TokenExpiredError') {
      console.warn('Token expired:', error.message)
    } else if (error.name === 'NotBeforeError') {
      console.warn('Token not active yet:', error.message)
    } else {
      console.warn('Token verification error:', error.message)
    }
    return null
  }
}
