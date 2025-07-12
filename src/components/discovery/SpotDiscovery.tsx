import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MapPin, Star, Clock, AlertTriangle, Waves, Wind, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  skillLevel: number;
  experience: number;
  preferredWaveTypes: string[];
  boardType: string;
  sport: string;
  height?: string;
  weight?: string;
}

interface SpotRecommendation {
  spotName: string;
  spotId: string;
  rating: number;
  reason: string;
  bestTime: string;
  tips: string;
  safetyNotes: string;
}

interface EquipmentRecommendation {
  board: {
    type: string;
    length: string;
    width: string;
    thickness: string;
    volume: string;
    reason: string;
  };
  wetsuit: {
    thickness: string;
    type: string;
    features: string[];
    reason: string;
  };
  accessories: Array<{
    item: string;
    recommendation: string;
    reason: string;
  }>;
  alternatives: string;
}

export default function SpotDiscovery() {
  const [activeTab, setActiveTab] = useState('discovery');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skillLevel: 5,
    experience: 2,
    preferredWaveTypes: ['Beach Break'],
    boardType: 'Shortboard',
    sport: 'surfing'
  });
  const [recommendations, setRecommendations] = useState<SpotRecommendation[]>([]);
  const [equipmentRecs, setEquipmentRecs] = useState<EquipmentRecommendation | null>(null);
  const [safetyCheck, setSafetyCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentConditions = {
    waveHeight: '2-4 ft',
    windSpeed: 15,
    windDirection: 'SW',
    tide: 'Rising',
    waterTemp: 18,
    waveType: 'Beach Break'
  };

  const location = {
    name: 'Current Location',
    lat: -33.8688,
    lng: 151.2093
  };

  const getSpotRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-surf-recommendations', {
        body: {
          type: 'spot_discovery',
          userProfile,
          currentConditions,
          location
        }
      });

      if (error) throw error;
      setRecommendations(data.recommendations || []);
      toast({
        title: "Recommendations Updated",
        description: "Found personalized surf spots for you!"
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getEquipmentRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-surf-recommendations', {
        body: {
          type: 'equipment_recommendations',
          userProfile,
          currentConditions,
          equipment: {}
        }
      });

      if (error) throw error;
      setEquipmentRecs(data);
      toast({
        title: "Equipment Recommendations",
        description: "Got optimal gear suggestions for current conditions!"
      });
    } catch (error) {
      console.error('Error getting equipment recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get equipment recommendations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSafetyCheck = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-surf-recommendations', {
        body: {
          type: 'safety_check',
          currentConditions,
          location
        }
      });

      if (error) throw error;
      setSafetyCheck(data);
      toast({
        title: "Safety Check Complete",
        description: `Risk level: ${data.riskLevel}`,
        variant: data.riskLevel === 'high' ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Error getting safety check:', error);
      toast({
        title: "Error",
        description: "Failed to perform safety check.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI-Powered Surf Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized recommendations for spots, equipment, and safety
        </p>
      </div>

      {/* User Profile Setup */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Tell us about yourself for better recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Sport</Label>
              <Select value={userProfile.sport} onValueChange={(value) => 
                setUserProfile(prev => ({ ...prev, sport: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surfing">Surfing</SelectItem>
                  <SelectItem value="kitesurfing">Kitesurfing</SelectItem>
                  <SelectItem value="windsurfing">Windsurfing</SelectItem>
                  <SelectItem value="sup">Stand Up Paddle (SUP)</SelectItem>
                  <SelectItem value="bodyboarding">Bodyboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Skill Level: {userProfile.skillLevel}/10</Label>
              <Slider
                value={[userProfile.skillLevel]}
                onValueChange={(value) => 
                  setUserProfile(prev => ({ ...prev, skillLevel: value[0] }))
                }
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Experience (years)</Label>
              <Slider
                value={[userProfile.experience]}
                onValueChange={(value) => 
                  setUserProfile(prev => ({ ...prev, experience: value[0] }))
                }
                max={20}
                min={0}
                step={1}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{userProfile.experience} years</span>
            </div>

            <div>
              <Label>Board Type</Label>
              <Select value={userProfile.boardType} onValueChange={(value) => 
                setUserProfile(prev => ({ ...prev, boardType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Longboard">Longboard</SelectItem>
                  <SelectItem value="Shortboard">Shortboard</SelectItem>
                  <SelectItem value="Funboard">Funboard</SelectItem>
                  <SelectItem value="Fish">Fish</SelectItem>
                  <SelectItem value="Gun">Gun</SelectItem>
                  <SelectItem value="SUP">SUP Board</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="discovery" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Spot Discovery
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Equipment
          </TabsTrigger>
          <TabsTrigger value="safety" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Safety Check
          </TabsTrigger>
          <TabsTrigger value="conditions" className="flex items-center gap-2">
            <Waves className="w-4 h-4" />
            Conditions
          </TabsTrigger>
        </TabsList>

        {/* Current Conditions Display */}
        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle>Current Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <Waves className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="font-semibold">{currentConditions.waveHeight}</div>
                  <div className="text-sm text-muted-foreground">Wave Height</div>
                </div>
                <div className="text-center">
                  <Wind className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="font-semibold">{currentConditions.windSpeed} km/h</div>
                  <div className="text-sm text-muted-foreground">Wind Speed</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-purple-500 font-bold">
                    {currentConditions.windDirection}
                  </div>
                  <div className="font-semibold">Direction</div>
                  <div className="text-sm text-muted-foreground">Wind Dir</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-orange-500 font-bold">
                    T
                  </div>
                  <div className="font-semibold">{currentConditions.tide}</div>
                  <div className="text-sm text-muted-foreground">Tide</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-red-500 font-bold">
                    °C
                  </div>
                  <div className="font-semibold">{currentConditions.waterTemp}°C</div>
                  <div className="text-sm text-muted-foreground">Water Temp</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-cyan-500 font-bold">
                    W
                  </div>
                  <div className="font-semibold">{currentConditions.waveType}</div>
                  <div className="text-sm text-muted-foreground">Wave Type</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spot Discovery */}
        <TabsContent value="discovery">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recommended Surf Spots</h2>
              <Button onClick={getSpotRecommendations} disabled={loading}>
                {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
              </Button>
            </div>

            {recommendations.length > 0 && (
              <div className="grid gap-6">
                {recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            {rec.spotName}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{rec.rating}/10</span>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {rec.bestTime}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-1">Why this spot:</h4>
                          <p className="text-muted-foreground">{rec.reason}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-1">Tips:</h4>
                          <p className="text-muted-foreground">{rec.tips}</p>
                        </div>

                        {rec.safetyNotes && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                            <h4 className="font-semibold mb-1 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              Safety Notes:
                            </h4>
                            <p className="text-sm">{rec.safetyNotes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Equipment Recommendations */}
        <TabsContent value="equipment">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Equipment Recommendations</h2>
              <Button onClick={getEquipmentRecommendations} disabled={loading}>
                {loading ? 'Analyzing...' : 'Get Equipment Recommendations'}
              </Button>
            </div>

            {equipmentRecs && (
              <div className="grid gap-6">
                {/* Board Recommendation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Board</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label>Type</Label>
                        <div className="font-semibold">{equipmentRecs.board.type}</div>
                      </div>
                      <div>
                        <Label>Length</Label>
                        <div className="font-semibold">{equipmentRecs.board.length}</div>
                      </div>
                      <div>
                        <Label>Width</Label>
                        <div className="font-semibold">{equipmentRecs.board.width}</div>
                      </div>
                      <div>
                        <Label>Volume</Label>
                        <div className="font-semibold">{equipmentRecs.board.volume}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{equipmentRecs.board.reason}</p>
                  </CardContent>
                </Card>

                {/* Wetsuit Recommendation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Wetsuit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Thickness</Label>
                        <div className="font-semibold">{equipmentRecs.wetsuit.thickness}</div>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <div className="font-semibold">{equipmentRecs.wetsuit.type}</div>
                      </div>
                      <div>
                        <Label>Features</Label>
                        <div className="flex flex-wrap gap-1">
                          {equipmentRecs.wetsuit.features.map((feature, index) => (
                            <Badge key={index} variant="outline">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{equipmentRecs.wetsuit.reason}</p>
                  </CardContent>
                </Card>

                {/* Accessories */}
                {equipmentRecs.accessories.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Gear</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {equipmentRecs.accessories.map((accessory, index) => (
                          <div key={index} className="border-l-4 border-primary pl-4">
                            <h4 className="font-semibold">{accessory.item}</h4>
                            <p className="text-sm">{accessory.recommendation}</p>
                            <p className="text-xs text-muted-foreground mt-1">{accessory.reason}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Safety Check */}
        <TabsContent value="safety">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Safety Assessment</h2>
              <Button onClick={getSafetyCheck} disabled={loading}>
                {loading ? 'Analyzing...' : 'Perform Safety Check'}
              </Button>
            </div>

            {safetyCheck && (
              <div className="space-y-6">
                {/* Risk Level */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        safetyCheck.riskLevel === 'high' ? 'text-red-500' :
                        safetyCheck.riskLevel === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      Overall Risk Level: {safetyCheck.riskLevel.toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{safetyCheck.overallAdvice}</p>
                  </CardContent>
                </Card>

                {/* Rip Current Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rip Current Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant={
                        safetyCheck.ripCurrentRisk.level === 'high' ? 'destructive' :
                        safetyCheck.ripCurrentRisk.level === 'medium' ? 'secondary' :
                        'default'
                      }>
                        {safetyCheck.ripCurrentRisk.level.toUpperCase()} RISK
                      </Badge>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Warning Signs:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {safetyCheck.ripCurrentRisk.indicators.map((indicator: string, index: number) => (
                            <li key={index} className="text-sm">{indicator}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Safety Advice:</h4>
                        <p className="text-sm text-muted-foreground">{safetyCheck.ripCurrentRisk.avoidanceAdvice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Emergency Services:</span>
                        <span className="text-red-600 font-bold">{safetyCheck.emergencyContacts.primary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Coast Guard:</span>
                        <span>{safetyCheck.emergencyContacts.coastGuard}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Local Lifeguards:</span>
                        <span>{safetyCheck.emergencyContacts.localLifeguards}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Check-in Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{safetyCheck.checkInAdvice}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}