
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';
import { UserProfile } from '@/types/mentorship';

const MentorFinder: React.FC = () => {
  const { mentors, mentorsLoading } = useMentorship();
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [rateFilter, setRateFilter] = useState('all');

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = 
      mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.certification_level?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExperience = experienceFilter === 'all' || 
      (experienceFilter === 'beginner' && (mentor.years_experience || 0) < 2) ||
      (experienceFilter === 'intermediate' && (mentor.years_experience || 0) >= 2 && (mentor.years_experience || 0) < 5) ||
      (experienceFilter === 'expert' && (mentor.years_experience || 0) >= 5);

    const matchesRate = rateFilter === 'all' ||
      (rateFilter === 'budget' && (mentor.hourly_rate || 0) < 50) ||
      (rateFilter === 'standard' && (mentor.hourly_rate || 0) >= 50 && (mentor.hourly_rate || 0) < 100) ||
      (rateFilter === 'premium' && (mentor.hourly_rate || 0) >= 100);

    return matchesSearch && matchesExperience && matchesRate;
  });

  if (mentorsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading mentors...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Find Your Perfect Surf Mentor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by name, bio, or certification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All experience levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience Levels</SelectItem>
                  <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                  <SelectItem value="expert">Expert (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <Select value={rateFilter} onValueChange={setRateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All price ranges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Price Ranges</SelectItem>
                  <SelectItem value="budget">Budget (&lt; $50/hr)</SelectItem>
                  <SelectItem value="standard">Standard ($50-100/hr)</SelectItem>
                  <SelectItem value="premium">Premium ($100+/hr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No mentors found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))
        )}
      </div>
    </div>
  );
};

interface MentorCardProps {
  mentor: UserProfile;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{mentor.full_name || 'Mentor'}</h3>
            {mentor.certification_level && (
              <Badge className="mt-1 bg-blue-500">
                {mentor.certification_level}
              </Badge>
            )}
          </div>
          {mentor.hourly_rate && (
            <div className="text-right">
              <div className="flex items-center text-green-600 font-semibold">
                <DollarSign className="w-4 h-4" />
                {mentor.hourly_rate}/hr
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          {mentor.years_experience && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {mentor.years_experience} years
            </div>
          )}
          {mentor.timezone && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {mentor.timezone}
            </div>
          )}
        </div>

        {mentor.bio && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {mentor.bio}
          </p>
        )}

        <div className="flex justify-between items-center pt-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-500 ml-1">(23 reviews)</span>
          </div>
          
          <Button size="sm" className="bg-ocean hover:bg-ocean-dark">
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorFinder;
