
import React from 'react';
import SecureAdminLayout from '@/components/SecureAdminLayout';
import SecureApiConfigPanel from '@/components/SecureApiConfigPanel';
import SecureAdminGuard from '@/components/SecureAdminGuard';

const AdminApiConfigPage: React.FC = () => {
  return (
    <SecureAdminGuard>
      <SecureAdminLayout>
        <SecureApiConfigPanel />
      </SecureAdminLayout>
    </SecureAdminGuard>
  );
};

export default AdminApiConfigPage;
