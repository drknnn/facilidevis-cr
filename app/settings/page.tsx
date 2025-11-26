'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MobileLayout from '@/components/layout/MobileLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FiLogOut, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi'

interface User {
  id: string
  email: string
  companyName: string | null
  phone: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      router.push('/login')
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

  if (!user) {
    return null
  }

  return (
    <MobileLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Paramètres</h1>
          <p className="text-sm text-gray-600">Gérez votre compte</p>
        </div>

        {/* Informations */}
        <Card padding="md">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Informations
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <FiBriefcase className="text-gray-400" size={16} />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Entreprise
                </p>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {user.companyName || 'Non renseigné'}
              </p>
            </div>
            
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-1.5">
                <FiMail className="text-gray-400" size={16} />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </p>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {user.email}
              </p>
            </div>
            
            {user.phone && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiPhone className="text-gray-400" size={16} />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Téléphone
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {user.phone}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Déconnexion */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleLogout}
          icon={<FiLogOut size={18} />}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Déconnexion
        </Button>
      </div>
    </MobileLayout>
  )
}
