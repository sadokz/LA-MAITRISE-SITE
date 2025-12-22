import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  textKey: string; // Format: "page.section.key" e.g., "home.hero.title"
  defaultValue: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  multiline?: boolean;
}

// Sanitize text to prevent XSS - only allow plain text
const sanitizeText = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.textContent || '';
};

const EditableText: React.FC<EditableTextProps> = ({
  textKey,
  defaultValue,
  className = '',
  as: Component = 'span',
  multiline = false,
}) => {
  const { isEditMode, isAdmin } = useEditMode();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [originalValue, setOriginalValue] = useState(defaultValue);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Parse the textKey
  const [page, section, key] = textKey.split('.');

  useEffect(() => {
    setValue(defaultValue);
    setOriginalValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const sanitizedValue = sanitizeText(value);
    
    if (sanitizedValue === originalValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      // Try to update existing record first
      const { data: existing } = await supabase
        .from('site_texts')
        .select('id')
        .eq('page', page)
        .eq('section', section)
        .eq('key', key)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('site_texts')
          .update({ content: sanitizedValue })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('site_texts')
          .insert({
            page,
            section,
            key,
            content: sanitizedValue,
          });

        if (error) throw error;
      }

      setValue(sanitizedValue);
      setOriginalValue(sanitizedValue);
      setIsEditing(false);
      
      toast({
        title: 'Enregistré',
        description: 'Modifications enregistrées avec succès',
      });
    } catch (error) {
      console.error('Error saving text:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les modifications',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(originalValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Not admin or edit mode off - render normally
  if (!isAdmin || !isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  // Admin and edit mode on
  if (isEditing) {
    const inputClassName = cn(
      'w-full bg-white/90 text-gray-dark rounded px-2 py-1 outline-none ring-2 ring-orange',
      className
    );

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={cn(inputClassName, 'min-h-[80px] resize-y')}
          disabled={isSaving}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        className={inputClassName}
        disabled={isSaving}
      />
    );
  }

  // Edit mode ON, not editing - show with edit icon on hover
  return (
    <Component
      className={cn(
        className,
        'relative group cursor-pointer inline-block',
        'ring-2 ring-transparent hover:ring-orange/50 rounded transition-all duration-200',
        'bg-orange/5 hover:bg-orange/10'
      )}
      onClick={() => setIsEditing(true)}
    >
      {value}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-orange text-white p-1 rounded-full shadow-lg">
        <Pencil className="w-3 h-3" />
      </span>
    </Component>
  );
};

export default EditableText;
