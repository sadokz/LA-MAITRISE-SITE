import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Edit, X, Phone, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useContactTexts, ContactText } from '@/hooks/useSupabaseData';
import { useToast } from '@/components/ui/use-toast'; // Updated import
import AdminCoordinates from './AdminCoordinates';

const AdminContact = () => {
  const { contactTexts, fetchContactTexts, getContactText, loading } = useContactTexts();
  const [editingText, setEditingText] = useState<ContactText | null>(null);
  const [editForm, setEditForm] = useState({ content: '' });
  const { toast } = useToast();

  const handleEdit = (text: ContactText) => {
    setEditingText(text);
    setEditForm({ content: text.content });
  };

  const handleSave = async () => {
    if (!editingText) return;

    const { error } = await supabase
      .from('contact_texts')
      .update({ content: editForm.content })
      .eq('id', editingText.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le texte',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Texte mis à jour avec succès',
    });

    setEditingText(null);
    fetchContactTexts();
  };

  const handleCancel = () => {
    setEditingText(null);
    setEditForm({ content: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sections = [
    {
      title: 'En-tête de la page',
      icon: MessageSquare,
      fields: [
        { key: 'header_title', label: 'Titre principal', placeholder: 'Contactez notre équipe' },
        { key: 'header_subtitle', label: 'Sous-titre', placeholder: 'Description de la section contact', multiline: true }
      ]
    },
    {
      title: 'Adresse',
      icon: MapPin,
      fields: [
        { key: 'address_value', label: 'Adresse complète', placeholder: 'Adresse de l\'entreprise', multiline: true }
      ]
    },
    {
      title: 'Formulaire de contact',
      icon: Mail,
      fields: [
        { key: 'form_header', label: 'Titre du formulaire', placeholder: 'Demander un devis' },
        { key: 'form_name_label', label: 'Label "Nom"', placeholder: 'Nom complet' },
        { key: 'form_email_label', label: 'Label "Email"', placeholder: 'Email' },
        { key: 'form_phone_label', label: 'Label "Téléphone"', placeholder: 'Téléphone' },
        { key: 'form_message_label', label: 'Label "Message"', placeholder: 'Message' },
        { key: 'form_submit_label', label: 'Bouton d\'envoi', placeholder: 'Envoyer le message' }
      ]
    },
    {
      title: 'Messages système',
      icon: MessageSquare,
      fields: [
        { key: 'success_message', label: 'Message de succès', placeholder: 'Message envoyé avec succès', multiline: true },
        { key: 'error_message', label: 'Message d\'erreur', placeholder: 'Erreur lors de l\'envoi', multiline: true }
      ]
    },
    {
      title: 'Sections supplémentaires',
      icon: Clock,
      fields: [
        { key: 'hours_title', label: 'Titre horaires', placeholder: 'Horaires d\'ouverture' },
        { key: 'whatsapp_title', label: 'Titre WhatsApp', placeholder: 'Contact rapide' },
        { key: 'whatsapp_subtitle', label: 'Sous-titre WhatsApp', placeholder: 'Description WhatsApp', multiline: true },
        { key: 'whatsapp_button', label: 'Bouton WhatsApp', placeholder: 'Écrire sur WhatsApp' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Coordonnées multiples */}
      <AdminCoordinates />
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.fields.map((field) => {
                  const text = contactTexts.find(t => t.key === field.key);
                  if (!text) return null;

                  return (
                    <div key={field.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">{field.label}</Label>
                        {editingText?.id === text.id ? (
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={handleSave}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleEdit(text)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {editingText?.id === text.id ? (
                        field.multiline ? (
                          <Textarea
                            value={editForm.content}
                            onChange={(e) => setEditForm({ content: e.target.value })}
                            className="min-h-[100px]"
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <Input
                            value={editForm.content}
                            onChange={(e) => setEditForm({ content: e.target.value })}
                            placeholder={field.placeholder}
                          />
                        )
                      ) : (
                        <div className="p-3 bg-muted rounded border">
                          <p className="text-sm whitespace-pre-wrap">{text.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminContact;