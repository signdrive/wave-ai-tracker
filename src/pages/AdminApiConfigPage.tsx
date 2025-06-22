
import React from 'react';
import SecureAdminLayout from '@/components/SecureAdminLayout';
import ApiSecurityGovernance from '@/components/admin/ApiSecurityGovernance';

const AdminApiConfigPage: React.FC = () => {
  return (
    <SecureAdminLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ocean-dark mb-2">
            🔧 API Configuration & Security
          </h1>
          <p className="text-gray-600">
            GDPR-compliant API endpoint management and security governance
          </p>
        </div>
        
        <ApiSecurityGovernance />
      </div>
    </SecureAdminLayout>
  );
};

export default AdminApiConfigPage;
