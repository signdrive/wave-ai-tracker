
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, Star, Trophy, Users, Camera, MapPin } from 'lucide-react';

interface SocialCommunityHubProps {
  spotId: string;
  spotName: string;
}

const SocialCommunityHub: React.FC<SocialCommunityHubProps> = ({ spotId, spotName }) => {
  const [activeTab, setActiveTab] = useState('feed');

  const feedPosts = [
    {
      id: '1',
      user: 'surf_sarah_92',
      avatar: '/placeholder.svg',
      timeAgo: '2h ago',
      location: spotName,
      content: 'Perfect 6ft barrels this morning! The AI forecast was spot on 🤙',
      image: '/placeholder.svg',
      likes: 24,
      comments: 8,
      waveHeight: '4-6ft',
      conditions: 'Clean'
    },
    {
      id: '2',
      user: 'local_legend',
      avatar: '/placeholder.svg',
      timeAgo: '4h ago',
      location: spotName,
      content: 'Pro tip: Best entry point is 200m north of the main break. Less crowded and cleaner waves.',
      likes: 31,
      comments: 12,
      waveHeight: '3-5ft',
      conditions: 'Good'
    }
  ];

  const spotReviews = [
    {
      id: '1',
      user: 'wave_rider_808',
      rating: 5,
      timeAgo: '1 day ago',
      title: 'Epic session!',
      content: 'Best waves I\'ve had all year. The AI forecast predicted perfect conditions and it delivered!',
      helpful: 15
    },
    {
      id: '2',
      user: 'surf_instructor_mike',
      rating: 4,
      timeAgo: '3 days ago',
      title: 'Great for beginners',
      content: 'Perfect spot for teaching. Consistent waves and sandy bottom make it ideal for learning.',
      helpful: 8
    }
  ];

  const leaderboard = [
    { rank: 1, user: 'barrel_hunter', sessions: 47, streak: 12, badge: 'Local Legend' },
    { rank: 2, user: 'dawn_patrol', sessions: 38, streak: 8, badge: 'Early Bird' },
    { rank: 3, user: 'sunset_surfer', sessions: 32, streak: 5, badge: 'Consistent' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Community Hub - {spotName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Live Feed</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="buddies">Find Buddies</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {feedPosts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.user[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">{post.user}</span>
                      <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.location}
                    </div>
                    <p className="text-sm mb-3">{post.content}</p>
                    
                    <div className="flex space-x-3 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.waveHeight}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        {post.conditions}
                      </Badge>
                    </div>
                    
                    {post.image && (
                      <div className="mb-3">
                        <img src={post.image} alt="Surf session" className="rounded-lg w-full h-48 object-cover" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-500">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Camera className="w-4 h-4 mr-2" />
              Share Your Session
            </Button>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {spotReviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{review.user}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{review.timeAgo}</span>
                </div>
                
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{review.content}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <button className="text-green-600 hover:text-green-700">
                    👍 Helpful ({review.helpful})
                  </button>
                  <button className="text-blue-600 hover:text-blue-700">
                    Reply
                  </button>
                </div>
              </Card>
            ))}
            
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Write a Review
            </Button>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">🏆 Monthly Champions</h3>
              <p className="text-sm text-gray-600">Most active surfers at {spotName}</p>
            </div>
            
            {leaderboard.map((surfer) => (
              <Card key={surfer.rank} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      surfer.rank === 1 ? 'bg-yellow-500' : surfer.rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {surfer.rank}
                    </div>
                    <div>
                      <div className="font-semibold">{surfer.user}</div>
                      <Badge variant="outline" className="text-xs">
                        {surfer.badge}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{surfer.sessions} sessions</div>
                    <div className="text-sm text-gray-500">{surfer.streak} day streak</div>
                  </div>
                </div>
              </Card>
            ))}
            
            <Card className="p-4 bg-blue-50">
              <div className="text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h4 className="font-semibold">Join the Competition!</h4>
                <p className="text-sm text-gray-600 mb-3">Log your sessions to climb the leaderboard</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Logging Sessions
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="buddies" className="space-y-4">
            <Card className="p-4">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-2">Find Surf Buddies</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with other surfers at {spotName}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
                  Find Buddies Now
                </Button>
                <Button variant="outline" className="w-full">
                  Create Group Session
                </Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-3">🌊 Active Groups</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">Dawn Patrol Crew</div>
                    <div className="text-xs text-gray-500">12 members • Daily 6AM</div>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">Weekend Warriors</div>
                    <div className="text-xs text-gray-500">23 members • Weekends</div>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialCommunityHub;
