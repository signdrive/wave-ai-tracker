
import React from 'react';
import { Card } from '@/components/ui/card';
import { SurfSpot } from '@/types/surfSpots';
import { Camera, Globe, Waves, Users, TrendingUp, MapPin } from 'lucide-react';

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
  const stats = {
    total: surfSpots.length,
    liveCams: surfSpots.filter(s => s.live_cam).length,
    countries: countries.length,
    beginner: filteredSpots.filter(s => s.difficulty.toLowerCase().includes('beginner')).length,
    expert: filteredSpots.filter(s => s.difficulty.toLowerCase().includes('expert') || s.difficulty.toLowerCase().includes('advanced')).length,
    reefBreaks: filteredSpots.filter(s => s.wave_type.toLowerCase().includes('reef')).length,
    pointBreaks: filteredSpots.filter(s => s.wave_type.toLowerCase().includes('point')).length,
    beachBreaks: filteredSpots.filter(s => s.wave_type.toLowerCase().includes('beach')).length
  };

  const statCards = [
    {
      label: 'Total Spots',
      value: stats.total.toLocaleString(),
      icon: MapPin,
      color: 'text-ocean',
      bgColor: 'bg-ocean/10'
    },
    {
      label: 'Live Cams',
      value: stats.liveCams,
      icon: Camera,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Countries',
      value: stats.countries,
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Beginner Spots',
      value: stats.beginner,
      icon: Waves,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      label: 'Expert Spots',
      value: stats.expert,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: 'Reef Breaks',
      value: stats.reefBreaks,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-ocean-dark mb-4">Surf Spot Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Break Type Distribution */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-medium text-sm text-gray-600 mb-2">Break Types</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">🪨 Reef Breaks</span>
              <span className="font-medium">{stats.reefBreaks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">⛰️ Point Breaks</span>
              <span className="font-medium">{stats.pointBreaks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">🏖️ Beach Breaks</span>
              <span className="font-medium">{stats.beachBreaks}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium text-sm text-gray-600 mb-2">Difficulty Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-green-600">● Beginner</span>
              <span className="font-medium">{stats.beginner}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-yellow-600">● Intermediate</span>
              <span className="font-medium">
                {filteredSpots.filter(s => s.difficulty.toLowerCase().includes('intermediate')).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-red-600">● Expert</span>
              <span className="font-medium">{stats.expert}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium text-sm text-gray-600 mb-2">Live Monitoring</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">📹 Live Cameras</span>
              <span className="font-medium text-green-600">{stats.liveCams}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">📊 Coverage</span>
              <span className="font-medium">
                {Math.round((stats.liveCams / stats.total) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">🌍 Global Reach</span>
              <span className="font-medium">{stats.countries} countries</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SurfSpotStats;
