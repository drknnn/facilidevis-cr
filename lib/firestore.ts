/**
 * Services Firestore pour FaciliDevis
 * 
 * Couche d'abstraction pour les opérations CRUD sur les collections :
 * - users
 * - clients
 * - quotes (devis)
 * - reminders (relances)
 * - signatures
 * 
 * Toutes les opérations vérifient que l'utilisateur ne peut accéder qu'à ses propres données
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  writeBatch,
  addDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  User,
  Client,
  Quote,
  QuoteItem,
  Reminder,
  Signature,
  QuoteStatus,
} from '@/types/crm'

// ============================================
// USERS
// ============================================

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      return null
    }
    return { id: userDoc.id, ...userDoc.data() } as User
  } catch (error) {
    console.error('[FIRESTORE] Get user error:', error)
    throw error
  }
}

export async function updateUser(
  userId: string,
  data: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('[FIRESTORE] Update user error:', error)
    throw error
  }
}

// ============================================
// CLIENTS
// ============================================

export async function getClients(userId: string): Promise<Client[]> {
  try {
    const clientsRef = collection(db, 'clients')
    const q = query(
      clientsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Client)
    )
  } catch (error) {
    console.error('[FIRESTORE] Get clients error:', error)
    throw error
  }
}

export async function getClientById(
  clientId: string,
  userId: string
): Promise<Client | null> {
  try {
    const clientDoc = await getDoc(doc(db, 'clients', clientId))
    if (!clientDoc.exists()) {
      return null
    }
    const client = { id: clientDoc.id, ...clientDoc.data() } as Client
    
    // Vérifier que le client appartient à l'utilisateur
    if (client.userId !== userId) {
      throw new Error('Unauthorized: Client does not belong to user')
    }
    
    return client
  } catch (error) {
    console.error('[FIRESTORE] Get client error:', error)
    throw error
  }
}

export async function createClient(
  userId: string,
  data: Omit<Client, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Client> {
  try {
    const clientsRef = collection(db, 'clients')
    const clientData = {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    const docRef = await addDoc(clientsRef, clientData)
    const clientDoc = await getDoc(docRef)
    
    return { id: docRef.id, ...clientDoc.data() } as Client
  } catch (error) {
    console.error('[FIRESTORE] Create client error:', error)
    throw error
  }
}

export async function updateClient(
  clientId: string,
  userId: string,
  data: Partial<Omit<Client, 'id' | 'userId' | 'createdAt'>>>
): Promise<void> {
  try {
    // Vérifier que le client appartient à l'utilisateur
    const client = await getClientById(clientId, userId)
    if (!client) {
      throw new Error('Client not found')
    }
    
    await updateDoc(doc(db, 'clients', clientId), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('[FIRESTORE] Update client error:', error)
    throw error
  }
}

export async function deleteClient(
  clientId: string,
  userId: string
): Promise<void> {
  try {
    // Vérifier que le client appartient à l'utilisateur
    const client = await getClientById(clientId, userId)
    if (!client) {
      throw new Error('Client not found')
    }
    
    await deleteDoc(doc(db, 'clients', clientId))
  } catch (error) {
    console.error('[FIRESTORE] Delete client error:', error)
    throw error
  }
}

// ============================================
// QUOTES (Devis)
// ============================================

export async function getQuotes(
  userId: string,
  status?: QuoteStatus
): Promise<Quote[]> {
  try {
    const quotesRef = collection(db, 'quotes')
    let q = query(
      quotesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status))
    }
    
    const snapshot = await getDocs(q)
    const quotes: Quote[] = []
    
    // Pour chaque devis, récupérer les items (sous-collection ou inclus)
    for (const quoteDoc of snapshot.docs) {
      const quoteData = quoteDoc.data()
      
      // Récupérer les items (sous-collection)
      const itemsRef = collection(db, 'quotes', quoteDoc.id, 'items')
      const itemsSnapshot = await getDocs(itemsRef)
      const items: QuoteItem[] = itemsSnapshot.docs.map((itemDoc) => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      })) as QuoteItem[]
      
      quotes.push({
        id: quoteDoc.id,
        ...quoteData,
        items,
      } as Quote)
    }
    
    return quotes
  } catch (error) {
    console.error('[FIRESTORE] Get quotes error:', error)
    throw error
  }
}

export async function getQuoteById(
  quoteId: string,
  userId: string
): Promise<Quote | null> {
  try {
    const quoteDoc = await getDoc(doc(db, 'quotes', quoteId))
    if (!quoteDoc.exists()) {
      return null
    }
    const quoteData = quoteDoc.data()
    
    // Vérifier que le devis appartient à l'utilisateur
    if (quoteData.userId !== userId) {
      throw new Error('Unauthorized: Quote does not belong to user')
    }
    
    // Récupérer les items (sous-collection)
    const itemsRef = collection(db, 'quotes', quoteId, 'items')
    const itemsSnapshot = await getDocs(itemsRef)
    const items: QuoteItem[] = itemsSnapshot.docs.map((itemDoc) => ({
      id: itemDoc.id,
      ...itemDoc.data(),
    })) as QuoteItem[]
    
    // Récupérer les reminders
    const remindersRef = collection(db, 'reminders')
    const remindersQuery = query(
      remindersRef,
      where('quoteId', '==', quoteId),
      where('userId', '==', userId),
      orderBy('reminderDate', 'asc')
    )
    const remindersSnapshot = await getDocs(remindersQuery)
    const reminders = remindersSnapshot.docs.map((reminderDoc) => ({
      id: reminderDoc.id,
      ...reminderDoc.data(),
    })) as Reminder[]
    
    return {
      id: quoteDoc.id,
      ...quoteData,
      items,
      reminders,
    } as Quote
  } catch (error) {
    console.error('[FIRESTORE] Get quote error:', error)
    throw error
  }
}

export async function createQuote(
  userId: string,
  data: {
    clientId: string
    title: string
    description?: string | null
    items: Omit<QuoteItem, 'id'>[]
    autoReminders?: boolean
  }
): Promise<Quote> {
  try {
    const batch = writeBatch(db)
    
    // Calculer les totaux
    const amountHt = data.items.reduce((sum, item) => {
      const total = item.qty * item.unitPrice
      return sum + total
    }, 0)
    const amountTtc = amountHt * 1.2 // 20% TVA
    
    // Créer le devis
    const quotesRef = collection(db, 'quotes')
    const quoteData = {
      userId,
      clientId: data.clientId,
      title: data.title,
      description: data.description || null,
      amountHt,
      amountTtc,
      status: 'draft' as QuoteStatus,
      pdfUrl: null,
      sentAt: null,
      lastSentAt: null,
      viewedAt: null,
      acceptedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    const quoteDocRef = doc(quotesRef)
    const quoteId = quoteDocRef.id
    batch.set(quoteDocRef, quoteData)
    
    // Créer les items (sous-collection)
    const itemsRef = collection(db, 'quotes', quoteId, 'items')
    data.items.forEach((item) => {
      const itemDocRef = doc(itemsRef)
      batch.set(itemDocRef, {
        ...item,
        total: item.qty * item.unitPrice,
      })
    })
    
    // Créer les reminders si activés
    if (data.autoReminders) {
      const remindersRef = collection(db, 'reminders')
      const reminderDates = [
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // J+3
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // J+7
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // J+14
      ]
      
      reminderDates.forEach((date) => {
        const reminderDocRef = doc(remindersRef)
        batch.set(reminderDocRef, {
          quoteId,
          userId,
          reminderDate: Timestamp.fromDate(date),
          reminderType: 'email',
          status: 'pending',
          createdAt: serverTimestamp(),
        })
      })
    }
    
    await batch.commit()
    
    // Récupérer le devis créé avec toutes ses relations
    return await getQuoteById(quoteId, userId) as Quote
  } catch (error) {
    console.error('[FIRESTORE] Create quote error:', error)
    throw error
  }
}

export async function updateQuote(
  quoteId: string,
  userId: string,
  data: Partial<Omit<Quote, 'id' | 'userId' | 'clientId' | 'createdAt' | 'items'>>
): Promise<void> {
  try {
    // Vérifier que le devis appartient à l'utilisateur
    const quote = await getQuoteById(quoteId, userId)
    if (!quote) {
      throw new Error('Quote not found')
    }
    
    await updateDoc(doc(db, 'quotes', quoteId), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('[FIRESTORE] Update quote error:', error)
    throw error
  }
}

export async function deleteQuote(
  quoteId: string,
  userId: string
): Promise<void> {
  try {
    // Vérifier que le devis appartient à l'utilisateur
    const quote = await getQuoteById(quoteId, userId)
    if (!quote) {
      throw new Error('Quote not found')
    }
    
    // Supprimer les items (sous-collection)
    const itemsRef = collection(db, 'quotes', quoteId, 'items')
    const itemsSnapshot = await getDocs(itemsRef)
    const batch = writeBatch(db)
    
    itemsSnapshot.docs.forEach((itemDoc) => {
      batch.delete(itemDoc.ref)
    })
    
    // Supprimer le devis
    batch.delete(doc(db, 'quotes', quoteId))
    
    await batch.commit()
  } catch (error) {
    console.error('[FIRESTORE] Delete quote error:', error)
    throw error
  }
}

// ============================================
// REMINDERS
// ============================================

export async function getReminders(
  userId: string,
  quoteId?: string
): Promise<Reminder[]> {
  try {
    const remindersRef = collection(db, 'reminders')
    let q = query(remindersRef, where('userId', '==', userId))
    
    if (quoteId) {
      q = query(q, where('quoteId', '==', quoteId))
    }
    
    q = query(q, orderBy('reminderDate', 'asc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Reminder)
    )
  } catch (error) {
    console.error('[FIRESTORE] Get reminders error:', error)
    throw error
  }
}

export async function updateReminderStatus(
  reminderId: string,
  userId: string,
  status: 'pending' | 'done'
): Promise<void> {
  try {
    const reminderDoc = await getDoc(doc(db, 'reminders', reminderId))
    if (!reminderDoc.exists()) {
      throw new Error('Reminder not found')
    }
    
    const reminder = reminderDoc.data() as Reminder
    if (reminder.userId !== userId) {
      throw new Error('Unauthorized: Reminder does not belong to user')
    }
    
    await updateDoc(doc(db, 'reminders', reminderId), {
      status,
      completedAt: status === 'done' ? serverTimestamp() : null,
    })
  } catch (error) {
    console.error('[FIRESTORE] Update reminder error:', error)
    throw error
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(userId: string): Promise<{
  sent: number
  accepted: number
  conversionRate: number
  recentQuotes: Quote[]
}> {
  try {
    const quotes = await getQuotes(userId)
    
    const sent = quotes.filter((q) => q.status === 'sent' || q.status === 'viewed' || q.status === 'reminded').length
    const accepted = quotes.filter((q) => q.status === 'accepted').length
    const conversionRate = sent > 0 ? (accepted / sent) * 100 : 0
    
    const recentQuotes = quotes
      .sort((a, b) => {
        const aDate = a.createdAt instanceof Date 
          ? a.createdAt 
          : (a.createdAt as Timestamp).toDate()
        const bDate = b.createdAt instanceof Date 
          ? b.createdAt 
          : (b.createdAt as Timestamp).toDate()
        return bDate.getTime() - aDate.getTime()
      })
      .slice(0, 5)
    
    return {
      sent,
      accepted,
      conversionRate,
      recentQuotes,
    }
  } catch (error) {
    console.error('[FIRESTORE] Get dashboard stats error:', error)
    throw error
  }
}

