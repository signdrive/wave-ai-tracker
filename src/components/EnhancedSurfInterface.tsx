
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SurfCamDisplay from './SurfCamDisplay';
import SurfSpotMap from './SurfSpotMap';
import MLWavePredictions from './MLWavePredictions';
import RealAROverlaySystem from './RealAROverlaySystem';
import PersonalSurfCoach from './PersonalSurfCoach';
import ComplianceStatusDashboard from './ComplianceStatusDashboard';

const EnhancedSurfInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('surf-cams');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sample wave data for AR overlay
  const waveData = {
    height: 4.2,
    period: 12.5,
    direction: 225
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="surf-cams">Live Cams</TabsTrigger>
          <TabsTrigger value="forecasts">AI Forecasts</TabsTrigger>
          <TabsTrigger value="map">Spot Map</TabsTrigger>
          <TabsTrigger value="ar-overlay">AR Zone</TabsTrigger>
          <TabsTrigger value="surf-coach">AI Instructor</TabsTrigger>
          <TabsTrigger value="compliance">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="surf-cams">
          <SurfCamDisplay />
        </TabsContent>

        <TabsContent value="forecasts">
          <div className="space-y-6">
            <MLWavePredictions
              spotId="pipeline"
              spotName="Pipeline, Hawaii"
              currentConditions={{
                waveHeight: 6.5,
                period: 14,
                windSpeed: 8,
                windDirection: 225,
                tideLevel: 0.3,
                swellDirection: 315,
                temperature: 26
              }}
              spotPreferences={{
                idealWaveHeight: [6, 12],
                idealPeriod: [12, 16],
                idealWindSpeed: 10,
                bestTide: 'mid'
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="map">
          <SurfSpotMap />
        </TabsContent>

        <TabsContent value="ar-overlay">
          <RealAROverlaySystem videoRef={videoRef} waveData={waveData} />
        </TabsContent>

        <TabsContent value="surf-coach">
          <PersonalSurfCoach />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceStatusDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSurfInterface;
