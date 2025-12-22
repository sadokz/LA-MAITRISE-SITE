import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Domains from '@/components/Domains';
import References from '@/components/References';
import Founder from '@/components/Founder';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import { useSectionVisibility } from '@/hooks/useSupabaseData';

const Index = () => {
  const { isAdmin } = useEditMode();
  const { data: visibility, isLoading } = useSectionVisibility();

  // Default all sections to visible if loading or no data
  const isVisible = (section: string) => {
    if (isLoading || !visibility) return true;
    return visibility[section as keyof typeof visibility] ?? true;
  };

  return (
    <main className="min-h-screen">
      {/* Admin Edit Bar - only shown when admin is logged in */}
      <AdminEditBar />
      
      {/* Add padding top when admin bar is visible */}
      <div className={isAdmin ? 'pt-12' : ''}>
        {/* Navigation */}
        <Header />
        
        {/* Hero Section */}
        {isVisible('home') && <Hero />}
        
        {/* About Section */}
        {isVisible('about') && <About />}
        
        {/* Services Section */}
        {isVisible('skills') && <Services />}
        
        {/* Domains Section */}
        {isVisible('domains') && <Domains />}
        
        {/* References Section */}
        {isVisible('projects') && <References />}
        
        {/* Founder Section */}
        {isVisible('founder') && <Founder />}
        
        {/* Contact Section */}
        {isVisible('contact') && <Contact />}
        
        {/* Footer */}
        <Footer />
        
        {/* WhatsApp Button */}
        <WhatsAppButton />
      </div>
    </main>
  );
};

export default Index;
