
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
      console.log('🔄 Fetching ALL surf spots from Supabase database...');
      
      try {
        // Fetch ALL surf spots without any limits
        const { data, error, count } = await supabase
          .from('surf_spots')
          .select('*', { count: 'exact' })
          .not('lat', 'is', null)
          .not('lon', 'is', null)
          .order('name');
        
        if (error) {
          console.error('❌ Supabase query error:', error);
          throw error;
        }
        
        console.log(`✅ Successfully loaded ${data?.length || 0} surf spots from database`);
        console.log(`📊 Total count from database: ${count}`);
        console.log('🗄️ Database connection details:');
        console.log('- Table: surf_spots');
        console.log('- Columns fetched: ALL (*)');
        
        if (data && data.length > 0) {
          console.log('📍 Sample surf spot data:', data[0]);
          console.log('🏄‍♂️ First 5 spot names:', data.slice(0, 5).map(spot => spot.name));
        }
        
        return data || [];
      } catch (err) {
        console.error('❌ Database connection failed:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });

  // Convert to the format expected by existing map components
  const convertedSpots = surfSpots
    .filter(spot => {
      // Ensure we have valid coordinates
      const lat = Number(spot.lat);
      const lon = Number(spot.lon);
      const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLon = !isNaN(lon) && lon >= -180 && lon <= 180;
      
      if (!isValidLat || !isValidLon) {
        console.warn(`⚠️ Filtering out spot ${spot.name} - invalid coordinates: lat=${spot.lat}, lon=${spot.lon}`);
        return false;
      }
      
      return true;
    })
    .map(spot => {
      const lat = Number(spot.lat);
      const lon = Number(spot.lon);
      
      const converted = {
        id: spot.id.toString(),
        name: spot.name,
        full_name: spot.name,
        lat: lat,
        lon: lon,
        country: spot.country || 'Unknown',
        state: spot.state || '',
        best_swell_direction: spot.ideal_swell_direction || 'N/A',
        wave_type: spot.break_type || 'Unknown',
        difficulty: spot.difficulty || 'Unknown',
        best_wind: spot.wind_direction || 'N/A',
        best_tide: spot.best_tide || 'N/A',
        crowd_factor: spot.crowd_levels || 'Unknown',
        live_cam: '',
        backup_cam: '',
        status: 'ACTIVE' as const,
        last_verified: new Date().toISOString().split('T')[0],
        source: 'Supabase Database',
        imageSrc: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
      };
      
      return converted;
    });

  console.log(`🎯 Total spots after conversion and filtering: ${convertedSpots.length}`);
  
  if (convertedSpots.length > 0) {
    console.log('📍 Sample converted spots:', convertedSpots.slice(0, 3).map(spot => ({
      name: spot.name,
      lat: spot.lat,
      lon: spot.lon,
      id: spot.id
    })));
    
    // Log California spots specifically
    const californiaSpots = convertedSpots.filter(spot => 
      spot.state?.toLowerCase().includes('california') || 
      spot.country?.toLowerCase().includes('usa')
    );
    console.log(`🏄‍♂️ California surf spots found: ${californiaSpots.length}`);
    console.log('🌊 Sample California spots:', californiaSpots.slice(0, 5).map(spot => spot.name));
  }

  return {
    surfSpots: convertedSpots,
    rawSpots: surfSpots,
    isLoading,
    error,
    totalCount: surfSpots.length,
    getSurfSpotById: (id: string) => convertedSpots.find(spot => spot.id === id),
    getSurfSpotsByCountry: (country: string) => convertedSpots.filter(spot => spot.country === country),
    getSurfSpotsByDifficulty: (difficulty: string) => convertedSpots.filter(spot => spot.difficulty.includes(difficulty))
  };
};
