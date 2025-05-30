
import L from 'leaflet';

export const DEFAULT_MAP_CONFIG = {
  center: [34.0522, -118.2437] as [number, number],
  zoom: 6,
  zoomControl: true,
  preferCanvas: false,
  attributionControl: true,
  zoomSnap: 0.5,
  zoomDelta: 0.5,
  wheelPxPerZoomLevel: 60
};

export const TILE_LAYER_CONFIG = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  minZoom: 1,
  errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
  crossOrigin: true as const
};

export const POPUP_CONFIG = {
  maxWidth: 300,
  closeButton: true,
  autoPan: true,
  autoClose: false,
  closeOnEscapeKey: true
};

export const FIT_BOUNDS_CONFIG = {
  padding: [20, 20] as [number, number],
  maxZoom: 10,
  animate: true,
  duration: 0.5
};
