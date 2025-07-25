const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: 'Football',
    slug: 'football',
    description: 'Équipements et accessoires de football'
  },
  {
    name: 'Basketball', 
    slug: 'basketball',
    description: 'Équipements et accessoires de basketball'
  },
  {
    name: 'Tennis',
    slug: 'tennis', 
    description: 'Équipements et accessoires de tennis'
  },
  {
    name: 'Fitness',
    slug: 'fitness',
    description: 'Équipements de fitness et musculation'
  },
  {
    name: 'Running',
    slug: 'running',
    description: 'Équipements de course à pied'
  },
  {
    name: 'Natation',
    slug: 'natation',
    description: 'Équipements de natation et sports aquatiques'
  },
  {
    name: 'Sports de raquette',
    slug: 'sports-raquette',
    description: 'Tennis, badminton, squash, padel'
  },
  {
    name: 'Équipement de protection',
    slug: 'protection',
    description: 'Protections et équipements de sécurité sportive'
  }
];

async function createCategories() {
  try {
    console.log('🔧 Création des catégories par défaut...');

    for (const categoryData of defaultCategories) {
      // Vérifier si la catégorie existe déjà
      const existing = await prisma.category.findFirst({
        where: {
          OR: [
            { name: categoryData.name },
            { slug: categoryData.slug }
          ]
        }
      });

      if (existing) {
        console.log(`⚠️  Catégorie "${categoryData.name}" existe déjà, ignorée.`);
        continue;
      }

      // Créer la catégorie
      await prisma.category.create({
        data: categoryData
      });

      console.log(`✅ Catégorie "${categoryData.name}" créée.`);
    }

    console.log('🎉 Toutes les catégories ont été créées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la création des catégories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories(); 