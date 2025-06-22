
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, AlertTriangle, Key, Activity, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { adminAccessControl } from '@/services/adminAccessControl';

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  gdprImpact: 'low' | 'medium' | 'high' | 'critical';
  requiredRoles: string[];
  isEnabled: boolean;
  auditRequired: boolean;
}

interface ApiAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  endpoint: string;
  action: string;
  timestamp: string;
  success: boolean;
  details: any;
}

const ApiSecurityGovernance: React.FC = () => {
  const { user } = useAuth();
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([]);
  const [auditLogs, setAuditLogs] = useState<ApiAuditLog[]>([]);
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApiConfiguration();
    loadAuditLogs();
  }, []);

  const loadApiConfiguration = async () => {
    // Mock API endpoints for demonstration
    const mockEndpoints: ApiEndpoint[] = [
      {
        path: '/api/surf-sessions/{user_id}',
        method: 'GET',
        description: 'Retrieve user surf session data',
        gdprImpact: 'high',
        requiredRoles: ['admin', 'support'],
        isEnabled: true,
        auditRequired: true
      },
      {
        path: '/api/surf-sessions/{user_id}',
        method: 'DELETE',
        description: 'Delete user surf session data (GDPR)',
        gdprImpact: 'critical',
        requiredRoles: ['admin'],
        isEnabled: true,
        auditRequired: true
      },
      {
        path: '/api/surf-spots/location',
        method: 'GET',
        description: 'Get surf spot locations with crowd data',
        gdprImpact: 'medium',
        requiredRoles: ['all'],
        isEnabled: true,
        auditRequired: false
      },
      {
        path: '/api/users/{user_id}/export',
        method: 'POST',
        description: 'Generate GDPR data export',
        gdprImpact: 'critical',
        requiredRoles: ['admin'],
        isEnabled: true,
        auditRequired: true
      },
      {
        path: '/api/professional-athletes',
        method: 'POST',
        description: 'Create pro athlete profile with biometrics',
        gdprImpact: 'critical',
        requiredRoles: ['admin', 'head_coach'],
        isEnabled: true,
        auditRequired: true
      },
      {
        path: '/api/ai/wave-predictions',
        method: 'GET',
        description: 'Get AI-generated wave predictions',
        gdprImpact: 'low',
        requiredRoles: ['all'],
        isEnabled: true,
        auditRequired: false
      }
    ];

    setApiEndpoints(mockEndpoints);
    setLoading(false);
  };

  const loadAuditLogs = async () => {
    if (!user) return;

    try {
      const logs = await adminAccessControl.getAccessLogs(user.id, 50);
      const apiLogs: ApiAuditLog[] = logs
        .filter(log => log.resource.includes('api'))
        .map(log => ({
          id: log.id,
          adminId: log.userId,
          adminEmail: log.userEmail,
          endpoint: log.resource,
          action: log.action,
          timestamp: log.timestamp,
          success: log.success,
          details: log.metadata
        }));
      
      setAuditLogs(apiLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  };

  const toggleEndpoint = async (endpointPath: string, enabled: boolean) => {
    if (!user) return;

    try {
      const hasPermission = await adminAccessControl.validateAdminAccess(
        user.id,
        'app_config',
        'write',
        `Toggle API endpoint: ${endpointPath}`
      );

      if (!hasPermission) {
        toast.error('Insufficient permissions to modify API configuration');
        return;
      }

      setApiEndpoints(prev => 
        prev.map(endpoint => 
          endpoint.path === endpointPath 
            ? { ...endpoint, isEnabled: enabled }
            : endpoint
        )
      );

      toast.success(`API endpoint ${enabled ? 'enabled' : 'disabled'}: ${endpointPath}`);
    } catch (error) {
      toast.error('Failed to update API configuration');
    }
  };

  const handleEmergencyLockdown = async () => {
    if (!user) return;

    try {
      const hasPermission = await adminAccessControl.validateAdminAccess(
        user.id,
        'security_logs',
        'write',
        'Emergency API lockdown initiated'
      );

      if (!hasPermission) {
        toast.error('Insufficient permissions for emergency lockdown');
        return;
      }

      setEmergencyLockdown(!emergencyLockdown);
      
      if (!emergencyLockdown) {
        // Disable all high-risk endpoints
        setApiEndpoints(prev => 
          prev.map(endpoint => ({
            ...endpoint,
            isEnabled: endpoint.gdprImpact === 'low' || endpoint.gdprImpact === 'medium'
          }))
        );
        toast.error('🚨 Emergency lockdown activated - High-risk APIs disabled');
      } else {
        // Re-enable all endpoints
        setApiEndpoints(prev => 
          prev.map(endpoint => ({ ...endpoint, isEnabled: true }))
        );
        toast.success('✅ Emergency lockdown lifted - All APIs restored');
      }
    } catch (error) {
      toast.error('Failed to execute emergency lockdown');
    }
  };

  const getGdprImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-ocean" />
            API Security Governance
          </h2>
          <p className="text-gray-600">GDPR-enforced API endpoint management and audit controls</p>
        </div>
        
        <Button 
          onClick={handleEmergencyLockdown}
          variant={emergencyLockdown ? "default" : "destructive"}
          className="flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          {emergencyLockdown ? 'Lift Lockdown' : '🚨 Emergency Lockdown'}
        </Button>
      </div>

      {emergencyLockdown && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>Emergency Lockdown Active:</strong> High-risk API endpoints have been disabled for GDPR breach mitigation.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                GDPR-Enforced API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>GDPR Impact</TableHead>
                    <TableHead>Required Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiEndpoints.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        {endpoint.path}
                      </TableCell>
                      <TableCell>
                        <Badge variant={endpoint.method === 'DELETE' ? 'destructive' : 'default'}>
                          {endpoint.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGdprImpactColor(endpoint.gdprImpact)}>
                          {endpoint.gdprImpact.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {endpoint.requiredRoles.map((role, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={endpoint.isEnabled}
                            onCheckedChange={(checked) => toggleEndpoint(endpoint.path, checked)}
                            disabled={emergencyLockdown && endpoint.gdprImpact === 'critical'}
                          />
                          <span className="text-sm">
                            {endpoint.isEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {endpoint.auditRequired && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Database className="w-3 h-3 mr-1" />
                            Audited
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                API Access Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.slice(0, 20).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.adminEmail}</TableCell>
                        <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          <Badge className={log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {log.success ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No audit logs available. API access will be logged here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Endpoint Category</th>
                      <th className="border border-gray-300 p-2 text-center">Admin</th>
                      <th className="border border-gray-300 p-2 text-center">Support Agent</th>
                      <th className="border border-gray-300 p-2 text-center">Head Coach</th>
                      <th className="border border-gray-300 p-2 text-center">All Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">View Personal Data</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">⚠️ Limited</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Export User Data</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Delete User Accounts</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Pro Athlete Management</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">❌</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Wave Forecasts</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                      <td className="border border-gray-300 p-2 text-center">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiSecurityGovernance;
