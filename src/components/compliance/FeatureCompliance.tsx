
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface ComplianceStatus {
  feature: string;
  status: 'compliant' | 'violation' | 'warning';
  accuracy?: number;
  details: string;
}

interface FeatureComplianceProps {
  complianceStatus: ComplianceStatus[];
}

const FeatureCompliance: React.FC<FeatureComplianceProps> = ({ complianceStatus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {complianceStatus.map((item, index) => (
        <Card key={index} className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{item.feature}</h3>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4" />
                <Badge className="ml-2 bg-green-500 text-white">
                  COMPLIANT
                </Badge>
              </div>
            </div>
            
            {item.accuracy && (
              <div className="mb-2">
                <span className="text-sm font-medium">Accuracy: </span>
                <span className="font-bold text-green-600">
                  {(item.accuracy * 100).toFixed(1)}%
                </span>
              </div>
            )}
            
            <p className="text-sm text-gray-600">{item.details}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeatureCompliance;
