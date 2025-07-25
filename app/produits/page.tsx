'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Grid, List, ShoppingCart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  slug: string;
  isActive: boolean;
  isPromo: boolean;
  category?: Category;
}

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  const filterProducts = useCallback(() => {
    let filtered = products;

    // Filtrer par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category?.id === selectedCategory);
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const loadData = async () => {
    try {
      // Charger les produits
      const productsRes = await fetch('/api/products?isActive=true');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      // Charger les catégories
      const categoriesRes = await fetch('/api/categories?isActive=true');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-header mb-4">
              Nos Produits en Magasin
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Découvrez notre gamme complète d&apos;équipements sportifs de qualité professionnelle
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtres mobiles */}
        <div className="lg:hidden mb-6">
                      <div className="card p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recherche mobile */}
                <div>
                  <label className="form-label flex items-center gap-2">
                    <Search className="text-card-accent" size={18} />
                    Rechercher
                  </label>
                  <input
                    type="text"
                    placeholder="Nom du produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Catégories mobile */}
                <div>
                  <label className="form-label">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Toutes</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                          
              {(selectedCategory || searchTerm) && (
                <div className="mt-4">
                  <button
                    onClick={resetFilters}
                    className="btn-product w-full text-sm"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtres Desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="card sticky top-4">
              {/* Recherche */}
              <div className="mb-6">
                <label className="form-label font-bold">
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-card-accent" size={18} />
                  <input
                    type="text"
                    placeholder="Nom du produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>

              {/* Catégories */}
              <div className="mb-6">
                <label className="form-label font-bold">
                  Catégories
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Réinitialiser */}
              {(selectedCategory || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="btn-product w-full"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="flex-1">
            {/* Barre d'actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-header font-medium">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
                {(selectedCategory || searchTerm) && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 hidden sm:inline">•</span>
                    <button
                      onClick={resetFilters}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium bg-blue-500/10 px-3 py-1 rounded-full"
                    >
                      Effacer les filtres
                    </button>
                  </div>
                )}
              </div>

              {/* Mode d'affichage */}
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-black' 
                      : 'text-slate-400 hover:text-black'
                  }`}
                  title="Vue en grille"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-black' 
                      : 'text-slate-400 hover:text-black'
                  }`}
                  title="Vue en liste"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Produits */}
            {filteredProducts.length === 0 ? (
              <div className="card text-center">
                <ShoppingCart className="mx-auto text-slate-400 mb-4" size={64} />
                <h3 className="text-xl font-bold text-card-primary mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-card-secondary mb-6">
                  Essayez de modifier vos critères de recherche ou de navigation.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-product hover:scale-105"
                >
                  Voir tous les produits
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
              <div className="card">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-card-primary text-lg">{product.name}</h3>
                  {product.category && (
                    <p className="text-cyan-400 text-sm mb-2 font-medium">{product.category.name}</p>
                  )}
                  <p className="text-card-secondary text-sm line-clamp-2">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-card-accent font-bold text-xl">{product.price.toFixed(2)} €</p>
                {product.isPromo && (
                  <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full mt-2 font-bold shadow-lg inline-block">
                    TOP PRODUIT
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Link
                href={`/produits/${product.slug}`}
                className="btn-product"
              >
                <Eye size={16} />
                Voir le produit
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-product group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="image-product group-hover:scale-105"
        />
        {product.isPromo && (
          <div className="badge-promo">
            TOP PRODUIT
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3">
          {product.category && (
            <p className="text-cyan-400 text-sm font-medium mb-2">{product.category.name}</p>
          )}
          <h3 className="font-bold text-card-primary text-lg leading-tight">{product.name}</h3>
        </div>
        <p className="text-card-secondary text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-card-accent font-bold text-xl">{product.price.toFixed(2)} €</p>
          <Link
            href={`/produits/${product.slug}`}
            className="btn-product"
          >
            <Eye size={16} />
            Voir
          </Link>
        </div>
      </div>
    </div>
  );
} 