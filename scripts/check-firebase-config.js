#!/usr/bin/env node

/**
 * Script de vérification de la configuration Firebase
 * 
 * Usage: node scripts/check-firebase-config.js
 */

const fs = require('fs')
const path = require('path')

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Fichier .env.local introuvable')
    console.log('\n📝 Pour créer le fichier :')
    console.log('   1. Copiez .env.local.example vers .env.local')
    console.log('   2. Remplissez les valeurs Firebase')
    console.log(`\n   cp .env.local.example .env.local`)
    return false
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
      }
    }
  })

  console.log('🔍 Vérification de la configuration Firebase...\n')
  
  let allPresent = true
  const missing = []
  const empty = []

  requiredVars.forEach(varName => {
    if (!envVars[varName]) {
      missing.push(varName)
      allPresent = false
    } else if (envVars[varName].includes('votre-') || envVars[varName].includes('XXXX') || envVars[varName].length < 5) {
      empty.push(varName)
      allPresent = false
    }
  })

  if (missing.length > 0) {
    console.error('❌ Variables manquantes :')
    missing.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.log('')
  }

  if (empty.length > 0) {
    console.warn('⚠️  Variables non configurées (valeurs par défaut détectées) :')
    empty.forEach(varName => {
      console.warn(`   - ${varName}`)
    })
    console.log('')
  }

  if (allPresent) {
    console.log('✅ Toutes les variables Firebase sont configurées !\n')
    console.log('📋 Résumé :')
    requiredVars.forEach(varName => {
      const value = envVars[varName]
      const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value
      console.log(`   ✓ ${varName}: ${displayValue}`)
    })
    console.log('\n🚀 Vous pouvez maintenant lancer : npm run dev')
    return true
  } else {
    console.log('📚 Guide de configuration :')
    console.log('   Voir docs/SETUP_FIREBASE.md pour les instructions détaillées\n')
    console.log('🔗 Liens utiles :')
    console.log('   - Firebase Console: https://console.firebase.google.com')
    console.log('   - Guide complet: docs/SETUP_FIREBASE.md\n')
    return false
  }
}

// Exécuter la vérification
const isValid = checkEnvFile()
process.exit(isValid ? 0 : 1)

