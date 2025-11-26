'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MobileLayout from '@/components/layout/MobileLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FiPlus, FiUser, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

interface Client {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
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

  return (
    <MobileLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Clients</h1>
            <p className="text-sm text-gray-600">
              {clients.length} {clients.length > 1 ? 'clients' : 'client'}
            </p>
          </div>
          <Link href="/clients/new">
            <Button
              size="sm"
              icon={<FiPlus size={18} />}
              className="shadow-lg"
            >
              Nouveau
            </Button>
          </Link>
        </div>

        {/* Liste des clients */}
        {clients.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-900 font-semibold mb-2">
                Aucun client pour le moment
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Ajoutez votre premier client pour commencer à créer des devis
              </p>
              <Link href="/clients/new">
                <Button fullWidth icon={<FiPlus size={18} />}>
                  Ajouter un client
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {clients.map((client, index) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card 
                  hover 
                  padding="md"
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-2 truncate">
                        {client.name}
                      </h3>
                      <div className="space-y-1.5">
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPhone size={16} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{client.phone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMail size={16} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <FiMapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{client.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bouton flottant */}
        {clients.length > 0 && (
          <Link href="/clients/new">
            <div className="fixed bottom-24 right-4 z-40 md:hidden">
              <button className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 tap-target">
                <FiPlus size={24} />
              </button>
            </div>
          </Link>
        )}
      </div>
    </MobileLayout>
  )
}
