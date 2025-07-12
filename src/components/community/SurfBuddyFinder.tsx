import React, { useState } from 'react';
import { UserPlus, MapPin, Star, Clock, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SurfBuddyFinder: React.FC = () => {
  const [filters, setFilters] = useState({
    location: '',
    skillLevel: '',
    availability: ''
  });

  const mockSurfers = [
    {
      id: 1,
      name: "Alex Rivera",
      location: "Santa Monica, CA",
      skillLevel: "Intermediate",
      yearsExperience: 5,
      favoriteSpots: ["Malibu", "Manhattan Beach", "El Segundo"],
      availability: "Weekends",
      bio: "Love dawn patrol sessions and always looking for new surf buddies!",
      rating: 4.8,
      sessionsShared: 23
    },
    {
      id: 2,
      name: "Emma Chen",
      location: "Huntington Beach, CA",
      skillLevel: "Advanced",
      yearsExperience: 8,
      favoriteSpots: ["The Wedge", "Huntington Pier", "Bolsa Chica"],
      availability: "Mornings",
      bio: "Experienced surfer, happy to mentor beginners or surf with anyone!",
      rating: 4.9,
      sessionsShared: 45
    },
    {
      id: 3,
      name: "Jake Thompson",
      location: "Venice, CA",
      skillLevel: "Beginner",
      yearsExperience: 1,
      favoriteSpots: ["Venice Beach", "Santa Monica"],
      availability: "Flexible",
      bio: "New to surfing and eager to learn with patient surf buddies.",
      rating: 4.5,
      sessionsShared: 8
    }
  ];

  const [selectedSurfer, setSelectedSurfer] = useState<any>(null);
  const [message, setMessage] = useState('');

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleSendRequest = () => {
    // In real app, this would send a buddy request
    console.log('Sending buddy request to:', selectedSurfer?.name, 'with message:', message);
    setSelectedSurfer(null);
    setMessage('');
    // Show success toast
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Find Surf Buddies</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with surfers of similar skill levels and find your perfect surf partner
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Surfers</CardTitle>
          <CardDescription>Find surfers that match your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input 
                placeholder="Enter city or beach name"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Skill Level</label>
              <Select value={filters.skillLevel} onValueChange={(value) => setFilters({...filters, skillLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="mornings">Mornings</SelectItem>
                  <SelectItem value="afternoons">Afternoons</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surfer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSurfers.map((surfer) => (
          <Card key={surfer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://images.unsplash.com/photo-${1500000000000 + surfer.id * 1000000}?w=100&h=100&fit=crop&crop=face`} />
                  <AvatarFallback>{surfer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{surfer.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {surfer.location}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getSkillColor(surfer.skillLevel)}>
                  {surfer.skillLevel}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {surfer.rating}
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Experience:</strong> {surfer.yearsExperience} years</p>
                <p><strong>Availability:</strong> {surfer.availability}</p>
                <p><strong>Sessions shared:</strong> {surfer.sessionsShared}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Favorite Spots:</p>
                <div className="flex flex-wrap gap-1">
                  {surfer.favoriteSpots.slice(0, 2).map((spot, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spot}
                    </Badge>
                  ))}
                  {surfer.favoriteSpots.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{surfer.favoriteSpots.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">{surfer.bio}</p>

              <Dialog open={selectedSurfer?.id === surfer.id} onOpenChange={(open) => !open && setSelectedSurfer(null)}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedSurfer(surfer)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Send Buddy Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Buddy Request to {surfer.name}</DialogTitle>
                    <DialogDescription>
                      Introduce yourself and suggest when you'd like to surf together
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Hey! I'd love to surf together sometime. I usually hit the waves early morning on weekends..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                    
                    <div className="flex gap-2">
                      <Button onClick={handleSendRequest} className="flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Send Request
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedSurfer(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SurfBuddyFinder;