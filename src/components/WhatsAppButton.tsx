import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip for first-time visitors
      const hasSeenTooltip = localStorage.getItem('whatsapp-tooltip-seen');
      if (!hasSeenTooltip) {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('whatsapp-tooltip-seen', 'true');
        }, 5000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = "21652949411";
    const message = "Bonjour, je souhaiterais avoir plus d'informations sur vos services d'ingénierie électrique.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const closeTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('whatsapp-tooltip-seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-20 right-0 mb-2 animate-fade-up">
          <div className="relative bg-white rounded-lg shadow-hover p-4 max-w-xs border border-border/50">
            <button
              onClick={closeTooltip}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-dark rounded-full flex items-center justify-center text-white hover:bg-gray-dark/80 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="pr-4">
              <p className="text-sm font-medium text-gray-dark mb-1">
                Besoin d'aide ?
              </p>
              <p className="text-xs text-gray-muted">
                Contactez-nous directement sur WhatsApp pour une réponse rapide !
              </p>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-border/50 transform rotate-45"></div>
          </div>
        </div>
      )}
      
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-hover hover:shadow-[0_20px_50px_-10px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-105 animate-scale-in"
        aria-label="Contacter LA MAITRISE ENGINEERING via WhatsApp"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        
        {/* Hover tooltip */}
        <div className="absolute bottom-full mb-2 right-0 bg-gray-dark text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chattez avec nous
          <div className="absolute top-full right-3 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-dark"></div>
        </div>
      </button>
    </div>
  );
};

export default WhatsAppButton;