import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Récupérer l'utilisateur de test
  const user = await prisma.user.findUnique({
    where: { email: 'test@facilidevis.fr' },
  })

  if (!user) {
    console.error('❌ Utilisateur de test non trouvé. Exécutez d\'abord create-test-user.ts')
    process.exit(1)
  }

  // Créer un client de test
  const client = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Jean Dupont',
      email: 'drakenlou@gmail.com', // Email pour tester l'envoi
      phone: '06 98 76 54 32',
      address: '123 Rue de la République, 75001 Paris',
    },
  })

  console.log('✅ Client de test créé :', client.name)

  // Créer un devis de test
  const quote = await prisma.quote.create({
    data: {
      userId: user.id,
      clientId: client.id,
      title: 'Rénovation salle de bain',
      description: 'Rénovation complète de la salle de bain avec carrelage et sanitaires',
      amountHt: 5000,
      amountTtc: 6000,
      status: 'draft',
    },
  })

  // Créer des lignes de devis
  await prisma.quoteItem.createMany({
    data: [
      {
        quoteId: quote.id,
        label: 'Carrelage sol et murs',
        qty: 25,
        unitPrice: 45,
        total: 1125,
      },
      {
        quoteId: quote.id,
        label: 'Sanitaires (lavabo, WC, douche)',
        qty: 1,
        unitPrice: 1500,
        total: 1500,
      },
      {
        quoteId: quote.id,
        label: 'Main d\'œuvre',
        qty: 5,
        unitPrice: 475,
        total: 2375,
      },
    ],
  })

  console.log('✅ Devis de test créé :', quote.title)
  console.log('✅ Total TTC :', quote.amountTtc, '€')
  console.log('\n📧 Vous pouvez maintenant tester l\'envoi d\'email !')
  console.log('   URL du devis : http://localhost:3000/quotes/' + quote.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

