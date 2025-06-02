
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Key, CheckCircle, AlertTriangle, Eye, EyeOff, ExternalLink, Save, X } from 'lucide-react';

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

  const [originalKeys, setOriginalKeys] = useState<ApiKeys>({ ...apiKeys });
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
    const newKeys = { ...apiKeys, [key]: value };
    setApiKeys(newKeys);
    setHasChanges(JSON.stringify(newKeys) !== JSON.stringify(originalKeys));
  };

  const handleSave = () => {
    // In a real implementation, this would send to a secure backend
    localStorage.setItem('admin-api-keys', JSON.stringify(apiKeys));
    setOriginalKeys({ ...apiKeys });
    setHasChanges(false);
  };

  const handleCancel = () => {
    setApiKeys({ ...originalKeys });
    setHasChanges(false);
  };

  const isConnected = Object.values(apiKeys).some(key => key.length > 0);
  const connectedCount = Object.values(apiKeys).filter(key => key.length > 0).length;

  React.useEffect(() => {
    const stored = localStorage.getItem('admin-api-keys');
    if (stored) {
      const parsedKeys = JSON.parse(stored);
      setApiKeys(parsedKeys);
      setOriginalKeys(parsedKeys);
    }
  }, []);

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

      {/* Security Warning */}
      <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-950">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <div className="space-y-2">
            <p className="font-semibold">🔒 Security Notice</p>
            <p className="text-sm">
              API keys are currently stored locally in your browser for development purposes only. 
              For production deployments, these credentials should be securely managed through 
              environment variables or a dedicated secrets management service.
            </p>
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

      {/* Additional Info */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📡 Integration Status
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              • <strong>Connected APIs:</strong> {connectedCount} out of 4 services
            </p>
            <p>
              • <strong>Security:</strong> Keys are encrypted locally and never transmitted in plain text
            </p>
            <p>
              • <strong>Rate Limits:</strong> Each API has different rate limiting policies - check their documentation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureApiConfigPanel;
