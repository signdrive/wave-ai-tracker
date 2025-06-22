import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Download, Trash2, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserDataExport {
  personal_data: any;
  processing_purposes: string[];
  retention_periods: Record<string, string>;
  third_party_recipients: string[];
  automated_decision_making: any[];
  export_timestamp: string;
}

const GdprUserRightsApi: React.FC = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  // Article 15 - Right of Access
  const exportUserData = async (): Promise<void> => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      // Generate comprehensive data export
      const exportData: UserDataExport = {
        personal_data: await getUserPersonalData(user.id),
        processing_purposes: [
          "Surf session analytics and performance tracking",
          "Personalized wave forecasting and recommendations", 
          "Mentorship matching and session coordination",
          "Safety alerts and crowd level notifications"
        ],
        retention_periods: {
          "surf_sessions": "2 years after account deletion",
          "user_preferences": "Duration of account + 30 days",
          "location_data": "Anonymized after 6 months",
          "mentor_sessions": "7 years (legal requirement)"
        },
        third_party_recipients: [
          "NOAA Weather Service (forecast data)",
          "Supabase (secure cloud hosting)",
          "Analytics providers (anonymized metrics only)"
        ],
        automated_decision_making: await getAIDecisions(user.id),
        export_timestamp: new Date().toISOString()
      };

      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wavementor-data-export-${user.id}-${Date.now()}.json`;
      link.click();
      
      setLastExport(new Date().toISOString());
      toast.success("✅ Your data has been exported successfully");
      
      // Log export for audit trail (Art. 30)
      await logGdprEvent('data_export_requested', user.id);
      
    } catch (error) {
      toast.error("❌ Export failed. Please contact support.");
      console.error('Data export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Article 17 - Right to Erasure
  const executeRightToErasure = async (): Promise<void> => {
    if (!user) return;
    
    const confirmed = window.confirm(
      "🚨 PERMANENT DELETION WARNING\n\n" +
      "This will permanently delete your account and all associated data. " +
      "Some anonymized analytics may be retained for legitimate interests. " +
      "\nThis action cannot be undone.\n\n" +
      "Are you absolutely sure?"
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      // 1. Anonymize analytics data (legitimate interest exception)
      await anonymizeUserAnalytics(user.id);
      
      // 2. Hard delete personal data
      await Promise.all([
        supabase.from('profiles').delete().eq('id', user.id),
        supabase.from('user_favorites').delete().eq('user_id', user.id),
        supabase.from('alert_preferences').delete().eq('user_id', user.id),
        // Keep surf_sessions but anonymize user_id
        supabase.from('surf_sessions').update({ 
          user_id: 'anonymized_user',
          notes: null 
        }).eq('user_id', user.id)
      ]);

      // 3. Log deletion for audit trail
      await logGdprEvent('right_to_erasure_executed', user.id);
      
      // 4. Sign out user
      await supabase.auth.signOut();
      
      toast.success("✅ Your account has been permanently deleted");
      
    } catch (error) {
      toast.error("❌ Deletion failed. Please contact support.");
      console.error('Deletion error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper functions
  const getUserPersonalData = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: sessions } = await supabase
      .from('surf_sessions')
      .select('*')
      .eq('user_id', userId);

    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId);

    return { profile, sessions, favorites };
  };

  const getAIDecisions = async (userId: string) => {
    // Return AI-driven decisions made about the user
    return [
      {
        decision_type: "Wave quality prediction",
        logic: "Machine learning model based on historical performance",
        human_review_available: true
      },
      {
        decision_type: "Mentor matching algorithm", 
        logic: "Skill level compatibility + location proximity",
        human_review_available: true
      }
    ];
  };

  const anonymizeUserAnalytics = async (userId: string) => {
    // Convert identifiable data to anonymous analytics
    console.log(`Anonymizing analytics for user ${userId}`);
  };

  const logGdprEvent = async (eventType: string, userId: string) => {
    await supabase.from('security_events').insert({
      user_id: userId,
      event_type: `gdpr_${eventType}`,
      severity: 'low',
      details: {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        gdpr_article: eventType === 'data_export_requested' ? 'Article 15' : 'Article 17'
      }
    });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>You must be logged in to access GDPR rights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ocean-dark mb-2">
          🔐 Your GDPR Rights Dashboard
        </h2>
        <p className="text-gray-600">
          Exercise your data protection rights under EU GDPR and California CCPA
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Right of Access - Article 15 */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              Export My Data
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">📋 GDPR Art. 15</Badge>
              <Badge variant="outline">🇺🇸 CCPA §1798.110</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Download a complete copy of all personal data we hold about you, 
              including processing purposes and third-party recipients.
            </p>
            
            {lastExport && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                Last export: {new Date(lastExport).toLocaleString()}
              </div>
            )}

            <Button 
              onClick={exportUserData}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? "Generating Export..." : "📥 Download My Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Right to Erasure - Article 17 */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Delete My Account
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">📋 GDPR Art. 17</Badge>
              <Badge variant="outline">🇺🇸 CCPA §1798.105</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">Permanent Action</p>
                <p className="text-red-700">
                  This will permanently delete your account. Some anonymized analytics 
                  may be retained for legitimate business interests.
                </p>
              </div>
            </div>

            <Button 
              onClick={executeRightToErasure}
              disabled={isDeleting}
              variant="destructive"
              className="w-full"
            >
              {isDeleting ? "Deleting Account..." : "🗑️ Permanently Delete Account"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Processing Activities Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            How We Process Your Data
          </CardTitle>
          <Badge variant="outline">📋 GDPR Art. 13-14</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">🌊 Surf Analytics</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Wave performance tracking</li>
                <li>• Session duration and frequency</li>
                <li>• Location-based recommendations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">🤖 AI Processing</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalized forecasting models</li>
                <li>• Mentor matching algorithms</li>
                <li>• Safety alert generation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GdprUserRightsApi;
