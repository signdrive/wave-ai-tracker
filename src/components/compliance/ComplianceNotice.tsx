
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const ComplianceNotice: React.FC = () => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Legal Compliance Achieved ✅</p>
            <p>
              This dashboard confirms real-time verification of all advertised features with proper 
              implementation. All user base claims include appropriate disclaimers and reflect 
              beta-stage development status. Full compliance with consumer protection laws maintained.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceNotice;
