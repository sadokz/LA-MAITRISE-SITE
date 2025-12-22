import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useSiteTexts } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';

const About = () => {
  const { getSiteText } = useSiteTexts();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <EditableText
            textKey="home.about.title"
            defaultValue={getSiteText('home', 'about', 'title', 'À propos de nous')}
            className="text-3xl md:text-4xl font-bold text-primary mb-6"
            as="h2"
          />
          <EditableText
            textKey="home.about.description"
            defaultValue={getSiteText('home', 'about', 'description', "LA MAITRISE ENGINEERING est un bureau d'études techniques spécialisé en électricité et BIM. Depuis plus de 30 ans, nous accompagnons nos clients en Tunisie, en Afrique et à l'international avec une exigence : leur satisfaction.")}
            className="text-lg text-muted-foreground leading-relaxed mb-8"
            as="p"
            multiline
          />
          
          <Button 
            onClick={() => scrollToSection('founder')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3"
          >
            En savoir plus
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default About;