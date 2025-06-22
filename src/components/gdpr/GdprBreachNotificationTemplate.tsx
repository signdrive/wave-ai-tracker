
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Shield, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface BreachNotificationData {
  incidentId: string;
  detectedAt: string;
  natureOfBreach: string;
  dataTypesAffected: string[];
  approximateAffectedUsers: number;
  riskAssessment: 'low' | 'medium' | 'high';
  actionsTaken: string[];
  contactInfo: {
    dpo_email: string;
    support_phone: string;
  };
}

const GdprBreachNotificationTemplate: React.FC = () => {
  const [notificationSent, setNotificationSent] = useState(false);
  
  // Mock breach data (in production, this would come from props or API)
  const breachData: BreachNotificationData = {
    incidentId: "BREACH-2024-001",
    detectedAt: "2024-06-22T03:15:00Z",
    natureOfBreach: "Unauthorized access to surf session location logs via compromised API endpoint",
    dataTypesAffected: ["surf_sessions", "location_coordinates", "session_timestamps"],
    approximateAffectedUsers: 847,
    riskAssessment: "medium",
    actionsTaken: [
      "Compromised API endpoint immediately disabled",
      "All user session tokens invalidated and regenerated", 
      "Database access logs reviewed for suspicious activity",
      "Security patches deployed to prevent similar incidents",
      "Third-party security audit initiated"
    ],
    contactInfo: {
      dpo_email: "privacy@wavementor.com",
      support_phone: "+1-555-SURF-HELP"
    }
  };

  const sendBreachNotification = async () => {
    // In production, this would send actual emails/SMS
    console.log("🚨 GDPR Breach Notification Template Generated");
    setNotificationSent(true);
    toast.success("✅ Breach notifications prepared for dispatch");
  };

  const generateUserNotificationText = () => {
    return `
🚨 Important Security Notice - WaveMentor Data Incident

Dear WaveMentor Community,

We are writing to inform you of a security incident that may have affected some of your personal data stored in our systems.

WHAT HAPPENED:
On ${new Date(breachData.detectedAt).toLocaleDateString()}, our security monitoring systems detected ${breachData.natureOfBreach}.

WHAT INFORMATION WAS INVOLVED:
The incident potentially affected the following types of data:
${breachData.dataTypesAffected.map(type => `• ${type.replace('_', ' ').toUpperCase()}`).join('\n')}

Approximately ${breachData.approximateAffectedUsers.toLocaleString()} user accounts may have been impacted.

WHAT WE'RE DOING:
We have taken immediate action to secure our systems:
${breachData.actionsTaken.map(action => `✅ ${action}`).join('\n')}

WHAT YOU CAN DO:
• Change your WaveMentor password immediately
• Review your recent surf session data for any anomalies
• Monitor your account for unusual activity
• Consider enabling two-factor authentication

YOUR PRIVACY RIGHTS:
Under GDPR and CCPA, you have the right to:
📋 Request a detailed report of what data was affected
🗑️ Request deletion of your affected data
🔒 File a complaint with your local data protection authority

CONTACT US:
If you have questions about this incident:
📧 Email our Data Protection Officer: ${breachData.contactInfo.dpo_email}
📞 Call our support line: ${breachData.contactInfo.support_phone}

We sincerely apologize for this incident and any inconvenience it may cause. Protecting your privacy and data security is our top priority.

Best regards,
The WaveMentor Security Team

---
This notification is sent in compliance with GDPR Article 34 and CCPA requirements.
Incident Reference: ${breachData.incidentId}
    `.trim();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-2">
          🚨 GDPR Breach Notification System
        </h1>
        <p className="text-gray-600">
          72-Hour Compliance Template Generator
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge className="bg-red-500 text-white">📋 GDPR Art. 33-34</Badge>
          <Badge className="bg-blue-500 text-white">🇺🇸 CCPA §1798.82</Badge>
        </div>
      </div>

      {/* Incident Overview */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-6 h-6" />
            Incident Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Detected:</span>
                <span>{new Date(breachData.detectedAt).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getRiskColor(breachData.riskAssessment)}>
                  Risk: {breachData.riskAssessment.toUpperCase()}
                </Badge>
              </div>

              <div>
                <span className="font-medium">Affected Users:</span>
                <span className="ml-2 text-lg font-bold text-red-600">
                  ~{breachData.approximateAffectedUsers.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-medium">Incident ID:</span>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                  {breachData.incidentId}
                </code>
              </div>
              
              <div>
                <span className="font-medium">Data Types:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {breachData.dataTypesAffected.map((type, index) => (
                    <Badge key={index} variant="outline">
                      {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="font-medium">Nature of Breach:</span>
            <p className="mt-1 p-3 bg-red-50 border border-red-200 rounded">
              {breachData.natureOfBreach}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions Taken */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Immediate Response Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {breachData.actionsTaken.map((action, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                <Badge className="bg-green-500 text-white mt-0.5">✅</Badge>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Notification Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            User Notification Template
          </CardTitle>
          <Badge variant="outline">📋 GDPR Art. 34 Compliance</Badge>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {generateUserNotificationText()}
            </pre>
          </div>
          
          <div className="flex gap-4 mt-4">
            <Button 
              onClick={sendBreachNotification}
              disabled={notificationSent}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {notificationSent ? "Notification Sent" : "Send Notifications"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generateUserNotificationText());
                toast.success("Notification template copied to clipboard");
              }}
            >
              📋 Copy Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Data Protection Officer</h3>
              <p className="text-sm text-gray-600">
                📧 {breachData.contactInfo.dpo_email}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">24/7 Support Line</h3>
              <p className="text-sm text-gray-600">
                📞 {breachData.contactInfo.support_phone}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Timeline */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-yellow-700">
            ⏰ GDPR Compliance Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">✅ COMPLETE</Badge>
              <span>T+0hrs: Breach detected and contained</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">✅ COMPLETE</Badge>
              <span>T+24hrs: Internal assessment completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500 text-white">🟡 IN PROGRESS</Badge>
              <span>T+72hrs: DPA notification (Article 33)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-white">⏳ PENDING</Badge>
              <span>Individual notifications (Article 34)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GdprBreachNotificationTemplate;
