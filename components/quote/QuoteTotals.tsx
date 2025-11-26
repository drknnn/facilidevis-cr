import React from 'react'
import { cn } from '@/lib/utils'

interface QuoteTotalsProps {
  amountHt: number
  amountTtc: number
  tvaRate?: number
}

export default function QuoteTotals({ amountHt, amountTtc, tvaRate = 20 }: QuoteTotalsProps) {
  const tva = amountTtc - amountHt

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-end">
        <div className="w-full md:w-96 bg-gradient-to-br from-gray-50 to-white border-l-4 border-primary-500 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-600 font-semibold">Total HT</span>
              <span className="font-bold text-gray-900 text-lg">{amountHt.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center text-base border-t-2 border-gray-200 pt-4">
              <span className="text-gray-600 font-semibold">TVA {tvaRate}%</span>
              <span className="font-bold text-gray-900 text-lg">{tva.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t-4 border-primary-500 bg-primary-50/50 -mx-6 px-6 py-4 rounded-r-xl">
              <span className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                Total TTC
              </span>
              <span className="text-3xl font-bold text-primary-500">
                {amountTtc.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
