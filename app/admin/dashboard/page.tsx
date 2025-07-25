'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  BarChart3,
  Tag,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductForm from '../../../components/admin/ProductForm';
import CategoryForm from '../../../components/admin/CategoryForm';

interface Admin {
  id: string;
  username: string;
  name?: string;
  email?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  content?: string;
  price: number;
  imageUrl: string;
  cloudinaryId?: string;
  slug: string;
  categoryId?: string;
  isPromo: boolean;
  isActive: boolean;
  createdAt: string;
}

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'contacts'>('overview');
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_user');

    if (!token || !adminData) {
      router.push('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // Charger les produits
      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      // Charger les catégories
      const categoriesRes = await fetch('/api/categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      // Charger les contacts
      const contactsRes = await fetch('/api/contacts');
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const handleCreateProduct = async (productData: {
    name: string;
    description: string;
    content: string;
    price: number;
    categoryId: string;
    slug: string;
    isPromo: boolean;
    isActive: boolean;
    imageUrl?: string;
    cloudinaryId?: string;
  }) => {
    setProductLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await loadData(); // Recharger les produits
        setShowProductForm(false);
        alert('Produit créé avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du produit');
    } finally {
      setProductLoading(false);
    }
  };

  const handleUpdateProduct = async (productData: {
    name: string;
    description: string;
    content: string;
    price: number;
    categoryId: string;
    slug: string;
    isPromo: boolean;
    isActive: boolean;
    imageUrl?: string;
    cloudinaryId?: string;
  }) => {
    if (!editingProduct) return;
    
    setProductLoading(true);
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await loadData(); // Recharger les produits
        setShowProductForm(false);
        setEditingProduct(null);
        alert('Produit mis à jour avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du produit');
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData(); // Recharger les produits
        alert('Produit supprimé avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const openProductForm = (product?: Product) => {
    setEditingProduct(product || null);
    setShowProductForm(true);
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Fonctions pour les catégories
  const handleCreateCategory = async (categoryData: {
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
  }) => {
    setCategoryLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        await loadData(); // Recharger les catégories
        setShowCategoryForm(false);
        alert('Catégorie créée avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la catégorie');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryData: {
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
  }) => {
    if (!editingCategory) return;
    
    setCategoryLoading(true);
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        await loadData(); // Recharger les catégories
        setShowCategoryForm(false);
        setEditingCategory(null);
        alert('Catégorie mise à jour avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour de la catégorie');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData(); // Recharger les catégories
        alert('Catégorie supprimée avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  const openCategoryForm = (category?: Category) => {
    setEditingCategory(category || null);
    setShowCategoryForm(true);
  };

  const closeCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  // Fonctions pour les contacts
  const handleMarkAsRead = async (contactId: string, read: boolean) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read }),
      });

      if (response.ok) {
        await loadData(); // Recharger les contacts
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du contact');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData(); // Recharger les contacts
        alert('Contact supprimé avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du contact');
    }
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
      <header style={{ 
        background: '#1e293b', 
        borderBottom: '1px solid #475569' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '16px 16px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: '#ffffff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <BarChart3 style={{ color: '#1e293b' }} size={20} />
              </div>
              <div>
                <h1 style={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold', 
                  fontSize: '18px',
                  margin: 0
                }}>
                  JBF Sport Admin
                </h1>
                <p style={{ 
                  color: '#94a3b8', 
                  fontSize: '14px',
                  margin: 0
                }}>Dashboard</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="hidden md:block">
                <p style={{ 
                  color: '#d1d5db', 
                  fontSize: '14px',
                  margin: 0
                }}>
                  Connecté en tant que <span style={{ 
                    color: '#ffffff', 
                    fontWeight: '500' 
                  }}>{admin?.name}</span>
                </p>
              </div>
              <button
                onClick={logout}
                style={{
                  background: '#475569',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#64748b'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#475569'; }}
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col">
        {/* Sidebar mobile - Navigation horizontale */}
        <aside style={{ background: '#1e293b', borderBottom: '1px solid #475569' }} className="md:hidden">
          <nav style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'overview' ? '#3b82f6' : '#475569',
                  color: activeTab === 'overview' ? '#ffffff' : '#d1d5db'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'overview') {
                    e.currentTarget.style.background = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'overview') {
                    e.currentTarget.style.background = '#475569';
                  }
                }}
              >
                <BarChart3 size={16} />
                <span>Vue d&apos;ensemble</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'products' ? '#3b82f6' : '#475569',
                  color: activeTab === 'products' ? '#ffffff' : '#d1d5db'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'products') {
                    e.currentTarget.style.background = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'products') {
                    e.currentTarget.style.background = '#475569';
                  }
                }}
              >
                <Package size={16} />
                <span>Produits</span>
                <span style={{
                  background: '#64748b',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  marginLeft: '4px'
                }}>
                  {products.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'categories' ? '#3b82f6' : '#475569',
                  color: activeTab === 'categories' ? '#ffffff' : '#d1d5db'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'categories') {
                    e.currentTarget.style.background = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'categories') {
                    e.currentTarget.style.background = '#475569';
                  }
                }}
              >
                <Tag size={16} />
                <span>Catégories</span>
                <span style={{
                  background: '#64748b',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  marginLeft: '4px'
                }}>
                  {categories.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'contacts' ? '#3b82f6' : '#475569',
                  color: activeTab === 'contacts' ? '#ffffff' : '#d1d5db'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'contacts') {
                    e.currentTarget.style.background = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'contacts') {
                    e.currentTarget.style.background = '#475569';
                  }
                }}
              >
                <Mail size={16} />
                <span>Demandes</span>
                {contacts.filter(c => !c.read).length > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    marginLeft: '4px'
                  }}>
                    {contacts.filter(c => !c.read).length}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </aside>

        {/* Layout desktop */}
        <div className="hidden md:flex">
          {/* Sidebar desktop */}
          <aside style={{ 
            width: '256px', 
            background: '#1e293b', 
            minHeight: 'calc(100vh - 80px)' 
          }}>
          <nav style={{ padding: '16px' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'overview' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'overview' ? '#ffffff' : '#d1d5db'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'overview') {
                      e.currentTarget.style.background = '#334155';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'overview') {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <BarChart3 size={20} />
                  <span>Vue d&apos;ensemble</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('products')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'products' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'products' ? '#ffffff' : '#d1d5db'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'products') {
                      e.currentTarget.style.background = '#334155';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'products') {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Package size={20} />
                  <span>Produits</span>
                  <span style={{
                    marginLeft: 'auto',
                    background: '#475569',
                    color: '#ffffff',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '12px'
                  }}>
                    {products.length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('categories')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'categories' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'categories' ? '#ffffff' : '#d1d5db'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'categories') {
                      e.currentTarget.style.background = '#334155';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'categories') {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Tag size={20} />
                  <span>Catégories</span>
                  <span style={{
                    marginLeft: 'auto',
                    background: '#475569',
                    color: '#ffffff',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '12px'
                  }}>
                    {categories.length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contacts')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'contacts' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'contacts' ? '#ffffff' : '#d1d5db'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'contacts') {
                      e.currentTarget.style.background = '#334155';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'contacts') {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Mail size={20} />
                  <span>Demandes</span>
                  {contacts.filter(c => !c.read).length > 0 && (
                    <span style={{
                      marginLeft: 'auto',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '12px'
                    }}>
                      {contacts.filter(c => !c.read).length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#374151]">Vue d&apos;ensemble</h2>
                <div className="text-sm text-slate-400">
                  Dernière mise à jour: {new Date().toLocaleDateString()}
                </div>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Package className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#374151]">{products.length}</h3>
                      <p className="text-slate-400">Produits</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <Mail className="text-green-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#374151]">{contacts.length}</h3>
                      <p className="text-slate-400">Demandes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <Mail className="text-red-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#374151]">{categories.length}</h3>
                      <p className="text-slate-400">Catégories</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <Mail className="text-red-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#374151]">{contacts.filter(c => !c.read).length}</h3>
                      <p className="text-slate-400">Non lues</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
                <h3 className="text-xl text-center font-bold text-[#374151] mb-4">Actions rapides</h3>
                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => openProductForm()}
                    className=" text-[#374151] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    style={{
                      background: '#475569',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={18} />
                    Ajouter un produit
                  </button>
                  <button 
                    onClick={() => setActiveTab('contacts')}
                    className=" text-[#374151] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    style={{
                      background: '#475569',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Mail size={18} />
                    Voir les demandes
                  </button>
                  <Link 
                    href="/"
                    className="bg-slate-700 hover:bg-slate-600 text-[#374151] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Eye size={18} />
                    Voir le site
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#374151]">Gestion des produits</h2>
                <button 
                  onClick={() => openProductForm()}
                  className=" text-[#374151] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  style={{
                    background: '#475569',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>

              {products.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                  <Package className="mx-auto text-slate-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-[#374151] mb-2">Aucun produit</h3>
                  <p className="text-slate-400 mb-6">
                    Vous n&apos;avez pas encore ajouté de produits à mettre en avant.
                  </p>
                  <button 
                    onClick={() => openProductForm()}
                    className="bg-blue-600 hover:bg-blue-700 text-[#374151] px-4 py-2 rounded-lg transition-colors"
                  >
                    Ajouter un produit
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '20px',
                  width: '100%'
                }}>
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      style={{
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                        e.currentTarget.style.borderColor = '#64748b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                    >
                      <div style={{ position: 'relative', height: '192px' }}>
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h3 style={{ fontWeight: 'bold', color: '#f8fafc', margin: 0, fontSize: '16px' }}>{product.name}</h3>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: product.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: product.isActive ? '#4ade80' : '#f87171'
                          }}>
                            {product.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p style={{
                          color: '#94a3b8',
                          fontSize: '14px',
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.4'
                        }}>
                          {product.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '18px' }}>{product.price.toFixed(2)} €</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => openProductForm(product)}
                            style={{
                              flex: 1,
                              background: '#475569',
                              color: '#f8fafc',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              fontSize: '14px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#64748b';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#475569';
                            }}
                          >
                            <Edit size={16} />
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', margin: 0 }}>Demandes de contact</h2>
              </div>
              
              {contacts.length === 0 ? (
                <div style={{ 
                  background: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '12px', 
                  padding: '48px', 
                  textAlign: 'center' 
                }}>
                  <Mail style={{ margin: '0 auto 16px', color: '#64748b' }} size={48} />
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Aucune demande</h3>
                  <p style={{ color: '#94a3b8', margin: 0 }}>
                    Vous n&apos;avez pas encore reçu de demandes de contact.
                  </p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
                  gap: '20px',
                  width: '100%'
                }}>
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      style={{
                        background: '#1e293b',
                        border: `2px solid ${!contact.read ? '#3b82f6' : '#475569'}`,
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#64748b';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = !contact.read ? '#3b82f6' : '#475569';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>{contact.name}</h3>
                          {!contact.read && (
                            <span style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#60a5fa',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0' }}>{contact.email}</p>
                        {contact.phone && (
                          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0' }}>{contact.phone}</p>
                        )}
                        <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0' }}>
                          {new Date(contact.createdAt).toLocaleDateString('fr-FR')} à {new Date(contact.createdAt).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{
                          color: '#e2e8f0',
                          background: 'rgba(51, 65, 85, 0.5)',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {contact.message}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button 
                          onClick={() => setSelectedContact(contact)}
                          style={{
                            color: '#60a5fa',
                            background: 'none',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            padding: '4px 0'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#93c5fd'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#60a5fa'; }}
                        >
                          <Eye size={14} />
                          Voir détail
                        </button>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleMarkAsRead(contact.id, !contact.read)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              background: contact.read ? '#475569' : '#3b82f6',
                              color: '#ffffff'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = contact.read ? '#64748b' : '#2563eb';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = contact.read ? '#475569' : '#3b82f6';
                            }}
                          >
                            {contact.read ? 'Non lu' : 'Marquer lu'}
                          </button>
                          <button 
                            onClick={() => handleDeleteContact(contact.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#374151]">Gestion des catégories</h2>
                <button 
                  onClick={() => openCategoryForm()}
                  className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>

              {categories.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                  <Tag className="mx-auto text-slate-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-[#374151] mb-2">Aucune catégorie</h3>
                  <p className="text-slate-400 mb-6">
                    Vous n&apos;avez pas encore créé de catégories pour organiser vos produits.
                  </p>
                  <button 
                    onClick={() => openCategoryForm()}
                    className="text-white px-4 py-2 rounded-lg transition-colors"
                    style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                  >
                    Créer une catégorie
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '20px',
                  width: '100%'
                }}>
                  {categories.map((category) => (
                    <div 
                      key={category.id} 
                      style={{
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        padding: '16px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                        e.currentTarget.style.borderColor = '#64748b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#f8fafc', margin: 0, fontSize: '16px' }}>{category.name}</h3>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: category.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: category.isActive ? '#4ade80' : '#f87171'
                        }}>
                          {category.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      {category.description && (
                        <p style={{
                          color: '#94a3b8',
                          fontSize: '14px',
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.4'
                        }}>
                          {category.description}
                        </p>
                      )}
                      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>Slug: {category.slug}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => openCategoryForm(category)}
                          style={{
                            flex: 1,
                            background: '#475569',
                            color: '#f8fafc',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#64748b';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#475569';
                          }}
                        >
                          <Edit size={16} />
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </main>
        </div>

        {/* Main content mobile */}
        <main className="md:hidden p-4">
          {activeTab === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#374151]">Vue d&apos;ensemble</h2>
                <div className="text-sm text-slate-400">
                  Dernière mise à jour: {new Date().toLocaleDateString()}
                </div>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}>
                      <Package className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#374151]">{products.length}</h3>
                      <p className="text-slate-400">Produits</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}>
                      <Mail className="text-green-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#374151]">{contacts.length}</h3>
                      <p className="text-slate-400">Demandes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}>
                      <Mail className="text-red-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#374151]">{contacts.filter(c => !c.read).length}</h3>
                      <p className="text-slate-400">Non lues</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <h3 className="text-xl font-bold text-[#374151] mb-4">Actions rapides</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors justify-center"
                    style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                  >
                    <Plus size={18} />
                    Ajouter un produit
                  </button>
                  <button 
                    onClick={() => setActiveTab('contacts')}
                    className="text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors justify-center"
                    style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                  >
                    <Mail size={18} />
                    Voir les demandes
                  </button>
                  <Link 
                    href="/"
                    className="text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors justify-center"
                    style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                  >
                    <Eye size={18} />
                    Voir le site
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#374151]">Gestion des produits</h2>
                <button 
                  onClick={() => openProductForm()}
                  className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>

              {products.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                  <Package className="mx-auto text-slate-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-[#374151] mb-2">Aucun produit</h3>
                  <p className="text-slate-400 mb-6">
                    Vous n&apos;avez pas encore ajouté de produits à mettre en avant.
                  </p>
                  <button 
                    onClick={() => openProductForm()}
                    className="text-white px-4 py-2 rounded-lg transition-colors"
                    style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                  >
                    Ajouter un produit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                      <div className="relative h-48">
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-[#374151]">{product.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {product.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[#374151] font-bold">{product.price.toFixed(2)} €</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openProductForm(product)}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-[#374151] px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                          >
                            <Edit size={16} />
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#374151]">Demandes de contact</h2>
              </div>
              
              {contacts.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                  <Mail className="mx-auto text-slate-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-[#374151] mb-2">Aucune demande</h3>
                  <p className="text-slate-400">
                    Vous n&apos;avez pas encore reçu de demandes de contact.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`bg-slate-800 border ${!contact.read ? 'border-blue-500' : 'border-slate-700'} rounded-xl p-5`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-[#374151]">{contact.name}</h3>
                          {!contact.read && (
                            <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-slate-400 text-sm mb-3">{contact.phone}</p>
                        )}
                        <p className="text-[#374151] bg-slate-700/50 p-3 rounded-lg mb-3">{contact.message}</p>
                        <div className="text-slate-400 text-sm mb-3">
                          {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-[#374151] px-3 py-2 rounded-lg text-sm transition-colors">
                            Marquer comme lu
                          </button>
                          <button className="flex-1 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1" style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}>
                            <Mail size={14} />
                            Répondre
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#374151]">Gestion des catégories</h2>
                <button 
                  onClick={() => openCategoryForm()}
                  className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>

              {categories.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                  <Tag className="mx-auto text-slate-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-[#374151] mb-2">Aucune catégorie</h3>
                  <p className="text-slate-400 mb-6">
                    Vous n&apos;avez pas encore créé de catégories pour organiser vos produits.
                  </p>
                  <button 
                    onClick={() => openCategoryForm()}
                    className="text-white px-4 py-2 rounded-lg transition-colors"
                    style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                  >
                    Créer une catégorie
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-[#374151]">{category.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          category.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {category.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <p className="text-slate-500 text-xs mb-4">Slug: {category.slug}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openCategoryForm(category)}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-[#374151] px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit size={16} />
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Formulaire de produit (modal) */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
            <ProductForm
              product={editingProduct || undefined}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={closeProductForm}
              isLoading={productLoading}
            />
          </div>
        </div>
      )}

      {/* Formulaire de catégorie (modal) */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
            <CategoryForm
              category={editingCategory || undefined}
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
              onCancel={closeCategoryForm}
              isLoading={categoryLoading}
            />
          </div>
        </div>
      )}

      {/* Modal de détail du contact */}
      {selectedContact && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 50
        }}>
          <div style={{
            width: '100%',
            maxWidth: '896px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0f172a',
            borderRadius: '12px',
            border: '1px solid #475569',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '24px' 
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  margin: 0
                }}>
                  <Mail size={24} />
                  Détail de la demande
                </h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  style={{
                    color: '#94a3b8',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    padding: '4px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Informations contact */}
                <div style={{
                  background: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#ffffff', 
                    marginBottom: '16px',
                    margin: 0
                  }}>Informations du contact</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: '#94a3b8', 
                        marginBottom: '4px' 
                      }}>Nom</label>
                      <p style={{ color: '#ffffff', fontWeight: '500', margin: 0 }}>{selectedContact.name}</p>
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: '#94a3b8', 
                        marginBottom: '4px' 
                      }}>Email</label>
                      <a 
                        href={`mailto:${selectedContact.email}`} 
                        style={{ 
                          color: '#60a5fa', 
                          textDecoration: 'none',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#93c5fd'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#60a5fa'; }}
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: '#94a3b8', 
                          marginBottom: '4px' 
                        }}>Téléphone</label>
                        <a 
                          href={`tel:${selectedContact.phone}`} 
                          style={{ 
                            color: '#60a5fa', 
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#93c5fd'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#60a5fa'; }}
                        >
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: '#94a3b8', 
                        marginBottom: '4px' 
                      }}>Date de réception</label>
                      <p style={{ color: '#ffffff', margin: 0 }}>
                        {new Date(selectedContact.createdAt).toLocaleDateString('fr-FR')} à {new Date(selectedContact.createdAt).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                  }}>
                    <span style={{ fontSize: '14px', color: '#94a3b8' }}>Statut :</span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: selectedContact.read ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: selectedContact.read ? '#4ade80' : '#60a5fa'
                    }}>
                      {selectedContact.read ? 'Lu' : 'Non lu'}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-4">Message</h3>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: Votre demande sur JBF Sport&body=Bonjour ${selectedContact.name},%0D%0A%0D%0AMerci pour votre message. `}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Mail size={16} />
                      Répondre par email
                    </a>
                    {selectedContact.phone && (
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <span>📞</span>
                        Appeler
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        handleMarkAsRead(selectedContact.id, !selectedContact.read);
                        setSelectedContact({...selectedContact, read: !selectedContact.read});
                      }}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedContact.read 
                          ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {selectedContact.read ? 'Marquer non lu' : 'Marquer comme lu'}
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
                          handleDeleteContact(selectedContact.id);
                          setSelectedContact(null);
                        }
                      }}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 