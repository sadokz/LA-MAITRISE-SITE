import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoLaMaitrise from '@/assets/logo-lamaitrise.png';
import { useSectionVisibility, useCompetences, useDomaines, useRealisations } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  id?: string; // For scrolling to section on homepage
  path?: string; // For navigating to a dedicated page
  items?: { label: string; id?: string; path?: string; category?: string }[]; // Dropdown items, added category
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

  // State for hover-controlled dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // Small delay to allow moving mouse to dropdown content
  };

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
    setOpenDropdown(null); // Close any open dropdown
  };

  const handleMainNavLinkClick = (item: NavItem) => {
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
    setOpenDropdown(null); // Close dropdown on click
  };

  const navItems: NavItem[] = [
    {
      label: 'Accueil',
      id: 'accueil',
      isVisible: isVisible('home'),
      items: [{ label: 'Aller à l\'accueil', id: 'accueil' }]
    },
    {
      label: 'Compétences',
      path: '/competences',
      isVisible: isVisible('skills'),
      items: competencesLoading ? [] : competences.map(c => ({ label: c.title, path: `/competences` }))
    },
    {
      label: 'Domaines d\'intervention',
      path: '/domaines',
      isVisible: isVisible('domains'),
      items: domainesLoading ? [] : domaines.map(d => ({ label: d.title, path: `/domaines` }))
    },
    {
      label: 'Références',
      path: '/realisations',
      isVisible: isVisible('projects'),
      items: [
        { label: 'Tous les projets', path: '/realisations', category: 'all' },
        ...(domainesLoading ? [] : domaines.map(d => ({ label: d.title, path: `/realisations`, category: d.title })))
      ]
    },
    {
      label: 'Le Fondateur',
      id: 'fondateur',
      isVisible: isVisible('founder'),
      items: [{ label: 'Découvrir le fondateur', id: 'fondateur' }]
    },
    {
      label: 'Contact',
      id: 'contact',
      isVisible: isVisible('contact'),
      items: [{ label: 'Nous contacter', id: 'contact' }]
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

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => item.isVisible && (
              <DropdownMenu key={item.label} open={openDropdown === item.label} onOpenChange={(open) => !open && setOpenDropdown(null)}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      `${textColor} transition-colors duration-300 font-medium cursor-pointer flex items-center gap-1`,
                      (location.pathname === item.path || (isHomePage && location.hash === `#${item.id}`)) && 'text-primary'
                    )}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                    // For items with sub-menus, the trigger itself doesn't navigate.
                    // For other items, the main link click is handled by handleMainNavLinkClick.
                    onClick={() => item.items?.length === 0 && handleMainNavLinkClick(item)}
                  >
                    {item.label}
                  </button>
                </DropdownMenuTrigger>
                {item.items && item.items.length > 0 && (
                  <DropdownMenuContent
                    className="w-56 bg-background border border-border shadow-lg z-50"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.items.map((subItem, subIndex) => (
                      <DropdownMenuItem key={subIndex} asChild>
                        <Link 
                          to={subItem.path ? { pathname: subItem.path, state: { category: subItem.category } } : '#'}
                          onClick={() => {
                            setIsMenuOpen(false); // Close mobile menu if open (though this is desktop nav)
                            setOpenDropdown(null); // Close dropdown
                          }}
                          className="w-full text-left"
                        >
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
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
                <React.Fragment key={item.label}>
                  {item.path ? (
                    <Link 
                      to={item.path === '/realisations' ? { pathname: item.path, state: { category: 'all' } } : item.path}
                      onClick={() => {
                        setIsMenuOpen(false); // Close mobile menu
                        setOpenDropdown(null); // Close any open dropdown
                      }}
                      className="block w-full text-left py-2 text-gray-dark hover:text-primary transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button 
                      onClick={() => {
                        scrollToSection(item.id!);
                        setIsMenuOpen(false); // Close mobile menu
                        setOpenDropdown(null); // Close any open dropdown
                      }}
                      className="block w-full text-left py-2 text-gray-dark hover:text-primary transition-colors font-medium"
                    >
                      {item.label}
                    </button>
                  )}
                  {item.items && item.items.length > 0 && (
                    <div className="pl-4 space-y-2 border-l border-gray-light ml-2">
                      {item.items.map((subItem, subIndex) => (
                        <div key={subIndex}>
                          <Link 
                            to={subItem.path ? { pathname: subItem.path, state: { category: subItem.category } } : '#'}
                            onClick={() => {
                              setIsMenuOpen(false); // Close mobile menu
                              setOpenDropdown(null); // Close dropdown
                            }}
                            className="block w-full text-left py-1 text-gray-medium hover:text-primary transition-colors text-sm"
                          >
                            {subItem.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
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