'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MobileLayout from '@/components/layout/MobileLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, FileText, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import { cn } from '@/lib/utils'

interface Quote {
  id: string
  title: string
  amountTtc: number
  status: string
  createdAt: string
  client: {
    name: string
  }
}

export default function QuotesPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'accepted'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotes()
  }, [filter])

  const fetchQuotes = async () => {
    try {
      const url = filter === 'all' ? '/api/quotes' : `/api/quotes?status=${filter}`
      const res = await fetch(url)
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setQuotes(data.quotes || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-400 font-medium">Chargement...</div>
        </div>
      </MobileLayout>
    )
  }

  const filters = [
    { key: 'all' as const, label: 'Tous', count: null },
    { key: 'draft' as const, label: 'Brouillons', count: null },
    { key: 'sent' as const, label: 'Envoyés', count: null },
    { key: 'accepted' as const, label: 'Acceptés', count: null },
  ]

  return (
    <MobileLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header premium */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Devis</h1>
            <p className="text-sm font-medium text-gray-600">
              {quotes.length} {quotes.length > 1 ? 'devis' : 'devis'}
            </p>
          </div>
          <Link href="/quotes/new">
            <Button
              size="sm"
              icon={<Plus size={18} />}
              className="shadow-premium"
            >
              Nouveau
            </Button>
          </Link>
        </div>

        {/* Filtres premium - Segmented Control Style */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
          {filters.map((filterItem) => {
            const isActive = filter === filterItem.key
            return (
              <button
                key={filterItem.key}
                onClick={() => setFilter(filterItem.key)}
                className={cn(
                  'px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap',
                  'transition-all duration-200 min-h-[44px]',
                  'border-2',
                  isActive
                    ? 'bg-primary-500 text-white border-primary-500 shadow-premium'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                )}
              >
                {filterItem.label}
              </button>
            )
          })}
        </div>

        {/* Liste des devis premium */}
        {quotes.length === 0 ? (
          <Card padding="lg" className="border-2 border-dashed border-gray-200">
            <CardContent className="p-0">
              <div className="text-center py-12">
                <div className="bg-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={40} strokeWidth={1.5} />
                </div>
                <p className="text-lg font-bold text-gray-900 mb-2">
                  Aucun devis pour le moment
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Créez votre premier devis en quelques clics
                </p>
                <Link href="/quotes/new">
                  <Button size="lg" fullWidth icon={<Plus size={20} />} className="shadow-premium">
                    Créer un devis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote, index) => (
              <Link key={quote.id} href={`/quotes/${quote.id}`}>
                <Card 
                  hover 
                  interactive
                  padding="md"
                  className={cn(
                    'border-gray-200 transition-all duration-200',
                    'animate-slide-up'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-base font-bold text-gray-900 mb-1.5 truncate leading-tight">
                          {quote.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {quote.client.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(quote.createdAt), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <Badge status={quote.status as any} size="sm" />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Total TTC
                      </span>
                      <span className="text-2xl font-bold text-primary-500">
                        {quote.amountTtc.toFixed(2)} €
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bouton flottant FAB premium */}
        {quotes.length > 0 && (
          <Link href="/quotes/new">
            <div className="fixed bottom-28 right-4 z-40 md:hidden">
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-premium-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <Plus size={28} strokeWidth={2.5} />
              </Button>
            </div>
          </Link>
        )}
      </div>
    </MobileLayout>
  )
}
