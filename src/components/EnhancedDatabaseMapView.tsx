import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Users, Waves, MapPin, Calendar, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseSurfSpots } from '@/hooks/useSupabaseSurfSpots';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import DatabaseSurfSpotMap from './DatabaseSurfSpotMap';
import MentorMapLayer from './MentorMapLayer';
import SafeLeafletMap from './SafeLeafletMap';
import SurfSpotInfoPanel from './SurfSpotInfoPanel';
import DatabaseMapHeader from './DatabaseMapHeader';
import DatabaseMapFilters from './DatabaseMapFilters';
import DatabaseMapStats from './DatabaseMapStats';
import InstructorManagement from './admin/InstructorManagement';
import { checkIdealConditions } from '@/lib/booking';
import { useToast } from '@/hooks/use-toast';

const EnhancedDatabaseMapView: React.FC = () => {
  const { surfSpots, rawSpots, isLoading, error } = useSupabaseSurfSpots();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<'spots' | 'mentors' | 'both'>('spots');
  const [showMentors, setShowMentors] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedRawSpot, setSelectedRawSpot] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([34.0522, -118.2437]);
  const [adminEmergencyMode, setAdminEmergencyMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Get user's location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.warn('Location access denied:', error)
      );
    }
  }, []);

  // Get unique countries and difficulties
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(rawSpots.map(spot => spot.country))].sort();
    return uniqueCountries;
  }, [rawSpots]);

  const difficulties = useMemo(() => {
    const uniqueDifficulties = [...new Set(rawSpots.map(spot => spot.difficulty))].sort();
    return uniqueDifficulties;
  }, [rawSpots]);

  // Filter spots
  const filteredSpots = useMemo(() => {
    return surfSpots.filter(spot => {
      const matchesSearch = searchTerm === '' || 
        spot.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.difficulty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = selectedCountry === 'all' || spot.country === selectedCountry;
      const matchesDifficulty = selectedDifficulty === 'all' || spot.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCountry && matchesDifficulty;
    });
  }, [surfSpots, searchTerm, selectedCountry, selectedDifficulty]);

  const handleSelectSpot = (spot: any) => {
    setSelectedSpot(spot);
    const rawSpot = rawSpots.find(raw => raw.name === spot.full_name || raw.id === parseInt(spot.id));
    setSelectedRawSpot(rawSpot);
    
    // Check wave conditions for instant booking recommendation
    if (rawSpot) {
      const conditions = checkIdealConditions({
        id: spot.id,
        name: spot.full_name,
        lat: spot.lat,
        lon: spot.lon,
        swellHeight: Math.random() * 8, // Mock swell data
        windDirection: Math.random() > 0.5 ? 'offshore' : 'onshore',
        windSpeed: Math.random() * 25,
        tideLevel: 'mid'
      });
      
      if (conditions.isIdeal) {
        toast({
          title: "🔥 Perfect Surf Conditions!",
          description: conditions.recommendation,
          duration: 5000,
        });
      }
    }
  };

  const handleSpotClick = (spotId: string) => {
    const spot = surfSpots.find(s => s.id === spotId);
    if (spot) {
      handleSelectSpot(spot);
    }
  };

  const handleBookSession = async (instructorId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a surf session.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would open a booking modal/flow
    toast({
      title: "Booking Session",
      description: `Opening booking calendar for instructor ${instructorId}...`,
    });
  };

  const handleEmergencyToggle = () => {
    setAdminEmergencyMode(!adminEmergencyMode);
    toast({
      title: adminEmergencyMode ? "Emergency Mode Disabled" : "Emergency Mode Enabled",
      description: adminEmergencyMode 
        ? "All surf spots are now accessible for booking." 
        : "All surf spots are now closed for safety.",
      variant: adminEmergencyMode ? "default" : "destructive",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading surf spots from database: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Header with Admin Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ocean-dark">Surf Mentor Pro</h1>
            <p className="text-gray-600 mt-1">
              Live wave data • Expert mentors • Instant booking
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Admin Panel
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Emergency Mode</span>
                  <Switch
                    checked={adminEmergencyMode}
                    onCheckedChange={handleEmergencyToggle}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {adminEmergencyMode && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              🚨 Emergency Mode Active: All surf spots are closed for safety reasons.
            </AlertDescription>
          </Alert>
        )}

        {/* Admin Panel */}
        {showAdminPanel && isAdmin && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Admin: Instructor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <InstructorManagement />
            </CardContent>
          </Card>
        )}

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="spots" className="flex items-center">
              <Waves className="w-4 h-4 mr-1" />
              Surf Spots
            </TabsTrigger>
            <TabsTrigger value="mentors" className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Mentors
            </TabsTrigger>
            <TabsTrigger value="both" className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Both
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search and Filters */}
      <DatabaseMapFilters
        surfSpots={surfSpots}
        searchTerm={searchTerm}
        selectedCountry={selectedCountry}
        selectedDifficulty={selectedDifficulty}
        countries={countries}
        difficulties={difficulties}
        onSearch={setSearchTerm}
        onCountryChange={setSelectedCountry}
        onDifficultyChange={setSelectedDifficulty}
        onSelectSpot={handleSelectSpot}
      />

      {/* Statistics */}
      <DatabaseMapStats
        filteredSpots={filteredSpots}
        countries={countries}
      />

      {/* Enhanced Map with SafeLeafletMap wrapper */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Surf Map + Mentors</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {filteredSpots.length} spots
                </Badge>
                {(viewMode === 'mentors' || viewMode === 'both') && (
                  <Badge className="bg-green-600">
                    <Users className="w-3 h-3 mr-1" />
                    Mentors Online
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] relative">
              <SafeLeafletMap
                center={userLocation}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
              >
                {/* Surf Spots Layer */}
                {viewMode !== 'mentors' && (
                  <DatabaseSurfSpotMap 
                    spots={filteredSpots} 
                    isLoading={isLoading}
                    onSpotClick={handleSpotClick}
                    selectedSpotId={selectedSpot?.id}
                  />
                )}
                
                {/* Mentor Layer */}
                {(viewMode === 'mentors' || viewMode === 'both') && (
                  <MentorMapLayer
                    visible={true}
                    onBookSession={handleBookSession}
                    userLocation={userLocation}
                    radius={50}
                  />
                )}
              </SafeLeafletMap>
            </div>
          </CardContent>
        </Card>

        {/* Information Panel */}
        <SurfSpotInfoPanel 
          selectedSpot={selectedSpot}
          rawSpotData={selectedRawSpot}
        />
      </div>
    </div>
  );
};

export default EnhancedDatabaseMapView;
