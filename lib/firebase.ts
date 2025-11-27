/**
 * Configuration Firebase pour FaciliDevis
 * 
 * Initialise Firebase App, Auth et Firestore
 * Utilise les variables d'environnement NEXT_PUBLIC_FIREBASE_*
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Vérifier que toutes les variables sont définies
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
)

if (missingVars.length > 0) {
  console.warn('⚠️ Variables Firebase manquantes:')
  missingVars.forEach((varName) => {
    console.warn(`   - ${varName}`)
  })
  console.warn('   Ajoutez ces variables dans votre fichier .env.local')
  console.warn('   Voir .env.local.example pour un exemple')
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Firebase configuration missing: ${missingVars.join(', ')}`)
  }
  
  // En développement, continuer sans Firebase (pour permettre le build)
  console.warn('   ⚠️ Continuation du build sans Firebase (développement uniquement)')
}

// Initialiser Firebase App (éviter double initialisation)
let app: FirebaseApp | null = null
if (missingVars.length === 0) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
} else {
  // En développement, créer une app vide si les variables manquent
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Firebase non initialisé: variables manquantes')
  }
}

// Exporter les instances Firebase
// En production, ces valeurs ne seront jamais null si Firebase est configuré
export const auth: Auth = app ? getAuth(app) : (null as any)
export const db: Firestore = app ? getFirestore(app) : (null as any)
export const storage: FirebaseStorage = app ? getStorage(app) : (null as any)
export { app }

// Helper pour vérifier si Firebase est configuré
export function isFirebaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    missingVars.length === 0
  )
}

