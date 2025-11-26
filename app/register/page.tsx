'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Logo from '@/components/ui/Logo'
import { FiMail, FiLock, FiPhone, FiBriefcase } from 'react-icons/fi'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          phone: formData.phone,
        }),
        credentials: 'include', // Important pour recevoir les cookies
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      // Le cookie est maintenant défini côté serveur, pas besoin de le faire ici
      // Rediriger vers le dashboard
      router.push('/dashboard')
      router.refresh() // Forcer le rafraîchissement pour mettre à jour l'état d'auth
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background-gray py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo et titre */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Créez votre compte
          </h1>
          <p className="text-gray-600">
            Commencez à créer des devis en quelques minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            label="Nom de l'entreprise *"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            placeholder="Mon Entreprise"
            icon={<FiBriefcase size={18} />}
          />

          <Input
            type="email"
            label="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="votre@email.com"
            icon={<FiMail size={18} />}
          />

          <Input
            type="tel"
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="06 12 34 56 78"
            icon={<FiPhone size={18} />}
          />

          <Input
            type="password"
            label="Mot de passe *"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="••••••••"
            minLength={6}
            icon={<FiLock size={18} />}
            helperText="Minimum 6 caractères"
          />

          <Input
            type="password"
            label="Confirmer le mot de passe *"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            placeholder="••••••••"
            icon={<FiLock size={18} />}
          />

          {error && (
            <div className="bg-error-50 border-2 border-error-200 text-error-700 px-4 py-3.5 rounded-xl text-sm font-medium animate-scale-in">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            loading={loading}
            className="mt-6"
          >
            S'inscrire
          </Button>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
