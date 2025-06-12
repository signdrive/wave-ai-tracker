import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Save, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { secureApiKeyManager } from '@/services/secureApiKeyManager';
import { InputValidator } from '@/utils/inputValidator';
import { toast } from 'sonner';

interface ApiKeyConfig {
  service: string;
  label: string;
  description: string;
  placeholder: string;
  docsUrl: string;
}

const API_CONFIGS: ApiKeyConfig[] = [
  {
    service: 'stormglass',
    label: 'StormGlass API Key',
    description: 'Marine weather and wave data',
    placeholder: 'Enter your StormGlass API key',
    docsUrl: 'https://stormglass.io/'
  },
  {
    service: 'weatherapi',
    label: 'Weather API Key',
    description: 'General weather conditions',
    placeholder: 'Enter your WeatherAPI key',
    docsUrl: 'https://www.weatherapi.com/'
  },
  {
    service: 'surfline',
    label: 'Surfline API Key',
    description: 'Surf forecasts and conditions',
    placeholder: 'Enter your Surfline API key',
    docsUrl: 'https://www.surfline.com/developer'
  },
  {
    service: 'magicseaweed',
    label: 'Magic Seaweed API Key',
    description: 'Alternative surf forecast data',
    placeholder: 'Enter your Magic Seaweed API key',
    docsUrl: 'https://magicseaweed.com/developer/api'
  }
];

const SecureApiKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [hasKeys, setHasKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    checkExistingKeys();
  }, []);

  const checkExistingKeys = async () => {
    for (const config of API_CONFIGS) {
      const existingKey = await secureApiKeyManager.getApiKey(config.service);
      if (existingKey) {
        setHasKeys(prev => ({ ...prev, [config.service]: true }));
      }
    }
  };

  const handleKeyChange = (service: string, value: string) => {
    // Basic client-side validation
    const sanitized = InputValidator.sanitizeString(value);
    setApiKeys(prev => ({ ...prev, [service]: sanitized }));
  };

  const handleSaveKey = async (service: string) => {
    const keyValue = apiKeys[service];
    
    if (!keyValue || keyValue.trim().length < 10) {
      toast.error('API key must be at least 10 characters long');
      return;
    }

    // Additional validation
    if (!InputValidator.validateUrl(`https://example.com?key=${keyValue}`)) {
      toast.error('Invalid API key format');
      return;
    }

    setLoading(prev => ({ ...prev, [service]: true }));

    try {
      const success = await secureApiKeyManager.setApiKey(service, keyValue.trim());

      if (success) {
        toast.success(`${service} API key saved securely`);
        setHasKeys(prev => ({ ...prev, [service]: true }));
        setApiKeys(prev => ({ ...prev, [service]: '' }));
      } else {
        toast.error('Failed to save API key');
      }
    } catch (error) {
      console.error('API key save error:', error);
      toast.error('Failed to save API key');
    } finally {
      setLoading(prev => ({ ...prev, [service]: false }));
    }
  };

  const handleDeleteKey = async (service: string) => {
    if (!confirm(`Are you sure you want to delete the ${service} API key?`)) {
      return;
    }

    setLoading(prev => ({ ...prev, [service]: true }));

    try {
      const success = await secureApiKeyManager.deactivateApiKey(service);
      
      if (success) {
        toast.success(`${service} API key deleted`);
        setHasKeys(prev => ({ ...prev, [service]: false }));
      } else {
        toast.error('Failed to delete API key');
      }
    } catch (error) {
      console.error('API key delete error:', error);
      toast.error('Failed to delete API key');
    } finally {
      setLoading(prev => ({ ...prev, [service]: false }));
    }
  };

  const toggleKeyVisibility = (service: string) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold">Secure API Key Management</h2>
      </div>

      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          API keys are encrypted and stored securely. They are never exposed in client-side code.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {API_CONFIGS.map((config) => (
          <Card key={config.service} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{config.label}</span>
                {hasKeys[config.service] && (
                  <Badge variant="default" className="bg-green-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Configured
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">{config.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasKeys[config.service] ? (
                <>
                  <div>
                    <Label htmlFor={`key-${config.service}`}>API Key</Label>
                    <div className="relative">
                      <Input
                        id={`key-${config.service}`}
                        type={showKeys[config.service] ? 'text' : 'password'}
                        placeholder={config.placeholder}
                        value={apiKeys[config.service] || ''}
                        onChange={(e) => handleKeyChange(config.service, e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility(config.service)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showKeys[config.service] ? 
                          <EyeOff className="w-4 h-4" /> : 
                          <Eye className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleSaveKey(config.service)}
                      disabled={!apiKeys[config.service] || loading[config.service]}
                      className="flex-1"
                    >
                      {loading[config.service] ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Securely
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">API key configured</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteKey(config.service)}
                      disabled={loading[config.service]}
                    >
                      {loading[config.service] ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Get your API key from:{' '}
                <a
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {config.docsUrl}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert variant="destructive" className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Security Note:</strong> API keys are encrypted at rest and never exposed in client-side code. 
          Only authorized administrators can access stored keys through secure backend functions.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SecureApiKeyManagement;
