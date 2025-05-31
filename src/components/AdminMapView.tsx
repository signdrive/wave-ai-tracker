
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Users, Activity, MapPin } from 'lucide-react';
import DatabaseSurfSpotMap from './DatabaseSurfSpotMap';
import { useToast } from '@/hooks/use-toast';

interface ActiveSession {
  id: string;
  mentor_name: string;
  student_name: string;
  spot_name: string;
  scheduled_at: string;
  status: string;
  lat: number;
  lon: number;
}

const AdminMapView: React.FC = () => {
  const { toast } = useToast();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [closedSpots, setClosedSpots] = useState<Set<string>>(new Set());

  // Get active sessions
  const { data: activeSessions = [], isLoading } = useQuery({
    queryKey: ['admin-active-sessions'],
    queryFn: async (): Promise<ActiveSession[]> => {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select(`
          id,
          scheduled_at,
          status,
          spot_id,
          profiles!mentorship_sessions_mentor_id_fkey(full_name),
          profiles!mentorship_sessions_student_id_fkey(full_name)
        `)
        .in('status', ['pending', 'confirmed', 'in_progress'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Mock location data for demo
      return data?.map(session => ({
        id: session.id,
        mentor_name: (session.profiles as any)?.full_name || 'Unknown Mentor',
        student_name: (session.profiles as any)?.full_name || 'Unknown Student',
        spot_name: session.spot_id,
        scheduled_at: session.scheduled_at,
        status: session.status,
        lat: 34.0522 + (Math.random() - 0.5) * 0.2,
        lon: -118.2437 + (Math.random() - 0.5) * 0.2,
      })) || [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleEmergencyToggle = () => {
    setEmergencyMode(!emergencyMode);
    toast({
      title: emergencyMode ? "Emergency Mode Disabled" : "🚨 Emergency Mode Activated",
      description: emergencyMode 
        ? "All systems restored to normal operation." 
        : "All active sessions will be notified. New bookings suspended.",
      variant: emergencyMode ? "default" : "destructive",
    });
  };

  const handleSpotClosure = (spotId: string) => {
    const newClosedSpots = new Set(closedSpots);
    if (newClosedSpots.has(spotId)) {
      newClosedSpots.delete(spotId);
      toast({
        title: "Spot Reopened",
        description: `${spotId} is now available for booking.`,
      });
    } else {
      newClosedSpots.add(spotId);
      toast({
        title: "Spot Closed",
        description: `${spotId} has been closed for safety.`,
        variant: "destructive",
      });
    }
    setClosedSpots(newClosedSpots);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-red-600">🚨 Admin Control Center</h1>
            <p className="text-gray-600 mt-1">
              Live session monitoring • Emergency controls • Safety management
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Emergency Mode</span>
              <Switch
                checked={emergencyMode}
                onCheckedChange={handleEmergencyToggle}
              />
            </div>
          </div>
        </div>

        {emergencyMode && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              🚨 EMERGENCY MODE ACTIVE: All new bookings suspended. Active sessions notified.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-green-600">{activeSessions.length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Closed Spots</p>
                <p className="text-2xl font-bold text-red-600">{closedSpots.size}</p>
              </div>
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mentors Online</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergency Level</p>
                <p className="text-2xl font-bold text-orange-600">
                  {emergencyMode ? 'HIGH' : 'NORMAL'}
                </p>
              </div>
              <AlertTriangle className={`w-8 h-8 ${emergencyMode ? 'text-red-600' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Sessions Map */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🗺️ Live Session Monitoring</span>
            <Badge variant={emergencyMode ? 'destructive' : 'default'}>
              {activeSessions.length} Active Sessions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px]">
            <DatabaseSurfSpotMap 
              spots={[]} 
              isLoading={isLoading}
              onSpotClick={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge variant={session.status === 'in_progress' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                    <span className="font-medium">{session.mentor_name}</span>
                    <span className="text-gray-500">teaching</span>
                    <span className="font-medium">{session.student_name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {session.spot_name} • {new Date(session.scheduled_at).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={closedSpots.has(session.spot_name) ? "default" : "destructive"}
                    onClick={() => handleSpotClosure(session.spot_name)}
                  >
                    {closedSpots.has(session.spot_name) ? 'Reopen Spot' : 'Close Spot'}
                  </Button>
                </div>
              </div>
            ))}
            
            {activeSessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No active sessions at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMapView;
