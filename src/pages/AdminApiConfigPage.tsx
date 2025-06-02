
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import SecureApiConfigPanel from '@/components/SecureApiConfigPanel';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminApiConfigPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath="/">
      <AdminLayout>
        <SecureApiConfigPanel />
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminApiConfigPage;
