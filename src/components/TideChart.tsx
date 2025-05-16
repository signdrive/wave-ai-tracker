
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TideData {
  time: string;
  height: number;
  type?: string;
}

interface MoonPhase {
  phase: string;
  illumination: number;
  image: string;
}

const TideChart: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('today');

  // Sample tide data
  const tideData: Record<string, TideData[]> = {
    today: [
      { time: '12AM', height: 1.2 },
      { time: '3AM', height: 0.5, type: 'Low' },
      { time: '6AM', height: 1.8 },
      { time: '9AM', height: 3.2, type: 'High' },
      { time: '12PM', height: 2.5 },
      { time: '3PM', height: 1.0, type: 'Low' },
      { time: '6PM', height: 2.8, type: 'High' },
      { time: '9PM', height: 2.0 },
      { time: '12AM', height: 1.1 }
    ],
    tomorrow: [
      { time: '12AM', height: 1.1 },
      { time: '3AM', height: 0.3, type: 'Low' },
      { time: '6AM', height: 1.5 },
      { time: '9AM', height: 3.5, type: 'High' },
      { time: '12PM', height: 2.8 },
      { time: '3PM', height: 1.2, type: 'Low' },
      { time: '6PM', height: 3.0, type: 'High' },
      { time: '9PM', height: 2.2 },
      { time: '12AM', height: 1.3 }
    ],
    day3: [
      { time: '12AM', height: 1.3 },
      { time: '3AM', height: 0.4, type: 'Low' },
      { time: '6AM', height: 1.6 },
      { time: '9AM', height: 3.3, type: 'High' },
      { time: '12PM', height: 2.6 },
      { time: '3PM', height: 1.1, type: 'Low' },
      { time: '6PM', height: 2.9, type: 'High' },
      { time: '9PM', height: 2.1 },
      { time: '12AM', height: 1.2 }
    ]
  };

  const moonPhases: Record<string, MoonPhase> = {
    today: { 
      phase: 'Waxing Gibbous', 
      illumination: 78,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23e0e0e0' stroke='%23000' stroke-width='1'/%3E%3Cpath d='M50 5 A45 45 0 0 1 50 95 A45 45 0 0 0 50 5' fill='%23333'/%3E%3C/svg%3E"
    },
    tomorrow: { 
      phase: 'Full Moon', 
      illumination: 99,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23f5f5f5' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E"
    },
    day3: { 
      phase: 'Waning Gibbous', 
      illumination: 95,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23e0e0e0' stroke='%23000' stroke-width='1'/%3E%3Cpath d='M50 5 A45 45 0 0 0 50 95 A45 45 0 0 1 50 5' fill='%23333'/%3E%3C/svg%3E"
    }
  };

  const dateLabels = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    day3: 'Thursday'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="text-sm font-medium">{`${label}: ${payload[0].value}ft`}</p>
          {payload[0].payload.type && (
            <p className="text-xs text-ocean">{payload[0].payload.type} Tide</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="tides" className="py-16 bg-wave-pattern bg-bottom bg-repeat-x">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ocean-dark mb-4">Tide Charts</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track tide patterns and moon phases to find the best times to surf. 
            Our precision tide forecasts help you plan your sessions for optimal conditions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="today" onValueChange={setSelectedDay}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="today">{dateLabels.today}</TabsTrigger>
              <TabsTrigger value="tomorrow">{dateLabels.tomorrow}</TabsTrigger>
              <TabsTrigger value="day3">{dateLabels.day3}</TabsTrigger>
            </TabsList>
            
            {Object.keys(tideData).map((day) => (
              <TabsContent key={day} value={day} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Tide Chart */}
                  <div className="md:col-span-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tide Chart for {dateLabels[day as keyof typeof dateLabels]}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={tideData[day]}
                              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                            >
                              <defs>
                                <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#0077B6" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                              <XAxis 
                                dataKey="time" 
                                tick={{ fontSize: 12 }} 
                              />
                              <YAxis 
                                tick={{ fontSize: 12 }}
                                label={{ 
                                  value: 'Height (ft)', 
                                  angle: -90, 
                                  position: 'insideLeft',
                                  style: { textAnchor: 'middle', fontSize: 12 }
                                }} 
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area 
                                type="monotone" 
                                dataKey="height" 
                                stroke="#0077B6" 
                                fillOpacity={1} 
                                fill="url(#colorTide)" 
                                activeDot={{ r: 6 }}
                              />
                              {tideData[day].map((entry, index) => (
                                entry.type && (
                                  <text
                                    key={index}
                                    x={index * 100 / (tideData[day].length - 1) + '%'}
                                    y={entry.type === 'High' ? '15%' : '85%'}
                                    textAnchor="middle"
                                    fill="#0077B6"
                                    fontSize={12}
                                  >
                                    {entry.type}
                                  </text>
                                )
                              ))}
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="bg-ocean/10 p-3 rounded-md">
                            <p className="text-sm font-medium">High Tides</p>
                            <p className="text-sm text-gray-600">9:00 AM (3.2ft), 6:00 PM (2.8ft)</p>
                          </div>

                          <div className="bg-ocean/10 p-3 rounded-md">
                            <p className="text-sm font-medium">Low Tides</p>
                            <p className="text-sm text-gray-600">3:00 AM (0.5ft), 3:00 PM (1.0ft)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Moon Phase */}
                  <div>
                    <Card className="h-full flex flex-col">
                      <CardHeader>
                        <CardTitle>Moon Phase</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
                        <div className="w-32 h-32">
                          <img 
                            src={moonPhases[day].image} 
                            alt={moonPhases[day].phase}
                            className="w-full h-full"
                          />
                        </div>
                        
                        <div className="text-center">
                          <p className="font-medium text-lg">{moonPhases[day].phase}</p>
                          <p className="text-sm text-gray-600">{moonPhases[day].illumination}% Illumination</p>
                        </div>

                        <div className="mt-4 bg-sand/50 p-3 rounded-md w-full text-center">
                          <p className="text-sm text-gray-600">
                            {moonPhases[day].phase === 'Full Moon' 
                              ? 'Stronger gravitational pull causes higher tide variations today'
                              : 'Moderate gravitational effects on tides'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TideChart;
