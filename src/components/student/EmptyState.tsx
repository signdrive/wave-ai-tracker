
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  onBookSession: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onBookSession }) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Start Your Surf Journey</h3>
        <p className="text-gray-600 mb-6">
          Book your first session with a certified surf mentor to improve your skills
        </p>
        <Button onClick={onBookSession}>
          Book Your First Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
