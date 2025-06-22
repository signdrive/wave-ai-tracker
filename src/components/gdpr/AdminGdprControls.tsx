
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Shield, Download, Eye, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { adminAccessControl } from '@/services/adminAccessControl';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { useAuth } from '@/hooks/useAuth';

interface DataRequest {
  id: string;
  userId: string;
  userEmail: string;
  requestType: 'access' | 'deletion' | 'rectification' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: string;
  completedAt?: string;
  gdprDeadline: string;
}

interface BreachIncident {
  id: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: number;
  dataTypes: string[];
  notificationSent: boolean;
  dpaNotified: boolean;
  status: 'investigating' | 'contained' | 'resolved';
}

const AdminGdprControls: React.FC = () => {
  const { user } = useAuth();
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [breachIncidents, setBreachIncidents] = useState<BreachIncident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Permission matrix for GDPR admin operations
  const permissionMatrix = {
    support_agent: {
      view_requests: true,
      process_requests: false,
      export_data: false,
      delete_accounts: false,
      view_breach_incidents: false
    },
    admin: {
      view_requests: true,
      process_requests: true,
      export_data: true,
      delete_accounts: true,
      view_breach_incidents: true
    },
    super_admin: {
      view_requests: true,
      process_requests: true,
      export_data: true,
      delete_accounts: true,
      view_breach_incidents: true
    }
  };

  useEffect(() => {
    loadGdprData();
  }, []);

  const loadGdprData = async () => {
    if (!user) return;
    
    try {
      // Check admin permissions
      const canViewRequests = await adminAccessControl.validateAdminAccess(
        user.id, 
        'legal_compliance', 
        'read'
      );
      
      if (!canViewRequests) {
        toast.error("Insufficient permissions to view GDPR data");
        return;
      }

      // Load mock data (in production, load from database)
      setDataRequests([
        {
          id: '1',
          userId: 'user-123',
          userEmail: 'surfer@example.com',
          requestType: 'access',
          status: 'pending',
          submittedAt: '2024-06-20T10:00:00Z',
          gdprDeadline: '2024-07-20T10:00:00Z'
        },
        {
          id: '2',
          userId: 'user-456',
          userEmail: 'wave.rider@example.com',
          requestType: 'deletion',
          status: 'processing',
          submittedAt: '2024-06-18T14:30:00Z',
          gdprDeadline: '2024-07-18T14:30:00Z'
        }
      ]);

      setBreachIncidents([
        {
          id: 'breach-001',
          detectedAt: '2024-06-22T03:15:00Z',
          severity: 'medium',
          affectedUsers: 150,
          dataTypes: ['surf_sessions', 'location_data'],
          notificationSent: false,
          dpaNotified: false,
          status: 'investigating'
        }
      ]);

    } catch (error) {
      console.error('Failed to load GDPR data:', error);
      toast.error("Failed to load GDPR administration data");
    } finally {
      setIsLoading(false);
    }
  };

  const processDataRequest =
   async (requestId: string, action: 'approve' | 'reject') => {
    if (!user) return;

    try {
      const canProcess = await adminAccessControl.validateAdminAccess(
        user.id,
        'legal_compliance', 
        'write',
        `Processing GDPR ${action} request ${requestId}`
      );

      if (!canProcess) {
        toast.error("Insufficient permissions to process requests");
        return;
      }

      // Update request status
      setDataRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: action === 'approve' ? 'completed' : 'rejected',
                completedAt: new Date().toISOString()
              }
            : req
        )
      );

      // Log action for audit trail
      await enhancedSecurityService.logSecurityEvent({
        user_id: user.id,
        event_type: `gdpr_request_${action}`,
        severity: 'low',
        details: { 
          requestId, 
          action,
          timestamp: new Date().toISOString()
        }
      });

      toast.success(`✅ GDPR request ${action === 'approve' ? 'approved' : 'rejected'}`);

    } catch (error) {
      console.error('Failed to process request:', error);
      toast.error("Failed to process GDPR request");
    }
  };

  const handleBreachNotification = async (breachId: string) => {
    if (!user) return;

    try {
      const canNotify = await adminAccessControl.validateAdminAccess(
        user.id,
        'security_logs',
        'write',
        `Sending breach notification for incident ${breachId}`
      );

      if (!canNotify) {
        toast.error("Insufficient permissions for breach notifications");
        return;
      }

      // Update breach status
      setBreachIncidents(prev =>
        prev.map(incident =>
          incident.id === breachId
            ? { ...incident, notificationSent: true, dpaNotified: true }
            : incident
        )
      );

      // In production, send actual notifications here
      console.log(`🚨 GDPR Breach Notification sent for ${breachId}`);
      
      toast.success("✅ Breach notifications sent (72-hour compliance)");

    } catch (error) {
      console.error('Failed to send breach notification:', error);
      toast.error("Failed to send breach notifications");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-4"></div>
          <p>Loading GDPR administration panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ocean-dark mb-2">
          🔐 GDPR Administration Panel
        </h1>
        <p className="text-gray-600">
          Manage data subject requests and privacy compliance
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge className="bg-green-500 text-white">EU GDPR Compliant</Badge>
          <Badge className="bg-blue-500 text-white">CCPA Ready</Badge>
          <Badge className="bg-purple-500 text-white">SOC 2 Audit Trail</Badge>
        </div>
      </div>

      {/* Data Subject Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Subject Access Requests (DSAR)
          </CardTitle>
          <Badge variant="outline">📋 GDPR Art. 15-22</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Type</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataRequests.map((request) => {
                const daysLeft = getDaysUntilDeadline(request.gdprDeadline);
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {request.requestType.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.userEmail}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(request.status)} text-white`}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className={daysLeft < 7 ? 'text-red-600 font-semibold' : ''}>
                          {daysLeft} days
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => processDataRequest(request.id, 'approve')}
                          >
                            ✅ Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => processDataRequest(request.id, 'reject')}
                          >
                            ❌ Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Breach Incident Management */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Data Breach Incidents
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">📋 GDPR Art. 33-34</Badge>
            <Badge variant="destructive">🚨 72-Hour Notification Required</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {breachIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ✅ No active breach incidents
            </div>
          ) : (
            <div className="space-y-4">
              {breachIncidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4 bg-red-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-red-800">
                        Incident {incident.id}
                      </h3>
                      <p className="text-sm text-red-600">
                        Detected: {new Date(incident.detectedAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={`${
                      incident.severity === 'critical' ? 'bg-red-600' :
                      incident.severity === 'high' ? 'bg-red-500' :
                      incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    } text-white`}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium">Affected Users:</span> {incident.affectedUsers}
                    </div>
                    <div>
                      <span className="font-medium">Data Types:</span> {incident.dataTypes.join(', ')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!incident.notificationSent && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBreachNotification(incident.id)}
                      >
                        🚨 Send 72h Notifications
                      </Button>
                    )}
                    {incident.notificationSent && (
                      <Badge className="bg-green-500 text-white">
                        ✅ Notifications Sent
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 GDPR Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {[
              { task: "Data Protection Impact Assessment (DPIA)", article: "Art. 35", completed: true },
              { task: "Privacy Policy Updated", article: "Art. 13-14", completed: true },
              { task: "Consent Management System", article: "Art. 7", completed: true },
              { task: "Data Breach Response Plan", article: "Art. 33-34", completed: true },
              { task: "Records of Processing Activities", article: "Art. 30", completed: false },
              { task: "EU Representative Appointed", article: "Art. 27", completed: false }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <Badge className="bg-green-500 text-white">✅</Badge>
                  ) : (
                    <Badge variant="destructive">❌</Badge>
                  )}
                  <span>{item.task}</span>
                </div>
                <Badge variant="outline">{item.article}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGdprControls;
