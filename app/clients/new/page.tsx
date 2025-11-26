'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MobileLayout from '@/components/layout/MobileLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { FiPhone, FiMail, FiMapPin, FiUser } from 'react-icons/fi'

export default function NewClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      router.push('/clients')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MobileLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Nouveau client</h1>
          <p className="text-sm text-gray-600">Ajoutez les informations du client</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identité */}
          <Card padding="md">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Identité
            </h2>
            <Input
              type="text"
              label="Nom complet *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Jean Dupont"
              icon={<FiUser size={18} />}
            />
          </Card>

          {/* Contact */}
          <Card padding="md">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Contact
            </h2>
            <div className="space-y-4">
              <Input
                type="tel"
                label="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 12 34 56 78"
                icon={<FiPhone size={18} />}
              />
              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@email.com"
                icon={<FiMail size={18} />}
              />
            </div>
          </Card>

          {/* Adresse */}
          <Card padding="md">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Adresse
            </h2>
            <Textarea
              label="Adresse complète"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Rue de la République, 75001 Paris"
              rows={3}
            />
          </Card>

          {error && (
            <div className="bg-error-50 border-2 border-error-200 text-error-700 px-4 py-3.5 rounded-xl text-sm font-medium animate-scale-in">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              icon={<FiUser size={18} />}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  )
}
