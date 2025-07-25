"use client"
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50" style={{background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'}}>
      <div className="container mx-auto px-4">

                {/* Main header */}
        <div className="flex justify-between items-center py-5">
          {/* Logo - toujours à gauche */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform h-12">
            <Image src="/JBFSPORTLOGO.png" alt="JBF Sport" width={200} height={200} className="rounded-lg"/>
          </Link>

          {/* Navigation Desktop - au centre */}
          <nav className="hidden md:flex items-center">
            <Link href="/" className="text-white hover:text-cyan-300 transition-all duration-300 relative group font-semibold text-base px-6 py-2 mt-3">
              Accueil  
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/produits" className="text-white hover:text-cyan-300 transition-all duration-300 relative group font-semibold text-base px-6 py-2 mt-3">
              Nos Produits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contact" className="text-white hover:text-cyan-300 transition-all duration-300 relative group font-semibold text-base px-6 py-2 mt-3">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Côté droit */}
          <div className="flex items-center">
            {/* Bouton contact desktop */}
            <Link href="/contact" className="hidden md:block bg-[#F8F9F4] hover:from-cyan-400 hover:to-blue-500 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25 mt-3">
              Nous contacter
            </Link>
            
            {/* Menu Mobile Toggle - à droite */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="md:hidden bg-gray-800 border-t border-gray-700">
              <nav className="flex flex-col space-y-2 py-4">
                <Link 
                  href="/" 
                  className="text-white hover:text-cyan-300 transition-all duration-300 font-semibold text-base px-4 py-3 hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link 
                  href="/produits" 
                  className="text-white hover:text-cyan-300 transition-all duration-300 font-semibold text-base px-4 py-3 hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nos Produits
                </Link>
                <Link 
                  href="/contact" 
                  className="text-white hover:text-cyan-300 transition-all duration-300 font-semibold text-base px-4 py-3 hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
  );
} 