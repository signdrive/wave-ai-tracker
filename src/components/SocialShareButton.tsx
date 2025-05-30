
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { useSocialSharing } from '@/hooks/useIntegrations';
import { ShareOptions } from '@/services/sharingService';

interface SocialShareButtonProps {
  spot: string;
  conditions: string;
  rating: number;
  image?: string;
  className?: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  spot,
  conditions,
  rating,
  image,
  className = ''
}) => {
  const { shareSpotConditions, shareToSocial } = useSocialSharing();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    const shareOptions: ShareOptions = {
      spot,
      conditions,
      rating,
      image
    };

    try {
      await shareSpotConditions(shareOptions);
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
    >
      <Share2 className="w-4 h-4" />
      <span>{isSharing ? 'Sharing...' : 'Share'}</span>
    </Button>
  );
};

export default SocialShareButton;
