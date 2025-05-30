
export interface EnhancedSurfSpot {
  id: string;
  name: string;
  full_name: string;
  lat: number;
  lon: number;
  region: string;
  country: string;
  state: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  point_break: boolean;
  reef_break: boolean;
  beach_break: boolean;
  description: string;
  best_season: string;
  break_type: string;
  crowd_levels: 'Low' | 'Moderate' | 'Heavy' | 'Extreme';
  wave_direction: 'Left' | 'Right' | 'Both';
  bottom_type: 'Sand' | 'Reef' | 'Rock' | 'Cobblestone';
  ideal_swell_direction: string;
  wave_height_range: string;
  best_tide: 'Low' | 'Mid' | 'High' | 'All';
  wind_direction: string;
  parking: string;
  amenities: string[];
  hazards: string[];
  water_temp_range: string;
  secret: boolean;
  big_wave: boolean;
  longboard_friendly: boolean;
  kite_surfing: boolean;
  pro_tip?: string;
  google_maps_link: string;
  live_cam?: string;
  imageSrc: string;
}

export interface EnhancedSurfSpotsData {
  surf_spots: EnhancedSurfSpot[];
}
