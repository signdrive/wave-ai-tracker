
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RealTimeTides from './RealTimeTides';
import { useRealTimeUpdates } from '@/hooks/useRealTimeData';

const TideChart: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('today');
  
  // Set up real-time updates
  useRealTimeUpdates();

  const tideStations = {
    today: { id: 'station-1', name: 'Current Location' },
    tomorrow: { id: 'station-1', name: 'Current Location' },
    day3: { id: 'station-1', name: 'Current Location' }
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
            Track real-time tide patterns and moon phases to find the best times to surf. 
            Our live tide forecasts help you plan your sessions for optimal conditions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="today" onValueChange={setSelectedDay}>
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
