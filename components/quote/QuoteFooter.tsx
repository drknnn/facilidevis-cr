import React from 'react'
import { cn } from '@/lib/utils'

interface QuoteFooterProps {
  amountTtc: number
  depositRate?: number
}

export default function QuoteFooter({ amountTtc, depositRate = 20 }: QuoteFooterProps) {
  const depositAmount = (amountTtc * depositRate) / 100
  const balanceAmount = amountTtc - depositAmount

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-6">
      <div className="space-y-6">
        {/* Conditions de règlement */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-gray-100 pb-2">
            Conditions de règlement
          </h3>
          <div className="space-y-3 text-base text-gray-700">
            <p className="font-semibold">
              <span className="text-gray-900">Acompte de {depositRate}% à la commande :</span>{' '}
              <span className="font-bold text-primary-500 text-lg">{depositAmount.toFixed(2)} €</span>
            </p>
            <p className="font-semibold">
              <span className="text-gray-900">Solde à la livraison :</span>{' '}
              <span className="font-bold text-primary-500 text-lg">{balanceAmount.toFixed(2)} €</span>
            </p>
            <p className="text-gray-600 italic mt-4 font-medium">
              Paiement comptant dès réception des travaux.
            </p>
          </div>
        </div>

        {/* Mentions légales */}
        <div className="pt-4 border-t-2 border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Merci de nous retourner un exemplaire de ce devis signé avec votre nom et revêtu de la mention{' '}
            <span className="font-bold text-gray-900">« Bon pour accord et commande »</span>.
          </p>
        </div>

        {/* Signature blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-gray-100">
          <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">
              Pour l'entreprise
            </p>
            <div className="h-20 border-b-2 border-dashed border-gray-300"></div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Signature et cachet</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">
              Pour le client
            </p>
            <div className="h-20 border-b-2 border-dashed border-gray-300"></div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Signature</p>
          </div>
        </div>

        {/* Footer légal */}
        <div className="pt-4 border-t-2 border-gray-100">
          <p className="text-xs text-gray-400 text-center font-medium">
            Document généré par FaciliDevis
          </p>
        </div>
      </div>
    </div>
  )
}
