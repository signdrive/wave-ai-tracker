
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
    <div style="max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="margin-bottom: 12px;">
        <h3 style="font-weight: bold; font-size: 16px; color: #1e40af; margin: 0 0 4px 0; line-height: 1.3;">
          ${spot.full_name}
        </h3>
        <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">
          ${spot.state}, ${spot.country}
        </p>
        <p style="font-size: 11px; color: #10b981; margin: 0; font-weight: 500;">
          🗄️ Database ID: ${spot.id}
        </p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 12px;">
        <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
          <span style="font-weight: 600; color: #374151;">Difficulty:</span><br>
          <span style="color: #1f2937;">${spot.difficulty}</span>
        </div>
        <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
          <span style="font-weight: 600; color: #374151;">Break:</span><br>
          <span style="color: #1f2937;">${spot.wave_type}</span>
        </div>
        <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
          <span style="font-weight: 600; color: #374151;">Best Swell:</span><br>
          <span style="color: #1f2937;">${spot.best_swell_direction}</span>
        </div>
        <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
          <span style="font-weight: 600; color: #374151;">Best Tide:</span><br>
          <span style="color: #1f2937;">${spot.best_tide}</span>
        </div>
        <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
          <span style="font-weight: 600; color: #374151;">Best Wind:</span><br>
          <span style="color: #1f2937;">${spot.best_wind}</span>
        </div>
        <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
          <span style="font-weight: 600; color: #374151;">Crowd:</span><br>
          <span style="color: #1f2937;">${spot.crowd_factor}</span>
        </div>
      </div>

      <div style="background-color: #f0f9ff; padding: 8px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #3b82f6;">
        <div style="font-size: 11px; font-weight: 600; color: #1e40af; margin-bottom: 2px;">📍 Coordinates:</div>
        <div style="font-size: 10px; color: #1e3a8a; font-family: monospace;">Lat: ${spot.lat.toFixed(6)}, Lon: ${spot.lon.toFixed(6)}</div>
      </div>

      <button 
        onclick="window.parent.postMessage({type: 'selectSpot', spotId: '${spot.id}'}, '*')"
        style="width: 100%; background-color: #3b82f6; color: white; padding: 8px 12px; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
        onmouseover="this.style.backgroundColor='#2563eb'"
        onmouseout="this.style.backgroundColor='#3b82f6'"
      >
        📋 View Full Details
      </button>
    </div>
  `;
};
