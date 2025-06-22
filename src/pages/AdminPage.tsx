
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath="/">
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminPage;
