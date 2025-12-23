import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteTexts, useCompetences } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';

const Services = () => {
  const { getSiteText } = useSiteTexts();
  const { competences } = useCompetences();

  return (
    <section id="competences" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-6">
            <EditableText textKey="services.title.part1" defaultValue={getSiteText('services', 'title', 'part1', 'Nos Compétences')} className="inline" as="span" />{' '}
            <EditableText textKey="services.title.part2" defaultValue={getSiteText('services', 'title', 'part2', 'en ingénierie électrique')} className="text-gradient-blue inline" as="span" />
          </h2>
          <EditableText textKey="services.description.main" defaultValue={getSiteText('services', 'description', 'main', "Notre équipe intervient sur toutes les phases d'un projet (APD, DCE, EXE, DOE) avec des solutions techniques et innovantes, adaptées aux besoins de nos clients.")} className="text-lg text-muted-foreground max-w-3xl mx-auto" as="p" multiline />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competences.map((competence) => (
            <Card key={competence.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {competence.icon}
                </div>
                <CardTitle className="text-xl text-gray-dark">
                  {competence.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {competence.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button 
            asChild 
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3"
          >
            <Link to="/competences">
              En Savoir Plus
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;