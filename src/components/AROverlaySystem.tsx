
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Scan, Waves, Wind, Compass, Eye, EyeOff } from 'lucide-react';

interface ARData {
  waveHeight: string;
  windDirection: string;
  windSpeed: number;
  swellDirection: string;
  tideStage: string;
  crowdLevel: string;
  waterTemp: number;
}

const AROverlaySystem: React.FC = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [arData, setARData] = useState<ARData>({
    waveHeight: '3-4ft',
    windDirection: 'Offshore SW',
    windSpeed: 12,
    swellDirection: 'W-SW',
    tideStage: 'Mid Rising',
    crowdLevel: 'Moderate',
    waterTemp: 68
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    checkCameraSupport();
  }, []);

  const checkCameraSupport = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');
      setHasCamera(hasVideoInput);
    } catch (error) {
      console.error('Error checking camera support:', error);
      setHasCamera(false);
    }
  };

  const startAR = async () => {
    if (!hasCamera) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsARActive(true);
        
        // Start AR overlay rendering
        requestAnimationFrame(renderAROverlay);
      }
    } catch (error) {
      console.error('Error starting AR camera:', error);
      alert('Could not access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARActive(false);
  };

  const renderAROverlay = () => {
    if (!isARActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw semi-transparent overlays
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';

    // Wave height indicator (top left)
    ctx.fillRect(20, 20, 200, 60);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🌊 ' + arData.waveHeight, 30, 50);

    // Wind data (top right)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 220, 20, 200, 60);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`💨 ${arData.windSpeed}mph ${arData.windDirection}`, canvas.width - 30, 50);

    // Water temp (bottom left)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, canvas.height - 80, 150, 60);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`🌡️ ${arData.waterTemp}°F`, 30, canvas.height - 50);

    // Crowd level (bottom right)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 200, canvas.height - 80, 180, 60);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`👥 ${arData.crowdLevel}`, canvas.width - 30, canvas.height - 50);

    // Compass overlay (center top)
    const centerX = canvas.width / 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(centerX - 100, 20, 200, 40);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`🧭 Swell: ${arData.swellDirection}`, centerX, 45);

    // Continue animation if AR is still active
    if (isARActive) {
      requestAnimationFrame(renderAROverlay);
    }
  };

  // Simulate real-time data updates
  useEffect(() => {
    if (!isARActive) return;

    const interval = setInterval(() => {
      setARData(prev => ({
        ...prev,
        windSpeed: Math.floor(Math.random() * 5) + 10,
        waterTemp: Math.floor(Math.random() * 4) + 66,
        waveHeight: ['2-3ft', '3-4ft', '4-5ft'][Math.floor(Math.random() * 3)]
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isARActive]);

  if (!hasCamera) {
    return (
      <Card className="border-orange-200">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-2">Camera Not Available</h3>
            <p className="text-sm">AR features require camera access</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Scan className="w-5 h-5 mr-2 text-purple-600" />
            AR Surf Vision
          </div>
          <Badge className={isARActive ? 'bg-purple-500' : 'bg-gray-500'}>
            {isARActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isARActive ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="bg-purple-50 p-6 rounded-lg mb-4">
                <Eye className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-medium text-purple-800 mb-2">Augmented Reality Surf Data</h3>
                <p className="text-sm text-purple-600">
                  Point your camera at the ocean to see live surf conditions overlaid on your view
                </p>
              </div>
              
              <Button onClick={startAR} className="bg-purple-600 hover:bg-purple-700">
                <Camera className="w-4 h-4 mr-2" />
                Start AR Camera
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">AR Features:</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Real-time wave height detection</p>
                <p>• Wind direction and speed overlay</p>
                <p>• Water temperature display</p>
                <p>• Crowd level indicators</p>
                <p>• Compass and swell direction</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm">
                <Compass className="w-4 h-4 mr-2" />
                Calibrate
              </Button>
              
              <Button onClick={stopAR} variant="destructive" size="sm">
                <EyeOff className="w-4 h-4 mr-2" />
                Stop AR
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Tide:</span> {arData.tideStage}
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Swell:</span> {arData.swellDirection}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AROverlaySystem;
