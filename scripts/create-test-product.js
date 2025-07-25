const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestProduct() {
  try {
    console.log('🔧 Création d\'un produit de test...');

    // Récupérer une catégorie (Football par exemple)
    const footballCategory = await prisma.category.findFirst({
      where: { slug: 'football' }
    });

    if (!footballCategory) {
      console.log('❌ Aucune catégorie trouvée. Créez d\'abord les catégories avec npm run create-categories');
      return;
    }

    // Vérifier si le produit test existe déjà
    const existingProduct = await prisma.product.findUnique({
      where: { slug: 'ballon-football-professionnel' }
    });

    if (existingProduct) {
      console.log('⚠️  Produit de test existe déjà, ignoré.');
      return;
    }

    // Créer le produit de test
    const testProduct = await prisma.product.create({
      data: {
        name: 'Ballon de Football Professionnel',
        description: 'Ballon de football officiel de qualité professionnelle, parfait pour les matchs et l\'entraînement.',
        content: `Ce ballon de football professionnel est conçu pour répondre aux exigences les plus strictes du sport.

Caractéristiques :
• Taille officielle 5
• Cuir synthétique haute qualité
• Vessie en latex pour une meilleure rétention d'air
• Coutures renforcées pour une durabilité maximale
• Approuvé FIFA Quality Pro

Idéal pour :
- Matchs officiels
- Entraînements intensifs
- Clubs professionnels
- Écoles de football

Ce ballon offre un toucher exceptionnel et une trajectoire parfaite, garantissant des performances optimales sur le terrain.`,
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        slug: 'ballon-football-professionnel',
        categoryId: footballCategory.id,
        isActive: true,
        isPromo: true
      },
      include: {
        category: true
      }
    });

    console.log(`✅ Produit de test créé : "${testProduct.name}"`);
    console.log(`   Catégorie : ${testProduct.category?.name}`);
    console.log(`   Prix : ${testProduct.price}€`);
    console.log(`   Slug : ${testProduct.slug}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du produit de test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestProduct(); 