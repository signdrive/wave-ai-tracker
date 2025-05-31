
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, Users, CheckCircle, XCircle, MapPin, RefreshCw } from 'lucide-react';

interface MockInstructor {
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

// Mock data for demonstration until database is set up
const MOCK_INSTRUCTORS: MockInstructor[] = [
  {
    id: 'isa_001',
    name: 'Jake Morrison',
    email: 'jake.morrison@surfpro.com',
    certifications: ['ISA Level 2', 'Lifeguard Certified', 'First Aid'],
    specialties: ['Beginner Lessons', 'Group Sessions', 'Ocean Safety'],
    years_experience: 15,
    hourly_rate: 120,
    is_verified: true,
    is_available: true,
    data_source: 'isa',
    created_at: new Date().toISOString()
  },
  {
    id: 'vdws_002',
    name: 'Sarah Chen',
    email: 'sarah.chen@malibusurf.com',
    certifications: ['VDWS Instructor', 'WSI Certified', 'CPR/AED'],
    specialties: ['Longboard', 'Classic Style', 'Photography'],
    years_experience: 12,
    hourly_rate: 140,
    is_verified: true,
    is_available: true,
    data_source: 'vdws',
    created_at: new Date().toISOString()
  },
  {
    id: 'pro_003',
    name: 'Marcus "Barrel" Rodriguez',
    email: 'marcus@huntingtonsurf.com',
    certifications: ['Professional Surfer', 'Surf Coach', 'Water Safety'],
    specialties: ['Advanced Techniques', 'Competition Prep', 'Video Analysis'],
    years_experience: 22,
    hourly_rate: 200,
    is_verified: true,
    is_available: false,
    data_source: 'manual',
    created_at: new Date().toISOString()
  }
];

const InstructorManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);
  const [mockInstructors, setMockInstructors] = useState<MockInstructor[]>(MOCK_INSTRUCTORS);

  // For now, use mock data until database is properly set up
  const { data: instructors = mockInstructors, isLoading } = useQuery({
    queryKey: ['all-instructors'],
    queryFn: async (): Promise<MockInstructor[]> => {
      // Try to fetch from database, but fall back to mock data
      try {
        // This will fail until the table exists, so we catch and use mock data
        const { data, error } = await supabase
          .from('instructors' as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Database not ready, using mock data:', error.message);
          return mockInstructors;
        }
        
        return data || mockInstructors;
      } catch (error) {
        console.log('Using mock instructor data');
        return mockInstructors;
      }
    }
  });

  // Mock seed data function
  const seedDataMutation = useMutation({
    mutationFn: async () => {
      setIsSeeding(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just add more mock data
      const newMockData = [
        ...MOCK_INSTRUCTORS,
        {
          id: 'local_004',
          name: 'Luna Waves',
          email: 'luna@venicebeachsurf.com',
          certifications: ['ISA Level 1', 'Youth Instructor', 'Ocean Rescue'],
          specialties: ['Kids Classes', 'Family Lessons', 'SUP'],
          years_experience: 8,
          hourly_rate: 95,
          is_verified: false,
          is_available: true,
          data_source: 'manual',
          created_at: new Date().toISOString()
        }
      ];
      
      setMockInstructors(newMockData);
      return newMockData;
    },
    onSuccess: () => {
      toast({
        title: "Mock Data Added",
        description: "Sample instructor data has been generated (database setup required for real persistence).",
      });
      queryClient.invalidateQueries({ queryKey: ['all-instructors'] });
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

  // Mock verification toggle
  const toggleVerificationMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      // Update mock data
      const updatedInstructors = mockInstructors.map(instructor => 
        instructor.id === id ? { ...instructor, is_verified: verified } : instructor
      );
      setMockInstructors(updatedInstructors);
      return updatedInstructors;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-instructors'] });
      toast({
        title: "Verification Updated",
        description: "Instructor verification status has been updated (mock data).",
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
              Add Mock Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Alert>
        <Upload className="h-4 w-4" />
        <AlertDescription>
          Currently showing mock instructor data. Complete the database setup to enable real instructor management and persistence.
        </AlertDescription>
      </Alert>

      {/* Instructors List */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor Directory (Mock Data)</CardTitle>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorManagement;
