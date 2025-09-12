import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Waves } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Search Surf Spots
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect waves for your next surf session
            </p>
          </div>

          {/* Search Form */}
          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search for Surf Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                  name="search"
                  placeholder="Enter location, spot name, or wave type..."
                  defaultValue={query}
                  className="flex-1"
                />
                <Button type="submit" className="px-6">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results or Instructions */}
          {query ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Search Results for "{query}"
              </h2>
              <Card className="bg-card/95 backdrop-blur border-border/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Waves className="h-12 w-12 text-primary mx-auto" />
                    <p className="text-muted-foreground">
                      Search functionality is coming soon! For now, explore our surf spots on the interactive map.
                    </p>
                    <Button onClick={() => navigate('/map')} className="mt-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Surf Spots Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/95 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Explore by Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Discover surf spots around the world with our interactive map feature.
                  </p>
                  <Button onClick={() => navigate('/map')} variant="outline" className="w-full">
                    View Map
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-primary" />
                    Live Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Check real-time surf conditions and live camera feeds from spots worldwide.
                  </p>
                  <Button onClick={() => navigate('/live-spots')} variant="outline" className="w-full">
                    View Live Spots
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;