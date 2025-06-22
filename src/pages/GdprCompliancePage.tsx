
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GdprPolicyTiers from '@/components/gdpr/GdprPolicyTiers';
import GranularConsentToggle from '@/components/gdpr/GranularConsentToggle';
import GdprUserRightsApi from '@/components/gdpr/GdprUserRightsApi';
import AdminGdprControls from '@/components/gdpr/AdminGdprControls';
import GdprBreachNotificationTemplate from '@/components/gdpr/GdprBreachNotificationTemplate';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, AlertTriangle, FileText } from 'lucide-react';

const GdprCompliancePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-ocean-dark mb-4">
          🔐 GDPR Compliance Framework
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Complete data protection solution for WaveMentor
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-green-500 text-white">✅ GDPR Compliant</Badge>
          <Badge className="bg-blue-500 text-white">🇺🇸 CCPA Ready</Badge>
          <Badge className="bg-purple-500 text-white">🛡️ SOC 2 Audited</Badge>
          <Badge className="bg-orange-500 text-white">⚡ Real-time Monitoring</Badge>
        </div>
      </div>

      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Consent
          </TabsTrigger>
          <TabsTrigger value="rights" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Rights
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Admin
          </TabsTrigger>
          <TabsTrigger value="breach" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Breach
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="mt-6">
          <GdprPolicyTiers />
        </TabsContent>

        <TabsContent value="consent" className="mt-6">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-ocean-dark mb-2">
                🎛️ Granular Consent Management
              </h2>
              <p className="text-gray-600">
                Control exactly how your data is used with GDPR-compliant consent toggles
              </p>
            </div>

            <div className="space-y-4">
              <GranularConsentToggle
                title="🌊 Share wave data for research"
                description="Help improve surf forecasting by sharing anonymized wave performance data with marine research institutions"
                storageKey="research_consent"
                gdprArticle="Art. 89 - Scientific Research"
                ccpaEquivalent="Do Not Sell My Data"
                onConsentChange={(granted) => console.log('Research consent:', granted)}
              />

              <GranularConsentToggle
                title="📍 Location-based notifications"
                description="Receive personalized surf alerts and crowd level updates based on your current location"
                storageKey="location_notifications"
                gdprArticle="Art. 6(1)(a) - Consent"
                ccpaEquivalent="Opt-out of Sale"
                onConsentChange={(granted) => console.log('Location consent:', granted)}
              />

              <GranularConsentToggle
                title="🤖 AI-powered surf coaching"
                description="Allow our AI to analyze your surf sessions and provide personalized performance recommendations"
                storageKey="ai_coaching"
                gdprArticle="Art. 22 - Automated Decision Making"
                ccpaEquivalent="Right to Opt-out"
                onConsentChange={(granted) => console.log('AI coaching consent:', granted)}
              />

              <GranularConsentToggle
                title="📧 Marketing communications"
                description="Receive emails about new features, surf conditions, and exclusive offers"
                storageKey="marketing_emails"
                gdprArticle="Art. 6(1)(a) - Consent"
                ccpaEquivalent="Opt-out Communications"
                onConsentChange={(granted) => console.log('Marketing consent:', granted)}
              />

              <GranularConsentToggle
                title="⚠️ Core functionality (Required)"
                description="Essential data processing for surf session logging and basic app functionality"
                storageKey="core_functionality"
                gdprArticle="Art. 6(1)(b) - Contract Performance"
                required={true}
                onConsentChange={(granted) => console.log('Core functionality:', granted)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rights" className="mt-6">
          <GdprUserRightsApi />
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          {user ? (
            <AdminGdprControls />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>🔒 Admin Access Required</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You must be logged in with admin privileges to access GDPR administration controls.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="breach" className="mt-6">
          <GdprBreachNotificationTemplate />
        </TabsContent>
      </Tabs>

      {/* Compliance Summary */}
      <Card className="mt-8 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">
            ✅ Full GDPR Compliance Achieved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Privacy by Design</h3>
              <p className="text-sm text-gray-600">Built-in data protection</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">User Rights</h3>
              <p className="text-sm text-gray-600">Full control over personal data</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Breach Response</h3>
              <p className="text-sm text-gray-600">72-hour compliance ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GdprCompliancePage;
