
export interface EnhancedSurfSpot {
  id: string;
  name: string;
  full_name: string;
  lat: number;
  lon: number;
  region: string;
  country: string;
  state: string;
  difficulty: string; // Changed from strict union to string
  point_break: boolean;
  reef_break: boolean;
  beach_break: boolean;
  description: string;
  best_season: string;
  break_type: string;
  crowd_levels: string; // Changed from strict union to string
  wave_direction: string; // Changed from strict union to string
  bottom_type: string; // Changed from strict union to string
  ideal_swell_direction: string;
  wave_height_range: string;
  best_tide: string; // Changed from strict union to string
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
