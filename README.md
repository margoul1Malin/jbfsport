# 🏆 JBF Sport - Site Vitrine

Site vitrine moderne pour JBF Sport, partenaire officiel de Casal Sport, spécialisé dans l'équipement sportif professionnel.

## ✨ Fonctionnalités

- 🎨 **3 thèmes de couleurs** - Bleu sport, Gris moderne, Noir élégant
- 📱 **Design responsive** et moderne
- 🛡️ **Panel d'administration sécurisé** avec JWT
- 📦 **Gestion des produits promo** avec images
- 📧 **Formulaire de contact** avec validation
- 🌙 **Thème sombre** inspiré de casalsport.com
- ⚡ **Next.js 15** avec Tailwind CSS et TypeScript

## 🚀 Installation

### Prérequis
- Node.js 18+
- MongoDB (local ou cloud)
- npm ou yarn

### 1. Cloner et installer les dépendances

```bash
# Cloner le projet
git clone <url-du-repo>
cd jbfsport

# Installer les dépendances
npm install
```

### 2. Configuration de l'environnement

Créer un fichier `.env` à partir de `env.example` :

```bash
cp env.example .env
```

Modifier les variables dans `.env` :

```env
# Base de données MongoDB
DATABASE_URL="mongodb://localhost:27017/jbfsport"

# JWT Secret (IMPORTANT: Changez cette valeur)
JWT_SECRET="votre-secret-jwt-tres-securise"

# Cloudinary (optionnel - pour la gestion des images)
CLOUDINARY_CLOUD_NAME="votre-cloud-name"
CLOUDINARY_API_KEY="votre-api-key"
CLOUDINARY_API_SECRET="votre-api-secret"
```

### 3. Configuration de la base de données

```bash
# Setup complet (génère la DB, créé l'admin)
npm run setup

# Ou étape par étape :
npm run db:generate  # Génère le client Prisma
npm run db:push      # Synchronise le schéma avec MongoDB
npm run create-admin # Crée l'utilisateur admin
```

### 4. Lancer le projet

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 🔐 Administration

### Accès au panel admin

- URL : `http://localhost:3000/admin/login`
- Email : `admin@jbfsport.com`
- Mot de passe : `Admin123!`

⚠️ **Important** : Changez le mot de passe après la première connexion !

### Fonctionnalités admin

- 📊 **Dashboard** avec statistiques
- 📦 **Gestion des produits promo** (ajout, modification, suppression)
- 📧 **Consultation des demandes de contact**
- 👁️ **Prévisualisation du site**

## 🎨 Thèmes disponibles

Le site propose 3 thèmes de couleurs que vous pouvez tester sur `/themes` :

### 1. Bleu Sport (par défaut)
- Couleur principale : Bleu marine professionnel
- Accent : Cyan moderne
- Style : Sportif et traditionnel

### 2. Gris Moderne
- Couleur principale : Gris charbon
- Accent : Vert émeraude
- Style : Moderne et élégant

### 3. Noir Élégant
- Couleur principale : Noir profond
- Accent : Or/Jaune
- Style : Luxueux et premium

## 📁 Structure du projet

```
jbfsport/
├── app/                    # Pages et routes Next.js
│   ├── admin/             # Panel d'administration
│   ├── api/               # API routes
│   ├── contact/           # Page de contact
│   ├── themes/            # Démo des thèmes
│   └── globals.css        # Styles globaux et thèmes
├── lib/                   # Utilitaires (auth, etc.)
├── prisma/                # Schéma et configuration DB
├── scripts/               # Scripts utilitaires
└── public/                # Assets statiques
```

## 🛠️ Scripts disponibles

```bash
npm run dev          # Lancer en développement
npm run build        # Build de production
npm run start        # Lancer en production
npm run lint         # Vérifier le code
npm run db:push      # Synchroniser la DB
npm run db:generate  # Générer le client Prisma
npm run create-admin # Créer un utilisateur admin
npm run setup        # Installation complète
```

## 📧 Configuration email (optionnel)

Pour recevoir les notifications de contact par email, configurez SMTP dans `.env` :

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"
```

## 🌐 Déploiement

### Vercel (recommandé)

1. Connecter votre repo GitHub à Vercel
2. Ajouter les variables d'environnement
3. Déployer automatiquement

### Autres plateformes

Le projet est compatible avec toutes les plateformes supportant Next.js :
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 🔧 Personnalisation

### Changer les couleurs

Modifier les variables CSS dans `app/globals.css` :

```css
.theme-blue {
  --primary: #votre-couleur;
  --accent: #votre-accent;
  /* ... */
}
```

### Ajouter du contenu

1. **Produits** : Via le panel admin `/admin/dashboard`
2. **Textes** : Modifier directement dans `app/page.tsx`
3. **Images** : Remplacer dans le dossier `public/`

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@jbfsport.com
- 🐛 Issues : [GitHub Issues](lien-vers-issues)

## 🏷️ Version

**v1.0.0** - Site vitrine complet avec administration

---

**JBF Sport** - Votre partenaire pour l'équipement sportif professionnel 🏆
