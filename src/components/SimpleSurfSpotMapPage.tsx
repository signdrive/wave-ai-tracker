
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, List, LayoutGrid } from 'lucide-react';

const SimpleSurfSpotMapPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ocean-dark">Global Surf Spots</h1>
            <p className="text-gray-600 mt-1">
              Discover surf spots worldwide with live conditions
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4 mr-1" />
              Map
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('split')}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Split
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className={`grid gap-6 ${
        viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div className={viewMode === 'map' ? 'col-span-1' : ''}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Interactive Surf Map</span>
                  <Badge variant="outline">
                    Loading...
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Map will load here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* List View */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div className={viewMode === 'list' ? 'col-span-1' : ''}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Surf Spots</span>
                  <Badge variant="outline">
                    Loading...
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="text-center py-8 text-gray-500">
                  <p>Surf spots will load here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleSurfSpotMapPage;
