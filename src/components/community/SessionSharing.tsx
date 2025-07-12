import React, { useState } from 'react';
import { Camera, Heart, MessageCircle, Share2, MapPin, Star, Plus, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SessionSharing: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    location: '',
    waveRating: '',
    funRating: '',
    crowdLevel: '',
    visibility: 'public'
  });

  const mockPosts = [
    {
      id: 1,
      user: {
        name: "Sarah Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      title: "Perfect Dawn Patrol Session!",
      description: "Scored some amazing 4-6ft waves this morning at Malibu. The offshore wind was perfect and the crowd was minimal. Best session in weeks! The water was crystal clear and the waves were so clean. Managed to get some of the longest rides of the year.",
      location: "Malibu, CA",
      waveRating: 5,
      funRating: 5,
      crowdLevel: "Light",
      photos: [
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop"
      ],
      likes: 23,
      comments: 8,
      isLiked: false,
      timeAgo: "2 hours ago",
      stats: {
        duration: "2.5 hours",
        waveCount: 24,
        bestWave: "6.2ft"
      }
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      title: "Sunset Session Magic",
      description: "Nothing beats surfing during golden hour. Smaller waves but the vibe was incredible. Perfect way to end the day.",
      location: "Huntington Beach, CA",
      waveRating: 3,
      funRating: 5,
      crowdLevel: "Moderate",
      photos: [
        "https://images.unsplash.com/photo-1465831235717-7d85a5ee6d25?w=500&h=300&fit=crop"
      ],
      likes: 15,
      comments: 5,
      isLiked: true,
      timeAgo: "1 day ago",
      stats: {
        duration: "1.8 hours",
        waveCount: 18,
        bestWave: "4.1ft"
      }
    }
  ];

  const [posts, setPosts] = useState(mockPosts);

  const handleCreatePost = () => {
    // In real app, this would create the post
    console.log('Creating post:', newPost);
    setShowCreatePost(false);
    setNewPost({
      title: '',
      description: '',
      location: '',
      waveRating: '',
      funRating: '',
      crowdLevel: '',
      visibility: 'public'
    });
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Light': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Heavy': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session Stories</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Share your epic surf sessions with the community
          </p>
        </div>
        
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Share Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Your Session</DialogTitle>
              <DialogDescription>
                Tell the community about your latest surf adventure
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Session Title</label>
                  <Input
                    placeholder="e.g., Epic Dawn Patrol at Malibu"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    placeholder="e.g., Malibu, CA"
                    value={newPost.location}
                    onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  placeholder="Describe your session - how were the waves, the conditions, any highlights..."
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Wave Rating</label>
                  <Select value={newPost.waveRating} onValueChange={(value) => setNewPost({...newPost, waveRating: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate waves" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Poor</SelectItem>
                      <SelectItem value="2">2 - Fair</SelectItem>
                      <SelectItem value="3">3 - Good</SelectItem>
                      <SelectItem value="4">4 - Great</SelectItem>
                      <SelectItem value="5">5 - Epic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Fun Rating</label>
                  <Select value={newPost.funRating} onValueChange={(value) => setNewPost({...newPost, funRating: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate fun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Meh</SelectItem>
                      <SelectItem value="2">2 - Okay</SelectItem>
                      <SelectItem value="3">3 - Good</SelectItem>
                      <SelectItem value="4">4 - Great</SelectItem>
                      <SelectItem value="5">5 - Epic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Crowd Level</label>
                  <Select value={newPost.crowdLevel} onValueChange={(value) => setNewPost({...newPost, crowdLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Crowd" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Photos</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photos or drag and drop</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreatePost} className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Session
                </Button>
                <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{post.user.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.location} • {post.timeAgo}
                      </p>
                    </div>
                    <Badge className={getCrowdColor(post.crowdLevel)}>
                      {post.crowdLevel} crowd
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{post.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{post.description}</p>
              </div>
              
              {/* Ratings */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Waves:</span>
                  <div className="flex">{getRatingStars(post.waveRating)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Fun:</span>
                  <div className="flex">{getRatingStars(post.funRating)}</div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{post.stats.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waves</p>
                  <p className="font-medium">{post.stats.waveCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Best Wave</p>
                  <p className="font-medium">{post.stats.bestWave}</p>
                </div>
              </div>
              
              {/* Photos */}
              {post.photos && post.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Session photo ${index + 1}`}
                      className="rounded-lg object-cover h-48 w-full cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 transition-colors ${
                      post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionSharing;