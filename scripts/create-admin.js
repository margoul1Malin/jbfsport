const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔄 Création de l\'utilisateur admin...');
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: 'admin@jbfsport.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Un utilisateur admin existe déjà avec cet email.');
      
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash('mdp123', 12);
      await prisma.adminUser.update({
        where: { email: 'admin@jbfsport.com' },
        data: { 
          password: hashedPassword,
          name: 'Administrateur'
        }
      });
      
      console.log('✅ Mot de passe admin mis à jour !');
    } else {
      // Créer un nouvel admin
      const hashedPassword = await bcrypt.hash('mdp123', 12);
      
      const admin = await prisma.adminUser.create({
        data: {
          email: 'admin@jbfsport.com',
          password: hashedPassword,
          name: 'Administrateur'
        }
      });

      console.log('✅ Utilisateur admin créé avec succès !');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`👤 Nom: ${admin.name}`);
    }
    
    console.log('\n🔐 Identifiants de connexion:');
    console.log('   Email: admin@jbfsport.com');
    console.log('   Mot de passe: mdp123');
    console.log('\n🌐 Connectez-vous sur: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 