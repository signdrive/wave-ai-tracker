
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface Mentor {
  id: string;
  full_name: string;
  bio: string;
  hourly_rate: number;
  certification_level: string;
  years_experience: number;
}

interface MentorSelectionProps {
  mentors: Mentor[];
  mentorsLoading: boolean;
  spotName?: string;
  onSelectMentor: (mentor: Mentor) => void;
}

const MentorSelection: React.FC<MentorSelectionProps> = ({
  mentors,
  mentorsLoading,
  spotName,
  onSelectMentor
}) => {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Choose Your Surf Mentor
        </CardTitle>
        {spotName && (
          <p className="text-gray-600">
            Book a session at {spotName}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {mentorsLoading ? (
          <div className="text-center py-8">Loading mentors...</div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No mentors available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{mentor.full_name}</h3>
                        <Badge variant="outline">{mentor.certification_level}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${mentor.hourly_rate}/hr</p>
                        <p className="text-sm text-gray-600">{mentor.years_experience} years</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-3">{mentor.bio}</p>
                    
                    <Button 
                      className="w-full"
                      onClick={() => onSelectMentor(mentor)}
                    >
                      Select Mentor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MentorSelection;
