import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('test123', 10)

  const user = await prisma.user.create({
    data: {
      email: 'test@facilidevis.fr',
      password: hashedPassword,
      companyName: 'Test Artisan',
      phone: '06 12 34 56 78',
      role: 'artisan',
    },
  })

  console.log('✅ Utilisateur de test créé :')
  console.log('   Email: test@facilidevis.fr')
  console.log('   Mot de passe: test123')
  console.log('   ID:', user.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

