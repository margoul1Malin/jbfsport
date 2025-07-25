import { notFound } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Package, Star, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Product {
  id: string;
  name: string;
  description: string;
  content?: string;
  price: number;
  imageUrl: string;
  slug: string;
  isActive: boolean;
  isPromo: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { 
        slug,
        isActive: true 
      },
      include: {
        category: true
      }
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      content: product.content || undefined,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
      } : undefined,
      createdAt: product.createdAt.toISOString()
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
}

async function getSimilarProducts(categoryId?: string, currentProductId?: string): Promise<Product[]> {
  if (!categoryId) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        id: {
          not: currentProductId
        }
      },
      include: {
        category: true
      },
      take: 3,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products.map(product => ({
      ...product,
      content: product.content || undefined,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
      } : undefined,
      createdAt: product.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits similaires:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.category?.id, product.id);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Breadcrumb */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-secondary hover:text-primary transition-colors">
              Accueil
            </Link>
            <span className="text-secondary">/</span>
            <Link href="/produits" className="text-secondary hover:text-primary transition-colors">
              Produits
            </Link>
            <span className="text-secondary">/</span>
            {product.category && (
              <>
                <span className="text-secondary">{product.category.name}</span>
                <span className="text-secondary">/</span>
              </>
            )}
            <span className="text-primary">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link 
          href="/produits"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Retour aux produits
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image du produit */}
          <div className="space-y-4">
            <div className="relative h-96 lg:h-[500px] bg-slate-800 rounded-xl overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isPromo && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    TOP PRODUIT
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Informations du produit */}
          <div className="space-y-6 mobile-center sm:text-left">
            {/* Catégorie */}
            {product.category && (
              <div>
                <Link 
                  href={`/produits?category=${product.category.id}`}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                >
                  {product.category.name}
                </Link>
              </div>
            )}

            {/* Nom et prix */}
            <div>
              <h1 className="text-3xl font-bold text-primary mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-accent">
                  {product.price.toFixed(2)} €
                </p>
              </div>
            </div>

            {/* Description courte */}
            <div>
              <p className="text-secondary text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="card">
              <h3 className="text-lg font-semibold text-card-primary mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Package className="text-cyan-400" size={20} />
                  <span className="text-card-secondary">Produit de qualité professionnelle</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-green-400" size={20} />
                  <span className="text-card-secondary">Garantie fabricant</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="text-yellow-400" size={20} />
                  <span className="text-card-secondary">Recommandé par les pros</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-purple-400" size={20} />
                  <span className="text-card-secondary">Disponible en magasin</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Link
                href="/contact"
                className="w-full btn-product px-8 py-4"
              >
                <ShoppingCart size={20} />
                Nous contacter pour ce produit
              </Link>
              <p className="text-secondary text-sm text-center">
                Contactez notre équipe pour plus d&apos;informations ou pour passer commande
              </p>
            </div>
          </div>
        </div>

        {/* Contenu détaillé */}
        {product.content && (
          <div className="mt-16">
            <div className="card">
              <h2 className="text-2xl font-bold text-card-primary mb-6">Description détaillée</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-card-secondary leading-relaxed whitespace-pre-line">
                  {product.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-primary">Produits similaires</h2>
              <Link 
                href="/produits"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                Voir tous les produits →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct.id}
                  href={`/produits/${similarProduct.slug}`}
                  className="card-product group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={similarProduct.imageUrl}
                      alt={similarProduct.name}
                      fill
                      className="image-product group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 mobile-center sm:text-left">
                    <h3 className="font-bold text-card-primary mb-2">{similarProduct.name}</h3>
                    <p className="text-card-secondary text-sm mb-3 line-clamp-2">
                      {similarProduct.description}
                    </p>
                    <p className="text-card-accent font-bold">{similarProduct.price.toFixed(2)} €</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 