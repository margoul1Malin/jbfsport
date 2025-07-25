'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, ArrowRight, Phone, Mail, Package, Dumbbell, Zap, Target, Trophy, Compass } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  slug?: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.slice(0, 3)); // Limiter à 3 produits pour la page d'accueil
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Produits par défaut si aucun produit en base
  const defaultProducts = [
    {
      id: '1',
      name: 'Ballons de Football Professionnel',
      description: 'Collection de ballons certifiés FIFA pour entraînement et compétition',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'ballons-football-professionnel',
      isActive: true
    },
    {
      id: '2',
      name: 'Équipement de Musculation',
      description: 'Haltères et équipements de fitness de qualité professionnelle',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'equipement-musculation',
      isActive: true
    },
    {
      id: '3',
      name: 'Matériel de Tennis',
      description: 'Raquettes et accessoires pour tous les niveaux de jeu',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'materiel-tennis',
      isActive: true
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div>

      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
        <div className="container mx-auto px-4 py-20 relative z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-primary mb-6 leading-tight">
                Votre magasin de sport en 
                <span className="block" style={{color: 'var(--accent)'}}>
                  Corse
                </span>
              </h1>
              <p className="text-xl text-secondary mb-8 leading-relaxed">
                Depuis plus de 20 ans, JBF Sport équipe tous les sportifs corses avec du matériel 
                de qualité. Revendeur officiel Casal Sport, nous vous proposons une large gamme 
                d&apos;équipements dans notre magasin.
              </p>
              <div className="flex md:flex-col gap-4">
                <Link href="/produits" className="text-center flex justify-center items-center bg-primary border border-2 border-white shadow-xl rounded-xl px-6 py-3 mt-2">
                  Voir nos produits <ArrowRight size={20} className="ml-2"/>
                </Link>
                <Link href="/contact" className="text-center text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25 mt-3" style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}>
                  <div className="flex items-center justify-center">
                    Nous trouver
                    <ArrowRight size={20} className="ml-2"/>
                  </div>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl p-8">
                <Image 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Équipement sportif JBF Sport" 
                  width={500} 
                  height={400}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produits Phares */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Nos Produits Phares
            </h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Découvrez notre sélection d&apos;équipements sportifs disponibles en magasin, 
              choisis pour leur qualité et adaptés à tous les niveaux.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="text-secondary mt-4">Chargement des produits...</p>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px'}}>
              {displayProducts.map((product) => (
                <div 
                  key={product.id} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{position: 'relative', marginBottom: '24px', overflow: 'hidden'}}>
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      width={400}
                      height={300}
                      style={{width: '100%', height: '256px', objectFit: 'cover', transition: 'transform 0.3s ease'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <div style={{
                      position: 'absolute', 
                      top: '16px', 
                      right: '16px', 
                      background: 'red', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 'bold'
                    }}>
                      Promo
                    </div>
                  </div>
                  <div style={{padding: '16px'}}>
                    {/* Prix en premier */}
                    <div style={{marginBottom: '12px'}}>
                      <span style={{
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: 'var(--accent)',
                        display: 'block'
                      }}>
                        {product.price}€
                      </span>
                    </div>
                    
                    {/* Titre en deuxième */}
                    <h3 style={{
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: 'var(--primary)', 
                      marginBottom: '12px',
                      lineHeight: '1.3'
                    }}>
                      {product.name}
                    </h3>
                    
                    {/* Description en troisième */}
                    <p style={{
                      color: 'var(--secondary)', 
                      marginBottom: '16px', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {product.description}
                    </p>
                    
                    {/* Bouton centré */}
                    <div style={{textAlign: 'center'}}>
                                             <Link
                         href={`/produits/${product.slug || product.id}`}
                        style={{
                          display: 'inline-block',
                          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          border: 'none',
                          cursor: 'pointer'
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
                        En savoir plus
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message si pas de produits */}
          {!loading && products.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-secondary mb-4">
                Aucun produit configuré. Connectez-vous à l&apos;administration pour ajouter des produits.
              </p>
              <Link href="/admin/login" className="btn-accent">
                Accéder à l&apos;administration
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Magasin Physique</h3>
              <p className="text-secondary">
                Venez essayer et tester nos équipements directement dans notre magasin en Corse.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Qualité Garantie</h3>
              <p className="text-secondary">
                Équipements certifiés et garantis. Partenariat avec les meilleures marques.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Conseils d&apos;Experts</h3>
              <p className="text-secondary">
                Notre équipe passionnée vous guide dans le choix de votre équipement sportif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Venez découvrir notre magasin !
          </h2>
          <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
            Rendez-vous dans notre magasin pour découvrir toute notre gamme d&apos;équipements sportifs 
            et bénéficier de nos conseils personnalisés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-white hover:bg-primary/90 px-6 py-3 rounded-xl" style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}>
              Nous trouver
            </Link>
            <Link href="/produits" className="btn-primary bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-accent px-6 py-3 rounded-xl">
              Voir nos produits
            </Link>
          </div>
        </div>
      </section>

            {/* Section Catégories */}
      <CategoriesSection />

      {/* Section SEO - Contenu textuel */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-primary mb-6">
                JBF Sport, votre spécialiste équipement sportif en Corse
              </h2>
              <p className="text-xl text-secondary leading-relaxed">
                Depuis plus de 20 ans, nous équipons les sportifs corses avec du matériel de qualité professionnelle. 
                Découvrez pourquoi nous sommes la référence en équipement sportif sur l&apos;île.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Une expertise reconnue depuis 1995
                </h3>
                <div className="space-y-4 text-secondary leading-relaxed">
                  <p>
                    <strong>JBF Sport</strong> est le leader de l&apos;équipement sportif en Corse. Notre magasin physique 
                    vous accueille avec une équipe passionnée qui saura vous conseiller dans le choix de votre matériel sportif.
                  </p>
                  <p>
                    Que vous soyez un <strong>sportif amateur</strong> ou un <strong>athlète professionnel</strong>, 
                    nous avons l&apos;équipement qu&apos;il vous faut : ballons de football, matériel de musculation, 
                    équipements de tennis, basketball et bien plus encore.
                  </p>
                  <p>
                    Notre partenariat avec <strong>Casal Sport</strong> nous permet de vous proposer des produits 
                    de qualité supérieure à des prix compétitifs, directement dans notre magasin en Corse.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Pourquoi choisir JBF Sport ?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-2">Magasin physique en Corse</h4>
                      <p className="text-secondary text-sm">
                        Venez toucher et tester nos équipements avant achat. Conseil personnalisé garanti.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-2">Qualité professionnelle</h4>
                      <p className="text-secondary text-sm">
                        Équipements certifiés et approuvés, utilisés par les clubs sportifs corses.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-2">Service après-vente</h4>
                      <p className="text-secondary text-sm">
                        Support technique et garantie sur tous nos équipements sportifs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mots-clés SEO intégrés naturellement */}
            <div className="bg-secondary rounded-xl p-8">
              <h3 className="text-2xl font-bold text-primary mb-6 text-center">
                Large gamme d&apos;équipements sportifs
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-bold text-primary mb-3">Sports collectifs</h4>
                  <p className="text-secondary text-sm">
                    Ballons de football, basketball, volleyball. Équipements pour clubs et particuliers.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-3">Fitness & Musculation</h4>
                  <p className="text-secondary text-sm">
                    Haltères, machines de musculation, tapis de sol. Tout pour votre salle de sport.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-3">Sports de raquette</h4>
                  <p className="text-secondary text-sm">
                    Raquettes de tennis, badminton, ping-pong. Cordage et réparation sur place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nouvelle section CTA */}
      <section className="py-20 bg-gradient-to-br from-accent via-accent/90 to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-6">
              Prêt à équiper votre passion sportive ?
            </h2>
            <p className="text-xl text-primary/90 mb-8 leading-relaxed">
              Que vous soyez débutant ou expert, notre équipe vous accompagne dans le choix 
              de l&apos;équipement parfait pour vos activités sportives en Corse.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="flex items-center gap-3 text-primary">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Phone className="text-accent" size={16} />
                </div>
                <span className="font-medium">09 69 36 95 95</span>
              </div>
              <div className="flex items-center gap-3 text-primary">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Mail className="text-accent" size={16} />
                </div>
                <span className="font-medium">contact@jbfsport.com</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn-primary text-white hover:bg-primary/90 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg" 
                style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
              >
                <div className="flex items-center justify-center gap-2">
                  <Phone size={20} />
                  Nous contacter
                </div>
              </Link>
              
              <Link 
                href="/produits" 
                className="btn-primary bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-accent px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Découvrir nos produits
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Composant pour afficher les catégories
function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories?isActive=true');
      if (response.ok) {
        const data = await response.json();
        // Limiter à 5 catégories
        setCategories(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir l'icône appropriée selon le nom de la catégorie
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('football') || name.includes('ballon')) return <Target size={32} />;
    if (name.includes('musculation') || name.includes('fitness') || name.includes('force')) return <Dumbbell size={32} />;
    if (name.includes('tennis') || name.includes('raquette')) return <Zap size={32} />;
    if (name.includes('basketball') || name.includes('basket')) return <Trophy size={32} />;
    if (name.includes('course') || name.includes('running') || name.includes('athlétisme')) return <Zap size={32} />;
    // Icône par défaut
    return <Package size={32} />;
  };

  if (loading) {
    return (
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-secondary mt-4">Chargement des catégories...</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de catégories
  }

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Nous avons toutes sortes de catégories
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Explorez nos différentes catégories d&apos;équipements sportifs pour trouver 
            exactement ce dont vous avez besoin.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Catégories existantes */}
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/produits/categorie/${category.slug}`}
              className="card group cursor-pointer shadow-lg rounded-xl hover:scale-105 transition-all duration-300"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {getCategoryIcon(category.name)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-secondary mb-4 leading-relaxed">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center justify-center text-accent group-hover:text-primary transition-colors">
                  <span className="font-medium">Découvrir</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}

          {/* Carte "Découvrir tous nos produits" */}
          <Link
            href="/produits"
            className="card group cursor-pointer shadow-lg rounded-xl hover:scale-105 transition-all duration-300 border-2 border-dashed border-accent"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Découvrir tous nos produits
              </h3>
              <p className="text-secondary mb-4 leading-relaxed">
                Explorez notre gamme complète d&apos;équipements sportifs et trouvez tout ce dont vous avez besoin.
              </p>
              <div className="flex items-center justify-center text-accent group-hover:text-primary transition-colors">
                <span className="font-medium">Explorer</span>
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
