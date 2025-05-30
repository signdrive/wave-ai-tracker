
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Download, Share2 } from 'lucide-react';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { CameraValidationResult } from '@/utils/cameraValidation';

interface MobileSurfCamProps {
  spots: Array<{
    id: string;
    name: string;
    imageSrc: string;
    metadata?: any;
  }>;
  cameraStatuses: Record<string, CameraValidationResult>;
  onSpotChange?: (spotId: string) => void;
}

const MobileSurfCam: React.FC<MobileSurfCamProps> = ({
  spots,
  cameraStatuses,
  onSpotChange
}) => {
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSpot = spots[currentSpotIndex];

  const goToNext = () => {
    const nextIndex = (currentSpotIndex + 1) % spots.length;
    setCurrentSpotIndex(nextIndex);
    onSpotChange?.(spots[nextIndex].id);
  };

  const goToPrevious = () => {
    const prevIndex = currentSpotIndex === 0 ? spots.length - 1 : currentSpotIndex - 1;
    setCurrentSpotIndex(prevIndex);
    onSpotChange?.(spots[prevIndex].id);
  };

  const touchGestures = useTouchGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50
  });

  const shareSpot = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentSpot.name} - Wave AI Tracker`,
          text: `Check out the live surf conditions at ${currentSpot.name}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (!currentSpot) return null;

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <Card className={`${isFullscreen ? 'h-full border-0 rounded-none' : ''} transition-all duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-ocean dark:text-ocean-light">
              {currentSpot.name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge 
                className={`${
                  cameraStatuses[currentSpot.id]?.status === 'LIVE' 
                    ? 'bg-green-500' 
                    : 'bg-gray-500'
                } animate-pulse`}
              >
                {cameraStatuses[currentSpot.id]?.status || 'OFFLINE'}
              </Badge>
              <span className="text-sm text-gray-500">
                {currentSpotIndex + 1} / {spots.length}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Main Image Container */}
          <div 
            className="relative group"
            {...touchGestures}
          >
            <img
              src={currentSpot.imageSrc}
              alt={`Live surf cam at ${currentSpot.name}`}
              className={`w-full object-cover transition-all duration-300 ${
                isFullscreen ? 'h-screen' : 'h-64 sm:h-80'
              }`}
              loading="lazy"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={goToNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
              
              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                
                {navigator.share && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={shareSpot}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Swipe Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {spots.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSpotIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Spot Info */}
          {!isFullscreen && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Country:</span>
                  <p className="font-medium">{currentSpot.metadata?.country || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Wave Type:</span>
                  <p className="font-medium">{currentSpot.metadata?.waveType || 'Unknown'}</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Swipe left/right to navigate • Tap to view controls
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSurfCam;
