import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Thermometer, Wind, Calendar, Waves } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SurfSpotMapData {
  id: string;
  name: string;
  coordinates: [number, number];
  best_season: string;
  optimal_swell: string;
  difficulty: string;
  wave_type: string;
  climate_outlook: {
    sea_level_impact: string;
    swell_pattern_changes: string;
    conservation_efforts: string;
  };
}

interface InteractiveSurfMapProps {
  spots: SurfSpotMapData[];
  selectedSpot?: string;
  onSpotSelect?: (spotId: string) => void;
}

const InteractiveSurfMap: React.FC<InteractiveSurfMapProps> = ({ 
  spots, 
  selectedSpot, 
  onSpotSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedSpotData, setSelectedSpotData] = useState<SurfSpotMapData | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Custom marker icons based on difficulty
    const createCustomIcon = (difficulty: string) => {
      const color = {
        'Beginner': '#22c55e',
        'Intermediate': '#eab308',
        'Intermediate to Advanced': '#f97316',
        'Advanced': '#ef4444',
        'Advanced to Expert': '#8b5cf6',
        'Expert': '#374151'
      }[difficulty] || '#374151';

      return L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 10px;
              font-weight: bold;
            ">🏄</div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
    };

    // Add markers for each spot
    spots.forEach(spot => {
      const marker = L.marker(spot.coordinates, {
        icon: createCustomIcon(spot.difficulty)
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div class="popup-content">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${spot.name}</h3>
          <div style="margin-bottom: 4px;">
            <strong>🏄 Wave Type:</strong> ${spot.wave_type}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>📊 Difficulty:</strong> ${spot.difficulty}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>🌊 Swell:</strong> ${spot.optimal_swell}
          </div>
          <div>
            <strong>📅 Best Season:</strong> ${spot.best_season}
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedSpotData(spot);
        onSpotSelect?.(spot.id);
      });

      markersRef.current.push(marker);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [spots, onSpotSelect]);

  // Highlight selected spot
  useEffect(() => {
    if (selectedSpot && mapInstanceRef.current) {
      const spot = spots.find(s => s.id === selectedSpot);
      if (spot) {
        mapInstanceRef.current.setView(spot.coordinates, 6);
        setSelectedSpotData(spot);
      }
    }
  }, [selectedSpot, spots]);

  return (
    <div className="space-y-4">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-lg border"
        style={{ minHeight: '400px' }}
      />
      
      {selectedSpotData && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-blue-600" />
              {selectedSpotData.name} - Climate & Swell Data
            </CardTitle>
            <CardDescription>
              Interactive wave analysis and future projections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Best Season</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedSpotData.best_season}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Optimal Swell</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedSpotData.optimal_swell}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <h4 className="font-semibold text-lg">Climate Impact Analysis</h4>
              
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Sea Level Impact</Badge>
                <p className="text-sm text-muted-foreground">
                  {selectedSpotData.climate_outlook.sea_level_impact}
                </p>
              </div>
              
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Swell Pattern Changes</Badge>
                <p className="text-sm text-muted-foreground">
                  {selectedSpotData.climate_outlook.swell_pattern_changes}
                </p>
              </div>
              
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Conservation Efforts</Badge>
                <p className="text-sm text-muted-foreground">
                  {selectedSpotData.climate_outlook.conservation_efforts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveSurfMap;