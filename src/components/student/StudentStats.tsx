
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Video, Star, BookOpen } from 'lucide-react';

interface StudentStatsProps {
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  pendingSessions: number;
}

const StudentStats: React.FC<StudentStatsProps> = ({
  totalSessions,
  upcomingSessions,
  completedSessions,
  pendingSessions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold">{totalSessions}</p>
            </div>
            <Calendar className="w-8 h-8 text-ocean" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold">{upcomingSessions}</p>
            </div>
            <Video className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{completedSessions}</p>
            </div>
            <Star className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{pendingSessions}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentStats;
