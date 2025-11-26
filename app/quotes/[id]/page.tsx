'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MobileLayout from '@/components/layout/MobileLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/ToastProvider'
import QuoteHeader from '@/components/quote/QuoteHeader'
import QuoteTable from '@/components/quote/QuoteTable'
import QuoteTotals from '@/components/quote/QuoteTotals'
import QuoteFooter from '@/components/quote/QuoteFooter'
import { Send, Download, Mail, FileText, Clock, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import { cn } from '@/lib/utils'

interface QuoteItem {
  id: string
  label: string
  qty: number
  unitPrice: number
  total: number
}

interface Reminder {
  id: string
  reminderDate: string
  reminderType: string
  status: string
}

interface Quote {
  id: string
  title: string
  description: string | null
  amountHt: number
  amountTtc: number
  status: string
  pdfUrl: string | null
  sentAt: string | null
  lastSentAt: string | null
  createdAt: string
  client: {
    name: string
    email: string | null
    phone: string | null
    address: string | null
  }
  items: QuoteItem[]
  reminders: Reminder[]
  user: {
    companyName: string | null
    email: string
    phone: string | null
  }
}

export default function QuoteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { showToast } = useToast()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [sendingSMS, setSendingSMS] = useState(false)
  const [emailConfig, setEmailConfig] = useState<{ isConfigured: boolean; method: string } | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchQuote(params.id as string)
      checkEmailConfig()
    }
  }, [params.id])

  const checkEmailConfig = async () => {
    try {
      const res = await fetch('/api/email/config')
      if (res.ok) {
        const data = await res.json()
        setEmailConfig(data)
      }
    } catch (error) {
      console.error('Error checking email config:', error)
    }
  }

  const fetchQuote = async (id: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`)
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setQuote(data.quote)
    } catch (error) {
      console.error('Error fetching quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!quote) return
    setSending(true)

    try {
      const res = await fetch(`/api/quotes/${quote.id}/send`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setQuote(data.quote)
        showToast('Statut du devis mis à jour', 'success')
      } else {
        showToast('Erreur lors de la mise à jour', 'error')
      }
    } catch (error) {
      console.error('Error sending quote:', error)
      showToast('Erreur lors de la mise à jour', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleSendEmail = async () => {
    if (!quote) return
    
    if (!quote.client.email) {
      showToast('Le client n\'a pas d\'adresse email. Veuillez l\'ajouter dans les informations du client.', 'error')
      return
    }

    setSendingEmail(true)

    try {
      const res = await fetch(`/api/quotes/${quote.id}/send-email`, {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        setQuote(data.quote)
        const message = data.simulated
          ? 'Devis marqué comme envoyé (simulation en mode développement)'
          : 'Devis envoyé avec succès par email !'
        showToast(message, 'success')
        fetchQuote(quote.id)
      } else {
        showToast(data.error || 'Erreur lors de l\'envoi de l\'email', 'error')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      showToast('Erreur lors de l\'envoi de l\'email', 'error')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleSendSMS = async () => {
    if (!quote) return
    
    if (!quote.client.phone) {
      showToast('Le client n\'a pas de numéro de téléphone. Veuillez l\'ajouter dans les informations du client.', 'error')
      return
    }

    setSendingSMS(true)

    try {
      const res = await fetch(`/api/quotes/${quote.id}/send-sms`, {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        showToast('Devis envoyé par SMS avec succès !', 'success')
        fetchQuote(quote.id)
      } else {
        showToast(data.error || 'Erreur lors de l\'envoi du SMS', 'error')
      }
    } catch (error) {
      console.error('Error sending SMS:', error)
      showToast('Erreur lors de l\'envoi du SMS', 'error')
    } finally {
      setSendingSMS(false)
    }
  }

  const handleViewPDF = () => {
    if (!quote) return
    window.open(`/api/quotes/${quote.id}/pdf`, '_blank')
  }

  const handleDownloadPDF = () => {
    if (quote?.pdfUrl) {
      const link = document.createElement('a')
      link.href = quote.pdfUrl
      link.download = `devis-${quote.id.slice(0, 8)}.pdf`
      link.click()
    } else {
      handleViewPDF()
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

  if (!quote) {
    return (
      <MobileLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 font-medium">Devis introuvable</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="space-y-6 animate-fade-in pb-24">
        {/* Devis principal - Style premium */}
        <div className="bg-gray-50 -mx-4 px-4 py-6 md:bg-white md:mx-0 md:px-0 md:py-0">
          {/* Header du devis */}
          <QuoteHeader 
            quote={{
              id: quote.id,
              title: quote.title,
              status: quote.status,
              createdAt: quote.createdAt,
            }}
            user={quote.user}
            client={quote.client}
          />

          {/* Tableau des lignes */}
          <div className="mt-6">
            <QuoteTable 
              items={quote.items}
              description={quote.description}
            />
          </div>

          {/* Totaux */}
          <div className="mt-6">
            <QuoteTotals 
              amountHt={quote.amountHt}
              amountTtc={quote.amountTtc}
              tvaRate={20}
            />
          </div>

          {/* Footer avec conditions */}
          <div className="mt-6">
            <QuoteFooter 
              amountTtc={quote.amountTtc}
              depositRate={20}
            />
          </div>
        </div>

        {/* Informations supplémentaires */}
        {quote.lastSentAt && (
          <Card padding="md" className="border-primary-100 bg-primary-50/50">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-500 p-3 rounded-xl shadow-premium">
                    <Mail className="text-white" size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Dernier envoi
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {format(new Date(quote.lastSentAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Relances programmées */}
        {quote.reminders.length > 0 && (
          <Card padding="md">
            <CardContent className="p-0">
              <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-100 pb-2">
                Relances programmées
              </h2>
              <div className="space-y-3">
                {quote.reminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border-2 transition-colors',
                      reminder.status === 'done' 
                        ? 'bg-success-50 border-success-200' 
                        : 'bg-warning-50 border-warning-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {reminder.status === 'done' ? (
                        <CheckCircle2 className="text-success-600" size={20} strokeWidth={2.5} />
                      ) : (
                        <Clock className="text-warning-600" size={20} strokeWidth={2.5} />
                      )}
                      <span className="text-sm font-bold text-gray-900">
                        {format(new Date(reminder.reminderDate), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <Badge 
                      variant={reminder.status === 'done' ? 'accepted' : 'reminded'}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerte mode dev */}
        {emailConfig && !emailConfig.isConfigured && (
          <Card padding="md" className="bg-warning-50 border-2 border-warning-200">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className="bg-warning-500 p-2.5 rounded-xl">
                  <AlertCircle className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-warning-900 mb-1">
                    Mode développement
                  </p>
                  <p className="text-xs text-warning-700 font-medium">
                    L'email n'est pas configuré. L'envoi sera simulé. Configurez RESEND_API_KEY ou SMTP dans .env pour un envoi réel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions premium */}
        <div className="space-y-3 pb-4">
          {/* Bouton principal Email */}
          <Button
            size="lg"
            fullWidth
            onClick={handleSendEmail}
            disabled={sendingEmail || !quote.client.email}
            loading={sendingEmail}
            icon={<Mail size={20} />}
            className="shadow-premium-lg"
          >
            Envoyer par email
          </Button>

          {/* Bouton SMS */}
          {quote.client.phone && (
            <Button
              size="lg"
              variant="outline"
              fullWidth
              onClick={handleSendSMS}
              disabled={sendingSMS}
              loading={sendingSMS}
              icon={<MessageSquare size={20} />}
              className="border-2"
            >
              Envoyer par SMS
            </Button>
          )}

          {/* Actions secondaires */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="default"
              fullWidth
              onClick={handleViewPDF}
              icon={<FileText size={18} />}
            >
              Voir PDF
            </Button>
            <Button
              variant="outline"
              size="default"
              fullWidth
              onClick={handleDownloadPDF}
              icon={<Download size={18} />}
            >
              Télécharger
            </Button>
          </div>

          {/* Marquer comme envoyé */}
          {quote.status === 'draft' && (
            <Button
              variant="secondary"
              fullWidth
              onClick={handleSend}
              disabled={sending}
              loading={sending}
              icon={<Send size={18} />}
            >
              Marquer comme envoyé
            </Button>
          )}
        </div>
      </div>
    </MobileLayout>
  )
}
