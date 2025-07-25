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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-black" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
            Administration
          </h1>
          <p className="text-slate-300 text-sm">
            JBF Sport - Panel d&apos;administration
          </p>
        </div>

        {/* Formulaire */}
                  <div style={{backgroundColor: 'white'}} className="rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" style={{color: '#374151'}} className="block text-sm font-medium mb-2">
                Adresse email
              </label>
              <div className="flex gap-2 items-center justify-center w-full">
              <Mail className="text-gray-400 relative w-8 h-8" size={20} />
              <div className="relative w-full">
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
                  style={{
                    backgroundColor: 'white',
                    color: '#333',
                    borderColor: '#d1d5db'
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-500"
                  placeholder="admin@jbfsport.com"
                />
              </div>
              </div>
              {errors.email && (
                <p style={{color: '#dc2626'}} className="text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" style={{color: '#374151'}} className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="flex gap-2 items-center justify-center w-full">
              <Lock className="text-gray-400 relative w-8 h-8" size={20} />
              <div className="relative w-full">
                <input
                  {...register('password', { required: 'Le mot de passe est requis' })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  style={{
                    backgroundColor: 'white',
                    color: '#333',
                    borderColor: '#d1d5db'
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-500"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>
              </div>
              {errors.password && (
                <p style={{color: '#dc2626'}} className="text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white cursor-pointer font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              ← Retour au site
            </Link>
          </div>
        </div>

        {/* Info développement */}
        <div className="mt-6 text-center">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-300 text-xs">
              💡 admin@jbfsport.com / mdp123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 