'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', JSON.stringify(result.admin));
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.log(error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-accent to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Administration
          </h1>
          <p className="text-secondary text-sm">
            JBF Sport - Panel d&apos;administration
          </p>
        </div>

        {/* Formulaire */}
        <div className="card">
                    {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <div className="flex gap-3 items-center">
                <Mail className="text-card-accent flex-shrink-0" size={20} />
                <input
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide'
                    }
                  })}
                  type="email"
                  id="email"
                  className="form-input flex-1"
                  placeholder="admin@jbfsport.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <div className="flex gap-3 items-center">
                <Lock className="text-card-accent flex-shrink-0" size={20} />
                <div className="relative flex-1">
                  <input
                    {...register('password', { required: 'Le mot de passe est requis' })}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input w-full pr-12"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-card-secondary hover:text-card-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-product"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-card-secondary hover:text-card-primary text-sm transition-colors"
            >
              ← Retour au site
            </Link>
          </div>
        </div>

        {/* Info développement */}
        <div className="mt-6 text-center">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
            <p className="text-accent text-xs">
              💡 admin@jbfsport.com / mdp123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 