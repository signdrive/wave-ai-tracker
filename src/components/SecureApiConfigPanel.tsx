
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Key, CheckCircle, AlertTriangle, Eye, EyeOff, ExternalLink, Save, X, Shield } from 'lucide-react';

interface ApiKeys {
  surflineApiKey: string;
  magicSeaweedApiKey: string;
  stormglassApiKey: string;
  weatherApiKey: string;
}

const SecureApiConfigPanel: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    surflineApiKey: '',
    magicSeaweedApiKey: '',
    stormglassApiKey: '',
    weatherApiKey: ''
  });

  const [showKeys, setShowKeys] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const apiConfigs = [
    {
      key: 'surflineApiKey' as keyof ApiKeys,
      label: 'Surfline API Key',
      description: 'Access to surf forecasts and conditions',
      docsUrl: 'https://www.surfline.com/developer',
      docsText: 'Surfline Developer Portal'
    },
    {
      key: 'magicSeaweedApiKey' as keyof ApiKeys,
      label: 'Magic Seaweed API Key',
      description: 'Alternative surf forecast data',
      docsUrl: 'https://magicseaweed.com/developer/api',
      docsText: 'Magic Seaweed API'
    },
    {
      key: 'stormglassApiKey' as keyof ApiKeys,
      label: 'StormGlass API Key',
      description: 'Marine weather and wave data',
      docsUrl: 'https://stormglass.io/',
      docsText: 'StormGlass.io'
    },
    {
      key: 'weatherApiKey' as keyof ApiKeys,
      label: 'Weather API Key',
      description: 'General weather conditions',
      docsUrl: 'https://www.weatherapi.com/',
      docsText: 'WeatherAPI.com'
    }
  ];

  const handleInputChange = (key: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a production environment, this should send to a secure backend
    // For now, we'll just simulate saving and warn the user
    alert('⚠️ SECURITY WARNING: API keys should be stored securely on the backend, not in the browser!');
    setHasChanges(false);
  };

  const handleCancel = () => {
    setApiKeys({
      surflineApiKey: '',
      magicSeaweedApiKey: '',
      stormglassApiKey: '',
      weatherApiKey: ''
    });
    setHasChanges(false);
  };

  const isConnected = Object.values(apiKeys).some(key => key.length > 0);
  const connectedCount = Object.values(apiKeys).filter(key => key.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage external API integrations and keys
          </p>
        </div>
        <Badge variant={isConnected ? "default" : "secondary"} className="text-base px-3 py-1">
          {isConnected ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              {connectedCount}/4 Connected
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-1" />
              Not Connected
            </>
          )}
        </Badge>
      </div>

      {/* Critical Security Warning */}
      <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950">
        <Shield className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <div className="space-y-3">
            <p className="font-bold text-lg">🚨 CRITICAL SECURITY WARNING</p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>DO NOT USE THIS IN PRODUCTION!</strong> This interface is for development/demonstration purposes only.
              </p>
              <p>
                API keys entered here are stored in browser memory and will be lost on page refresh.
                In a production environment, API keys must be:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Stored securely on the backend server</li>
                <li>Encrypted at rest and in transit</li>
                <li>Never exposed to client-side JavaScript</li>
                <li>Managed through environment variables or secret management services</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* API Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {apiConfigs.map((config) => (
          <Card key={config.key} className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span>{config.label}</span>
                </div>
                {apiKeys[config.key] && (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={config.key} className="text-sm font-medium">
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id={config.key}
                    type={showKeys ? "text" : "password"}
                    placeholder={`Enter your ${config.label.replace(' API Key', '')} API key`}
                    value={apiKeys[config.key]}
                    onChange={(e) => handleInputChange(config.key, e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Get your API key from:</span>
                <a
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center space-x-1"
                >
                  <span>{config.docsText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">You have unsaved changes</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel} size="sm">
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Development Notice */}
      <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            🚧 Development Environment Only
          </h3>
          <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
            <p>
              This API configuration panel is designed for development and testing purposes.
            </p>
            <p>
              <strong>For production deployment:</strong> Implement proper backend API key management with encryption,
              secure storage, and environment variable configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureApiConfigPanel;
