'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ShoppingCart, Eye, Grid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Style global pour l'animation de rotation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
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

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadCategoryData = useCallback(async () => {
    try {
      // Charger la catégorie
      const categoryRes = await fetch(`/api/categories?slug=${params.slug}&isActive=true`);
      if (!categoryRes.ok) {
        setNotFound(true);
        return;
      }
      
      const categoriesData = await categoryRes.json();
      const foundCategory = categoriesData.find((cat: Category) => cat.slug === params.slug);
      
      if (!foundCategory) {
        setNotFound(true);
        return;
      }
      
      setCategory(foundCategory);

      // Charger les produits de la catégorie
      const productsRes = await fetch(`/api/products?category=${foundCategory.id}&isActive=true`);
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          border: '2px solid transparent',
          borderBottom: '2px solid #ffffff'
        }}></div>
      </div>
    );
  }

  if (notFound || !category) {
    router.push('/404');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Breadcrumb */}
      <div style={{ 
        background: '#1e293b', 
        borderBottom: '1px solid #475569' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '16px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px' 
          }}>
            <Link 
              href="/" 
              style={{ 
                color: '#94a3b8', 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
              Accueil
            </Link>
            <span style={{ color: '#64748b' }}>/</span>
            <Link 
              href="/produits" 
              style={{ 
                color: '#94a3b8', 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
              Produits
            </Link>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: '#ffffff' }}>{category.name}</span>
          </div>
        </div>
      </div>

      {/* Header de la catégorie */}
      <div style={{ 
        background: '#1e293b', 
        borderBottom: '1px solid #475569' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '32px 16px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <Link 
              href="/produits"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#94a3b8',
                textDecoration: 'none',
                transition: 'color 0.2s',
                marginBottom: '24px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
              <ArrowLeft size={20} />
              Retour aux produits
            </Link>
            
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              {category.name}
            </h1>
            {category.description && (
              <p style={{ 
                color: '#d1d5db', 
                fontSize: '18px', 
                maxWidth: '512px', 
                margin: '0 auto',
                marginBottom: '16px'
              }}>
                {category.description}
              </p>
            )}
            <p style={{ 
              color: '#94a3b8', 
              marginTop: '16px',
              margin: '16px 0 0 0'
            }}>
              {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 16px' 
      }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '12px',
              padding: '48px',
              maxWidth: '384px',
              margin: '0 auto'
            }}>
              <ShoppingCart 
                style={{ 
                  margin: '0 auto 24px auto', 
                  color: '#94a3b8' 
                }} 
                size={64} 
              />
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#ffffff', 
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                Aucun produit disponible
              </h3>
              <p style={{ 
                color: '#94a3b8', 
                marginBottom: '24px',
                margin: '0 0 24px 0'
              }}>
                Cette catégorie ne contient pas encore de produits.
              </p>
              <Link
                href="/produits"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
              >
                <ArrowLeft size={16} />
                Voir tous les produits
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {products.map((product) => (
              <div 
                key={product.id} 
                style={{
                  background: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.borderColor = '#64748b';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.borderColor = '#475569';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  position: 'relative', 
                  height: '192px', 
                  overflow: 'hidden' 
                }}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {product.isPromo && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px' 
                    }}>
                      <span style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        TOP PRODUIT
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    color: '#ffffff', 
                    fontSize: '18px', 
                    marginBottom: '8px', 
                    lineHeight: '1.3',
                    margin: '0 0 8px 0'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{ 
                    color: '#94a3b8', 
                    fontSize: '14px', 
                    marginBottom: '16px',
                    margin: '0 0 16px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <p style={{ 
                      color: '#ffffff', 
                      fontWeight: 'bold', 
                      fontSize: '20px',
                      margin: 0
                    }}>
                      {product.price.toFixed(2)} €
                    </p>
                    <Link
                      href={`/produits/${product.slug}`}
                      style={{
                        background: '#3b82f6',
                        color: '#ffffff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
                    >
                      <Eye size={16} />
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lien vers toutes les catégories */}
        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '12px',
            padding: '32px'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              Découvrez nos autres catégories
            </h3>
            <p style={{ 
              color: '#94a3b8', 
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              Explorez toute notre gamme d&apos;équipements sportifs
            </p>
            <Link
              href="/produits"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#3b82f6',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
            >
              <Grid size={20} />
              Voir tous les produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 