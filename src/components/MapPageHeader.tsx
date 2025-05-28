
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, List, LayoutGrid, Waves } from 'lucide-react';

interface MapPageHeaderProps {
  totalSpots: number;
  filteredSpots: number;
  viewMode: 'map' | 'list' | 'split';
  onViewModeChange: (mode: 'map' | 'list' | 'split') => void;
  surfNowActive: boolean;
  onSurfNowToggle: () => void;
}

const MapPageHeader: React.FC<MapPageHeaderProps> = ({
  totalSpots,
  filteredSpots,
  viewMode,
  onViewModeChange,
  surfNowActive,
  onSurfNowToggle
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold text-ocean-dark">Global Surf Spots</h1>
        <p className="text-gray-600 mt-1">
          Discover {totalSpots} surf spots worldwide with live conditions
          {filteredSpots !== totalSpots && (
            <span> • {filteredSpots} matching filters</span>
          )}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={surfNowActive ? 'default' : 'outline'}
          size="sm"
          onClick={onSurfNowToggle}
          className="mr-4"
        >
          <Waves className="w-4 h-4 mr-1" />
          Surf Now
        </Button>
        
        <Button
          variant={viewMode === 'map' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('map')}
        >
          <Map className="w-4 h-4 mr-1" />
          Map
        </Button>
        <Button
          variant={viewMode === 'split' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('split')}
        >
          <LayoutGrid className="w-4 h-4 mr-1" />
          Split
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-4 h-4 mr-1" />
          List
        </Button>
      </div>
    </div>
  );
};

export default MapPageHeader;
