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
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import { useSectionVisibility } from '@/hooks/useSupabaseData';
import Chatbot from '@/components/Chatbot';
import TunisiaMap from '@/components/TunisiaMap';
// import FloatingPointsBackground from '@/components/FloatingPoints'; // Temporarily commented out

interface IndexProps {
  primaryColorHex: string;
}

const Index: React.FC<IndexProps> = ({ primaryColorHex }) => {
  const { isAdmin } = useEditMode();
  const { data: visibility, isLoading } = useSectionVisibility();

  const isVisible = (section: string) => {
    if (isLoading || !visibility) return true;
    return visibility[section as keyof typeof visibility] ?? true;
  };

  return (
    <main className="min-h-screen relative">
      {/* Admin Edit Bar - only shown when admin is logged in */}
      <AdminEditBar />
      
      {/* Add padding top when admin bar is visible */}
      <div className={isAdmin ? 'pt-12' : ''}>
        {/* Navigation */}
        <Header />
        
        {/* Hero Section */}
        {isVisible('home') && <Hero />}
        
        {/* This div will contain all sections *after* the Hero, and the 3D background */}
        <div className="relative z-10 bg-background"> 
          {/* Floating Points Background - positioned absolutely behind other content */}
          {/* It should start from the top of this div (which is right after Hero) and cover its height */}
          {/* {!isAdmin && (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <FloatingPointsBackground primaryColorHex={primaryColorHex} />
            </div>
          )} */}

          {/* All other sections */}
          <div className="relative z-10"> 
            {isVisible('about') && <About />}
            {isVisible('skills') && <Services />}
            {isVisible('domains') && <Domains />}
            {isVisible('projects') && <References />}
            <TunisiaMap />
            {isVisible('founder') && <Founder />}
            {isVisible('contact') && <Contact />}
            <Footer />
          </div>
        </div>
        
        {isVisible('chatbot_visible') && <Chatbot />}
      </div>
    </main>
  );
};

export default Index;