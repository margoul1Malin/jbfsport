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
          <div 
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {/* Recherche mobile */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                <Search style={{ color: '#6b7280' }} size={18} />
                  Rechercher
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Nom du produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '16px',
                      height: '48px',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Catégories mobile */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#374151',
                    fontSize: '16px',
                    height: '48px',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="" style={{ background: '#ffffff', color: '#374151' }}>Toutes</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} style={{ background: '#ffffff', color: '#374151' }}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {(selectedCategory || searchTerm) && (
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={resetFilters}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1e293b, #334155, #1e293b)',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtres Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div 
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                position: 'sticky',
                top: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              {/* Recherche */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '8px'
                }}> 
                  Rechercher
                </label>
                <div style={{ position: 'relative' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }} size={18} />
                  <input
                    type="text"
                    placeholder="Nom du produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '16px',
                      height: '48px',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Catégories */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Catégories
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#374151',
                    fontSize: '16px',
                    height: '48px',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="" style={{ background: '#ffffff', color: '#374151' }}>Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} style={{ background: '#ffffff', color: '#374151' }}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Réinitialiser */}
              {(selectedCategory || searchTerm) && (
                <button
                  onClick={resetFilters}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1e293b, #334155, #1e293b)',
                    color: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
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
              <div className="bg-white shadow-lg rounded-xl p-6 text-center">
                <ShoppingCart className="mx-auto text-slate-400 mb-4" size={64} />
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-slate-600 mb-6">
                  Essayez de modifier vos critères de recherche ou de navigation.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
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
      <div className="bg-white shadow-lg hover:shadow-xl rounded-xl p-5 transition-all duration-300">
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
                <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                {product.category && (
                  <p className="text-blue-600 text-sm mb-2 font-medium">{product.category.name}</p>
                )}
                <p className="text-slate-600 text-sm line-clamp-2">{product.description}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-bold text-xl text-right">{product.price.toFixed(2)} €</p>
                {product.isPromo && (
                  <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full mt-1 font-bold shadow-lg text-right">
                    TOP PRODUIT
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Link
                href={`/produits/${product.slug}`}
                className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
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
    <div className="bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isPromo && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              TOP PRODUIT
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3">
          {product.category && (
            <p className="text-blue-600 text-sm font-medium">{product.category.name}</p>
          )}
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{product.name}</h3>
        </div>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-slate-900 font-bold text-xl">{product.price.toFixed(2)} €</p>
          <Link
            href={`/produits/${product.slug}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
            style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
          >
            <Eye size={16} />
            Voir
          </Link>
        </div>
      </div>
    </div>
  );
} 