
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RealTimeTides from './RealTimeTides';
import { useRealTimeUpdates } from '@/hooks/useRealTimeData';

interface TideChartProps {
  spotId?: string;
  locationName?: string;
}

const TideChart: React.FC<TideChartProps> = ({ spotId, locationName }) => {
  const [selectedDay, setSelectedDay] = useState<string>('today');
  
  console.log('TideChart rendering with selectedDay:', selectedDay, 'spotId:', spotId, 'locationName:', locationName);
  
  // Set up real-time updates
  useRealTimeUpdates();

  // Map spot IDs to appropriate tide station data - using consistent location names
  const getTideStationForSpot = (spotId: string | undefined, locationName: string | undefined) => {
    const stationMappings: Record<string, { id: string; name: string }> = {
      'pipeline': { id: 'honolulu-hi', name: 'Pipeline, Hawaii' },
      'mavericks': { id: 'mavericks-ca', name: 'Mavericks, CA' },
      'bondi': { id: 'sydney-au', name: 'Bondi Beach, AU' },
      'jeffreys': { id: 'port-elizabeth-za', name: 'Jeffreys Bay, SA' },
      'trestles': { id: 'san-diego-ca', name: 'Trestles, CA' },
      'mundaka': { id: 'bilbao-es', name: 'Mundaka, ES' },
      'uluwatu': { id: 'bali-id', name: 'Uluwatu, ID' },
      'bells': { id: 'melbourne-au', name: 'Bells Beach, AU' },
      'cloudbreak': { id: 'suva-fj', name: 'Cloudbreak, FJ' },
      'teahupoo': { id: 'tahiti-pf', name: 'Teahupoo, PF' }
    };

    if (spotId && stationMappings[spotId]) {
      return stationMappings[spotId];
    }

    // If we have a location name, use it directly for consistency
    if (locationName) {
      return {
        id: locationName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: locationName // Use the exact same name as the search input
      };
    }

    // Fallback to default
    return { id: 'default-station', name: 'Current Location' };
  };

  const tideStation = getTideStationForSpot(spotId, locationName);

  const tideStations = {
    today: tideStation,
    tomorrow: tideStation,
    day3: tideStation
  };

  const dateLabels = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    day3: 'Thursday'
  };

  return (
    <section id="tides" className="py-16 bg-wave-pattern bg-bottom bg-repeat-x">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ocean-dark mb-4">Live Tide Charts</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track real-time tide patterns and moon phases for {tideStation.name} to find the best times to surf. 
            Our live tide forecasts help you plan your sessions for optimal conditions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="today">{dateLabels.today}</TabsTrigger>
              <TabsTrigger value="tomorrow">{dateLabels.tomorrow}</TabsTrigger>
              <TabsTrigger value="day3">{dateLabels.day3}</TabsTrigger>
            </TabsList>
            
            {Object.entries(tideStations).map(([day, station]) => (
              <TabsContent key={day} value={day} className="mt-0">
                <RealTimeTides
                  stationId={station.id}
                  stationName={station.name}
                  days={1}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TideChart;
