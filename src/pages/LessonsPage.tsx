import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, MapPin, Calendar, Clock, Users, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const LessonsPage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedRate, setSelectedRate] = useState('all');

  // Mock data - in real app this would come from Supabase
  const instructors = [
    {
      id: '1',
      name: 'Kelly Martinez',
      bio: 'Former pro surfer with 15 years teaching experience. Specializes in wave reading and technique improvement.',
      experience: 15,
      rating: 4.9,
      totalReviews: 127,
      hourlyRate: 85,
      location: 'Malibu, CA',
      specialties: ['Beginner', 'Intermediate', 'Wave Reading'],
      certifications: ['ISA Level 2', 'Water Safety'],
      languages: ['English', 'Spanish'],
      avatar: '/placeholder.svg',
      nextAvailable: '2024-01-20',
      isVerified: true
    },
    {
      id: '2',
      name: 'Marcus Thompson',
      bio: 'Surfboard shaper and instructor focused on helping beginners find their confidence in the water.',
      experience: 8,
      rating: 4.8,
      totalReviews: 93,
      hourlyRate: 65,
      location: 'Santa Monica, CA',
      specialties: ['Beginner', 'Board Selection', 'Safety'],
      certifications: ['Red Cross Lifeguard', 'ISA Level 1'],
      languages: ['English'],
      avatar: '/placeholder.svg',
      nextAvailable: '2024-01-18',
      isVerified: true
    },
    {
      id: '3',
      name: 'Sofia Rodriguez',
      bio: 'Competition coach and technique specialist. Perfect for surfers looking to take their skills to the next level.',
      experience: 12,
      rating: 5.0,
      totalReviews: 76,
      hourlyRate: 120,
      location: 'Huntington Beach, CA',
      specialties: ['Advanced', 'Competition', 'Technique'],
      certifications: ['ISA Level 3', 'Surf Coach Certification'],
      languages: ['English', 'Spanish', 'Portuguese'],
      avatar: '/placeholder.svg',
      nextAvailable: '2024-01-22',
      isVerified: true
    }
  ];

  const experienceLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner Friendly' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const rateRanges = [
    { value: 'all', label: 'All Rates' },
    { value: 'budget', label: 'Under $70/hr' },
    { value: 'standard', label: '$70-100/hr' },
    { value: 'premium', label: '$100+/hr' }
  ];

  const filteredInstructors = instructors.filter(instructor => {
    const matchesLocation = searchLocation === '' || 
                           instructor.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesExperience = selectedExperience === 'all' || 
                             instructor.specialties.some(s => s.toLowerCase().includes(selectedExperience));
    const matchesRate = selectedRate === 'all' ||
                       (selectedRate === 'budget' && instructor.hourlyRate < 70) ||
                       (selectedRate === 'standard' && instructor.hourlyRate >= 70 && instructor.hourlyRate <= 100) ||
                       (selectedRate === 'premium' && instructor.hourlyRate > 100);
    return matchesLocation && matchesExperience && matchesRate;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Surf Lessons & Instructors
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Learn from certified surf instructors and take your surfing to the next level
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map(level => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedRate} onValueChange={setSelectedRate}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rateRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInstructors.map((instructor) => (
          <Card key={instructor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={instructor.avatar} alt={instructor.name} />
                  <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl">{instructor.name}</CardTitle>
                    {instructor.isVerified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Award className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                      {instructor.rating} ({instructor.totalReviews} reviews)
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {instructor.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ${instructor.hourlyRate}/hr
                    </span>
                    <span className="text-sm text-gray-500">
                      {instructor.experience} years experience
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {instructor.bio}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Specialties
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {instructor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Languages
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {instructor.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Next available: {new Date(instructor.nextAvailable).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-ocean hover:bg-ocean-dark">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Lesson
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Lesson with {instructor.name}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lesson-date">Preferred Date</Label>
                          <Input id="lesson-date" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="lesson-time">Preferred Time</Label>
                          <Input id="lesson-time" type="time" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lesson-type">Lesson Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private (1-on-1)</SelectItem>
                              <SelectItem value="semi-private">Semi-Private (2 people)</SelectItem>
                              <SelectItem value="group">Group (3-4 people)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="3">3 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="requests">Special Requests</Label>
                        <Textarea 
                          id="requests" 
                          placeholder="Let the instructor know about your experience level, goals, or any special requirements..." 
                          rows={3} 
                        />
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Estimated Total:</span>
                          <span className="text-xl font-bold text-green-600">
                            ${instructor.hourlyRate * 2}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Based on 2-hour private lesson
                        </p>
                      </div>
                      
                      <Button type="submit" className="w-full bg-ocean hover:bg-ocean-dark">
                        Request Booking
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No instructors found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonsPage;