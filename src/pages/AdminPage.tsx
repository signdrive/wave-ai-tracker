
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';
import AdminAuditDashboard from '@/components/admin/AdminAuditDashboard';
import SecureAdminLogin from '@/components/admin/SecureAdminLogin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminAuth = (role: string) => {
    setAdminRole(role);
    setIsAuthenticated(true);
  };

  if (!user) {
    return <SecureAdminLogin onSuccess={handleAdminAuth} />;
  }

  if (!isAuthenticated) {
    return <SecureAdminLogin onSuccess={handleAdminAuth} />;
  }

  return (
    <AdminLayout>
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="audit">Security Audit</TabsTrigger>
          <TabsTrigger value="config">API Config</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="audit">
          <AdminAuditDashboard />
        </TabsContent>
        
        <TabsContent value="config">
          <div className="text-center py-8">
            <p>API Configuration panel - Enhanced security coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminPage;
