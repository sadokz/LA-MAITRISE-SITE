import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoLaMaitrise from '@/assets/logo-lamaitrise.png';
import { useSectionVisibility } from '@/hooks/useSupabaseData';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { data: visibility, isLoading } = useSectionVisibility();

  // Helper to check section visibility
  const isVisible = (section: string) => {
    if (isLoading || !visibility) return true;
    return visibility[section as keyof typeof visibility] ?? true;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      // If not on home page, navigate to home first then scroll
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Dynamic styles based on scroll state
  const headerBg = isScrolled 
    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border/50' 
    : 'bg-black/20 backdrop-blur-sm';
  
  const textColor = isScrolled 
    ? 'text-gray-dark hover:text-orange' 
    : 'text-white hover:text-orange drop-shadow-md';
  
  const logoTextColor = isScrolled ? 'text-gray-dark' : 'text-white drop-shadow-md';
  const logoSubtextColor = isScrolled ? 'text-gray-muted' : 'text-white/80 drop-shadow-md';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src={logoLaMaitrise} 
              alt="LA MAITRISE ENGINEERING Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="hidden sm:block">
              <div className={`font-heading font-bold text-lg ${logoTextColor} transition-colors duration-300`}>
                LA MAITRISE
              </div>
              <p className={`text-xs font-medium ${logoSubtextColor} transition-colors duration-300`}>ENGINEERING</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {isVisible('home') && (
              <button 
                onClick={() => scrollToSection('accueil')}
                className={`${textColor} transition-colors duration-300 font-medium cursor-pointer`}
              >
                Accueil
              </button>
            )}
            {isVisible('skills') && (
              <button 
                onClick={() => scrollToSection('competences')}
                className={`${textColor} transition-colors duration-300 font-medium cursor-pointer`}
              >
                Compétences
              </button>
            )}
            {isVisible('domains') && (
              <button 
                onClick={() => scrollToSection('domaines')}
                className={`${textColor} transition-colors duration-300 font-medium cursor-pointer`}
              >
                Domaines d'intervention
              </button>
            )}
            {isVisible('projects') && (
              <button 
                onClick={() => scrollToSection('references')}
                className={`${textColor} transition-colors duration-300 font-medium cursor-pointer`}
              >
                Références
              </button>
            )}
            {isVisible('founder') && (
              <button 
                onClick={() => scrollToSection('fondateur')}
                className={`${textColor} transition-colors duration-300 font-medium cursor-pointer`}
              >
                Le Fondateur
              </button>
            )}
            {isVisible('contact') && (
              <button 
                onClick={() => scrollToSection('contact')}
                className={`${textColor} transition-colors duration-300 font-medium cursor-pointer`}
              >
                Contact
              </button>
            )}
          </nav>

          {/* CTA Button & Login */}
          <div className="hidden lg:flex items-center space-x-4">
            {isVisible('contact') && (
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-orange text-white hover:bg-orange/90 font-semibold px-6 py-2 rounded-lg shadow-lg"
              >
                Demander un devis
              </Button>
            )}
            <Link to="/login">
              <Button 
                className={`font-semibold rounded-lg border bg-transparent ${
                  isScrolled 
                    ? 'border-orange text-orange hover:bg-orange hover:text-white' 
                    : 'border-white text-white hover:bg-white hover:text-orange'
                } transition-colors duration-300`}
              >
                Connexion
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 ${isScrolled ? 'text-gray-dark' : 'text-white'} hover:text-orange transition-colors`}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-border/50 animate-fade-up shadow-lg">
            <nav className="px-4 py-6 space-y-4">
              {isVisible('home') && (
                <button 
                  onClick={() => scrollToSection('accueil')}
                  className="block w-full text-left py-2 text-gray-dark hover:text-orange transition-colors font-medium cursor-pointer"
                >
                  Accueil
                </button>
              )}
              {isVisible('skills') && (
                <button 
                  onClick={() => scrollToSection('competences')}
                  className="block w-full text-left py-2 text-gray-dark hover:text-orange transition-colors font-medium cursor-pointer"
                >
                  Compétences
                </button>
              )}
              {isVisible('domains') && (
                <button 
                  onClick={() => scrollToSection('domaines')}
                  className="block w-full text-left py-2 text-gray-dark hover:text-orange transition-colors font-medium cursor-pointer"
                >
                  Domaines d'intervention
                </button>
              )}
              {isVisible('projects') && (
                <button 
                  onClick={() => scrollToSection('references')}
                  className="block w-full text-left py-2 text-gray-dark hover:text-orange transition-colors font-medium cursor-pointer"
                >
                  Références
                </button>
              )}
              {isVisible('founder') && (
                <button 
                  onClick={() => scrollToSection('fondateur')}
                  className="block w-full text-left py-2 text-gray-dark hover:text-orange transition-colors font-medium cursor-pointer"
                >
                  Le Fondateur
                </button>
              )}
              {isVisible('contact') && (
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left py-2 text-gray-dark hover:text-orange transition-colors font-medium cursor-pointer"
                >
                  Contact
                </button>
              )}
              {isVisible('contact') && (
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-orange text-white hover:bg-orange/90 mt-4 w-full font-semibold"
                >
                  Demander un devis
                </Button>
              )}
              <Link to="/login" className="block">
                <Button 
                  className="border border-orange text-orange bg-transparent hover:bg-orange hover:text-white rounded-lg mt-2 w-full font-semibold"
                >
                  Connexion
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;