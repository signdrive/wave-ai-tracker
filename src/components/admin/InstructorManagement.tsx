
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { seedInstructorData, checkInstructorData } from '@/utils/instructorDataSeeder';
import { Upload, Users, CheckCircle, XCircle, MapPin, RefreshCw } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  email?: string;
  certifications: string[];
  specialties: string[];
  years_experience: number;
  hourly_rate: number;
  is_verified: boolean;
  is_available: boolean;
  data_source: string;
  created_at: string;
}

const InstructorManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);

  // Fetch all instructors
  const { data: instructors = [], isLoading } = useQuery({
    queryKey: ['all-instructors'],
    queryFn: async (): Promise<Instructor[]> => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Seed data mutation
  const seedDataMutation = useMutation({
    mutationFn: async () => {
      setIsSeeding(true);
      await seedInstructorData();
    },
    onSuccess: () => {
      toast({
        title: "Data Seeded Successfully",
        description: "Sample instructor data has been added to the database.",
      });
      queryClient.invalidateQueries({ queryKey: ['all-instructors'] });
      queryClient.invalidateQueries({ queryKey: ['nearby-instructors'] });
    },
    onError: (error) => {
      toast({
        title: "Seeding Failed",
        description: `Failed to seed data: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSeeding(false);
    }
  });

  // Toggle verification mutation
  const toggleVerificationMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase
        .from('instructors')
        .update({ is_verified: verified })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-instructors'] });
      toast({
        title: "Verification Updated",
        description: "Instructor verification status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Failed to update verification: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSeedData = () => {
    seedDataMutation.mutate();
  };

  const toggleVerification = (id: string, currentStatus: boolean) => {
    toggleVerificationMutation.mutate({ id, verified: !currentStatus });
  };

  const verifiedCount = instructors.filter(i => i.is_verified).length;
  const availableCount = instructors.filter(i => i.is_available).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Instructors</p>
                <p className="text-2xl font-bold text-blue-600">{instructors.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-ocean">{availableCount}</p>
              </div>
              <MapPin className="w-8 h-8 text-ocean" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-center">
            <Button 
              onClick={handleSeedData}
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Seed Sample Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      {instructors.length === 0 && (
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            No instructors found in the database. Click "Seed Sample Data" to add sample surf instructors for testing, 
            or connect to external instructor APIs for real data.
          </AlertDescription>
        </Alert>
      )}

      {/* Instructors List */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading instructors...</div>
          ) : (
            <div className="space-y-3">
              {instructors.map((instructor) => (
                <div key={instructor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{instructor.name}</h3>
                      <Badge variant={instructor.is_verified ? 'default' : 'secondary'}>
                        {instructor.is_verified ? 'Verified' : 'Pending'}
                      </Badge>
                      <Badge variant={instructor.is_available ? 'default' : 'outline'}>
                        {instructor.is_available ? 'Available' : 'Busy'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {instructor.data_source}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>{instructor.years_experience} years experience</span>
                        <span>${instructor.hourly_rate}/hour</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {instructor.certifications.slice(0, 3).map((cert, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                        {instructor.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={instructor.is_verified ? "destructive" : "default"}
                      onClick={() => toggleVerification(instructor.id, instructor.is_verified)}
                      disabled={toggleVerificationMutation.isPending}
                    >
                      {instructor.is_verified ? (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Unverify
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              {instructors.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No instructors in database</p>
                  <p className="text-sm">Seed sample data or import real instructor profiles</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorManagement;
