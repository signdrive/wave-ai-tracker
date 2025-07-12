import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users, Waves, Star, Plane, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const TravelPackagesPage = () => {
  const [searchDestination, setSearchDestination] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock data - in real app this would come from Supabase
  const packages = [
    {
      id: '1',
      name: 'Bali Surf Adventure',
      destination: 'Bali, Indonesia',
      duration: 7,
      pricePerPerson: 1499,
      maxParticipants: 8,
      difficulty: 'intermediate',
      description: 'Experience the magic of Bali\'s world-class surf breaks with our expert guides.',
      included: ['Accommodation', 'Daily breakfast', 'Surf guide', 'Equipment', 'Airport transfers'],
      surfSpots: ['Uluwatu', 'Padang Padang', 'Balangan', 'Dreamland'],
      bestSeason: 'April - October',
      images: ['/placeholder.svg', '/placeholder.svg'],
      rating: 4.8,
      reviews: 124,
      nextDeparture: '2024-03-15'
    },
    {
      id: '2',
      name: 'Costa Rica Jungle Surf',
      destination: 'Guanacaste, Costa Rica',
      duration: 10,
      pricePerPerson: 1899,
      maxParticipants: 12,
      difficulty: 'beginner',
      description: 'Perfect for beginners! Learn to surf in warm water with consistent waves.',
      included: ['Eco-lodge accommodation', 'All meals', 'Daily lessons', 'Equipment', 'Jungle tours'],
      surfSpots: ['Tamarindo', 'Nosara', 'Santa Teresa', 'Mal País'],
      bestSeason: 'November - April',
      images: ['/placeholder.svg', '/placeholder.svg'],
      rating: 4.9,
      reviews: 89,
      nextDeparture: '2024-02-20'
    },
    {
      id: '3',
      name: 'Portugal Pro Experience',
      destination: 'Ericeira, Portugal',
      duration: 5,
      pricePerPerson: 899,
      maxParticipants: 6,
      difficulty: 'advanced',
      description: 'Tackle some of Europe\'s most challenging waves with professional coaching.',
      included: ['Boutique hotel', 'Breakfast', 'Pro coaching', 'Video analysis', 'Equipment'],
      surfSpots: ['Ribeira d\'Ilhas', 'Coxos', 'Pedra Branca', 'Praia do Norte'],
      bestSeason: 'September - March',
      images: ['/placeholder.svg', '/placeholder.svg'],
      rating: 5.0,
      reviews: 43,
      nextDeparture: '2024-02-10'
    }
  ];

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: 'short', label: '3-5 days' },
    { value: 'medium', label: '6-10 days' },
    { value: 'long', label: '11+ days' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesDestination = searchDestination === '' || 
                              pkg.destination.toLowerCase().includes(searchDestination.toLowerCase());
    const matchesDuration = selectedDuration === 'all' ||
                           (selectedDuration === 'short' && pkg.duration <= 5) ||
                           (selectedDuration === 'medium' && pkg.duration >= 6 && pkg.duration <= 10) ||
                           (selectedDuration === 'long' && pkg.duration > 10);
    const matchesDifficulty = selectedDifficulty === 'all' || pkg.difficulty === selectedDifficulty;
    return matchesDestination && matchesDuration && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Surf Travel Packages
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover the world's best surf destinations with our curated travel packages
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search destinations..."
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {durations.map(duration => (
              <SelectItem key={duration.value} value={duration.value}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={pkg.images[0]}
                alt={pkg.name}
                className="w-full h-48 object-cover"
              />
              <Badge className={`absolute top-3 left-3 ${getDifficultyColor(pkg.difficulty)}`}>
                {pkg.difficulty}
              </Badge>
              <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-sm font-medium">
                {pkg.duration} days
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{pkg.destination}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                  <span className="text-sm">{pkg.rating} ({pkg.reviews})</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {pkg.description}
              </p>
              
              <div className="space-y-3 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Surf Spots
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pkg.surfSpots.slice(0, 3).map((spot, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Waves className="w-3 h-3 mr-1" />
                        {spot}
                      </Badge>
                    ))}
                    {pkg.surfSpots.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pkg.surfSpots.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Included
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pkg.included.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {pkg.included.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pkg.included.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Max {pkg.maxParticipants} people
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Next: {new Date(pkg.nextDeparture).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    ${pkg.pricePerPerson}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">per person</span>
                </div>
                <Badge variant="outline">
                  Best: {pkg.bestSeason}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-ocean hover:bg-ocean-dark">
                      <Plane className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Book {pkg.name}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="departure-date">Preferred Departure Date</Label>
                          <Input id="departure-date" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="participants">Number of Participants</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: pkg.maxParticipants }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  {i + 1} {i === 0 ? 'person' : 'people'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">Your Surfing Experience</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                            <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                            <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Package Includes:</h4>
                        <ul className="text-sm space-y-1">
                          {pkg.included.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Cost:</span>
                          <span className="text-xl font-bold text-green-600">
                            ${pkg.pricePerPerson * 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Based on 1 participant
                        </p>
                      </div>
                      
                      <Button type="submit" className="w-full bg-ocean hover:bg-ocean-dark">
                        Request Booking
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No travel packages found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default TravelPackagesPage;