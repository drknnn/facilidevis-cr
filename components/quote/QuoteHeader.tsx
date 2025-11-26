import React from 'react'
import Image from 'next/image'
import { Badge, getStatusLabel } from '@/components/ui/Badge'
import { format, addDays } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import { cn } from '@/lib/utils'

interface QuoteHeaderProps {
  quote: {
    id: string
    title: string
    status: string
    createdAt: Date | string
  }
  user: {
    companyName?: string | null
    email: string
    phone?: string | null
  }
  client: {
    name: string
    address?: string | null
    phone?: string | null
    email?: string | null
  }
}

export default function QuoteHeader({ quote, user, client }: QuoteHeaderProps) {
  const quoteDate = typeof quote.createdAt === 'string' ? new Date(quote.createdAt) : quote.createdAt
  const validUntil = addDays(quoteDate, 30)
  const quoteNumber = quote.id.slice(0, 8).toUpperCase()

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header principal - 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b-2 border-gray-100">
        {/* Colonne 1 : Logo + Entreprise */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {/* Logo FaciliDevis */}
            <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium">
              {/* Placeholder - sera remplacé par l'image réelle */}
              <span className="text-white font-bold text-xl">FD</span>
              {/* TODO: Remplacer par <Image src="/facilidevis-logo.png" width={56} height={56} alt="FaciliDevis" className="object-contain" /> */}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">FaciliDevis</h2>
            </div>
          </div>
          
          {user.companyName && (
            <div>
              <p className="font-bold text-gray-900 text-base">{user.companyName}</p>
            </div>
          )}
          
          <div className="space-y-1.5 text-sm text-gray-600">
            {user.email && (
              <p className="flex items-center gap-2 font-medium">
                <span className="font-semibold text-gray-500">Email:</span>
                <span>{user.email}</span>
              </p>
            )}
            {user.phone && (
              <p className="flex items-center gap-2 font-medium">
                <span className="font-semibold text-gray-500">Tél:</span>
                <span>{user.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Colonne 2 : Client */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">
            Adresse du client
          </h3>
          <div className="space-y-1.5 text-sm text-gray-700">
            <p className="font-bold text-base text-gray-900">{client.name}</p>
            {client.address && (
              <p className="text-gray-600 leading-relaxed">{client.address}</p>
            )}
            {client.phone && (
              <p className="text-gray-600 font-medium">Tél: {client.phone}</p>
            )}
            {client.email && (
              <p className="text-gray-600 font-medium">Email: {client.email}</p>
            )}
          </div>
        </div>

        {/* Colonne 3 : Informations devis */}
        <div className="space-y-3">
          <div className="bg-primary-500 rounded-xl p-5 border-2 border-primary-600 shadow-premium">
            <h3 className="text-xl font-bold text-white mb-4">DEVIS</h3>
            <div className="space-y-2.5 text-sm bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div>
                <span className="font-semibold text-white/90">N° </span>
                <span className="font-bold text-white">{quoteNumber}</span>
              </div>
              <div>
                <span className="font-semibold text-white/90">Date: </span>
                <span className="text-white">{format(quoteDate, 'dd/MM/yyyy', { locale: fr })}</span>
              </div>
              <div>
                <span className="font-semibold text-white/90">Valable jusqu'au: </span>
                <span className="text-white">{format(validUntil, 'dd/MM/yyyy', { locale: fr })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-start">
            <Badge status={quote.status as any} />
          </div>
        </div>
      </div>

      {/* Titre du devis */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">{quote.title}</h1>
      </div>
    </div>
  )
}
