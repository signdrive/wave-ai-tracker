
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const renderEndTime = Date.now();
    const renderTime = renderEndTime - renderStartTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} render time: ${renderTime}ms`);
      
      // Log slow renders (>100ms)
      if (renderTime > 100) {
        console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime}ms`);
      }
    }

    // Reset for next render
    renderStartTime.current = Date.now();
  });

  return {
    logEvent: (eventName: string, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 ${componentName} - ${eventName}:`, data);
      }
    }
  };
};
