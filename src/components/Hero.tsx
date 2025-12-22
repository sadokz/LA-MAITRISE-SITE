import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import { useSiteTexts, useHeroSettings } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
import heroImage from '@/assets/hero-engineering.jpg';

const Hero = () => {
  const { getSiteText } = useSiteTexts();
  const { heroSettings } = useHeroSettings();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine media URL based on settings
  const getMediaUrl = () => {
    if (!heroSettings) return null;
    
    if (heroSettings.hero_source_type === 'upload' && heroSettings.hero_media_file) {
      return heroSettings.hero_media_file;
    }
    if (heroSettings.hero_source_type === 'url' && heroSettings.hero_media_url) {
      return heroSettings.hero_media_url;
    }
    return null;
  };

  const mediaUrl = getMediaUrl();
  const isVideo = heroSettings?.hero_media_type === 'video' && mediaUrl;

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
      {/* Background media - pointer-events none to allow clicks through */}
      <div className="absolute inset-0 pointer-events-none">
        {isVideo ? (
          <video 
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={mediaUrl || heroImage} 
            alt="Ingénierie électrique" 
            className="w-full h-full object-cover"
            width="1920"
            height="1080"
          />
        )}
      </div>
      {/* Overlay - pointer-events none */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          <EditableText
            textKey="home.hero.title"
            defaultValue={getSiteText('home', 'hero', 'title', 'Votre partenaire en ingénierie électrique et BIM depuis 1993')}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            as="h1"
          />
          <EditableText
            textKey="home.hero.subtitle"
            defaultValue={getSiteText('home', 'hero', 'subtitle', 'De la conception à la réalisation, nous mettons notre expertise et notre innovation au service de vos projets.')}
            className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto"
            as="p"
            multiline
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-lg"
              onClick={() => scrollToSection('competences')}
            >
              Découvrir nos services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              className="border border-white text-white bg-transparent hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg"
              onClick={() => scrollToSection('contact')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;