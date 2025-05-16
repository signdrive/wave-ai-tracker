
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SurfCondition {
  location: string;
  waveHeight: number;
  period: number;
  crowdLevel: number;
  setsPerHour: number;
  imageSrc: string;
}

const SurfCamDisplay: React.FC = () => {
  const [progress, setProgress] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState<string>("pipeline");
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  const surfLocations: Record<string, SurfCondition> = {
    "pipeline": {
      location: "Pipeline, Oahu",
      waveHeight: 6.5,
      period: 12,
      crowdLevel: 75,
      setsPerHour: 8,
      imageSrc: "https://images.unsplash.com/photo-1535682215715-c31b9db51592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "mavericks": {
      location: "Mavericks, California",
      waveHeight: 12.0,
      period: 18,
      crowdLevel: 40,
      setsPerHour: 4,
      imageSrc: "https://images.unsplash.com/photo-1565142453412-4e95c3ff81b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "snapper": {
      location: "Snapper Rocks, Australia",
      waveHeight: 4.5,
      period: 9,
      crowdLevel: 90,
      setsPerHour: 12,
      imageSrc: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1173&q=80"
    },
    "jeffreys": {
      location: "Jeffreys Bay, South Africa",
      waveHeight: 5.0,
      period: 11,
      crowdLevel: 60,
      setsPerHour: 10,
      imageSrc: "https://images.unsplash.com/photo-1626450787667-830beef2d6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
  };
  
  const currentSpot = surfLocations[selectedLocation];

  const getCrowdLevelText = (level: number) => {
    if (level < 30) return "Low";
    if (level < 70) return "Moderate";
    return "High";
  };

  return (
    <section id="surf-cams" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ocean-dark mb-4">Live Surf Cams</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Check real-time conditions at top surf spots around the world with AI-powered analytics. 
            Track wave consistency, crowd levels, and get instant alerts for optimal surf conditions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="pipeline" onValueChange={setSelectedLocation}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="mavericks">Mavericks</TabsTrigger>
              <TabsTrigger value="snapper">Snapper Rocks</TabsTrigger>
              <TabsTrigger value="jeffreys">Jeffreys Bay</TabsTrigger>
            </TabsList>

            {Object.keys(surfLocations).map((key) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Surf Cam Video */}
                  <div className="md:col-span-2">
                    <Card>
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={surfLocations[key].imageSrc} 
                          alt={surfLocations[key].location} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Live
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                          12:42 PM Local
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                          <h3 className="font-bold text-lg">{surfLocations[key].location}</h3>
                          <p className="text-sm opacity-90">Powered by AI Wave Detection</p>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Wave Height</p>
                            <p className="font-semibold text-lg">{surfLocations[key].waveHeight}ft</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Period</p>
                            <p className="font-semibold text-lg">{surfLocations[key].period}s</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Sets Per Hour</p>
                            <p className="font-semibold text-lg">{surfLocations[key].setsPerHour}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Wind</p>
                            <p className="font-semibold text-lg">5mph Offshore</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Analysis */}
                  <div>
                    <Card className="h-full flex flex-col">
                      <CardHeader>
                        <CardTitle>AI Wave Analysis</CardTitle>
                        <CardDescription>
                          Real-time conditions detected by our AI
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 flex-grow">
                        {/* Crowd Level */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Crowd Level</label>
                            <span className="text-sm text-gray-500">
                              {getCrowdLevelText(surfLocations[key].crowdLevel)}
                            </span>
                          </div>
                          <Progress value={surfLocations[key].crowdLevel} className="h-2" />
                        </div>

                        {/* Wave Consistency */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Wave Consistency</label>
                            <span className="text-sm text-gray-500">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="space-y-3 mt-4">
                          <div className="bg-sand/50 p-3 rounded-md">
                            <p className="text-sm font-medium text-ocean-dark">Wave Pattern</p>
                            <p className="text-sm text-gray-600">Sets of 5-6 waves every 12 minutes</p>
                          </div>

                          <div className="bg-sand/50 p-3 rounded-md">
                            <p className="text-sm font-medium text-ocean-dark">AI Prediction</p>
                            <p className="text-sm text-gray-600">Conditions improving over next 3 hours</p>
                          </div>

                          <div className="bg-sand/50 p-3 rounded-md">
                            <p className="text-sm font-medium text-ocean-dark">Best Spot</p>
                            <p className="text-sm text-gray-600">North end breaking best on incoming tide</p>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button className="w-full bg-ocean hover:bg-ocean-dark">
                          Set Alert for Perfect Conditions
                        </Button>
                      </CardFooter>
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

// Importing Button from UI components for use in the component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }> = ({ 
  children, 
  className = "", 
  variant = "default", 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default SurfCamDisplay;
