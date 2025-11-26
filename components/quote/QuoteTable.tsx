import React from 'react'
import { cn } from '@/lib/utils'

interface QuoteItem {
  id: string
  label: string
  qty: number
  unitPrice: number
  total: number
}

interface QuoteTableProps {
  items: QuoteItem[]
  description?: string | null
}

export default function QuoteTable({ items, description }: QuoteTableProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Description si présente */}
      {description && (
        <div className="px-6 py-5 border-b-2 border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
            Description du projet
          </h3>
          <p className="text-gray-700 leading-relaxed font-medium">{description}</p>
        </div>
      )}

      {/* Tableau des lignes */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-500 border-b-2 border-primary-600">
              <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Désignation
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                Unité
              </th>
              <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                Prix unit. HT
              </th>
              <th className="px-5 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                Total HT
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={cn(
                  'border-b border-gray-100 transition-colors',
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                  'hover:bg-primary-50/30'
                )}
              >
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                  {item.label}
                </td>
                <td className="px-4 py-4 text-sm text-center font-medium text-gray-600">
                  U
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-700">
                  {item.qty}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-700">
                  {item.unitPrice.toFixed(2)} €
                </td>
                <td className="px-5 py-4 text-sm font-bold text-right text-gray-900">
                  {item.total.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
