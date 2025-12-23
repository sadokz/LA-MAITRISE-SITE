import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AppColors {
  id: number;
  primary_color_hex: string;
  secondary_color_hex: string;
}

export const useAppColors = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<AppColors, Error>({
    queryKey: ['app_colors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_colors')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        // If no settings exist, insert defaults
        if (error.code === 'PGRST116') { // No rows found
          const { data: insertData, error: insertError } = await supabase
            .from('app_colors')
            .insert({ id: 1, primary_color_hex: '#FF7F00', secondary_color_hex: '#F0F0F0' }) // Changed default primary to orange
            .select('*')
            .single();
          if (insertError) throw insertError;
          return insertData;
        }
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  const updateColorsMutation = useMutation<AppColors, Error, Partial<AppColors>>({
    mutationFn: async (newColors) => {
      const { data, error } = await supabase
        .from('app_colors')
        .update(newColors)
        .eq('id', 1)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_colors'] });
      toast({
        title: 'Succès',
        description: 'Couleurs de l\'application mises à jour.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erreur',
        description: `Impossible de mettre à jour les couleurs: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateAppColors = useCallback(
    (newColors: Partial<AppColors>) => {
      updateColorsMutation.mutate(newColors);
    },
    [updateColorsMutation]
  );

  return {
    appColors: data,
    loading: isLoading,
    error,
    updateAppColors,
    isUpdating: updateColorsMutation.isPending,
  };
};