
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';

interface DatabaseMapHeaderProps {
  surfSpots: any[];
  filteredSpots: any[];
  isLoading: boolean;
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
}

const DatabaseMapHeader: React.FC<DatabaseMapHeaderProps> = ({
  surfSpots,
  filteredSpots,
  isLoading,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-ocean-dark">Real Surf Spots Database</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `${surfSpots.length} surf spots from Supabase database`}
          </p>
          {!isLoading && (
            <p className="text-sm text-green-600 font-medium">
              ✅ Connected to live database - showing {filteredSpots.length} filtered results
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="w-4 h-4 mr-1" />
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('map')}
          >
            <Map className="w-4 h-4 mr-1" />
            Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseMapHeader;
