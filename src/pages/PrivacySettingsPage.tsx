
import React from 'react';
import ConsentManager from '@/components/privacy/ConsentManager';
import DataRequestManager from '@/components/privacy/DataRequestManager';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacySettingsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ocean-dark mb-2 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-ocean" />
          Privacy & Data Settings
        </h1>
        <p className="text-gray-600">
          Manage your consents and data requests. You can review our full privacy policy{' '}
          <Link to="/privacy-policy" className="text-ocean hover:underline">
            here
          </Link>.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1">
        <ConsentManager />
        <DataRequestManager />
      </div>
    </div>
  );
};

export default PrivacySettingsPage;
