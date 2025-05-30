
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DatabaseMapStatsProps {
  filteredSpots: any[];
  countries: string[];
}

const DatabaseMapStats: React.FC<DatabaseMapStatsProps> = ({
  filteredSpots,
  countries
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-ocean-dark">{filteredSpots.length}</div>
          <div className="text-sm text-gray-600">Spots Found</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {filteredSpots.filter(s => s.difficulty.toLowerCase().includes('beginner')).length}
          </div>
          <div className="text-sm text-gray-600">Beginner Spots</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {filteredSpots.filter(s => s.wave_type.toLowerCase().includes('point')).length}
          </div>
          <div className="text-sm text-gray-600">Point Breaks</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {countries.length}
          </div>
          <div className="text-sm text-gray-600">Countries</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseMapStats;
