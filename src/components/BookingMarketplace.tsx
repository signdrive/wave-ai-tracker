
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Star, DollarSign, Bike, Camera } from 'lucide-react';

interface BookingMarketplaceProps {
  spotId: string;
  spotName: string;
}

const BookingMarketplace: React.FC<BookingMarketplaceProps> = ({ spotId, spotName }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const surfLessons = [
    {
      id: '1',
      instructor: 'Jake "Big Wave" Williams',
      rating: 4.9,
      price: 89,
      duration: '2 hours',
      type: 'Beginner Group',
      maxStudents: 6,
      nextSlot: '9:00 AM',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      instructor: 'Maria Gonzalez',
      rating: 4.8,
      price: 149,
      duration: '1.5 hours',
      type: 'Private Advanced',
      maxStudents: 1,
      nextSlot: '11:30 AM',
      image: '/placeholder.svg'
    }
  ];

  const equipmentRentals = [
    {
      id: '1',
      item: 'Performance Shortboard',
      brand: 'Lost Surfboards',
      size: '6\'2"',
      price: 45,
      period: 'Full Day',
      rating: 4.7,
      available: true
    },
    {
      id: '2',
      item: '4/3 Wetsuit',
      brand: 'Patagonia',
      size: 'Medium',
      price: 25,
      period: 'Full Day',
      rating: 4.8,
      available: true
    }
  ];

  const experiences = [
    {
      id: '1',
      title: 'Surf + Coastal Bike Tour',
      description: '3-hour surf session + 2-hour scenic bike ride',
      price: 129,
      duration: '5 hours',
      rating: 4.9,
      nextAvailable: '2:00 PM',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Professional Surf Photography',
      description: 'Capture your best waves with pro photographer',
      price: 199,
      duration: '2 hours',
      rating: 5.0,
      nextAvailable: '8:00 AM',
      image: '/placeholder.svg'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-500" />
          Surf Marketplace - {spotName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons">Surf Lessons</TabsTrigger>
            <TabsTrigger value="rentals">Equipment</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border rounded-md"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {surfLessons.map((lesson) => (
              <Card key={lesson.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{lesson.instructor}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{lesson.rating}</span>
                      <Badge variant="outline">{lesson.type}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${lesson.price}</div>
                    <div className="text-sm text-gray-500">{lesson.duration}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Next: {lesson.nextSlot}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Max: {lesson.maxStudents} students
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Book Lesson - ${lesson.price}
                </Button>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rentals" className="space-y-4">
            {equipmentRentals.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{item.item}</h3>
                    <p className="text-sm text-gray-600">{item.brand} - {item.size}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{item.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${item.price}</div>
                    <div className="text-sm text-gray-500">{item.period}</div>
                    <Badge className="mt-1 bg-green-100 text-green-800">Available</Badge>
                  </div>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Rent Now - ${item.price}
                </Button>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="experiences" className="space-y-4">
            {experiences.map((exp) => (
              <Card key={exp.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{exp.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{exp.rating}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" />
                        {exp.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-purple-600">${exp.price}</div>
                    <div className="text-sm text-gray-500">Next: {exp.nextAvailable}</div>
                  </div>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Book Experience - ${exp.price}
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingMarketplace;
