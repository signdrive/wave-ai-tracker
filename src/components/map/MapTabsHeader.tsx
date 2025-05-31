
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Waves, Users, MapPin } from 'lucide-react';

interface MapTabsHeaderProps {
  viewMode: 'spots' | 'mentors' | 'both';
  setViewMode: (mode: 'spots' | 'mentors' | 'both') => void;
  surfSpotsCount: number;
  availableMentorsCount: number;
}

const MapTabsHeader: React.FC<MapTabsHeaderProps> = ({
  viewMode,
  setViewMode,
  surfSpotsCount,
  availableMentorsCount
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 border-b">
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="spots" className="flex items-center gap-2">
            <Waves className="w-4 h-4" />
            Surf Spots
            <Badge variant="outline" className="ml-1">
              {surfSpotsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="mentors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Mentors
            <Badge variant="outline" className="ml-1">
              {availableMentorsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="both" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Both
            <Badge variant="outline" className="ml-1">
              {surfSpotsCount + availableMentorsCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default MapTabsHeader;
