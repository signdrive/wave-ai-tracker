
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DatabaseMapListViewProps {
  filteredSpots: any[];
  isLoading: boolean;
  onSelectSpot: (spot: any) => void;
}

const DatabaseMapListView: React.FC<DatabaseMapListViewProps> = ({
  filteredSpots,
  isLoading,
  onSelectSpot
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Database Surf Spots Directory</span>
          <Badge variant="outline">
            {filteredSpots.length} results
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredSpots.map((spot) => (
            <div 
              key={spot.id} 
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectSpot(spot)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-ocean-dark text-lg">{spot.full_name}</h3>
                <Badge className="bg-blue-500 text-xs">DB #{spot.id}</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-1 font-medium">{spot.state}, {spot.country}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className="ml-1 font-medium">{spot.difficulty}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Break:</span>
                  <span className="ml-1 font-medium">{spot.wave_type}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Coordinates:</span>
                  <span className="ml-1 font-medium">{spot.lat.toFixed(3)}, {spot.lon.toFixed(3)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSpots.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <p>No surf spots found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseMapListView;
