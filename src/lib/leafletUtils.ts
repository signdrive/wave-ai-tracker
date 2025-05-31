
import L from 'leaflet';

export const safeCreateLayer = () => {
  if (typeof window === 'undefined') return null;
  try {
    return L.layerGroup();
  } catch (error) {
    console.error('Error creating Leaflet layer:', error);
    return null;
  }
};

export const safeCreateIcon = (iconOptions: L.IconOptions) => {
  if (typeof window === 'undefined') return null;
  try {
    return L.icon(iconOptions);
  } catch (error) {
    console.error('Error creating Leaflet icon:', error);
    return null;
  }
};

export const validateLeafletContext = () => {
  return !!(typeof window !== 'undefined' && window.L);
};
