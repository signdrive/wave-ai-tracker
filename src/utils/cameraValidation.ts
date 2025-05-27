
import { SurfSpot } from '@/types/surfSpots';

export interface CameraValidationResult {
  spotId: string;
  isValid: boolean;
  status: 'LIVE' | 'OFFLINE' | 'PLACEHOLDER' | 'ERROR';
  responseTime?: number;
  error?: string;
  lastChecked: string;
}

export class CameraValidator {
  private static async testUrl(url: string, timeout: number = 5000): Promise<boolean> {
    try {
      // For placeholder URLs, return false
      if (url.includes('placeholder-cam-url.com')) {
        return false;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // Many cam sites don't allow CORS
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 0; // status 0 for no-cors mode
    } catch (error) {
      console.log(`Camera validation failed for ${url}:`, error);
      return false;
    }
  }

  static async validateCamera(spot: SurfSpot): Promise<CameraValidationResult> {
    const startTime = Date.now();
    
    try {
      const isValid = await this.testUrl(spot.live_cam);
      const responseTime = Date.now() - startTime;
      
      return {
        spotId: spot.id,
        isValid,
        status: isValid ? 'LIVE' : (spot.live_cam.includes('placeholder') ? 'PLACEHOLDER' : 'OFFLINE'),
        responseTime,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        spotId: spot.id,
        isValid: false,
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date().toISOString()
      };
    }
  }

  static async validateAllCameras(spots: SurfSpot[]): Promise<CameraValidationResult[]> {
    const validationPromises = spots.map(spot => this.validateCamera(spot));
    return Promise.all(validationPromises);
  }

  static async validateCameraBatch(spots: SurfSpot[], batchSize: number = 5): Promise<CameraValidationResult[]> {
    const results: CameraValidationResult[] = [];
    
    for (let i = 0; i < spots.length; i += batchSize) {
      const batch = spots.slice(i, i + batchSize);
      const batchResults = await this.validateAllCameras(batch);
      results.push(...batchResults);
      
      // Add a small delay between batches to avoid overwhelming servers
      if (i + batchSize < spots.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

// Helper function to get camera status icon
export const getCameraStatusIcon = (status: CameraValidationResult['status']) => {
  switch (status) {
    case 'LIVE':
      return '🟢';
    case 'OFFLINE':
      return '🔴';
    case 'PLACEHOLDER':
      return '🟡';
    case 'ERROR':
      return '❌';
    default:
      return '⚪';
  }
};

// Helper function to get camera status text
export const getCameraStatusText = (status: CameraValidationResult['status']) => {
  switch (status) {
    case 'LIVE':
      return 'Live';
    case 'OFFLINE':
      return 'Offline';
    case 'PLACEHOLDER':
      return 'Placeholder';
    case 'ERROR':
      return 'Error';
    default:
      return 'Unknown';
  }
};
