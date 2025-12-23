import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin,
  Linkedin,
  Facebook,
  Youtube,
  Clock
} from 'lucide-react';
import logoLaMaitrise from '@/assets/logo-lamaitrise.png';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: 'Accueil', path: '/', type: 'link' }, // Changed type to 'link' and added path
    { label: 'Compétences', path: '/competences', type: 'page' },
    { label: 'Domaines', path: '/domaines', type: 'page' },
    { label: 'Références', path: '/realisations', type: 'page' }, // Changed to /realisations page
    { label: 'Contact', id: 'contact', type: 'scroll' }
  ];

  return (
    <footer className="bg-gray-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logoLaMaitrise} 
                alt="LA MAITRISE ENGINEERING Logo" 
                className="w-12 h-12 object-contain"
                loading="lazy"
                width="48"
                height="48"
              />
              <div>
                <h3 className="font-heading font-bold text-xl text-white">
                  LA MAITRISE ENGINEERING
                </h3>
                <p className="text-sm text-gray-light">Bureau d'études techniques</p>
              </div>
            </div>
            
            <p className="text-gray-light mb-6 leading-relaxed">
              Votre partenaire en ingénierie électrique et BIM depuis 1993. 
              Nous accompagnons vos projets de la conception à la réalisation 
              avec expertise et innovation.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+21652949411" className="text-gray-light hover:text-white transition-colors">
                  +216 52 949 411
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:lamaitrise.engineering@gmail.com" className="text-gray-light hover:text-white transition-colors">
                  lamaitrise.engineering@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-light">
                  45 Avenue Habib Bourguiba<br />
                  8000 Nabeul, Tunisie
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">
              Liens rapides
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.type === 'scroll' ? (
                    <button
                      onClick={() => scrollToSection(link.id!)}
                      className="text-gray-light hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.path!}
                      className="text-gray-light hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">
              Horaires d'ouverture
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-gray-light text-sm">
                  <div className="mb-2">
                    <strong className="text-white">Lun - Ven:</strong><br />
                    8h00 - 17h00
                  </div>
                  <div className="mb-2">
                    <strong className="text-white">Samedi:</strong><br />
                    8h00 - 12h00
                  </div>
                  <div>
                    <strong className="text-white">Dimanche:</strong><br />
                    Fermé
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-medium/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-gray-light font-medium">Suivez-nous :</span>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-medium/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors group"
                  aria-label="Suivez LA MAITRISE ENGINEERING sur LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-gray-light group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-medium/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors group"
                  aria-label="Suivez LA MAITRISE ENGINEERING sur Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-light group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-medium/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors group"
                  aria-label="Suivez LA MAITRISE ENGINEERING sur YouTube"
                >
                  <Youtube className="w-5 h-5 text-gray-light group-hover:text-white" />
                </a>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-light text-sm">
                Site web : <span className="text-primary font-medium">www.la-maitrise.tn</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-medium/20 bg-gray-dark/50">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="text-center text-gray-light text-sm">
            <p>
              © 2025 LA MAITRISE ENGINEERING – Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;