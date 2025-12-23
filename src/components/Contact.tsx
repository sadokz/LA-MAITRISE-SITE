import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContactTexts } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';

interface Coordinate {
  id: string;
  type: 'phone' | 'fax' | 'email';
  value: string;
  label: string | null;
  position: number;
}

const Contact = () => {
  const { toast } = useToast();
  const { getContactText, loading } = useContactTexts();
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const { data } = await supabase
        .from('contact_coordinates')
        .select('*')
        .order('type')
        .order('position');
      
      if (data) {
        setCoordinates(data as Coordinate[]);
      }
    };
    fetchCoordinates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          telephone: formData.telephone || null,
          message: formData.message
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Message envoyé !",
        description: getContactText('success_message', "Nous vous répondrons dans les plus brefs délais."),
      });
      
      // Reset form
      setFormData({ name: '', email: '', telephone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Build contact info from coordinates
  const phones = coordinates.filter(c => c.type === 'phone');
  const faxes = coordinates.filter(c => c.type === 'fax');
  const emails = coordinates.filter(c => c.type === 'email');
  const address = getContactText('address_value', '45 Avenue Habib Bourguiba, 8000 Nabeul, Tunisie');

  if (loading) {
    return (
      <section id="contact" className="section-padding bg-gray-light/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-padding bg-gray-light/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-dark mb-6">
              {getContactText('header_title', 'Contactez notre équipe').split(' ').map((word, index, array) => 
                index === array.length - 2 ? (
                  <span key={index} className="text-gradient-primary">{word} </span>
                ) : word + ' '
              )}
            </h2>
            <p className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed">
              {getContactText('header_subtitle', 'Prêt à démarrer votre projet ? Contactez-nous pour discuter de vos besoins et découvrir nos solutions d\'ingénierie électrique.')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Contact Form and Business Hours */}
            <div className="animate-fade-up space-y-8">
              {/* Contact Form */}
              <div className="card-elegant bg-white">
                <h3 className="font-heading font-semibold text-2xl text-gray-dark mb-6">
                  {getContactText('form_header', 'Demander un devis')}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-dark mb-2">
                      {getContactText('form_name_label', 'Nom complet')} *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-dark mb-2">
                      {getContactText('form_email_label', 'Email')} *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-dark mb-2">
                      {getContactText('form_phone_label', 'Téléphone')}
                    </label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-dark mb-2">
                      {getContactText('form_message_label', 'Message')} *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full min-h-[120px]"
                      placeholder="Décrivez votre projet..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="btn-primary w-full group" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : getContactText('form_submit_label', 'Envoyer le message')}
                    {!isSubmitting && <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>
              </div>

              {/* Business Hours (Moved here) */}
              <div className="card-elegant bg-white">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold text-gray-dark mb-3">
                      {getContactText('hours_title', 'Horaires d\'ouverture')}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-muted">Lundi - Vendredi</span>
                        <span className="text-gray-dark font-medium">8h00 - 17h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-muted">Samedi</span>
                        <span className="text-gray-dark font-medium">8h00 - 12h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-muted">Dimanche</span>
                        <span className="text-gray-dark font-medium">Fermé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Info Cards and WhatsApp CTA */}
            <div className="space-y-8 animate-scale-in">
              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Phones */}
                {phones.length > 0 && (
                  <div className="card-elegant bg-white">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-gray-dark mb-1">
                          Téléphone{phones.length > 1 ? 's' : ''}
                        </h4>
                        <div className="space-y-1">
                          {phones.map((phone) => (
                            <div key={phone.id} className="flex items-center gap-2">
                              <a 
                                href={`tel:${phone.value.replace(/\s+/g, '')}`}
                                className="text-primary hover:text-primary-dark transition-colors"
                              >
                                {phone.value}
                              </a>
                              {phone.label && (
                                <span className="text-xs text-muted-foreground">({phone.label})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Faxes */}
                {faxes.length > 0 && (
                  <div className="card-elegant bg-white">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Printer className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-gray-dark mb-1">
                          Fax
                        </h4>
                        <div className="space-y-1">
                          {faxes.map((fax) => (
                            <div key={fax.id} className="flex items-center gap-2">
                              <span className="text-gray-muted">{fax.value}</span>
                              {fax.label && (
                                <span className="text-xs text-muted-foreground">({fax.label})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emails */}
                {emails.length > 0 && (
                  <div className="card-elegant bg-white">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-gray-dark mb-1">
                          Email{emails.length > 1 ? 's' : ''}
                        </h4>
                        <div className="space-y-1">
                          {emails.map((email) => (
                            <div key={email.id} className="flex items-center gap-2">
                              <a 
                                href={`mailto:${email.value}`}
                                className="text-primary hover:text-primary-dark transition-colors"
                              >
                                {email.value}
                              </a>
                              {email.label && (
                                <span className="text-xs text-muted-foreground">({email.label})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="card-elegant bg-white">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-gray-dark mb-1">
                        Adresse
                      </h4>
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                        className="text-primary hover:text-primary-dark transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {address}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="card-elegant bg-gradient-primary text-white p-6 lg:p-6">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                  <h4 className="font-heading font-semibold text-lg mb-1">
                    {getContactText('whatsapp_title', 'Contact rapide')}
                  </h4>
                  <p className="mb-2 text-white/90 text-sm">
                    {getContactText('whatsapp_subtitle', 'Besoin d\'une réponse immédiate ? Contactez-nous sur WhatsApp')}
                  </p>
                  <a
                    href="https://wa.me/21652949411"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                    aria-label="Contacter LA MAITRISE ENGINEERING via WhatsApp"
                  >
                    {getContactText('whatsapp_button', 'Écrire sur WhatsApp')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="mt-16 animate-fade-up">
            <div className="text-center mb-8">
              <h3 className="font-heading font-bold text-2xl text-gray-dark mb-4">
                Notre localisation
              </h3>
              <p className="text-gray-medium">
                Retrouvez-nous à Nabeul pour discuter de vos projets en personne
              </p>
            </div>
            <div className="card-elegant bg-white p-0 overflow-hidden">
              <iframe
                title="Localisation LA MAITRISE ENGINEERING"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.5!2d10.735537!3d36.451667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzYuNDUxNjY3LCAxMC43MzU1Mzc!5e0!3m2!1sfr!2stn!4v1640995200000!5m2!1sfr!2stn&q=FP2P%2BJ5C+Nabeul"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96 border-0"
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;