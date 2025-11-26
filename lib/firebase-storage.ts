/**
 * Service Firebase Storage pour FaciliDevis
 * 
 * Gère l'upload et le téléchargement de fichiers :
 * - PDFs de devis
 * - Logos clients
 * - Photos de chantier
 */

import { storage } from './firebase'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from 'firebase/storage'

/**
 * Upload un PDF de devis dans Firebase Storage
 * 
 * @param userId - UID de l'utilisateur
 * @param quoteId - ID du devis
 * @param pdfBuffer - Buffer du PDF
 * @returns URL de téléchargement du PDF
 */
export async function uploadQuotePDF(
  userId: string,
  quoteId: string,
  pdfBuffer: Buffer
): Promise<string> {
  try {
    const storagePath = `quotes/${userId}/${quoteId}.pdf`
    const storageRef = ref(storage, storagePath)
    
    // Upload le PDF
    const uploadResult: UploadResult = await uploadBytes(storageRef, pdfBuffer, {
      contentType: 'application/pdf',
      cacheControl: 'public, max-age=31536000', // Cache 1 an
    })
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(uploadResult.ref)
    
    console.log(`[STORAGE] PDF uploaded: ${storagePath}`)
    
    return downloadURL
  } catch (error) {
    console.error('[STORAGE] Upload PDF error:', error)
    throw new Error('Erreur lors de l\'upload du PDF')
  }
}

/**
 * Upload un logo client dans Firebase Storage
 * 
 * @param userId - UID de l'utilisateur
 * @param clientId - ID du client
 * @param imageBuffer - Buffer de l'image
 * @param mimeType - Type MIME de l'image (ex: 'image/png', 'image/jpeg')
 * @returns URL de téléchargement de l'image
 */
export async function uploadClientLogo(
  userId: string,
  clientId: string,
  imageBuffer: Buffer,
  mimeType: string = 'image/png'
): Promise<string> {
  try {
    const storagePath = `clients/${userId}/${clientId}/logo.${mimeType.split('/')[1]}`
    const storageRef = ref(storage, storagePath)
    
    const uploadResult: UploadResult = await uploadBytes(storageRef, imageBuffer, {
      contentType: mimeType,
      cacheControl: 'public, max-age=31536000',
    })
    
    const downloadURL = await getDownloadURL(uploadResult.ref)
    
    console.log(`[STORAGE] Client logo uploaded: ${storagePath}`)
    
    return downloadURL
  } catch (error) {
    console.error('[STORAGE] Upload logo error:', error)
    throw new Error('Erreur lors de l\'upload du logo')
  }
}

/**
 * Upload une photo de chantier
 * 
 * @param userId - UID de l'utilisateur
 * @param quoteId - ID du devis
 * @param imageBuffer - Buffer de l'image
 * @param mimeType - Type MIME de l'image
 * @param filename - Nom du fichier (optionnel)
 * @returns URL de téléchargement de l'image
 */
export async function uploadSitePhoto(
  userId: string,
  quoteId: string,
  imageBuffer: Buffer,
  mimeType: string = 'image/jpeg',
  filename?: string
): Promise<string> {
  try {
    const timestamp = Date.now()
    const fileExtension = mimeType.split('/')[1]
    const fileName = filename || `photo-${timestamp}.${fileExtension}`
    const storagePath = `quotes/${userId}/${quoteId}/photos/${fileName}`
    const storageRef = ref(storage, storagePath)
    
    const uploadResult: UploadResult = await uploadBytes(storageRef, imageBuffer, {
      contentType: mimeType,
      cacheControl: 'public, max-age=31536000',
    })
    
    const downloadURL = await getDownloadURL(uploadResult.ref)
    
    console.log(`[STORAGE] Site photo uploaded: ${storagePath}`)
    
    return downloadURL
  } catch (error) {
    console.error('[STORAGE] Upload photo error:', error)
    throw new Error('Erreur lors de l\'upload de la photo')
  }
}

/**
 * Supprime un fichier de Firebase Storage
 * 
 * @param fileUrl - URL complète du fichier à supprimer
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extraire le chemin depuis l'URL Firebase Storage
    // Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const url = new URL(fileUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)
    
    if (!pathMatch) {
      throw new Error('URL invalide')
    }
    
    // Décoder le chemin (les espaces sont encodés en %20)
    const storagePath = decodeURIComponent(pathMatch[1])
    const storageRef = ref(storage, storagePath)
    
    await deleteObject(storageRef)
    
    console.log(`[STORAGE] File deleted: ${storagePath}`)
  } catch (error) {
    console.error('[STORAGE] Delete file error:', error)
    throw new Error('Erreur lors de la suppression du fichier')
  }
}

/**
 * Génère une URL signée pour un fichier (optionnel, pour accès temporaire)
 * Note: Firebase Storage génère automatiquement des URLs publiques
 * Cette fonction est utile si vous voulez générer des URLs avec expiration
 */
export async function getSignedURL(
  storagePath: string,
  expiresIn: number = 3600 // 1 heure par défaut
): Promise<string> {
  try {
    const storageRef = ref(storage, storagePath)
    const downloadURL = await getDownloadURL(storageRef)
    
    // Note: Firebase Storage ne supporte pas nativement les URLs signées avec expiration
    // Si vous avez besoin de cette fonctionnalité, utilisez Firebase Admin SDK côté serveur
    return downloadURL
  } catch (error) {
    console.error('[STORAGE] Get signed URL error:', error)
    throw new Error('Erreur lors de la génération de l\'URL')
  }
}

