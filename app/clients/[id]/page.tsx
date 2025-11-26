'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MobileLayout from '@/components/layout/MobileLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FiUser, FiPhone, FiMail, FiMapPin, FiEdit, FiTrash2 } from 'react-icons/fi'

interface Client {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
}

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchClient(params.id as string)
    }
  }, [params.id])

  const fetchClient = async (id: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`)
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setClient(data.client)
    } catch (error) {
      console.error('Error fetching client:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return
    }

    try {
      const res = await fetch(`/api/clients/${params.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/clients')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-400">Chargement...</div>
        </div>
      </MobileLayout>
    )
  }

  if (!client) {
    return (
      <MobileLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Client introuvable</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header avec avatar */}
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold text-2xl">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-1 truncate">
                {client.name}
              </h1>
              <p className="text-sm text-gray-600">Informations du client</p>
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card padding="md">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Contact
          </h2>
          <div className="space-y-3">
            {client.phone ? (
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="bg-primary-50 p-2 rounded-lg">
                  <FiPhone className="text-primary-600" size={18} />
                </div>
                <span className="font-medium text-gray-900">{client.phone}</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiPhone className="text-gray-400" size={18} />
                </div>
                <span className="text-gray-500">Non renseigné</span>
              </div>
            )}
            
            {client.email ? (
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="bg-primary-50 p-2 rounded-lg">
                  <FiMail className="text-primary-600" size={18} />
                </div>
                <span className="font-medium text-gray-900 truncate">{client.email}</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiMail className="text-gray-400" size={18} />
                </div>
                <span className="text-gray-500">Non renseigné</span>
              </div>
            )}
          </div>
        </Card>

        {/* Adresse */}
        {client.address && (
          <Card padding="md">
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Adresse
            </h2>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="bg-primary-50 p-2 rounded-lg flex-shrink-0">
                <FiMapPin className="text-primary-600" size={18} />
              </div>
              <p className="text-gray-900">{client.address}</p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => router.push(`/clients/${client.id}/edit`)}
            icon={<FiEdit size={18} />}
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={handleDelete}
            icon={<FiTrash2 size={18} />}
            className="border-error-300 text-error-600 hover:bg-error-50"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
