import Link from 'next/link';
import { Phone, Mail, MapPin, Star, ArrowRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700" style={{background: 'linear-gradient(to bottom, #0f172a, #000000)'}}>
      <div className="container mx-auto px-4 py-16">
        {/* Logo et description principale */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-75"></div>
              <Image src="/JBFSPORT4.png" alt="JBF Sport" width={60} height={60} className="relative rounded-xl"/>
            </div>
            <h3 className="text-3xl font-bold text-white">
              JBF SPORT
            </h3>
          </div>
          <p className="text-white text-lg max-w-2xl mx-auto leading-relaxed">
            Votre magasin d&apos;équipement sportif en Corse. 
            Plus de 20 ans d&apos;expertise pour équiper tous les sportifs de l&apos;île.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 mobile-center sm:text-left">
            <h4 className="font-bold text-white mb-6 text-lg relative">
              Navigation
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
                <ArrowRight size={14} />
                Accueil
              </Link></li>
              <li><Link href="/produits" className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
                <ArrowRight size={14} />
                Nos Produits
              </Link></li>
              <li><Link href="/contact" className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
                <ArrowRight size={14} />
                Contact
              </Link></li>
            </ul>
          </div>
          <div className="space-y-4 mobile-center sm:text-left">
            <h4 className="font-bold text-white mb-6 text-lg relative">
              Services
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
            </h4>
            <ul className="space-y-3 text-white">
              <li className="flex items-center gap-2">
                <Star size={14} className="text-cyan-400" />
                Conseils personnalisés
              </li>
              <li className="flex items-center gap-2">
                <Star size={14} className="text-cyan-400" />
                Large gamme de produits
              </li>
              <li className="flex items-center gap-2">
                <Star size={14} className="text-cyan-400" />
                Marques reconnues
              </li>
              <li className="flex items-center gap-2">
                <Star size={14} className="text-cyan-400" />
                Service client de proximité
              </li>
            </ul>
          </div>
          <div className="space-y-4 mobile-center sm:text-left">
            <h4 className="font-bold text-white mb-6 text-lg relative">
              Contact
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Phone size={16} className="text-white" />
                </div>
                <span>09 69 36 95 95</span>
              </li>
              <li className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-white" />
                </div>
                <span>contact@jbfsport.com</span>
              </li>
                              <li className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <span>Corse - Magasin physique</span>
                </li>
            </ul>
          </div>
          <div className="space-y-4 mobile-center sm:text-left">
            <h4 className="font-bold text-white mb-6 text-lg relative">
              Partenariat
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
                <h5 className="text-white font-semibold mb-2">Casal Sport</h5>
                <p className="text-white text-sm">Partenaire officiel - Revendeur agréé en Corse</p>
              </div>
              <div className="flex items-center gap-2 text-white">
                <ShoppingCart size={16} className="text-cyan-400" />
                <span className="text-sm">Magasin ouvert du lundi au samedi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation avec dégradé */}
        <div className="h-px bg-gray-600 mb-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 JBF Sport. Tous droits réservés. | 
            <span className="text-cyan-400 ml-1">Partenaire officiel Casal Sport</span>
          </p>
        </div>
      </div>
    </footer>
  );
} 