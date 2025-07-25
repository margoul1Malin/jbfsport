'use client';

import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';

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

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      isActive: category?.isActive !== undefined ? category.isActive : true
    }
  });

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

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #475569',
      borderRadius: '12px',
      padding: '24px'
    }}>
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
          margin: 0
        }}>
          {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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

      <form onSubmit={handleSubmit(onSubmit)} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Nom */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            Nom de la catégorie *
          </label>
          <input
            {...register('name', { 
              required: 'Le nom est requis',
              onChange: handleNameChange
            })}
            type="text"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            placeholder="Ex: Football, Basketball..."
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
            type="text"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            placeholder="football, basketball..."
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
            Généré automatiquement à partir du nom
          </p>
        </div>

        {/* Description */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              resize: 'vertical',
              minHeight: '80px'
            }}
            placeholder="Description de la catégorie..."
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

        {/* Options */}
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
            Catégorie active
          </label>
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          paddingTop: '16px',
          borderTop: '1px solid #475569',
          marginTop: '8px'
        }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              flex: 1,
              background: isLoading ? '#1e40af' : '#3b82f6',
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
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#3b82f6';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  animation: 'spin 1s linear infinite',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderBottom: '2px solid #ffffff'
                }}></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} />
                {category ? 'Mettre à jour' : 'Créer la catégorie'}
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
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#64748b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#475569'; }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 