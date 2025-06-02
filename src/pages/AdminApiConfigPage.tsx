
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import SecureApiConfigPanel from '@/components/SecureApiConfigPanel';

const AdminApiConfigPage: React.FC = () => {
  return (
    <AdminLayout>
      <SecureApiConfigPanel />
    </AdminLayout>
  );
};

export default AdminApiConfigPage;
