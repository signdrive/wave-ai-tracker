import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Waves, Wind, Compass, BarChartHorizontalBig } from 'lucide-react'; // Example icons

interface PreferredConditionData {
  spot_id: string;
  spot_name?: string | null;
  session_count: number; // Number of highly-rated sessions used for this insight
  avg_waveHeight_ft?: number | null;
  mode_waveDirection_cardinal?: string | null;
  mode_windSpeed_mph_range?: string | null;
  mode_windDirection_cardinal?: string | null;
}

interface PreferredConditionsViewProps {
  conditions?: PreferredConditionData; // Data for a single spot
  isLoading: boolean;
  error?: Error | null;
  // title?: string; // Optional title for the card
}

const PreferredConditionsView: React.FC<PreferredConditionsViewProps> = ({ conditions, isLoading, error /*, title*/ }) => {
  const cardTitle = `Preferred Conditions at ${conditions?.spot_name || conditions?.spot_id || 'Selected Spot'}`;

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>{cardTitle}</CardTitle></CardHeader>
        <CardContent><p>Loading preferred conditions...</p></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-red-600">{cardTitle}</CardTitle></CardHeader>
        <CardContent><p>Error loading preferred conditions: {error.message}</p></CardContent>
      </Card>
    );
  }

  if (!conditions || conditions.session_count === 0) { // session_count might be 0 if no highly rated sessions
     return (
      <Card>
        <CardHeader><CardTitle>{cardTitle}</CardTitle></CardHeader>
        <CardContent>
          <p>Not enough highly-rated sessions at {conditions?.spot_name || conditions?.spot_id || 'this spot'} to determine preferred conditions yet.</p>
          <p className="text-xs text-gray-500 mt-1">Log more sessions with a 4 or 5-star rating!</p>
        </CardContent>
      </Card>
    );
  }

  const dataExists = conditions.avg_waveHeight_ft ||
                     conditions.mode_waveDirection_cardinal ||
                     conditions.mode_windSpeed_mph_range ||
                     conditions.mode_windDirection_cardinal;

  if (!dataExists) {
    return (
      <Card>
        <CardHeader><CardTitle>{cardTitle}</CardTitle></CardHeader>
        <CardContent>
          <p>Could not determine specific preferred conditions from available data for {conditions.spot_name || conditions.spot_id}.</p>
          <p className="text-xs text-gray-500 mt-1">Ensure conditions snapshots were available for your highly-rated sessions.</p>
          <p className="text-xs text-gray-500">Used {conditions.session_count} highly-rated sessions for this analysis.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
            <BarChartHorizontalBig className="w-5 h-5 mr-2 text-indigo-500" />
            {cardTitle}
        </CardTitle>
        <p className="text-xs text-gray-500">Based on {conditions.session_count} highly-rated sessions (4+ stars)</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {conditions.avg_waveHeight_ft && (
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center">
              <Waves className="w-4 h-4 mr-2 text-blue-500" />
              <span>Avg. Wave Height:</span>
            </div>
            <span className="font-semibold">{conditions.avg_waveHeight_ft.toFixed(1)} ft</span>
          </div>
        )}
        {conditions.mode_waveDirection_cardinal && (
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center">
              <Compass className="w-4 h-4 mr-2 text-teal-500" />
              <span>Preferred Wave Direction:</span>
            </div>
            <span className="font-semibold">{conditions.mode_waveDirection_cardinal}</span>
          </div>
        )}
        {conditions.mode_windSpeed_mph_range && (
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center">
              <Wind className="w-4 h-4 mr-2 text-sky-500" />
              <span>Preferred Wind Speed:</span>
            </div>
            <span className="font-semibold">{conditions.mode_windSpeed_mph_range}</span>
          </div>
        )}
        {conditions.mode_windDirection_cardinal && (
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center">
              <Compass className="w-4 h-4 mr-2 text-cyan-500" />
              <span>Preferred Wind Direction:</span>
            </div>
            <span className="font-semibold">{conditions.mode_windDirection_cardinal}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreferredConditionsView;
