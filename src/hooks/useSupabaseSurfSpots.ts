
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseSurfSpot {
  id: number;
  name: string;
  lat: number;
  lon: number;
  region: string;
  country: string;
  state: string;
  difficulty: string;
  point_break: boolean;
  description: string;
  best_season: string;
  break_type: string;
  crowd_levels: string;
  wave_direction: string;
  bottom_type: string;
  ideal_swell_direction: string;
  wave_height_range: string;
  best_tide: string;
  wind_direction: string;
  parking: string;
  water_temp_range: string;
  'amenities/0': string;
  'amenities/1': string;
  'amenities/2': string;
  'amenities/3': string;
  'amenities/4': string;
  'hazards/0': string;
  'hazards/1': string;
  'hazards/2': string;
  'hazards/3': string;
  'hazards/4': string;
  'hazards/5': string;
}

export const useSupabaseSurfSpots = () => {
  const { data: surfSpots = [], isLoading, error } = useQuery({
    queryKey: ['supabase-surf-spots'],
    queryFn: async (): Promise<SupabaseSurfSpot[]> => {
      console.log('Fetching surf spots from Supabase database...');
      
      const { data, error } = await supabase
        .from('surf_spots')
        .select('*');
      
      if (error) {
        console.error('Error fetching surf spots:', error);
        throw error;
      }
      
      console.log(`Loaded ${data?.length || 0} surf spots from database`);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Convert to the format expected by existing map components
  const convertedSpots = surfSpots.map(spot => ({
    id: spot.id.toString(),
    name: spot.name,
    full_name: spot.name,
    lat: spot.lat,
    lon: spot.lon,
    country: spot.country,
    state: spot.state || '',
    best_swell_direction: spot.ideal_swell_direction || 'N/A',
    wave_type: spot.break_type || 'Unknown',
    difficulty: spot.difficulty || 'Unknown',
    best_wind: spot.wind_direction || 'N/A',
    best_tide: spot.best_tide || 'N/A',
    crowd_factor: spot.crowd_levels || 'Unknown',
    live_cam: '', // Not in database
    backup_cam: '',
    status: 'PLACEHOLDER' as const,
    last_verified: new Date().toISOString().split('T')[0],
    source: 'Supabase Database',
    imageSrc: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
  }));

  return {
    surfSpots: convertedSpots,
    rawSpots: surfSpots,
    isLoading,
    error,
    getSurfSpotById: (id: string) => convertedSpots.find(spot => spot.id === id),
    getSurfSpotsByCountry: (country: string) => convertedSpots.filter(spot => spot.country === country),
    getSurfSpotsByDifficulty: (difficulty: string) => convertedSpots.filter(spot => spot.difficulty.includes(difficulty))
  };
};
