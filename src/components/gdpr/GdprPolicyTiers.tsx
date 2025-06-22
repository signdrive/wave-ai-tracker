
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Code } from 'lucide-react';

const GdprPolicyTiers: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const policyTiers = {
    user: {
      title: "🏄‍♂️ Your Privacy Rights (Plain English)",
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          title: "🌊 What We Collect",
          content: "Your surf sessions, wave preferences, and location data to help you find the perfect waves!",
          gdprRef: "Art. 5(1)(a) - Lawfulness"
        },
        {
          title: "🎯 Why We Need It", 
          content: "To predict wave conditions, track your progress, and connect you with surf mentors.",
          gdprRef: "Art. 6(1)(f) - Legitimate Interest"
        },
        {
          title: "⏰ How Long We Keep It",
          content: "Active accounts: Forever. Inactive accounts: 2 years max, then automatic deletion.",
          gdprRef: "Art. 5(1)(e) - Storage Limitation"
        },
        {
          title: "🗑️ Your Rights",
          content: "Download your data anytime. Delete your account instantly. Change consent preferences below.",
          gdprRef: "Art. 15-22 - Data Subject Rights"
        }
      ]
    },
    legal: {
      title: "⚖️ Legal-Technical Implementation Guide",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        {
          title: "Article 5 - Data Minimization Protocol",
          content: "Surf session data limited to: wave height, duration, location (lat/lng), performance metrics. No video/audio recording without explicit consent.",
          implementation: "Enforced via API schema validation + database constraints"
        },
        {
          title: "Article 25 - Privacy by Design",
          content: "All location data encrypted at rest (AES-256). Pseudonymization of user IDs in analytics datasets.",
          implementation: "PostgreSQL encryption + UUID anonymization pipeline"
        },
        {
          title: "Article 30 - Records of Processing",
          content: "Processing register maintained in 'gdpr_processing_activities' table with: purpose, categories, retention periods, third-party transfers.",
          implementation: "Automated audit logging to Supabase with RBAC access controls"
        },
        {
          title: "Article 33-34 - Breach Notification",
          content: "72-hour DPA notification + individual alerts if high risk to rights/freedoms detected.",
          implementation: "Automated breach detection via security event correlation engine"
        }
      ]
    },
    technical: {
      title: "🔧 Engineer Implementation Specs",
      icon: <Code className="w-5 h-5" />,
      content: [
        {
          title: "Data Export Pipeline (Art. 15)",
          code: `// Automated DSAR Response
export const generateUserDataExport = async (userId: string) => {
  const userData = await supabase
    .from('user_data_view')
    .select('*')
    .eq('user_id', userId);
  
  return {
    personal_data: userData.data,
    processing_purposes: await getProcessingPurposes(userId),
    retention_periods: await getRetentionSchedule(userId),
    third_party_recipients: await getDataRecipients(userId),
    automated_decision_making: await getAIDecisions(userId)
  };
};`
        },
        {
          title: "Right to Erasure (Art. 17)",
          code: `// Cascading Deletion with Analytics Preservation
export const executeRightToErasure = async (userId: string) => {
  // 1. Anonymize instead of delete for legitimate interests
  await anonymizeUserData(userId);
  
  // 2. Hard delete PII while preserving aggregated analytics
  await Promise.all([
    supabase.from('profiles').delete().eq('id', userId),
    supabase.from('surf_sessions').update({ 
      user_id: 'anonymized',
      notes: null 
    }).eq('user_id', userId)
  ]);
  
  // 3. Audit trail (required for Art. 30)
  await logDeletionEvent(userId, 'user_requested_erasure');
};`
        }
      ]
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ocean-dark mb-2">
          🔐 GDPR Compliance Framework v2.3
        </h1>
        <p className="text-gray-600">
          Complete policy, technical, and legal implementation for WaveMentor
        </p>
        <Badge className="mt-2 bg-green-500 text-white">
          EU + California Compliant
        </Badge>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user" className="flex items-center gap-2">
            {policyTiers.user.icon}
            End Users
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            {policyTiers.legal.icon}
            Legal Team
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            {policyTiers.technical.icon}
            Engineers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {policyTiers.user.icon}
                {policyTiers.user.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {policyTiers.user.content.map((section, index) => (
                <div key={index} className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                  <p className="text-gray-700 mb-2">{section.content}</p>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer"
                    onClick={() => setSelectedArticle(section.gdprRef)}
                  >
                    📋 {section.gdprRef}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {policyTiers.legal.icon}
                {policyTiers.legal.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {policyTiers.legal.content.map((section, index) => (
                <div key={index} className="p-4 border rounded-lg bg-yellow-50">
                  <h3 className="font-semibold text-lg mb-2 text-yellow-800">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 mb-3">{section.content}</p>
                  <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                    <span className="font-medium text-yellow-800">Implementation: </span>
                    <span className="text-yellow-700">{section.implementation}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {policyTiers.technical.icon}
                {policyTiers.technical.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {policyTiers.technical.content.map((section, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">
                    {section.title}
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{section.code}</pre>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedArticle && (
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>📖 GDPR Reference:</strong> {selectedArticle} - 
              Click to view full article implementation details
            </p>
            <Button 
              size="sm" 
              variant="link" 
              onClick={() => setSelectedArticle(null)}
              className="text-blue-600"
            >
              Close Reference
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GdprPolicyTiers;
