import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoLaMaitrise from '@/assets/logo-lamaitrise.png';
import { useSectionVisibility, useCompetences, useDomaines, useRealisations } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  id?: string; // For scrolling to section on homepage
  path?: string; // For navigating to a dedicated page
  isVisible: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const { data: visibility, isLoading: visibilityLoading } = useSectionVisibility();
  const { competences, loading: competencesLoading } = useCompetences();
  const { domaines, loading: domainesLoading } = useDomaines();
  const { realisations, loading: realisationsLoading } = useRealisations();

  // Helper to check section visibility
  const isVisible = (section: string) => {
    if (visibilityLoading || !visibility) return true;
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
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          if (sectionId === 'accueil') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        if (sectionId === 'accueil') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const handleNavLinkClick = (item: NavItem) => {
    if (item.path) {
      // For main navigation links, if it's the realisations page, default to 'all' category
      if (item.path === '/realisations') {
        navigate(item.path, { state: { category: 'all' } });
      } else {
        navigate(item.path);
      }
    } else if (item.id) {
      scrollToSection(item.id);
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const navItems: NavItem[] = [
    {
      label: 'Accueil',
      id: 'accueil',
      isVisible: isVisible('home'),
    },
    {
      label: 'Compétences',
      path: '/competences',
      isVisible: isVisible('skills'),
    },
    {
      label: 'Domaines d\'intervention',
      path: '/domaines',
      isVisible: isVisible('domains'),
    },
    {
      label: 'Références',
      path: '/realisations',
      isVisible: isVisible('projects'),
    },
    {
      label: 'Le Fondateur',
      id: 'fondateur',
      isVisible: isVisible('founder'),
    },
    {
      label: 'Contact',
      id: 'contact',
      isVisible: isVisible('contact'),
    },
  ];

  const textColor = isScrolled 
    ? 'text-gray-dark hover:text-primary' 
    : 'text-white hover:text-primary drop-shadow-md';
  
  const logoTextColor = isScrolled ? 'text-gray-dark' : 'text-white drop-shadow-md';
  const logoSubtextColor = isScrolled ? 'text-gray-muted' : 'text-white/80 drop-shadow-md';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border/50' : 'bg-black/20 backdrop-blur-sm'}`}>
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
            {navItems.map((item) => item.isVisible && (
              item.path ? (
                <Link 
                  key={item.label}
                  to={item.path === '/realisations' ? { pathname: item.path, state: { category: 'all' } } : item.path}
                  className={cn(
                    `${textColor} transition-colors duration-300 font-medium cursor-pointer`,
                    (location.pathname === item.path || (isHomePage && location.hash === `#${item.id}`)) && 'text-primary'
                  )}
                  onClick={() => handleNavLinkClick(item)}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleNavLinkClick(item)}
                  className={cn(
                    `${textColor} transition-colors duration-300 font-medium cursor-pointer`,
                    (isHomePage && location.hash === `#${item.id}`) && 'text-primary'
                  )}
                >
                  {item.label}
                </button>
              )
            ))}
          </nav>

          {/* CTA Button & Login */}
          <div className="hidden lg:flex items-center space-x-4">
            {isVisible('contact') && (
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-primary text-white hover:bg-primary/90 font-semibold px-6 py-2 rounded-lg shadow-lg"
              >
                Demander un devis
              </Button>
            )}
            <Link to="/login">
              <Button 
                className={`font-semibold rounded-lg border bg-transparent ${
                  isScrolled 
                    ? 'border-primary text-primary hover:bg-primary hover:text-white' 
                    : 'border-white text-white hover:bg-white hover:text-primary'
                } transition-colors duration-300`}
              >
                Connexion
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 ${isScrolled ? 'text-gray-dark' : 'text-white'} hover:text-primary transition-colors`}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-border/50 animate-fade-up shadow-lg">
            <nav className="px-4 py-6 space-y-4">
              {navItems.map((item) => item.isVisible && (
                item.path ? (
                  <Link 
                    key={item.label}
                    to={item.path === '/realisations' ? { pathname: item.path, state: { category: 'all' } } : item.path}
                    onClick={() => handleNavLinkClick(item)}
                    className="block w-full text-left py-2 text-gray-dark hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button 
                    key={item.label}
                    onClick={() => handleNavLinkClick(item)}
                    className="block w-full text-left py-2 text-gray-dark hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </button>
                )
              ))}
              {isVisible('contact') && (
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-primary text-white hover:bg-primary/90 mt-4 w-full font-semibold"
                >
                  Demander un devis
                </Button>
              )}
              <Link to="/login" className="block">
                <Button 
                  className="border border-primary text-primary bg-transparent hover:bg-primary hover:text-white rounded-lg mt-2 w-full font-semibold"
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