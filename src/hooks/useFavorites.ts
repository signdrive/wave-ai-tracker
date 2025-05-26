
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Favorite {
  id: string;
  spot_id: string;
  spot_name: string;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!user,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async ({ spotId, spotName }: { spotId: string; spotName: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          spot_id: spotId,
          spot_name: spotName,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (spotId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('spot_id', spotId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const isFavorite = (spotId: string) => {
    return favorites.some(fav => fav.spot_id === spotId);
  };

  return {
    favorites,
    isLoading,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isFavorite,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
};
