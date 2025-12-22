import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts } from '@/hooks/useSupabaseData';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';

const CompetencesPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();

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

          {/* Under Construction Section */}
          <section className="py-20 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-dark mb-4">
                <EditableText 
                  textKey="competences.page.under_construction.title" 
                  defaultValue={getSiteText('competences', 'page', 'under_construction.title', 'Page en construction')} 
                  className="inline" 
                  as="span" 
                />
              </h2>
              <p className="text-gray-medium mb-8 max-w-md">
                <EditableText 
                  textKey="competences.page.under_construction.description" 
                  defaultValue={getSiteText('competences', 'page', 'under_construction.description', 'Nous travaillons activement sur cette page pour vous fournir les meilleures informations.')} 
                  className="inline" 
                  as="span" 
                  multiline 
                />
              </p>
              <Button asChild>
                <Link to="/" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> 
                  <EditableText 
                    textKey="competences.page.under_construction.button" 
                    defaultValue={getSiteText('competences', 'page', 'under_construction.button', 'Retour à l\'accueil')} 
                    className="inline" 
                    as="span" 
                  />
                </Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default CompetencesPage;