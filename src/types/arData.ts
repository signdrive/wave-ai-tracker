
export interface DetectedWave {
  id: string;
  height: number;
  confidence: number;
  timestamp: number;
  position: {
    x: number;
    y: number;
  };
}

export interface RealARData {
  isActive: boolean;
  detectedWaves: DetectedWave[];
  sessionDuration: number;
  complianceStatus: 'compliant' | 'violation' | 'warning';
  cameraPermission: boolean;
  webxrSupported: boolean;
  averageConfidence: number;
}

export interface ARSession {
  id: string;
  startTime: number;
  endTime?: number;
  totalWavesDetected: number;
  averageAccuracy: number;
  complianceViolations: string[];
}
