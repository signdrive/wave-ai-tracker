
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import SecureApiConfigPanel from '@/components/SecureApiConfigPanel';
import SecureAdminGuard from '@/components/SecureAdminGuard';

const AdminApiConfigPage: React.FC = () => {
  return (
    <SecureAdminGuard>
      <AdminLayout>
        <SecureApiConfigPanel />
      </AdminLayout>
    </SecureAdminGuard>
  );
};

export default AdminApiConfigPage;
