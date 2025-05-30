
import React, { Suspense } from 'react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeletonType?: 'forecast' | 'cam' | 'chart' | 'card' | 'list' | 'tabs';
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback, 
  skeletonType = 'card' 
}) => {
  const defaultFallback = <LoadingSkeleton type={skeletonType} />;
  
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyLoader;
