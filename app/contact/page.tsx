'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.log(error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-primary">

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header de la page */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Venez nous voir !
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Vous cherchez un équipement sportif ? Une question sur nos produits ? 
              Venez nous rendre visite dans notre magasin en Corse ou contactez-nous.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Informations de contact */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">
                Notre magasin
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Téléphone</h3>
                    <p className="text-secondary">09 69 36 95 95</p>
                    <p className="text-sm text-secondary">Lun-Ven 9h-12h30 / 13h30-17h</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Email</h3>
                    <p className="text-secondary">contact@jbfsport.com</p>
                    <p className="text-sm text-secondary">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Adresse</h3>
                    <p className="text-secondary">Corse</p>
                    <p className="text-sm text-secondary">Magasin physique - Venez nous voir !</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="card">
                <h3 className="text-xl font-bold text-primary mb-4">
                  Nos services
                </h3>
                <ul className="space-y-3 text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    Conseils d&apos;experts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    Test des équipements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    Large choix en magasin
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    Service après-vente
                  </li>
                </ul>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div>
              <div className="card">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} className="text-accent mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      Message envoyé !
                    </h3>
                    <p className="text-secondary mb-6">
                      Merci pour votre message. Notre équipe vous contactera dans les plus brefs délais.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="btn-accent"
                    >
                      Envoyer un nouveau message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-primary mb-6">
                      Laissez-nous un message
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                          Nom complet *
                        </label>
                        <input
                          {...register('name', { required: 'Le nom est requis' })}
                          type="text"
                          id="name"
                          className="w-full px-4 py-3 bg-accent border border-accent rounded-lg text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="Votre nom"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                          Email *
                        </label>
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
                          className="w-full px-4 py-3 bg-accent border border-accent rounded-lg text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="votre@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                          Téléphone (optionnel)
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          id="phone"
                          className="w-full px-4 py-3 bg-accent border border-accent rounded-lg text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="06 12 34 56 78"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                          Message *
                        </label>
                        <textarea
                          {...register('message', { required: 'Le message est requis' })}
                          id="message"
                          rows={6}
                          className="w-full px-4 py-3 bg-accent border border-accent rounded-lg text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                          placeholder="Quel équipement sportif recherchez-vous ? Avez-vous des questions ?"
                        />
                        {errors.message && (
                          <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-accent inline-flex items-center justify-center gap-2 text-white p-4 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                        style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Envoyer le message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 