
import L from 'leaflet';

// Fix for default markers in react-leaflet with error handling
export const initializeLeafletIcons = () => {
  try {
    // Check if already initialized
    if (L.Icon.Default.prototype._getIconUrl) {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
    }
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    });
    console.log('✅ Leaflet icons initialized');
  } catch (error) {
    console.error('❌ Error initializing Leaflet icons:', error);
  }
};

// Create custom highlighted marker icon with error handling
export const createHighlightedIcon = () => {
  try {
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
      iconSize: [30, 46],
      iconAnchor: [15, 46],
      popupAnchor: [1, -34],
      shadowSize: [46, 46]
    });
  } catch (error) {
    console.error('❌ Error creating highlighted icon:', error);
    // Return default icon as fallback
    return new L.Icon.Default();
  }
};

// Safely format numbers for display
const safeToFixed = (value: any, decimals: number = 6): string => {
  try {
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(decimals);
  } catch (error) {
    return 'N/A';
  }
};

// Safely escape HTML to prevent XSS
const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return 'N/A';
  
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const createPopupContent = (spot: any) => {
  try {
    // Validate spot data
    if (!spot || typeof spot !== 'object') {
      console.warn('⚠️ Invalid spot data provided to createPopupContent');
      return null;
    }

    // Safely extract and escape data
    const safeName = escapeHtml(spot.full_name || spot.name || 'Unknown Spot');
    const safeState = escapeHtml(spot.state || '');
    const safeCountry = escapeHtml(spot.country || 'Unknown');
    const safeId = escapeHtml(String(spot.id || 'N/A'));
    const safeDifficulty = escapeHtml(spot.difficulty || 'Unknown');
    const safeWaveType = escapeHtml(spot.wave_type || spot.break_type || 'Unknown');
    const safeSwellDirection = escapeHtml(spot.best_swell_direction || spot.ideal_swell_direction || 'N/A');
    const safeTide = escapeHtml(spot.best_tide || 'N/A');
    const safeWind = escapeHtml(spot.best_wind || spot.wind_direction || 'N/A');
    const safeCrowd = escapeHtml(spot.crowd_factor || spot.crowd_levels || 'Unknown');
    const safeLat = safeToFixed(spot.lat);
    const safeLon = safeToFixed(spot.lon);

    return `
      <div style="max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="margin-bottom: 12px;">
          <h3 style="font-weight: bold; font-size: 16px; color: #1e40af; margin: 0 0 4px 0; line-height: 1.3; word-wrap: break-word;">
            ${safeName}
          </h3>
          <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">
            ${safeState}${safeState ? ', ' : ''}${safeCountry}
          </p>
          <p style="font-size: 11px; color: #10b981; margin: 0; font-weight: 500;">
            🗄️ Database ID: ${safeId}
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 12px;">
          <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
            <span style="font-weight: 600; color: #374151;">Difficulty:</span><br>
            <span style="color: #1f2937;">${safeDifficulty}</span>
          </div>
          <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
            <span style="font-weight: 600; color: #374151;">Break:</span><br>
            <span style="color: #1f2937;">${safeWaveType}</span>
          </div>
          <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
            <span style="font-weight: 600; color: #374151;">Best Swell:</span><br>
            <span style="color: #1f2937;">${safeSwellDirection}</span>
          </div>
          <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
            <span style="font-weight: 600; color: #374151;">Best Tide:</span><br>
            <span style="color: #1f2937;">${safeTide}</span>
          </div>
          <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
            <span style="font-weight: 600; color: #374151;">Best Wind:</span><br>
            <span style="color: #1f2937;">${safeWind}</span>
          </div>
          <div style="background-color: #f8fafc; padding: 6px; border-radius: 4px;">
            <span style="font-weight: 600; color: #374151;">Crowd:</span><br>
            <span style="color: #1f2937;">${safeCrowd}</span>
          </div>
        </div>

        <div style="background-color: #f0f9ff; padding: 8px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #3b82f6;">
          <div style="font-size: 11px; font-weight: 600; color: #1e40af; margin-bottom: 2px;">📍 Coordinates:</div>
          <div style="font-size: 10px; color: #1e3a8a; font-family: monospace;">Lat: ${safeLat}, Lon: ${safeLon}</div>
        </div>

        <button 
          onclick="try { window.parent.postMessage({type: 'selectSpot', spotId: '${safeId}'}, '*'); } catch(e) { console.warn('Message posting failed:', e); }"
          style="width: 100%; background-color: #3b82f6; color: white; padding: 8px 12px; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.backgroundColor='#2563eb'"
          onmouseout="this.style.backgroundColor='#3b82f6'"
        >
          📋 View Full Details
        </button>
      </div>
    `;
  } catch (error) {
    console.error('❌ Error creating popup content:', error);
    return `
      <div style="padding: 12px; text-align: center; color: #ef4444;">
        <p>❌ Error loading spot details</p>
        <p style="font-size: 12px;">Please try again</p>
      </div>
    `;
  }
};
