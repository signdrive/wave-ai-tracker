
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  newUsers: number;
  retentionRate: number;
}

interface UserAnalyticsProps {
  userMetrics: UserMetrics | null;
}

const UserAnalytics: React.FC<UserAnalyticsProps> = ({ userMetrics }) => {
  if (!userMetrics) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Beta User Analytics (Development Stage)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userMetrics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Beta Testers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userMetrics.dailyActiveUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Daily Engaged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userMetrics.weeklyActiveUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Weekly Engaged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{(userMetrics.retentionRate * 100).toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Beta Retention</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Disclaimer:</strong> All metrics are preliminary and reflect beta-stage development. 
          Not yet independently verified by third-party analytics (FTC compliant).
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAnalytics;
