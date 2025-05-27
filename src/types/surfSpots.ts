
export interface SurfSpot {
  id: string;
  name: string;
  full_name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
  best_swell_direction: string;
  wave_type: string;
  difficulty: string;
  best_wind: string;
  best_tide: string;
  crowd_factor: string;
  live_cam: string;
  backup_cam?: string;
  status: 'LIVE' | 'OFFLINE' | 'PLACEHOLDER' | 'SEASONAL';
  last_verified: string;
  source: string;
  imageSrc: string;
}

export interface SurfSpotsData {
  surf_spots: SurfSpot[];
}
