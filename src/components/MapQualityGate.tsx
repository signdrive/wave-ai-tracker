
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapQualityGate: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const qualityCheck = {
      leafletLoaded: !!(typeof window !== 'undefined' && window.L),
      mapInstance: !!map,
      mapContainer: !!(map && map.getContainer()),
      timestamp: new Date().toISOString()
    };

    console.log('🔍 Map Quality Gate Check:', qualityCheck);

    // Validate all systems are operational
    if (qualityCheck.leafletLoaded && qualityCheck.mapInstance && qualityCheck.mapContainer) {
      console.log('✅ All map systems operational');
    } else {
      console.error('❌ Map quality gate failed:', qualityCheck);
    }
  }, [map]);

  return null;
};

export default MapQualityGate;
