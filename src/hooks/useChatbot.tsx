import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  useSiteTexts,
  useCompetences,
  useDomaines,
  useReferences, // Renamed hook
  useFounder,
  useContactTexts,
} from '@/hooks/useSupabaseData';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotData {
  contact: {
    phones: string[];
    faxes: string[];
    emails: string[];
    address: string;
    hours: string;
  };
  competences: { title: string; description: string; long_description?: string }[];
  domaines: { title: string; description: string; long_description?: string }[];
  references: { title: string; description: string; long_description?: string; category: string }[]; // Renamed key
  founder: { name: string; bio: string; experience: string };
  general: {
    welcome: string;
    fallback: string;
  };
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?", sender: 'bot' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [chatbotData, setChatbotData] = useState<ChatbotData | null>(null);

  // Fetch all necessary data using existing hooks
  const { siteTexts, loading: siteTextsLoading, getSiteText } = useSiteTexts();
  const { competences, loading: competencesLoading } = useCompetences();
  const { domaines, loading: domainesLoading } = useDomaines();
  const { references, loading: referencesLoading } = useReferences(); // Renamed hook
  const { founder, loading: founderLoading } = useFounder();
  const { contactTexts, loading: contactTextsLoading, getContactText } = useContactTexts();

  // Fetch contact coordinates separately as it's not part of useContactTexts
  const { data: contactCoordinates, isLoading: contactCoordinatesLoading } = useQuery({
    queryKey: ['contact_coordinates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_coordinates')
        .select('*')
        .order('type')
        .order('position');
      if (error) throw error;
      return data;
    },
  });

  const allDataLoading =
    siteTextsLoading ||
    competencesLoading ||
    domainesLoading ||
    referencesLoading || // Renamed hook
    founderLoading ||
    contactTextsLoading ||
    contactCoordinatesLoading;

  useEffect(() => {
    if (!allDataLoading) {
      const phones = (contactCoordinates || []).filter(c => c.type === 'phone').map(c => c.value);
      const faxes = (contactCoordinates || []).filter(c => c.type === 'fax').map(c => c.value);
      const emails = (contactCoordinates || []).filter(c => c.type === 'email').map(c => c.value);
      const address = getContactText('address_value', '45 Avenue Habib Bourguiba, 8000 Nabeul, Tunisie');
      const hours = `Lundi - Vendredi: 8h00 - 17h00, Samedi: 8h00 - 12h00, Dimanche: Fermé.`; // Hardcoded as per Contact.tsx

      const consolidatedData: ChatbotData = {
        contact: {
          phones,
          faxes,
          emails,
          address,
          hours,
        },
        competences: competences.map(c => ({
          title: c.title,
          description: c.description,
          long_description: c.long_description,
        })),
        domaines: domaines.map(d => ({
          title: d.title,
          description: d.description,
          long_description: d.long_description,
        })),
        references: references.filter(r => r.is_visible).map(r => ({ // Renamed key and hook
          title: r.title,
          description: r.description,
          long_description: r.long_description,
          category: r.category,
        })),
        founder: {
          name: founder?.name || 'Ahmed Zgolli',
          bio: founder?.bio_html || 'Ahmed Zgolli est le fondateur et ingénieur conseil de LA MAITRISE ENGINEERING.',
          experience: `Ingénieur électricien diplômé depuis ${founder?.since_year || 1988}. Fondateur de LA MAITRISE ENGINEERING en ${founder?.founder_since || 1993}. Plus de ${new Date().getFullYear() - (founder?.since_year || 1988)} ans d'expérience.`,
        },
        general: {
          welcome: getSiteText('chatbot', 'general', 'welcome', "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?"),
          fallback: getSiteText('chatbot', 'general', 'fallback', "Cette information n’est pas disponible sur le site pour le moment."),
        },
      };
      setChatbotData(consolidatedData);
      setIsLoadingData(false);
    }
  }, [
    allDataLoading,
    siteTexts,
    competences,
    domaines,
    references, // Renamed hook
    founder,
    contactTexts,
    contactCoordinates,
    getSiteText,
    getContactText,
  ]);

  const getBotResponse = useCallback(
    (query: string): string => {
      if (!chatbotData) return chatbotData?.general.fallback || "Cette information n’est pas disponible sur le site pour le moment.";

      const lowerQuery = query.toLowerCase();

      // Horaires d'ouverture
      if (lowerQuery.includes('horaires') || lowerQuery.includes('ouverture')) {
        return `Nos horaires d'ouverture sont : ${chatbotData.contact.hours}`;
      }

      // Adresse e-mail
      if (lowerQuery.includes('email') || lowerQuery.includes('e-mail') || lowerQuery.includes('courriel')) {
        if (chatbotData.contact.emails.length > 0) {
          return `Vous pouvez nous contacter par e-mail à : ${chatbotData.contact.emails.join(', ')}.`;
        }
        return "Nous n'avons pas d'adresse e-mail publique disponible sur le site pour le moment.";
      }

      // Numéro de téléphone
      if (lowerQuery.includes('téléphone') || lowerQuery.includes('tel') || lowerQuery.includes('contact')) {
        if (chatbotData.contact.phones.length > 0) {
          return `Vous pouvez nous joindre par téléphone au : ${chatbotData.contact.phones.join(', ')}.`;
        }
        return "Nous n'avons pas de numéro de téléphone public disponible sur le site pour le moment.";
      }

      // Adresse physique
      if (lowerQuery.includes('adresse') || lowerQuery.includes('localisation') || lowerQuery.includes('où êtes-vous')) {
        return `Notre adresse est : ${chatbotData.contact.address}.`;
      }

      // Domaines d'intervention
      if (lowerQuery.includes('domaines') || lowerQuery.includes('secteurs d\'activité') || lowerQuery.includes('secteurs')) {
        if (chatbotData.domaines.length > 0) {
          const domainesList = chatbotData.domaines.map(d => d.title).join(', ');
          return `Nous intervenons dans les domaines suivants : ${domainesList}. Pour plus de détails, visitez notre page Domaines d'intervention.`;
        }
        return "Les domaines d'intervention ne sont pas détaillés sur le site pour le moment.";
      }

      // Compétences et expertises
      if (lowerQuery.includes('compétences') || lowerQuery.includes('expertises') || lowerQuery.includes('services')) {
        if (chatbotData.competences.length > 0) {
          const competencesList = chatbotData.competences.map(c => c.title).join(', ');
          return `Nos principales compétences incluent : ${competencesList}. Pour plus d'informations, consultez notre page Compétences.`;
        }
        return "Nos compétences ne sont pas détaillées sur le site pour le moment.";
      }

      // References / projects
      if (lowerQuery.includes('références') || lowerQuery.includes('projets') || lowerQuery.includes('réalisations')) { // Renamed text
        if (chatbotData.references.length > 0) { // Renamed key
          const referencesList = chatbotData.references.slice(0, 3).map(r => r.title).join(', '); // Show top 3 (Renamed key)
          return `Nous avons réalisé de nombreux projets, notamment : ${referencesList} et bien d'autres. Visitez notre page Références pour en savoir plus.`; // Renamed text
        }
        return "Nous n'avons pas de références détaillées sur le site pour le moment."; // Renamed text
      }

      // Founder information
      if (lowerQuery.includes('fondateur') || lowerQuery.includes('ahmed zgolli')) {
        return `${chatbotData.founder.name} est le fondateur de LA MAITRISE ENGINEERING. ${chatbotData.founder.bio} ${chatbotData.founder.experience}`;
      }

      // Fallback
      return chatbotData.general.fallback;
    },
    [chatbotData]
  );

  const handleSendMessage = (text: string) => {
    if (text.trim() === '') return;

    const newUserMessage: Message = { text, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    // Simulate bot typing/thinking
    setTimeout(() => {
      const botResponseText = getBotResponse(text);
      const newBotMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    }, 500);
  };

  return {
    messages,
    isOpen,
    setIsOpen,
    handleSendMessage,
    isLoadingData,
  };
};