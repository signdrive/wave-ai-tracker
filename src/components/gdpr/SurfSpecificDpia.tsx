
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MapPin, Waves, Clock, Shield, AlertTriangle } from 'lucide-react';

interface DpiaAssessment {
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigations: string[];
  gdprArticles: string[];
}

const SurfSpecificDpia: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const dpiaAssessments: DpiaAssessment[] = [
    {
      category: "🌊 Surf Session Tracking",
      riskLevel: "medium",
      description: "Collection of wave performance metrics, session duration, and surfboard preferences for analytics",
      mitigations: [
        "Data minimization: Only collect performance metrics essential for coaching",
        "Pseudonymization: Session IDs separated from user identities",
        "Retention limits: Session data auto-deleted after 2 years",
        "Consent granularity: Users can opt-out of performance analytics"
      ],
      gdprArticles: ["Art. 5(1)(c) - Data Minimization", "Art. 25 - Privacy by Design"]
    },
    {
      category: "📍 Geolocation Processing",
      riskLevel: "high",
      description: "Real-time location tracking for surf spot recommendations and crowd density mapping",
      mitigations: [
        "Location fuzzing: Coordinates rounded to 1km accuracy for non-premium users",
        "Explicit consent: Separate toggle for location sharing",
        "Data controller agreements: Third-party weather APIs bound by DPA clauses",
        "Emergency override: Pro surfer safety mode disables location logging"
      ],
      gdprArticles: ["Art. 6(1)(a) - Consent", "Art. 9 - Special Categories", "Art. 28 - Processors"]
    },
    {
      category: "🏄‍♂️ Professional Athlete Data",
      riskLevel: "critical",
      description: "Enhanced tracking for sponsored surfers including biometric data and competition performance",
      mitigations: [
        "Explicit professional consent with separate legal basis",
        "Biometric data encryption with separate key management",
        "Competition waiver integration with WSL/ISA compliance",
        "Right to erasure exception handling for legitimate sports interests"
      ],
      gdprArticles: ["Art. 9(2)(b) - Employment/Sports", "Art. 17(3) - Erasure Exceptions"]
    },
    {
      category: "🤖 AI Wave Prediction Engine",
      riskLevel: "medium",
      description: "Machine learning models processing user behavior patterns for personalized forecasting",
      mitigations: [
        "Automated decision-making transparency: ML model explanations available",
        "Right to human intervention: Users can request manual forecast review",
        "Training data anonymization: Historical patterns aggregated and de-identified",
        "Model bias testing: Regular audits for discriminatory outcomes"
      ],
      gdprArticles: ["Art. 22 - Automated Decision Making", "Art. 13-14 - Transparency"]
    },
    {
      category: "📱 Mobile App Telemetry",
      riskLevel: "low",
      description: "App usage analytics, crash reports, and device performance metrics",
      mitigations: [
        "Anonymous telemetry: No personal identifiers in crash reports",
        "Opt-out available: Users can disable analytics in app settings",
        "Local processing: Device metrics processed on-device where possible",
        "Third-party SDK audits: Regular reviews of analytics provider compliance"
      ],
      gdprArticles: ["Art. 6(1)(f) - Legitimate Interest", "Art. 5(1)(a) - Lawfulness"]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ocean-dark mb-2 flex items-center justify-center gap-2">
          <Waves className="w-8 h-8" />
          🏄‍♂️ Surf-Specific DPIA Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Data Protection Impact Assessment for surf analytics and location tracking
        </p>
        <Badge className="bg-blue-500 text-white">
          Article 35 GDPR Compliant
        </Badge>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <MapPin className="w-4 h-4" />
        <AlertDescription>
          <strong>High-Risk Processing Identified:</strong> Location tracking and biometric data for professional athletes requires enhanced safeguards under GDPR Article 35.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">Risk Assessments</TabsTrigger>
          <TabsTrigger value="mitigations">Mitigation Controls</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-4">
          <div className="grid gap-4">
            {dpiaAssessments.map((assessment, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all ${
                  selectedAssessment === assessment.category 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedAssessment(
                  selectedAssessment === assessment.category ? null : assessment.category
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {assessment.category}
                    </CardTitle>
                    <Badge className={`flex items-center gap-1 ${getRiskColor(assessment.riskLevel)}`}>
                      {getRiskIcon(assessment.riskLevel)}
                      {assessment.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{assessment.description}</p>
                  
                  {selectedAssessment === assessment.category && (
                    <div className="space-y-4 mt-4 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">🛡️ Mitigation Controls:</h4>
                        <ul className="space-y-1">
                          {assessment.mitigations.map((mitigation, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {mitigation}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-blue-700">📋 GDPR Articles:</h4>
                        <div className="flex flex-wrap gap-2">
                          {assessment.gdprArticles.map((article, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {article}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mitigations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🔧 Technical Safeguards Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-ocean-dark">Location Geofencing</h4>
                  <p className="text-sm text-gray-600">
                    Surf spot coordinates automatically fuzzed to 1km radius for privacy protection
                  </p>
                  <Badge className="bg-green-100 text-green-800">✅ Implemented</Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-ocean-dark">Session Data Encryption</h4>
                  <p className="text-sm text-gray-600">
                    AES-256 encryption for all surf performance metrics with separate key management
                  </p>
                  <Badge className="bg-green-100 text-green-800">✅ Implemented</Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-ocean-dark">Pro Athlete Waivers</h4>
                  <p className="text-sm text-gray-600">
                    Enhanced consent flows for professional surfers with competition data integration
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800">🔄 In Progress</Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-ocean-dark">AI Model Transparency</h4>
                  <p className="text-sm text-gray-600">
                    Explainable AI for wave predictions with human review option available
                  </p>
                  <Badge className="bg-green-100 text-green-800">✅ Implemented</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📊 GDPR Compliance Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Processing Activity</th>
                      <th className="border border-gray-300 p-2 text-left">Legal Basis</th>
                      <th className="border border-gray-300 p-2 text-left">Retention Period</th>
                      <th className="border border-gray-300 p-2 text-left">Third Parties</th>
                      <th className="border border-gray-300 p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Surf Session Analytics</td>
                      <td className="border border-gray-300 p-2">Consent (Art. 6(1)(a))</td>
                      <td className="border border-gray-300 p-2">2 years</td>
                      <td className="border border-gray-300 p-2">None</td>
                      <td className="border border-gray-300 p-2">
                        <Badge className="bg-green-100 text-green-800">✅ Compliant</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Location Tracking</td>
                      <td className="border border-gray-300 p-2">Consent (Art. 6(1)(a))</td>
                      <td className="border border-gray-300 p-2">6 months (anonymized)</td>
                      <td className="border border-gray-300 p-2">NOAA Weather API</td>
                      <td className="border border-gray-300 p-2">
                        <Badge className="bg-green-100 text-green-800">✅ Compliant</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Pro Athlete Biometrics</td>
                      <td className="border border-gray-300 p-2">Employment/Sports (Art. 9(2)(b))</td>
                      <td className="border border-gray-300 p-2">7 years (legal requirement)</td>
                      <td className="border border-gray-300 p-2">WSL, ISA</td>
                      <td className="border border-gray-300 p-2">
                        <Badge className="bg-yellow-100 text-yellow-800">🔄 Review Required</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center pt-6">
        <Button className="bg-ocean hover:bg-ocean-dark">
          📋 Generate Full DPIA Report
        </Button>
      </div>
    </div>
  );
};

export default SurfSpecificDpia;
