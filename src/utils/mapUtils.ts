
import L from 'leaflet';

// Fix for default markers in react-leaflet
export const initializeLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  });
};

// Create custom highlighted marker icon
export const createHighlightedIcon = () => {
  return L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [1, -34],
    shadowSize: [46, 46]
  });
};

export const createPopupContent = (spot: any) => {
  return `
    <div style="max-width: 300px;">
      <h3 style="font-weight: bold; font-size: 18px; color: #1e40af; margin-bottom: 8px;">
        ${spot.full_name}
      </h3>
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
        ${spot.state}, ${spot.country}
      </p>
      <p style="font-size: 12px; color: #10b981; margin-bottom: 8px;">
        🗄️ Database ID: ${spot.id}
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 14px;">
        <div>
          <span style="font-weight: 500;">Difficulty:</span> ${spot.difficulty}
        </div>
        <div>
          <span style="font-weight: 500;">Break:</span> ${spot.wave_type}
        </div>
        <div>
          <span style="font-weight: 500;">Best Swell:</span> ${spot.best_swell_direction}
        </div>
        <div>
          <span style="font-weight: 500;">Best Tide:</span> ${spot.best_tide}
        </div>
        <div>
          <span style="font-weight: 500;">Best Wind:</span> ${spot.best_wind}
        </div>
        <div>
          <span style="font-weight: 500;">Crowd:</span> ${spot.crowd_factor}
        </div>
      </div>

      <div style="background-color: #f0f9ff; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
        <div style="font-size: 12px; font-weight: 500; color: #0369a1;">Real Database Data:</div>
        <div style="font-size: 11px; color: #0284c7;">Lat: ${spot.lat.toFixed(6)}, Lon: ${spot.lon.toFixed(6)}</div>
      </div>

      <button 
        onclick="window.parent.postMessage({type: 'selectSpot', spotId: '${spot.id}'}, '*')"
        style="width: 100%; background-color: #3b82f6; color: white; padding: 8px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; margin-top: 8px;"
      >
        View Details
      </button>
    </div>
  `;
};
