'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

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

interface ProductFormData {
  name: string;
  description: string;
  content: string;
  price: number;
  categoryId: string;
  slug: string;
  isPromo: boolean;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface Product {
  id?: string;
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
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData & { imageUrl?: string; cloudinaryId?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      content: product?.content || '',
      price: product?.price || 0,
      categoryId: product?.categoryId || '',
      slug: product?.slug || '',
      isPromo: product?.isPromo || false,
      isActive: product?.isActive !== undefined ? product.isActive : true
    }
  });

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories?isActive=true');
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };

    loadCategories();
  }, []);

  // Générer automatiquement le slug à partir du nom
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Mettre à jour le slug quand le nom change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setValue('slug', slug);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Créer une preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<{ imageUrl: string; cloudinaryId: string } | null> => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const result = await response.json();
      return {
        imageUrl: result.imageUrl,
        cloudinaryId: result.cloudinaryId
      };
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    let imageData = {};

    // Upload de l'image si une nouvelle image est sélectionnée
    if (imageFile) {
      const uploadResult = await uploadImage();
      if (uploadResult) {
        imageData = uploadResult;
      } else {
        return; // Arrêter si l'upload échoue
      }
    } else if (product?.imageUrl) {
      // Garder l'image existante
      imageData = {
        imageUrl: product.imageUrl,
        cloudinaryId: product.cloudinaryId
      };
    }

    onSubmit({ ...data, ...imageData });
  };

  return (
    <div style={{ 
      position: 'relative', 
      padding: '24px', 
      paddingBottom: '112px',
      background: '#0f172a',
      minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px', 
        position: 'sticky', 
        top: 0, 
        background: '#0f172a', 
        paddingTop: '8px', 
        paddingBottom: '16px', 
        zIndex: 10 
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#ffffff',
          margin: 0
        }}>
          {product ? 'Modifier le produit' : 'Nouveau produit'}
        </h2>
        <button
          onClick={onCancel}
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

      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px' 
      }} id="productForm">
        {/* Image */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#ffffff', 
            marginBottom: '8px' 
          }}>
            Image du produit *
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Preview de l'image - version compacte */}
            {imagePreview && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '12px', 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid #22c55e', 
                borderRadius: '8px' 
              }}>
                <div style={{ 
                  position: 'relative', 
                  width: '80px', 
                  height: '80px', 
                  background: '#475569', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  flexShrink: 0 
                }}>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: '#22c55e', 
                    fontWeight: '500',
                    margin: 0,
                    marginBottom: '4px'
                  }}>Image sélectionnée</p>
                  <p style={{ 
                    color: '#94a3b8', 
                    fontSize: '14px',
                    margin: 0
                  }}>L&apos;image sera redimensionnée automatiquement</p>
                </div>
              </div>
            )}

            {/* Zone d'upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${imagePreview ? '#22c55e' : '#64748b'}`,
                background: imagePreview ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!imagePreview) {
                  e.currentTarget.style.borderColor = '#94a3b8';
                }
              }}
              onMouseLeave={(e) => {
                if (!imagePreview) {
                  e.currentTarget.style.borderColor = '#64748b';
                }
              }}
            >
              <ImageIcon 
                style={{ 
                  margin: '0 auto 8px auto', 
                  color: imagePreview ? '#22c55e' : '#94a3b8' 
                }} 
                size={32} 
              />
              <p style={{ 
                color: imagePreview ? '#4ade80' : '#94a3b8', 
                marginBottom: '8px', 
                fontWeight: '500',
                margin: '0 0 8px 0'
              }}>
                {imagePreview ? 'Image sélectionnée - Cliquer pour changer' : 'Sélectionner une image'}
              </p>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '14px',
                margin: 0
              }}>PNG, JPG ou WEBP (max 5MB)</p>
              {imagePreview && (
                <p style={{ 
                  color: '#22c55e', 
                  fontSize: '14px', 
                  marginTop: '8px',
                  margin: '8px 0 0 0'
                }}>✓ Image prête à être enregistrée</p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Nom */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#ffffff', 
            marginBottom: '8px' 
          }}>
            Nom du produit *
          </label>
          <input
            {...register('name', { 
              required: 'Le nom est requis',
              onChange: handleNameChange
            })}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            placeholder="Ex: Ballon de football FIFA"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.name && (
            <p style={{ 
              color: '#f87171', 
              fontSize: '14px', 
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#ffffff', 
            marginBottom: '8px' 
          }}>
            Slug (URL) *
          </label>
          <input
            {...register('slug', { required: 'Le slug est requis' })}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            placeholder="ballon-football-fifa"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.slug && (
            <p style={{ 
              color: '#f87171', 
              fontSize: '14px', 
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>{errors.slug.message}</p>
          )}
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '14px', 
            marginTop: '4px',
            margin: '4px 0 0 0'
          }}>
            (ex: /produits/ballon-football-fifa)
          </p>
        </div>

        {/* Description courte */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#ffffff', 
            marginBottom: '8px' 
          }}>
            Description courte *
          </label>
          <textarea
            {...register('description', { required: 'La description est requise' })}
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              resize: 'none',
              minHeight: '80px'
            }}
            placeholder="Description courte pour les cartes produit"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.description && (
            <p style={{ 
              color: '#f87171', 
              fontSize: '14px', 
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>{errors.description.message}</p>
          )}
        </div>

        {/* Contenu détaillé */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#ffffff', 
            marginBottom: '8px' 
          }}>
            Contenu détaillé
          </label>
          <textarea
            {...register('content')}
            rows={6}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              resize: 'vertical',
              minHeight: '120px'
            }}
            placeholder="Description détaillée pour la page produit"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Prix et catégorie */}
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
              color: '#ffffff', 
              marginBottom: '8px' 
            }}>
              Prix (€) *
            </label>
            <input
              {...register('price', { 
                required: 'Le prix est requis',
                min: { value: 0, message: 'Le prix doit être positif' }
              })}
              type="number"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              placeholder="99.99"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#475569';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.price && (
              <p style={{ 
                color: '#f87171', 
                fontSize: '14px', 
                marginTop: '4px',
                margin: '4px 0 0 0'
              }}>{errors.price.message}</p>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#ffffff', 
              marginBottom: '8px' 
            }}>
              Catégorie
            </label>
            <select
              {...register('categoryId')}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#475569';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="" style={{ background: '#1e293b', color: '#ffffff' }}>Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} style={{ background: '#1e293b', color: '#ffffff' }}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              {...register('isPromo')}
              type="checkbox"
              id="isPromo"
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#3b82f6'
              }}
            />
            <label htmlFor="isPromo" style={{
              color: '#ffffff',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Produit en promotion (affiché sur la page d&apos;accueil)
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              {...register('isActive')}
              type="checkbox"
              id="isActive"
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#3b82f6'
              }}
            />
            <label htmlFor="isActive" style={{
              color: '#ffffff',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Produit actif (visible sur le site)
            </label>
          </div>
        </div>


              </form>
        
        {/* Boutons fixes en dehors du formulaire */}
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: '#0f172a',
          border: '1px solid #475569',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          zIndex: 20
        }}>
          <button
            form="productForm"
            type="submit"
            disabled={isLoading || uploadingImage}
            style={{
              flex: 1,
              background: (isLoading || uploadingImage) ? '#1e40af' : '#3b82f6',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: (isLoading || uploadingImage) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!(isLoading || uploadingImage)) {
                e.currentTarget.style.background = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!(isLoading || uploadingImage)) {
                e.currentTarget.style.background = '#3b82f6';
              }
            }}
          >
            {isLoading || uploadingImage ? (
              <>
                <div style={{
                  animation: 'spin 1s linear infinite',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderBottom: '2px solid #ffffff'
                }}></div>
                {uploadingImage ? 'Upload en cours...' : 'Sauvegarde...'}
              </>
            ) : (
              <>
                <Save size={20} />
                {product ? 'Mettre à jour' : 'Créer le produit'}
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              background: '#475569',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#64748b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#475569'; }}
          >
            <ArrowLeft size={20} />
            Annuler
          </button>
        </div>
      </div>
    );
  } 