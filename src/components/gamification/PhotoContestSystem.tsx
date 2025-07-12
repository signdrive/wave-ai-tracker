import React, { useState, useEffect } from 'react';
import { Camera, Upload, Heart, Clock, Trophy, Vote, Eye, Calendar, Award, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PhotoContest {
  id: string;
  title: string;
  description: string;
  theme: string;
  start_date: string;
  end_date: string;
  voting_end_date: string;
  status: 'upcoming' | 'active' | 'voting' | 'completed';
  max_entries_per_user: number;
  prize_description: string;
}

interface ContestEntry {
  id: string;
  contest_id: string;
  user_id: string;
  photo_url: string;
  title: string;
  description: string;
  location: string;
  taken_at: string;
  vote_count: number;
  created_at: string;
  profile?: {
    full_name: string;
    avatar_url?: string;
  };
  user_voted?: boolean;
}

interface NewEntry {
  title: string;
  description: string;
  location: string;
  taken_at: string;
}

const PhotoContestSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contests, setContests] = useState<PhotoContest[]>([]);
  const [selectedContest, setSelectedContest] = useState<PhotoContest | null>(null);
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [newEntry, setNewEntry] = useState<NewEntry>({
    title: '',
    description: '',
    location: '',
    taken_at: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContests();
  }, []);

  useEffect(() => {
    if (selectedContest) {
      loadContestEntries(selectedContest.id);
    }
  }, [selectedContest, user]);

  const loadContests = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_contests')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setContests((data || []) as PhotoContest[]);
      
      // Auto-select the most recent active or voting contest
      const activeContest = (data as PhotoContest[] || [])?.find(c => c.status === 'active' || c.status === 'voting');
      if (activeContest) {
        setSelectedContest(activeContest);
      } else if (data && data.length > 0) {
        setSelectedContest(data[0] as PhotoContest);
      }
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContestEntries = async (contestId: string) => {
    try {
      // Load entries with profile information
      const { data: entriesData, error: entriesError } = await supabase
        .from('photo_contest_entries')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('contest_id', contestId)
        .order('vote_count', { ascending: false });

      if (entriesError) throw entriesError;

      // Check which entries the current user has voted on
      let userVotes: string[] = [];
      if (user) {
        const { data: votesData, error: votesError } = await supabase
          .from('photo_contest_votes')
          .select('entry_id')
          .eq('user_id', user.id);

        if (!votesError && votesData) {
          userVotes = votesData.map(vote => vote.entry_id);
        }
      }

      const formattedEntries = (entriesData || []).map(entry => ({
        ...entry,
        profile: entry.profiles as any,
        user_voted: userVotes.includes(entry.id)
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading contest entries:', error);
    }
  };

  const handleVote = async (entryId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to vote on photo contest entries.",
        variant: "destructive",
      });
      return;
    }

    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) return;

      if (entry.user_voted) {
        // Remove vote
        await supabase
          .from('photo_contest_votes')
          .delete()
          .eq('entry_id', entryId)
          .eq('user_id', user.id);

        toast({
          title: "Vote Removed",
          description: "Your vote has been removed.",
        });
      } else {
        // Add vote
        await supabase
          .from('photo_contest_votes')
          .insert({
            entry_id: entryId,
            user_id: user.id
          });

        toast({
          title: "Vote Cast",
          description: "Your vote has been recorded!",
        });
      }

      // Reload entries to update vote counts
      if (selectedContest) {
        loadContestEntries(selectedContest.id);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitEntry = async () => {
    if (!user || !selectedContest) return;

    try {
      // In a real app, you'd handle photo upload here
      const mockPhotoUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop`;

      await supabase
        .from('photo_contest_entries')
        .insert({
          contest_id: selectedContest.id,
          user_id: user.id,
          photo_url: mockPhotoUrl,
          title: newEntry.title,
          description: newEntry.description,
          location: newEntry.location,
          taken_at: newEntry.taken_at || new Date().toISOString()
        });

      toast({
        title: "Entry Submitted!",
        description: "Your photo has been submitted to the contest.",
      });

      setShowSubmitDialog(false);
      setNewEntry({ title: '', description: '', location: '', taken_at: '' });
      
      // Reload entries
      loadContestEntries(selectedContest.id);
    } catch (error) {
      console.error('Error submitting entry:', error);
      toast({
        title: "Error",
        description: "Failed to submit your entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'voting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Accepting Entries';
      case 'voting': return 'Voting Open';
      case 'completed': return 'Complete';
      case 'upcoming': return 'Coming Soon';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading photo contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📸 Photo Contests</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Share your best surf photography and vote for community favorites
        </p>
      </div>

      {/* Contest Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.map((contest) => (
          <Card 
            key={contest.id} 
            className={`cursor-pointer transition-all ${
              selectedContest?.id === contest.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedContest(contest)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{contest.title}</CardTitle>
                <Badge className={getStatusColor(contest.status)}>
                  {getStatusText(contest.status)}
                </Badge>
              </div>
              <CardDescription>{contest.theme}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Ends: {formatDate(contest.end_date)}</span>
                </div>
                {contest.status === 'voting' && (
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4" />
                    <span>Voting until: {formatDate(contest.voting_end_date)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>{contest.prize_description}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedContest && (
        <>
          {/* Contest Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedContest.title}</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {selectedContest.description}
                  </CardDescription>
                </div>
                {selectedContest.status === 'active' && user && (
                  <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Camera className="w-4 h-4 mr-2" />
                        Submit Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Photo Entry</DialogTitle>
                        <DialogDescription>
                          Submit your best surf photo for "{selectedContest.title}"
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Photo Upload</label>
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Title</label>
                          <Input
                            placeholder="Give your photo a title"
                            value={newEntry.title}
                            onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <Textarea
                            placeholder="Tell us about this photo..."
                            value={newEntry.description}
                            onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <Input
                              placeholder="Where was this taken?"
                              value={newEntry.location}
                              onChange={(e) => setNewEntry({...newEntry, location: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Date Taken</label>
                            <Input
                              type="date"
                              value={newEntry.taken_at}
                              onChange={(e) => setNewEntry({...newEntry, taken_at: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={handleSubmitEntry} className="flex-1">
                            Submit Entry
                          </Button>
                          <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Contest Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry, index) => (
              <Card key={entry.id} className="overflow-hidden group">
                <div className="relative">
                  <img
                    src={entry.photo_url}
                    alt={entry.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index < 3 && selectedContest.status === 'completed' && (
                    <div className="absolute top-2 left-2">
                      <Badge className={
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        'bg-amber-600'
                      }>
                        {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : '🥉 3rd'}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    {selectedContest.status === 'voting' && (
                      <Button
                        size="sm"
                        variant={entry.user_voted ? 'default' : 'secondary'}
                        onClick={() => handleVote(entry.id)}
                        className="backdrop-blur-sm"
                      >
                        <Heart className={`w-4 h-4 mr-1 ${entry.user_voted ? 'fill-current' : ''}`} />
                        {entry.vote_count}
                      </Button>
                    )}
                    {selectedContest.status !== 'voting' && (
                      <Badge className="backdrop-blur-sm bg-black/50 text-white">
                        <Eye className="w-3 h-3 mr-1" />
                        {entry.vote_count} votes
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {entry.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={entry.profile?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {entry.profile?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.profile?.full_name || 'Anonymous'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {entry.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{entry.location}</span>
                    <span>{formatDate(entry.taken_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {entries.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No entries yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Be the first to submit a photo to this contest!
                </p>
                {selectedContest.status === 'active' && user && (
                  <Button onClick={() => setShowSubmitDialog(true)}>
                    <Camera className="w-4 h-4 mr-2" />
                    Submit First Entry
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PhotoContestSystem;