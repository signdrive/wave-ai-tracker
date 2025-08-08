import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Star, Users, Waves, Calendar, Compass, AlertTriangle, Camera, Wind, Thermometer } from 'lucide-react';
import surfSpotsData from '@/data/surfSpotsBlog.json';
import CanonicalUrl from '@/components/CanonicalUrl';
import NotFound from './NotFound';

const SurfSpotDetailPage = () => {
  const { spotId } = useParams();
  const spot = surfSpotsData.featured_spots.find(s => s.id === spotId);

  if (!spot) {
    return <NotFound />;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'intermediate to advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'advanced to expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'expert': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Generate detailed content based on the spot
  const generateDetailedContent = (spot: any) => {
    const spotSpecificContent: Record<string, any> = {
      'pipeline-oahu': {
        introduction: "Pipeline is the crown jewel of surfing, a wave so perfect and powerful that it has become the ultimate testing ground for the world's best surfers. Located on the North Shore of Oahu, this legendary break has been claiming waves—and occasionally lives—since surfers first discovered its perfect barrels in the 1960s.",
        history: "First surfed by Gerry Lopez and other North Shore pioneers in the late 1960s, Pipeline quickly gained a reputation as the most challenging wave in the world. The break got its name from the nearby Banzai Pipeline, a sewage pipe that runs under the beach. Over the decades, Pipeline has been the site of countless legendary rides, devastating wipeouts, and unfortunately, several surfing fatalities.",
        waveCharacteristics: "Pipeline breaks over a shallow reef shelf, creating perfect, hollow barrels that offer rides of 5-15 seconds when conditions align. The wave typically ranges from 6-20 feet Hawaiian scale (12-40 feet face), with the optimal swell coming from the north and northwest. The wave breaks left and right, with the left (known as Pipeline) being the more famous and challenging of the two.",
        localKnowledge: "According to longtime Pipeline regular Keoni Watson, 'The secret to Pipeline isn't just skill—it's respect. The ocean here demands your complete attention. One moment of hesitation or overconfidence can end badly.' Local photographer Brian Bielmann adds, 'I've been shooting Pipeline for 30 years, and it still amazes me how each wave is different, how each barrel has its own personality.'",
        equipment: "Most Pipeline surfers ride boards between 6'0\" and 6'6\" with extra volume for paddle power. A good leash is essential, as is protective gear—many pros wear helmets and impact vests. Board materials should be robust, as contact with the reef is always a possibility.",
        accommodation: "The North Shore offers various accommodation options, from luxury resorts like Turtle Bay to budget-friendly vacation rentals in Haleiwa. During peak season (November-February), book well in advance as the area fills up with surf tourists and photographers.",
        diningAndCulture: "Don't miss Giovanni's Shrimp Truck in Kahuku, Matsumoto Shave Ice in Haleiwa, and the famous North Shore farmers markets. The area has a rich Hawaiian culture—take time to learn about the spiritual significance of these waters to Native Hawaiians."
      },
      'jeffreys-bay': {
        introduction: "Jeffreys Bay, or 'J-Bay' as it's affectionately known, is home to one of the world's most perfect right-hand point breaks. This South African gem delivers consistent, long rides that can stretch for over 300 meters on the right day, making it a pilgrimage site for surfers seeking the ultimate point break experience.",
        history: "J-Bay was first surfed in the 1960s by local South African surfers, but it wasn't until the 1970s that it gained international recognition. The break became famous worldwide when it was featured in surf films and magazines, attracting surfers from across the globe. The annual Billabong Pro (now Corona Open J-Bay) has been held here since 1984, cementing its status as a world-class competitive venue.",
        waveCharacteristics: "The wave at J-Bay is actually a series of connected point breaks: Kitchen Windows, Magna Tubes, Boneyards, and Supertubes. Supertubes is the crown jewel, offering 150-300 meter rides with multiple barrel sections. The wave works best on south and southwest swells between 4-8 feet, with offshore winds from the west creating perfect conditions.",
        localKnowledge: "Local shaper Warrick Dunn explains, 'J-Bay is all about reading the sections. You need to know when to pump for speed, when to set up for the barrel, and when to kick out before the inside section closes out.' Pro surfer Jordy Smith, who grew up surfing J-Bay, says, 'The wave taught me everything about high-performance surfing—it's like a natural training ground.'",
        equipment: "A standard shortboard setup works well at J-Bay, though many surfers prefer slightly longer boards (6'2\" to 6'8\") for the longer rides. The water is cold (requiring 3/2mm to 4/3mm wetsuits), and the wave can be punchy, so a strong leash is recommended.",
        accommodation: "J-Bay town offers numerous surf lodges, backpacker hostels, and vacation rentals. Popular options include Island Vibe Backpackers, African Ubuntu Safaris Lodge, and various self-catering apartments with ocean views.",
        diningAndCulture: "The town has a laid-back surf culture with great seafood restaurants, local craft breweries, and surf shops. Visit the Dolphin Beach area for stunning sunset views, and don't miss the local craft markets for South African souvenirs."
      }
      // Add more spots as needed...
    };

    return spotSpecificContent[spot.id] || {
      introduction: `${spot.name} is one of the world's premier surf destinations, offering ${spot.wave_type.toLowerCase()} waves in a stunning ${spot.location} setting. This ${spot.difficulty.toLowerCase()} break attracts surfers from around the globe with its ${spot.optimal_swell} swells and ${spot.break_type.toLowerCase()} characteristics.`,
      history: `The waves at ${spot.name} have been surfed for decades, gaining recognition as one of the world's top surf spots. Local surf culture has developed around this break, with generations of surfers calling it home.`,
      waveCharacteristics: `${spot.name} produces ${spot.wave_type.toLowerCase()} waves that break ${spot.wave_direction.toLowerCase()}, with optimal conditions occurring during ${spot.best_season}. The break works best with ${spot.optimal_swell} swells and ${spot.best_tide} tide.`,
      localKnowledge: `According to local surfers, the key to surfing ${spot.name} successfully is understanding the wave's timing and respecting the local surf community. Conditions can change quickly, so it's important to read the ocean carefully.`,
      equipment: `For ${spot.name}, most surfers use equipment suited to ${spot.difficulty.toLowerCase()} conditions. Board choice depends on wave size and personal preference, but local surf shops can provide expert guidance.`,
      accommodation: `${spot.location} offers various accommodation options for visiting surfers, from budget-friendly hostels to luxury resorts. Book in advance during peak season (${spot.best_season}).`,
      diningAndCulture: `The local area around ${spot.name} has a rich surf culture with excellent dining options, local surf shops, and cultural attractions worth exploring during your surf trip.`
    };
  };

  const content = generateDetailedContent(spot);

  return (
    <>
      <CanonicalUrl />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-blue-600 to-cyan-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative max-w-6xl mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white">
              <Link to="/surf-blog" className="inline-flex items-center mb-4 text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Surf Spots
              </Link>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">{spot.name}</h1>
              <div className="flex items-center text-xl mb-2">
                <MapPin className="mr-2 h-5 w-5" />
                {spot.location}, {spot.country}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(Math.floor(spot.rating))].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2">{spot.rating}/5</span>
                </div>
                <Badge className={getDifficultyColor(spot.difficulty)}>
                  {spot.difficulty}
                </Badge>
                <Badge variant="secondary">
                  {spot.wave_type}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Introduction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Waves className="mr-2 h-5 w-5" />
                    About {spot.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">{content.introduction}</p>
                </CardContent>
              </Card>

              {/* Wave Characteristics */}
              <Card>
                <CardHeader>
                  <CardTitle>Wave Characteristics</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="leading-relaxed">{content.waveCharacteristics}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 not-prose">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Waves className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{spot.optimal_swell}</div>
                      <div className="text-sm text-muted-foreground">Optimal Swell</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Compass className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{spot.wave_direction}</div>
                      <div className="text-sm text-muted-foreground">Wave Direction</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{spot.best_tide}</div>
                      <div className="text-sm text-muted-foreground">Best Tide</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* History & Culture */}
              <Card>
                <CardHeader>
                  <CardTitle>History & Surf Culture</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="leading-relaxed">{content.history}</p>
                </CardContent>
              </Card>

              {/* Local Knowledge */}
              <Card>
                <CardHeader>
                  <CardTitle>Local Insights</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="leading-relaxed italic">{content.localKnowledge}</p>
                </CardContent>
              </Card>

              {/* Equipment & Preparation */}
              <Card>
                <CardHeader>
                  <CardTitle>Equipment & Preparation</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="leading-relaxed">{content.equipment}</p>
                </CardContent>
              </Card>

              {/* Accommodation & Dining */}
              <Card>
                <CardHeader>
                  <CardTitle>Where to Stay & Eat</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <h4>Accommodation</h4>
                  <p className="leading-relaxed">{content.accommodation}</p>
                  
                  <h4>Dining & Culture</h4>
                  <p className="leading-relaxed">{content.diningAndCulture}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Break Type:</span>
                    <span className="font-medium">{spot.break_type}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Season:</span>
                    <span className="font-medium">{spot.best_season}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crowd Level:</span>
                    <span className="font-medium flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {spot.crowd_level}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge className={getDifficultyColor(spot.difficulty)}>
                      {spot.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Hazards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Safety Hazards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {spot.hazards.map((hazard: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        {hazard}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Nearby Spots */}
              <Card>
                <CardHeader>
                  <CardTitle>Nearby Surf Spots</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {spot.nearby_spots.map((nearbySpot: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <Waves className="w-4 h-4 text-primary mr-3" />
                        {nearbySpot}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Location Coordinates */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latitude:</span>
                      <span className="font-mono">{spot.coordinates[0]}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longitude:</span>
                      <span className="font-mono">{spot.coordinates[1]}°</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurfSpotDetailPage;