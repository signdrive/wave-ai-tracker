
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type: 'forecast' | 'cam' | 'chart' | 'card' | 'list' | 'tabs';
  count?: number;
}

export function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'forecast':
        return (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        );
      
      case 'cam':
        return (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-48 w-full" />
          </div>
        );
      
      case 'card':
        return (
          <div className="space-y-3 animate-pulse">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'tabs':
        return (
          <div className="space-y-4 animate-pulse">
            <div className="flex space-x-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-20" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        );
      
      default:
        return <Skeleton className="h-20 w-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
