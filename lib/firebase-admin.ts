/**
 * Firebase Admin SDK pour FaciliDevis
 * 
 * Utilisé côté serveur pour vérifier les tokens Firebase Auth
 * Nécessite les variables d'environnement FIREBASE_ADMIN_* ou GOOGLE_APPLICATION_CREDENTIALS
 */

import * as admin from 'firebase-admin'

// Initialiser Firebase Admin (éviter double initialisation)
if (!admin.apps.length) {
  try {
    // Option 1 : Utiliser les credentials JSON depuis variable d'environnement
    const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson)
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    } 
    // Option 2 : Utiliser GOOGLE_APPLICATION_CREDENTIALS (chemin vers fichier JSON)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      })
    }
    // Option 3 : En développement, utiliser les credentials du projet Firebase
    else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      // En dev local, on peut utiliser les credentials du projet
      // En production Vercel, utiliser GOOGLE_APPLICATION_CREDENTIALS ou service account
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    }
    else {
      console.warn('⚠️ Firebase Admin non initialisé: aucune configuration trouvée')
      console.warn('   Configurez FIREBASE_ADMIN_SERVICE_ACCOUNT ou GOOGLE_APPLICATION_CREDENTIALS')
    }
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase Admin:', error)
  }
}

export { admin }

// Exporter adminDb pour utilisation dans les routes API
export const adminDb = admin.firestore()

/**
 * Vérifier un token Firebase ID côté serveur
 */
export async function verifyIdToken(idToken: string): Promise<{
  uid: string
  email: string | null
}> {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized')
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    }
  } catch (error: any) {
    console.error('[AUTH] Token verification error:', error)
    
    if (error.code === 'auth/id-token-expired') {
      throw new Error('Token expiré')
    }
    if (error.code === 'auth/id-token-revoked') {
      throw new Error('Token révoqué')
    }
    if (error.code === 'auth/argument-error') {
      throw new Error('Token invalide')
    }
    
    throw new Error('Token invalide')
  }
}

