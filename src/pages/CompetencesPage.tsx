import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts, useCompetences } from '@/hooks/useSupabaseData';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';

// Fallback images for auto mode
const fallbackImages: Record<string, string> = {
  'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'Électricité Générale': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'BIM & Maquettes Numériques': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'Éclairage Public & Urbain': 'https://images.unsplash.com/photo-1545558014_8692077e9b5c?w=600&h=400&fit=crop',
  'HTA/BT & Postes de Transformation': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  'Supervision & Accompagnement Technique': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
  'Audit & Expertise': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
};

const CompetencesPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { competences, loading: competencesLoading } = useCompetences();

  // Get display image for a competence
  const getDisplayImage = (c: typeof competences[0]) => {
    if (c.image_mode === 'upload' && c.image_file) {
      return c.image_file;
    }
    if (c.image_mode === 'url' && c.image_url) {
      return c.image_url;
    }
    // Auto mode: use fallback based on title
    return fallbackImages[c.title] || fallbackImages['default'];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminEditBar />
      <div className={isAdmin ? 'pt-12' : ''}>
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
            <div className="absolute inset-0 bg-[url('/src/assets/hero-engineering.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                <EditableText 
                  textKey="competences.page.title" 
                  defaultValue={getSiteText('competences', 'page', 'title', 'Nos Compétences en ingénierie électrique')} 
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-gray-medium max-w-3xl mx-auto">
                <EditableText 
                  textKey="competences.page.description" 
                  defaultValue={getSiteText('competences', 'page', 'description', 'Découvrez notre expertise technique et nos domaines de spécialisation')} 
                  className="inline" 
                  as="span" 
                  multiline 
                />
              </p>
            </div>
          </section>

          {/* Competences Section */}
          <section className="section-padding bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              {competencesLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : competences.length === 0 ? (
                <div className="text-center py-20 text-gray-medium">
                  <p>Aucune compétence n'est disponible pour le moment.</p>
                  <Button asChild className="mt-8">
                    <Link to="/" className="inline-flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" /> 
                      Retour à l'accueil
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-20">
                  {competences.sort((a, b) => a.position - b.position).map((competence, index) => {
                    const isImageLeft = index % 2 === 0; // Alternate layout
                    const displayImage = getDisplayImage(competence);

                    return (
                      <div 
                        key={competence.id} 
                        className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Image Column */}
                        {displayImage && (
                          <div className={`${isImageLeft ? 'order-1' : 'order-2'} md:order-none`}>
                            <img 
                              src={displayImage} 
                              alt={competence.title} 
                              className="w-full h-72 object-cover rounded-xl shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = fallbackImages['default'];
                                console.warn(`Image non disponible pour "${competence.title}", fallback utilisé.`);
                              }}
                            />
                          </div>
                        )}

                        {/* Text Content Column */}
                        <div className={`${isImageLeft ? 'order-2' : 'order-1'} md:order-none space-y-4`}>
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl text-primary flex-shrink-0"> {/* Changed from text-5xl to text-3xl */}
                              {competence.icon}
                            </div>
                            <h2 className="font-heading font-bold text-3xl text-gray-dark">
                              {competence.title}
                            </h2>
                          </div>
                          <p className="text-gray-medium leading-relaxed">
                            {competence.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default CompetencesPage;