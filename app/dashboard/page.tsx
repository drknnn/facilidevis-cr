'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MobileLayout from '@/components/layout/MobileLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, getStatusLabel } from '@/components/ui/Badge'
import Logo from '@/components/ui/Logo'
import { FileText, CheckCircle2, TrendingUp, Plus, ArrowRight, Send } from 'lucide-react'
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

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    sent: 0,
    accepted: 0,
    conversionRate: 0,
  })
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setStats(data.stats)
      setRecentQuotes(data.recentQuotes || [])
    } catch (error) {
      console.error('Error fetching dashboard:', error)
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

  return (
    <MobileLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header premium */}
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <Link href="/quotes/new">
            <Button
              size="sm"
              icon={<Plus size={18} />}
              className="shadow-premium"
            >
              Nouveau devis
            </Button>
          </Link>
        </div>

        {/* Stats cards premium - 2 colonnes */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stat Envoyés */}
          <Card hover padding="md" className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Envoyés
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-1 leading-none">
                    {stats.sent}
                  </p>
                  <p className="text-xs font-medium text-gray-500">devis</p>
                </div>
                <div className="bg-primary-500 p-3 rounded-xl shadow-premium">
                  <FileText className="text-white" size={20} strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stat Acceptés */}
          <Card hover padding="md" className="bg-gradient-to-br from-success-50 to-white border-success-100">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Acceptés
                  </p>
                  <p className="text-4xl font-bold text-success-600 mb-1 leading-none">
                    {stats.accepted}
                  </p>
                  <p className="text-xs font-medium text-gray-500">devis</p>
                </div>
                <div className="bg-success-500 p-3 rounded-xl shadow-premium">
                  <CheckCircle2 className="text-white" size={20} strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Taux de conversion premium */}
        <Card padding="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 border-0 shadow-premium-lg">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-white/90 mb-1 uppercase tracking-wide">
                  Taux de conversion
                </p>
                <p className="text-xs text-white/70">
                  {stats.sent > 0 ? `${stats.accepted} sur ${stats.sent} devis` : 'Aucun devis envoyé'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-3xl font-bold text-white leading-none">
                    {stats.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="text-white" size={24} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section derniers devis */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Derniers devis</h2>
          {recentQuotes.length > 0 && (
            <Link
              href="/quotes"
              className="text-sm font-semibold text-primary-500 flex items-center gap-1.5 hover:text-primary-600 transition-colors"
            >
              Voir tout
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Liste des devis premium */}
        <div className="space-y-3">
          {recentQuotes.length === 0 ? (
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
            recentQuotes.map((quote, index) => (
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
            ))
          )}
        </div>

        {/* Bouton flottant FAB premium */}
        {recentQuotes.length > 0 && (
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
