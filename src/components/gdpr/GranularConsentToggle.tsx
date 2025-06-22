
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

interface ConsentToggleProps {
  title: string;
  description: string;
  storageKey: string;
  gdprArticle?: string;
  ccpaEquivalent?: string;
  required?: boolean;
  onConsentChange?: (granted: boolean) => void;
}

const GranularConsentToggle: React.FC<ConsentToggleProps> = ({
  title,
  description,
  storageKey,
  gdprArticle = "",
  ccpaEquivalent = "",
  required = false,
  onConsentChange
}) => {
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Load consent from localStorage
    const stored = localStorage.getItem(`consent_${storageKey}`);
    if (stored) {
      const consentData = JSON.parse(stored);
      setIsGranted(consentData.granted);
      setLastUpdated(consentData.timestamp);
    }
  }, [storageKey]);

  const handleConsentChange = (granted: boolean) => {
    if (required && !granted) {
      toast.error("This consent is required for core functionality");
      return;
    }

    const timestamp = new Date().toISOString();
    const consentData = {
      granted,
      timestamp,
      gdprArticle,
      ccpaEquivalent,
      userAgent: navigator.userAgent
    };

    // Store consent with audit trail
    localStorage.setItem(`consent_${storageKey}`, JSON.stringify(consentData));
    
    setIsGranted(granted);
    setLastUpdated(timestamp);
    
    // Callback for parent component
    onConsentChange?.(granted);

    // GDPR requires granular consent feedback
    toast.success(
      granted 
        ? `✅ Consent granted for ${title}` 
        : `❌ Consent withdrawn for ${title}`
    );

    // Log consent change for audit (Art. 7 GDPR)
    console.log(`🔐 GDPR Consent Change:`, {
      storageKey,
      granted,
      timestamp,
      article: gdprArticle
    });
  };

  return (
    <Card className={`border-l-4 ${isGranted ? 'border-l-green-500' : 'border-l-gray-300'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={storageKey} className="text-base font-semibold">
                {title}
              </Label>
              {required && (
                <Badge variant="destructive" className="text-xs">
                  REQUIRED
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600">{description}</p>
            
            <div className="flex flex-wrap gap-2">
              {gdprArticle && (
                <Badge variant="outline" className="text-xs">
                  📋 GDPR {gdprArticle}
                </Badge>
              )}
              {ccpaEquivalent && (
                <Badge variant="outline" className="text-xs">
                  🇺🇸 CCPA {ccpaEquivalent}
                </Badge>
              )}
            </div>

            {lastUpdated && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <Switch
              id={storageKey}
              checked={isGranted}
              onCheckedChange={handleConsentChange}
              disabled={required && isGranted} // Can't turn off required consents
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GranularConsentToggle;
