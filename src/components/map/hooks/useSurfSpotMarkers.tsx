
import { useEffect } from 'react';
import L from 'leaflet';

interface UseSurfSpotMarkersProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  surfSpots: any[];
  isLoading: boolean;
  viewMode: 'spots' | 'mentors' | 'both';
  handleSpotSelection: (spotId: string) => void;
}

export const useSurfSpotMarkers = ({ 
  mapRef, 
  surfSpots, 
  isLoading, 
  viewMode, 
  handleSpotSelection 
}: UseSurfSpotMarkersProps) => {
  useEffect(() => {
    if (!mapRef.current || surfSpots.length === 0 || isLoading || (viewMode === 'mentors')) return;

    console.log('🏄 Adding surf spot markers:', surfSpots.length);
    console.log('🏄 handleSpotSelection type:', typeof handleSpotSelection);

    const spotLayer = L.layerGroup().addTo(mapRef.current);

    surfSpots.forEach((spot, index) => {
      console.log(`🔍 Processing spot ${index + 1}:`, { 
        id: spot.id, 
        name: spot.full_name,
        lat: spot.lat,
        lon: spot.lon 
      });
      
      // Mock swell data for now
      const mockSwell = Math.random() * 6 + 1;
      const color = mockSwell > 3 ? '#10B981' : '#EF4444';
      
      const spotIcon = L.divIcon({
        className: 'surf-spot-marker',
        html: `
          <div style="
            width: 28px; 
            height: 28px; 
            border-radius: 50%; 
            border: 3px solid ${color}; 
            background: white;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: bold;
            font-size: 11px;
            color: ${color};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${mockSwell.toFixed(1)}ft</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const spotMarker = L.marker([spot.lat, spot.lon], {
        icon: spotIcon
      });

      // Add click event to marker for direct selection
      spotMarker.on('click', (e) => {
        console.log('');
        console.log('🖱️ === MARKER CLICK EVENT ===');
        console.log('🖱️ Clicked spot:', spot.full_name);
        console.log('🖱️ Spot ID:', spot.id, 'Type:', typeof spot.id);
        console.log('🖱️ Event:', e);
        
        L.DomEvent.stopPropagation(e);
        
        console.log('📞 Calling handleSpotSelection with ID:', spot.id);
        handleSpotSelection(String(spot.id));
        console.log('✅ handleSpotSelection call completed');
        console.log('=== MARKER CLICK END ===');
        console.log('');
      });

      const spotPopupContent = `
        <div style="font-family: system-ui; padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">🏄 ${spot.full_name}</h3>
          <div style="margin: 8px 0;">
            <div style="margin: 4px 0; color: #374151;">
              <strong>Difficulty:</strong> ${spot.difficulty}
            </div>
            <div style="margin: 4px 0; color: #374151;">
              <strong>Wave Type:</strong> ${spot.wave_type}
            </div>
            <div style="margin: 4px 0; color: #374151;">
              <strong>Best Swell:</strong> ${spot.best_swell_direction}
            </div>
            <div style="margin: 4px 0; color: #374151;">
              <strong>Best Wind:</strong> ${spot.best_wind}
            </div>
          </div>
          <button 
            onclick="
              console.log('🔘 Popup button clicked for spot ID:', '${String(spot.id)}');
              window.selectSurfSpot && window.selectSurfSpot('${String(spot.id)}');
            "
            style="
              margin-top: 8px;
              width: 100%;
              background: #059669; 
              color: white; 
              border: none; 
              padding: 8px; 
              border-radius: 4px; 
              cursor: pointer; 
              font-size: 14px;
            "
          >
            View Details
          </button>
        </div>
      `;

      spotMarker.bindPopup(spotPopupContent, {
        maxWidth: 250,
        closeButton: true,
        autoPan: true
      });

      spotMarker.addTo(spotLayer);
    });

    // Set up global function for popup buttons
    (window as any).selectSurfSpot = (spotId: string) => {
      console.log('🌐 Global selectSurfSpot called with ID:', spotId);
      handleSpotSelection(spotId);
    };

    console.log('✅ All markers added to map');

    return () => {
      console.log('🧹 Cleaning up markers');
      spotLayer.remove();
      delete (window as any).selectSurfSpot;
    };
  }, [surfSpots, isLoading, viewMode, handleSpotSelection, mapRef]);
};
