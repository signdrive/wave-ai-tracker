
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  spotId: string;
  spotName: string;
  onAuthRequired?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  spotId, 
  spotName, 
  onAuthRequired 
}) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = useFavorites();
  const { toast } = useToast();

  const handleToggleFavorite = () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }

    if (isFavorite(spotId)) {
      removeFavorite(spotId);
      toast({
        title: "Removed from favorites",
        description: `${spotName} has been removed from your favorites.`,
      });
    } else {
      addFavorite({ spotId, spotName });
      toast({
        title: "Added to favorites",
        description: `${spotName} has been added to your favorites.`,
      });
    }
  };

  const isLoading = isAddingFavorite || isRemovingFavorite;
  const isFav = isFavorite(spotId);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${isFav ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
    >
      <Heart 
        className={`w-4 h-4 mr-1 ${isFav ? 'fill-current' : ''}`} 
      />
      {isFav ? 'Favorited' : 'Add to Favorites'}
    </Button>
  );
};

export default FavoriteButton;
