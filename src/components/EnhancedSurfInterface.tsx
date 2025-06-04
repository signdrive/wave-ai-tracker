
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SurfCamDisplay from './SurfCamDisplay';
import SurfSpotMap from './SurfSpotMap';
import MLWavePredictions from './MLWavePredictions';
import RealAROverlaySystem from './RealAROverlaySystem';
import PersonalSurfCoach from './PersonalSurfCoach';
import ComplianceAuditDashboard from './ComplianceAuditDashboard';

const EnhancedSurfInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('surf-cams');

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="surf-cams">Live Cams</TabsTrigger>
          <TabsTrigger value="forecasts">AI Forecasts</TabsTrigger>
          <TabsTrigger value="map">Spot Map</TabsTrigger>
          <TabsTrigger value="ar-overlay">AR Vision</TabsTrigger>
          <TabsTrigger value="surf-coach">AI Coach</TabsTrigger>
          <TabsTrigger value="compliance">Audit</TabsTrigger>
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
          <RealAROverlaySystem />
        </TabsContent>

        <TabsContent value="surf-coach">
          <PersonalSurfCoach />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceAuditDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSurfInterface;
