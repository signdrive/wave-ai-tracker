import React from 'react';
import { Users, UserPlus, MapPin, Share2, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import EnhancedAuthDialog from '@/components/EnhancedAuthDialog';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);

  const features = [
    {
      icon: UserPlus,
      title: "Find Surf Buddies",
      description: "Connect with surfers of similar skill levels in your area",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: Users,
      title: "Join Local Groups",
      description: "Find and join surf groups for your favorite beaches and regions",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      icon: MapPin,
      title: "Mentor Program",
      description: "Learn from experienced surfers or share your knowledge with beginners",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      icon: Share2,
      title: "Share Epic Sessions",
      description: "Post your best surf sessions with photos and connect with the community",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  const mockPosts = [
    {
      id: 1,
      user: "Sarah Wilson",
      location: "Malibu, CA",
      title: "Perfect Dawn Patrol Session!",
      description: "Scored some amazing 4-6ft waves this morning. The offshore wind was perfect and the crowd was minimal. Best session in weeks!",
      waveRating: 5,
      funRating: 5,
      likes: 23,
      comments: 8,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      user: "Mike Chen",
      location: "Huntington Beach, CA",
      title: "Great session with the crew",
      description: "Met up with the HB surf group for our weekly dawn patrol. Waves were smaller but still super fun!",
      waveRating: 3,
      funRating: 4,
      likes: 15,
      comments: 5,
      timeAgo: "4 hours ago"
    }
  ];

  const mockGroups = [
    {
      id: 1,
      name: "Malibu Dawn Patrol",
      location: "Malibu, CA",
      members: 47,
      description: "Early morning surfers hitting Malibu before work"
    },
    {
      id: 2,
      name: "Beginner Surfers LA",
      location: "Los Angeles County",
      members: 128,
      description: "Supportive community for new surfers learning the ropes"
    }
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Join the Surf Community
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Connect with fellow surfers, share epic sessions, and find your tribe
        </p>
        <Button 
          onClick={() => setShowAuthDialog(true)}
          size="lg"
          className="bg-ocean hover:bg-ocean-dark text-white"
        >
          Join Community
        </Button>
        
        <EnhancedAuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Surf Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Connect, share, and surf together
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Session Posts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Recent Session Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.user}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {post.location} • {post.timeAgo}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          🌊 {post.waveRating}/5
                        </Badge>
                        <Badge variant="secondary">
                          😊 {post.funRating}/5
                        </Badge>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{post.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  View All Posts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Popular Groups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{group.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {group.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{group.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{group.members} members</span>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  Browse All Groups
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Surf Buddies
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;