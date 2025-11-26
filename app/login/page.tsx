'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Logo from '@/components/ui/Logo'
import { FiMail, FiLock } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important pour recevoir les cookies
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion')
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background-gray">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo et titre */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenue
          </h1>
          <p className="text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
            icon={<FiMail size={18} />}
          />

          <Input
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Se connecter
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                href="/register" 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
