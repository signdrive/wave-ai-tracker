
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useApiIntegration } from '@/hooks/useIntegrations';
import { RealSurfApiConfig } from '@/services/realApiService';

const ApiConfigPanel: React.FC = () => {
  const { apiConfig, isConnected, connectApi } = useApiIntegration();
  const [formData, setFormData] = useState<RealSurfApiConfig>({});
  const [showKeys, setShowKeys] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connectApi(formData);
  };

  const handleInputChange = (key: keyof RealSurfApiConfig, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Configuration
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Not Connected
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="surflineKey">Surfline API Key</Label>
              <Input
                id="surflineKey"
                type={showKeys ? "text" : "password"}
                placeholder="Enter Surfline API key"
                value={formData.surflineApiKey || ''}
                onChange={(e) => handleInputChange('surflineApiKey', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from <a href="https://www.surfline.com/developer" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Surfline Developer Portal</a>
              </p>
            </div>

            <div>
              <Label htmlFor="magicSeaweedKey">Magic Seaweed API Key</Label>
              <Input
                id="magicSeaweedKey"
                type={showKeys ? "text" : "password"}
                placeholder="Enter Magic Seaweed API key"
                value={formData.magicSeaweedApiKey || ''}
                onChange={(e) => handleInputChange('magicSeaweedApiKey', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from <a href="https://magicseaweed.com/developer/api" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Magic Seaweed API</a>
              </p>
            </div>

            <div>
              <Label htmlFor="stormglassKey">StormGlass API Key</Label>
              <Input
                id="stormglassKey"
                type={showKeys ? "text" : "password"}
                placeholder="Enter StormGlass API key"
                value={formData.stormglassApiKey || ''}
                onChange={(e) => handleInputChange('stormglassApiKey', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from <a href="https://stormglass.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">StormGlass.io</a>
              </p>
            </div>

            <div>
              <Label htmlFor="weatherKey">Weather API Key</Label>
              <Input
                id="weatherKey"
                type={showKeys ? "text" : "password"}
                placeholder="Enter Weather API key"
                value={formData.weatherApiKey || ''}
                onChange={(e) => handleInputChange('weatherApiKey', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from <a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">WeatherAPI.com</a>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
            >
              {showKeys ? 'Hide' : 'Show'} API Keys
            </Button>
            
            <Button type="submit">
              <Settings className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">🔒 Security Note</h4>
          <p className="text-sm text-blue-700">
            API keys are stored locally in your browser for development. For production use, 
            consider setting up a backend service to securely manage API credentials.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfigPanel;
