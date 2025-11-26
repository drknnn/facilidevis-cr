'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MobileLayout from '@/components/layout/MobileLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { FiPlus, FiTrash2, FiCheck, FiUser, FiFileText } from 'react-icons/fi'

interface Client {
  id: string
  name: string
}

interface QuoteItem {
  label: string
  qty: number
  unitPrice: number
  total: number
}

// Modèles de désignation rapides
const QUICK_TEMPLATES = [
  'Rénovation complète salle de bain',
  'Peinture murs salon',
  'Intervention dépannage urgente',
  'Carrelage sol et murs',
  'Installation sanitaire',
  'Électricité complète',
  'Plomberie générale',
  'Menuiserie sur mesure',
]

export default function NewQuotePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<QuoteItem[]>([
    { label: '', qty: 1, unitPrice: 0, total: 0 },
  ])
  const [autoReminders, setAutoReminders] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'qty' || field === 'unitPrice') {
      newItems[index].total = newItems[index].qty * newItems[index].unitPrice
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { label: '', qty: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const applyTemplate = (template: string, index: number) => {
    updateItem(index, 'label', template)
  }

  const calculateTotals = () => {
    const amountHt = items.reduce((sum, item) => sum + item.total, 0)
    const amountTtc = amountHt * 1.2 // 20% TVA
    return { amountHt, amountTtc }
  }

  const handleNext = () => {
    if (step === 1 && !selectedClientId) {
      setError('Veuillez sélectionner un client')
      return
    }
    if (step === 2 && (!title || items.some(item => !item.label))) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    setError('')
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const { amountHt, amountTtc } = calculateTotals()

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          title,
          description,
          items: items.filter(item => item.label),
          autoReminders,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      router.push(`/quotes/${data.quote.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const { amountHt, amountTtc } = calculateTotals()

  return (
    <MobileLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Nouveau devis</h1>
          <p className="text-sm text-gray-600">Étape {step} sur 3</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${step >= s 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step > s ? <FiCheck size={18} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`
                    flex-1 h-1.5 mx-2 rounded-full transition-all duration-300
                    ${step > s ? 'bg-primary-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-error-50 border-2 border-error-200 text-error-700 px-4 py-3.5 rounded-xl text-sm font-medium animate-scale-in">
            {error}
          </div>
        )}

        {/* Step 1: Client */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Choisir un client</h2>
            {clients.length === 0 ? (
              <Card padding="lg">
                <div className="text-center py-8">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUser className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-900 font-semibold mb-2">
                    Aucun client disponible
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Créez votre premier client pour commencer
                  </p>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => router.push('/clients/new')}
                    icon={<FiPlus size={18} />}
                  >
                    Créer un client
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {clients.map((client) => (
                  <Card
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    hover
                    padding="md"
                    className={`
                      transition-all duration-200
                      ${selectedClientId === client.id 
                        ? 'border-2 border-primary-600 bg-primary-50' 
                        : 'border-2 border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedClientId === client.id ? 'bg-primary-600' : 'bg-gray-100'
                        }`}>
                          <span className={`font-bold ${
                            selectedClientId === client.id ? 'text-white' : 'text-gray-600'
                          }`}>
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className={`font-semibold ${
                          selectedClientId === client.id ? 'text-primary-900' : 'text-gray-900'
                        }`}>
                          {client.name}
                        </span>
                      </div>
                      {selectedClientId === client.id && (
                        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                          <FiCheck className="text-white" size={14} />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Items */}
        {step === 2 && (
          <div className="space-y-5">
            <Input
              label="Titre du devis *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Rénovation salle de bain"
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du projet..."
              rows={3}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Articles</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addItem}
                  icon={<FiPlus size={16} />}
                >
                  Ajouter
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <Card key={index} padding="md">
                    <div className="space-y-4">
                      <Input
                        label="Description *"
                        value={item.label}
                        onChange={(e) => updateItem(index, 'label', e.target.value)}
                        placeholder="Ex: Carrelage salle de bain"
                        required
                      />
                      
                      {/* Modèles rapides */}
                      {!item.label && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                            Modèles rapides
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {QUICK_TEMPLATES.map((template) => (
                              <button
                                key={template}
                                type="button"
                                onClick={() => applyTemplate(template, index)}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                              >
                                {template}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          type="number"
                          label="Qté"
                          value={item.qty}
                          onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.1"
                        />
                        <Input
                          type="number"
                          label="Prix unit."
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                              Total
                            </label>
                            <div className="px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 font-semibold text-gray-900">
                              {item.total.toFixed(2)} €
                            </div>
                          </div>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-2.5 text-error-600 hover:bg-error-50 rounded-xl transition-colors tap-target"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Recap */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Récapitulatif</h2>

            <Card padding="md">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Informations
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Client</p>
                  <p className="font-semibold text-gray-900">
                    {clients.find(c => c.id === selectedClientId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Titre</p>
                  <p className="font-semibold text-gray-900">{title}</p>
                </div>
                {description && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Description</p>
                    <p className="text-gray-700">{description}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card padding="md">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Détail
              </h3>
              <div className="space-y-3">
                {items.filter(item => item.label).map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1 pr-4">
                      <p className="font-semibold text-gray-900 mb-1">{item.label}</p>
                      <p className="text-sm text-gray-600">
                        {item.qty} × {item.unitPrice.toFixed(2)} €
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">{item.total.toFixed(2)} €</p>
                  </div>
                ))}
                <div className="pt-3 space-y-2 border-t-2 border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total HT</span>
                    <span className="font-semibold text-gray-900">{amountHt.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TVA (20%)</span>
                    <span className="font-semibold text-gray-900">{(amountTtc - amountHt).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900 uppercase tracking-wide">
                      Total TTC
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      {amountTtc.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="md">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={autoReminders}
                  onChange={(e) => setAutoReminders(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                />
                <div className="ml-3 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    Activer les relances automatiques
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Relances automatiques à J+3, J+7 et J+14
                  </p>
                </div>
              </label>
            </Card>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 pt-4 pb-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setStep(step - 1)}
            >
              Précédent
            </Button>
          )}
          {step < 3 ? (
            <Button 
              type="button" 
              fullWidth 
              onClick={handleNext}
              icon={<FiFileText size={18} />}
            >
              Suivant
            </Button>
          ) : (
            <Button
              type="button"
              fullWidth
              onClick={handleSubmit}
              loading={loading}
              icon={<FiCheck size={18} />}
              className="shadow-lg"
            >
              Créer le devis
            </Button>
          )}
        </div>
      </div>
    </MobileLayout>
  )
}
