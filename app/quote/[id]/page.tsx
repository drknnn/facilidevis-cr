'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

interface QuoteItem {
  id: string
  label: string
  qty: number
  unitPrice: number
  total: number
}

interface Quote {
  id: string
  title: string
  description: string | null
  amountHt: number
  amountTtc: number
  status: string
  createdAt: string
  client: {
    name: string
  }
  items: QuoteItem[]
}

export default function PublicQuotePage() {
  const params = useParams()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchQuote(params.id as string)
      // Track view
      fetch(`/api/quotes/${params.id}/view`, { method: 'GET' })
    }
  }, [params.id])

  const fetchQuote = async (id: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`)
      if (!res.ok) {
        throw new Error('Quote not found')
      }
      const data = await res.json()
      setQuote(data.quote)
    } catch (error) {
      console.error('Error fetching quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!quote) return
    setAccepting(true)

    try {
      const res = await fetch(`/api/quotes/${quote.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (res.ok) {
        const data = await res.json()
        setQuote(data.quote)
        alert('Devis accepté ! Merci pour votre confiance.')
      }
    } catch (error) {
      console.error('Error accepting quote:', error)
      alert('Erreur lors de l\'acceptation')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="text-text/50">Chargement...</div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="text-center">
          <p className="text-text/50 mb-4">Devis introuvable</p>
        </div>
      </div>
    )
  }

  const tva = quote.amountTtc - quote.amountHt

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">FaciliDevis</h1>
          <h2 className="text-2xl font-bold text-text mb-1">{quote.title}</h2>
          <p className="text-text/70 text-sm">
            {format(new Date(quote.createdAt), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        <Card>
          <h2 className="font-semibold text-text mb-2">Client</h2>
          <p className="text-text">{quote.client.name}</p>
        </Card>

        {quote.description && (
          <Card>
            <h2 className="font-semibold text-text mb-2">Description</h2>
            <p className="text-text">{quote.description}</p>
          </Card>
        )}

        <Card>
          <h2 className="font-semibold text-text mb-3">Détail</h2>
          <div className="space-y-3">
            {quote.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-background-gray last:border-0">
                <div className="flex-1">
                  <p className="text-text">{item.label}</p>
                  <p className="text-sm text-text/70">
                    {item.qty} × {item.unitPrice.toFixed(2)} €
                  </p>
                </div>
                <p className="font-semibold text-text">{item.total.toFixed(2)} €</p>
              </div>
            ))}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-text/70">Total HT</span>
                <span className="text-text">{quote.amountHt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text/70">TVA (20%)</span>
                <span className="text-text">{tva.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-background-gray">
                <span className="text-text">Total TTC</span>
                <span className="text-primary">{quote.amountTtc.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </Card>

        {quote.status !== 'accepted' && (
          <Button
            fullWidth
            size="lg"
            onClick={handleAccept}
            disabled={accepting}
          >
            {accepting ? 'Acceptation...' : 'Accepter ce devis'}
          </Button>
        )}

        {quote.status === 'accepted' && (
          <Card>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-500 text-2xl">✓</span>
              </div>
              <p className="text-text font-semibold">Devis accepté</p>
              <p className="text-text/70 text-sm mt-1">Merci pour votre confiance</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

