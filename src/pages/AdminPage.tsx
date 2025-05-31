
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminMapView from '@/components/AdminMapView';

const AdminPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showMap = searchParams.get('map') === 'true';

  if (showMap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <main className="pt-16">
          <AdminMapView />
        </main>
      </div>
    );
  }

  return <AdminLayout />;
};

export default AdminPage;
