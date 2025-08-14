import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Quote, User, Hammer, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';

interface CommunityVoice {
  type: 'female_surfer' | 'shaper' | 'environmental_activist';
  name: string;
  quote: string;
  avatar?: string;
}

interface CommunityVoicesProps {
  voices: CommunityVoice[];
  spotName: string;
}

const CommunityVoices: React.FC<CommunityVoicesProps> = ({ voices, spotName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getVoiceTypeInfo = (type: string) => {
    switch (type) {
      case 'female_surfer':
        return {
          label: 'Female Surfer',
          icon: <User className="h-4 w-4" />,
          color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
          description: 'Personal perspective and experience'
        };
      case 'shaper':
        return {
          label: 'Board Shaper',
          icon: <Hammer className="h-4 w-4" />,
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
          description: 'Equipment and technical insights'
        };
      case 'environmental_activist':
        return {
          label: 'Environmental Activist',
          icon: <Leaf className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          description: 'Conservation and sustainability focus'
        };
      default:
        return {
          label: 'Community Member',
          icon: <User className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          description: 'Local perspective'
        };
    }
  };

  const nextVoice = () => {
    setCurrentIndex((prev) => (prev + 1) % voices.length);
  };

  const prevVoice = () => {
    setCurrentIndex((prev) => (prev - 1 + voices.length) % voices.length);
  };

  if (!voices || voices.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-blue-600" />
            Community Voices: {spotName}
          </CardTitle>
          <CardDescription>
            Perspectives from surfers, shapers, and environmental advocates who know this wave best
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="carousel" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="carousel">Featured Voice</TabsTrigger>
              <TabsTrigger value="all">All Voices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="carousel" className="space-y-4">
              {voices.length > 0 && (
                <div className="relative">
                  <Card className="border-l-4 border-l-blue-600">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={voices[currentIndex].avatar} />
                          <AvatarFallback>
                            {voices[currentIndex].name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{voices[currentIndex].name}</h4>
                            <Badge className={getVoiceTypeInfo(voices[currentIndex].type).color}>
                              {getVoiceTypeInfo(voices[currentIndex].type).icon}
                              <span className="ml-1">{getVoiceTypeInfo(voices[currentIndex].type).label}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground text-sm">
                            {getVoiceTypeInfo(voices[currentIndex].type).description}
                          </p>
                          
                          <blockquote className="text-lg italic leading-relaxed border-l-4 border-gray-200 pl-4">
                            "{voices[currentIndex].quote}"
                          </blockquote>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {voices.length > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <Button variant="outline" size="sm" onClick={prevVoice}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <div className="flex gap-1">
                        {voices.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <Button variant="outline" size="sm" onClick={nextVoice}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {voices.map((voice, index) => {
                  const voiceInfo = getVoiceTypeInfo(voice.type);
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={voice.avatar} />
                            <AvatarFallback>
                              {voice.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{voice.name}</h5>
                              <Badge variant="outline" className="text-xs">
                                {voiceInfo.icon}
                                <span className="ml-1">{voiceInfo.label}</span>
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed">
                              "{voice.quote}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityVoices;