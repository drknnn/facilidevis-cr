/**
 * Services d'authentification Firebase pour FaciliDevis
 * 
 * Remplace l'ancien système JWT + bcrypt par Firebase Auth
 * Fonctions utilitaires pour signup, signin, signout
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { User } from '@/types/crm'

/**
 * Inscription avec email + mot de passe
 * Crée le compte Firebase Auth et le document User dans Firestore
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  companyName?: string,
  phone?: string
): Promise<{ user: FirebaseUser; userData: User }> {
  try {
    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim()

    // Créer le compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    )

    const firebaseUser = userCredential.user

    // Mettre à jour le profil avec le nom de l'entreprise si fourni
    if (companyName) {
      await updateProfile(firebaseUser, {
        displayName: companyName,
      })
    }

    // Créer le document User dans Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email: normalizedEmail,
      role: 'artisan',
      companyName: companyName || null,
      phone: phone || null,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    }

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`[AUTH] Inscription réussie pour: ${normalizedEmail}`)

    return {
      user: firebaseUser,
      userData,
    }
  } catch (error: any) {
    console.error('[AUTH] Sign up error:', error)
    
    // Erreurs Firebase communes
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Cet email est déjà utilisé')
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Email invalide')
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères')
    }

    throw new Error('Erreur lors de l\'inscription')
  }
}

/**
 * Connexion avec email + mot de passe
 * Retourne le token Firebase Auth (utilisable côté serveur)
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: FirebaseUser; idToken: string; userData: User }> {
  try {
    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim()

    // Connexion Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    )

    const firebaseUser = userCredential.user

    // Récupérer le token ID (nécessaire pour vérification côté serveur)
    const idToken = await firebaseUser.getIdToken()

    // Récupérer les données utilisateur depuis Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    
    if (!userDoc.exists()) {
      throw new Error('Données utilisateur introuvables')
    }

    const userData = userDoc.data() as User

    console.log(`[AUTH] Connexion réussie pour: ${normalizedEmail}`)

    return {
      user: firebaseUser,
      idToken,
      userData,
    }
  } catch (error: any) {
    console.error('[AUTH] Sign in error:', error)
    
    // Erreurs Firebase communes
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Email ou mot de passe incorrect')
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Email invalide')
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Trop de tentatives. Veuillez réessayer plus tard')
    }

    throw new Error('Erreur lors de la connexion')
  }
}

/**
 * Connexion avec Google (optionnel)
 */
export async function signInWithGoogle(): Promise<{
  user: FirebaseUser
  idToken: string
  userData: User
}> {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const firebaseUser = userCredential.user

    // Récupérer le token ID
    const idToken = await firebaseUser.getIdToken()

    // Vérifier si l'utilisateur existe dans Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid)
    const userDoc = await getDoc(userDocRef)

    let userData: User

    if (!userDoc.exists()) {
      // Créer le document User si inexistant
      userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        role: 'artisan',
        companyName: firebaseUser.displayName || null,
        phone: firebaseUser.phoneNumber || null,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      }

      await setDoc(userDocRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      userData = userDoc.data() as User
    }

    return {
      user: firebaseUser,
      idToken,
      userData,
    }
  } catch (error: any) {
    console.error('[AUTH] Google sign in error:', error)
    throw new Error('Erreur lors de la connexion avec Google')
  }
}

/**
 * Déconnexion
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
    console.log('[AUTH] Déconnexion réussie')
  } catch (error) {
    console.error('[AUTH] Sign out error:', error)
    throw new Error('Erreur lors de la déconnexion')
  }
}

/**
 * Observer les changements d'état d'authentification
 * Utile côté client pour gérer la session
 */
export function onAuthStateChangedCallback(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback)
}

/**
 * Vérifier le token Firebase côté serveur
 * Utilisé dans les routes API pour valider l'authentification
 */
export async function verifyIdToken(idToken: string): Promise<{
  uid: string
  email: string | null
}> {
  try {
    // En server-side Next.js, on utilise Admin SDK pour vérifier les tokens
    // Pour l'instant, on retourne une structure basique
    // TODO: Implémenter avec Firebase Admin SDK si nécessaire
    const admin = await import('firebase-admin')
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          // Les autres credentials doivent être dans les variables d'env
        }),
      })
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    }
  } catch (error) {
    console.error('[AUTH] Token verification error:', error)
    throw new Error('Token invalide')
  }
}

