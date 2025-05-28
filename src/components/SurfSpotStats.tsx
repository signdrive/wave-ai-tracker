
import React from 'react';
import { Card } from '@/components/ui/card';
import { SurfSpot } from '@/types/surfSpots';

interface SurfSpotStatsProps {
  surfSpots: SurfSpot[];
  countries: string[];
  filteredSpots: SurfSpot[];
}

const SurfSpotStats: React.FC<SurfSpotStatsProps> = ({ 
  surfSpots, 
  countries, 
  filteredSpots 
}) => {
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="text-2xl font-bold text-ocean">{surfSpots.length}</div>
        <div className="text-sm text-gray-600">Total Spots</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-green-600">
          {surfSpots.filter(s => s.live_cam).length}
        </div>
        <div className="text-sm text-gray-600">Live Cams</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-blue-600">{countries.length}</div>
        <div className="text-sm text-gray-600">Countries</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-orange-600">
          {filteredSpots.filter(s => s.difficulty.toLowerCase().includes('beginner')).length}
        </div>
        <div className="text-sm text-gray-600">Beginner Spots</div>
      </Card>
    </div>
  );
};

export default SurfSpotStats;
