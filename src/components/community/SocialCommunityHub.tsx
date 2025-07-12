import React, { useState } from 'react';
import { Users, Plus, Search, Filter, MapPin, Calendar, Crown, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SocialCommunityHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    location: '',
    visibility: 'public'
  });

  const mockGroups = [
    {
      id: 1,
      name: "Malibu Dawn Patrol",
      description: "Early morning surfers hitting Malibu before work. Join us for epic sunrise sessions!",
      location: "Malibu, CA",
      memberCount: 47,
      visibility: "public",
      creator: "Sarah Wilson",
      created: "2 months ago",
      isJoined: false,
      recentActivity: "3 new posts this week",
      tags: ["Dawn Patrol", "Intermediate", "Regular Group"]
    },
    {
      id: 2,
      name: "Beginner Surfers LA",
      description: "Supportive community for new surfers learning the ropes. All skill levels welcome!",
      location: "Los Angeles County",
      memberCount: 128,
      visibility: "public",
      creator: "Mike Chen",
      created: "6 months ago",
      isJoined: true,
      recentActivity: "12 new members this week",
      tags: ["Beginner Friendly", "Lessons", "Support"]
    },
    {
      id: 3,
      name: "HB Hardcore",
      description: "Advanced surfers pushing limits at Huntington Beach. Big waves, big sessions.",
      location: "Huntington Beach, CA",
      memberCount: 23,
      visibility: "public",
      creator: "Jake Rodriguez",
      created: "1 month ago",
      isJoined: false,
      recentActivity: "Epic session photos posted",
      tags: ["Advanced", "Big Waves", "Hardcore"]
    },
    {
      id: 4,
      name: "Venice Vibes",
      description: "Chill surfers from Venice Beach area. Good vibes only!",
      location: "Venice, CA",
      memberCount: 85,
      visibility: "public",
      creator: "Luna Martinez",
      created: "4 months ago",
      isJoined: true,
      recentActivity: "Beach cleanup organized",
      tags: ["Chill", "Community", "Beach Cleanup"]
    }
  ];

  const handleCreateGroup = () => {
    // In real app, this would create the group
    console.log('Creating group:', newGroup);
    setShowCreateGroup(false);
    setNewGroup({ name: '', description: '', location: '', visibility: 'public' });
  };

  const handleJoinGroup = (groupId: number) => {
    // In real app, this would join the group
    console.log('Joining group:', groupId);
  };

  const getVisibilityColor = (visibility: string) => {
    return visibility === 'public' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || group.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Surf Groups</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Find and join local surf communities
          </p>
        </div>
        
        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Surf Group</DialogTitle>
              <DialogDescription>
                Start a new community for your local surf spot or interest
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Group Name</label>
                <Input
                  placeholder="e.g., Malibu Dawn Patrol"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  placeholder="e.g., Malibu, CA"
                  value={newGroup.location}
                  onChange={(e) => setNewGroup({...newGroup, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  placeholder="Describe your group's purpose and vibe..."
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Visibility</label>
                <Select value={newGroup.visibility} onValueChange={(value) => setNewGroup({...newGroup, visibility: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can join</SelectItem>
                    <SelectItem value="private">Private - Invite only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateGroup} className="flex-1">
                  Create Group
                </Button>
                <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Input
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                    <Badge className={getVisibilityColor(group.visibility)} variant="secondary">
                      {group.visibility}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />
                    {group.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    {group.memberCount}
                  </div>
                  {group.isJoined && (
                    <Badge variant="outline" className="text-xs">
                      Member
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm">{group.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {group.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Created by {group.creator}
                </div>
                <span>{group.created}</span>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-3">{group.recentActivity}</p>
                
                {group.isJoined ? (
                  <Button variant="outline" className="w-full">
                    View Group
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Group
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No groups found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or create a new group</p>
            <Button onClick={() => setShowCreateGroup(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialCommunityHub;